import { AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { UploadProvider } from 'src/app/providers/upload';
//import { UploadViewService } from './upload-view.service';
//import { OrderFlowService } from 'src/app/modules/unified-purchase/group/order-flow/order-flow.service';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { ChangedModel, FileInfo, StoreType, UploadViewHelper } from './upload-view.model';
import { MD5 } from 'src/app/providers/common/md5';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { DxDataGridComponent } from 'devextreme-angular';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { environment } from 'src/environments/environment';
import { UploadViewService } from './upload-view.service';
import { TokenAuthService } from 'src/app/shared/services';
import { QlwODataContext } from 'src/app/providers/odataContext';
import { DataSourceParamters } from 'src/app/providers/odataContext/helper';

@Component({
    selector: 'app-upload-view',
    templateUrl: './upload-view.component.html',
    styleUrls: ['./upload-view.component.scss'],

})
export class UploadViewComponent implements OnInit {

    @ViewChild('dataGrid', { static: false })
    _dataGrid: DxDataGridComponent;

    /**
    * 文件选择是否多选
    */
    @Input()
    multiple: boolean = true;

    /**
    * 是否跳过弹框直接上传
    */
    @Input()
    jumpOver: boolean = false;

    /**
     * 允许最大长度，只有multiple为true时才管用。默认是5个文件
     */
    @Input()
    limit: number = 5;

    /**
     * 单个单据最大附件数量
     */
    @Input()
    maxFileLength = 20;

    /**
     * 单个附件最大文件大小（MB）
     */
    @Input()
    maxFileMB = 50;

    /**
     * 允许上传的文件类型
     */
    @Input()
    accept: string[] = ["*"];

    /**
     * 是否展示附件快捷列表
     */
    @Input()
    showShortcutList: boolean = true;

    /**
     * 是否只读
     */
    @Input()
    readonly: boolean = false;

    @Input()
    labelText: string = "附件管理";

    @Input()
    uploadButtonText: string = "上传";

    @Input()
    gridNoDataText: string = "请上传文件";

    @Input()
    title: string = "文件上传";

    /**
     * 流水号
     */
    @Input()
    numericalOrder: string;

    /**
     * 文件集合
     */
    // @Input()
    fileList: FileInfo[] = [];
    @Output()
    fileListChange = new EventEmitter<ChangedModel>();

    @Input()
    popWidth: string = "800px";

    @Input()
    popHeight: string = "580px";

    @Input()
    store: StoreType = "nxin";

    @Output()
    onChanged = new EventEmitter<ChangedModel>();

    /**
     * 文件基础路径
     */
    //  @Input() url: string = '';
    url: string = environment.nxinfileServerUrl;

    uploading = false;
    visible: boolean = false;

    gridDataSource: FileInfo[];

    currentUserId: string = '';
    ownerName: string = '';

    validationFile:any = null;

    constructor(private _http: HttpClient, private _service: UploadViewService, private tokenService: TokenAuthService, private qlwODataContext: QlwODataContext) {
        this.remove = this.remove.bind(this);
        this.download = this.download.bind(this);
        this.show = this.show.bind(this);
        this.currentUserId = this.tokenService.getTokenData.user_id;
        let parameter = new DataSourceParamters();
        parameter.filter = ["UserID", "=", this.currentUserId];
        let oData = this.qlwODataContext.getQlWPersonOData()
        oData.store.byKey(this.currentUserId).then(r => {
            if (r && r.length > 0) {
                this.ownerName = r[0].PersonName;
            }
        });
    }

    ngOnInit() {
        if (this.store === "nxin") {
            this.url = `${this.url}/upload`;
        }
        if (this.numericalOrder) {
            this._service.getFiles(this.numericalOrder).load().then((data) => {
                this.mapDataToFileList(data);
                this.initFileList();
                this.gridDataSource = this.fileList;
                this.changed(true);
            });
        }
    }

    changed(isInit: boolean = false) {
        this.fileListChange.emit({
            Files: this.fileList
            , isInit: isInit
        });
        //this.onChanged.emit(this.fileList);
    }

    clear() {
        this.fileList = [];
        this.validationFile = null;
    }

    fileRemove() {
        this.validationFile = null;
        for (let index = 0; index < this.fileList.length; index++) {
            const element = this.fileList[index];
            element.target = 3
        }
        this.changed();
    }

    

    // ngOnChanges(changes: SimpleChanges): void {
    //     this.fileList = this.fileList || [];
    //     this.initFileList();
    //     this.gridDataSource=this.validationFileList;
    // }

    

    initFileList() {
        if (this.fileList.length === 0) {
            return;
        }

        this.fileList.forEach(f => {
            f.target = 0;
        });
    }

    get validationFileList(): any[] {
        return this.fileList.filter(c => c.target !== 3);
    }

    open() {
        if (this.jumpOver) {
            this.upload()
        } else {
            this.visible = true;
        }
    }

    close() {
        this.visible = false;
    }

    openFile(item: FileInfo, target?: string) {
        HomeHelper.open(
            {
                url: item.filePath,
                title: item.fileName,
            },
            () => {
                window.open(item.filePath, target);
            }
        );
    }

    show(e) {
        if (!e || !e.row || !e.row.data) {
            return;
        }

        let file = e.row.data;
        this.openFile(file, "_blank");
    }

    download(e) {
        if (!e || !e.row || !e.row.data) {
            return;
        }

        let file = e.row.data;
        this.openFile(file, "_blank");
    }

    remove(e) {
        if (!e || !e.row || !e.row.data) {
            return;
        }
        let file = e.row.data;
        file.target = 3;
        this.gridDataSource = this.validationFileList;
        this.changed();
    }


    identityRecordCellTemplate(cellElement, cellInfo) {
        cellElement.innerText = parseInt(cellInfo.rowIndex) +
            1 +
            parseInt(cellInfo.component.pageSize()) * parseInt(cellInfo.component.pageIndex());
    }

    async upload() {
        if (this.uploading) {
            return;
        }

        let fileListTemp = await new UploadProvider(this.multiple, this.accept, this.limit).load();
        

        if (!fileListTemp || fileListTemp.length === 0) {
            return;
        }

        const tempLength = fileListTemp.length;
        const currentLength = this.validationFileList.length;

        if (tempLength > this.limit) {
            Notify.toast(`一次最多可以选择${this.limit}个文件`, NotifyType.Error);
            return;
        }

        if ((tempLength + currentLength) > this.maxFileLength) {
            Notify.toast(`单个单据附件最多不超过${this.maxFileLength}个`, NotifyType.Error);
            return;
        }

        const maxFileSizeBytes = this.maxFileMB * 1024 * 1024;

        for (let i = 0; i < fileListTemp.length; i++) {
            let file = fileListTemp[i];
            if (file.size > maxFileSizeBytes) {
                Notify.toast(`单个附件大小不能超过${this.maxFileMB}M`, NotifyType.Error);
                return;
            }
        }

        this.uploading = true;

        for (let i = 0; i < fileListTemp.length; i++) {
            let file = fileListTemp[i];
            let fileName = file.name;
            let time = new Date(); //new DateTime().toString('yyyy-MM-dd hh:mm');
            let ownerName = this.ownerName;
            let filePath = await this.uploadFile(file);
            let obj = { fileName: fileName, filePath: filePath, uploadDate: time, ownerName: ownerName, target: 1,EnterId:'' ,FileType:'',OwnerID:'',NumericalOrder:''}
            if (this.showShortcutList) {
                this.fileList.push(obj);
            } else {
                this.fileList = [obj]
            }
            this.gridDataSource = this.validationFileList;
            this._dataGrid.instance.refresh();
            this.validationFile = {
                file,
                fileName,
                time,
                ownerName,
                filePath
            }
        }

        this.changed();

        this.uploading = false;

        //let fileListTemp = await new UploadProvider(this.multiple, this.accept, this.limit).load().then((e) => {
        //this.uploading = true;
        // if (e && e.length > 0) {
        //     const key = `nxshuju/${this.dateFtt(new Date(), 'yyyyMMddhhmmss')}/${e[0].name}`;
        //     this._service.uploadAttach(e, key).then((result: { key: any; hash: any }) => {
        //         this.dataArr.push({
        //             FileName: e[0].name,
        //             DateTime: new DateTime().toString('yyyy-MM-dd hh:mm'),
        //             OwnerName: this.userInfo.realName,
        //             PathUrl: `${environment.qianniuYunFileUrl}/${key}`,
        //             FileHash: result.hash,
        //         });
        //         this.uploading = false;
        //     });
        // }
        //});
    }

    private async uploadFile(file: File) {
        if (this.store === "nxin") {
            return await this.uploadToNxin(file);
        }
    }

    private async uploadToNxin(file: File) {
        let formData = this.buildNxinRequestData(file);
        let buttonTextTemp = this.uploadButtonText;
        const req = new HttpRequest('POST', this.url, formData, {
            reportProgress: true
        });
        let response = await this._http.request(req).toPromise();
        let filePath = response['body']['data']["filepath"];

        return filePath;
    }

    private buildNxinRequestData(file: File) {
        let formData = new FormData();
        let timestamp = new Date().getTime().toString();
        let sign = MD5(timestamp + '0#01l@Rlp80').toString();
        formData.append("timestamp", timestamp)
        formData.append("uploadSource", 'qlw')
        formData.append("sign", sign)
        formData.append("thumbnail", 'true')
        formData.append("file", file);

        return formData;
    }

    private _dateFtt(date: Date, fmt: string) {
        //author: meizz
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp('(' + k + ')').test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        return fmt;
    }
    private mapDataToFileList(data) {
        if (!data) {
            return;
        }

        let files = data;
        this.fileList = UploadViewHelper(files);
        this.validationFile = this.fileList.filter(o => o.target != 3)[data.length - 1];
    }

}
