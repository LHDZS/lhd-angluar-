import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DataValidator,ValidationType } from 'src/app/providers/common/dataValidator';
import { DateTime } from 'src/app/providers/common/datetime';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { BasicSettingODataContext, YHBasicSettingODataContext, YHProductionODataContext } from 'src/app/providers/odataContext';
// import { groupBy } from 'src/app/providers/groupby';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { EditorToolbarComponent } from 'src/app/components/editor-grid/editor-toolbar/editor-toolbar.component'
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { FarmingPriceProposalsEntity, FarmingPriceProposalsService } from '../farmingpriceproposals.service';
import CustomStore from 'devextreme/data/custom_store';
import { DataDictionary } from 'src/app/providers/enums';
import { DataStatus } from 'src/app/components/editor-grid/util/index';
import { Distinct } from 'src/app/providers/distinct';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { environment } from 'src/environments/environment';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { PermissionService } from 'src/app/providers/permission';
import { HomeHelper } from 'src/app/providers/homeHelper';

@Component({
    selector: 'app-farmingpriceproposals-detail',
    templateUrl: './farmingpriceproposals-detail.component.html',
    styleUrls: ['./farmingpriceproposals-detail.component.scss'],
    providers: [FarmingPriceProposalsService],
})

export class FarmingPriceProposalsDetailComponent implements OnInit {
    @ViewChild('editorToolbar', { static: false })
    _editorToolbar: EditorToolbarComponent;
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    @ViewChild('detailGrid', { static: false })
    _detailGrid: DxDataGridComponent;
    @ViewChild('qmdetailGrid', { static: false })
    _qmdetailGrid: DxDataGridComponent;
    @ViewChild('sldetailGrid', { static: false })
    _sldetailGrid: DxDataGridComponent;
    @ViewChild('yzdetailGrid', { static: false })
    _yzdetailGrid: DxDataGridComponent;
    @ViewChild('review', { static: false })
    _review: EditorReviewRemoteComponent;
    mode: 'create' | 'edit';
    data: FarmingPriceProposalsEntity = {} as any;
    defaultData: FarmingPriceProposalsEntity = {} as any;
    lang: string = NxTranslateI18N.lang;
    /** 删除状态控制 */
    deleted: boolean = false;
    loading: boolean = false;
    hasDetail: boolean = false;
    rowFilter: boolean = false;
    qmrowFilter: boolean = false;
    slrowFilter: boolean = false;
    yzrowFilter: boolean = false;
    rqFlag: boolean = false;
    qmFlag: boolean = false;
    slFlag: boolean = false;
    yzFlag: boolean = false;
    zqHenhouseSource: any;
    UrlParam: any;
    breedingSource: any;
    // 商品数据源
    productSource: any;
    uploader:NxUploader=new NxUploader();
    numericalOrder: string = '';
    entertype: string = '';
    permission: PermissionService = new PermissionService();
    //附件
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];

    sumDetailSource: any;
    detailSource: any = [];
    qmdetailSource: any = [];
    sldetailSource: any = [];
    yzdetailSource: any = [];
    showDragIcons: boolean = true;
    /** 单据 当前操作行主键 */
    currentOperationRowKey: any;
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;

    @ViewChild('gridRef2', { static: false })
    dataGridRef2: DxDataGridComponent;

    @ViewChild('gridRef3', { static: false })
    dataGridRef3: DxDataGridComponent;

    //弹出框数据
    formData: any = {
        Number: null,
        EndEffectDate: null,
        StartEffectDate: null,
        Remarks: null,
    };
    outVisible: boolean = false;
    outSelect: string = "";
    outTitle: string = "";
    selectedRows: any=[];
    selectedRows2: any=[];
    $form: boolean = false;
    AutoDataSourceFilter: any=[];
    AutoDataSourceFilter2: any=[];
    mindex : 0;
    nindex : 0;
    /** APPID */
    appId: string=USER_INFO_CONTEXT.menuId;
    /** 用户ID */
    userId = USER_INFO_CONTEXT.userId;
    /** 已提交 */
    submited: boolean = false;
    referenced: boolean = false;
    reviewed: boolean = false;
    saveStatus: boolean=true;
    selectionModel: "single";

    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];
    columnSettingArr: any[] = [
       {
            'dataField': 'ProductName',
            'HeaderRequiredIcon': true,
            'caption': '商品代号',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'Specification',
            'caption': '规格',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'SexTypeName',
            'caption': '公母',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'PoultrySalesRankName',
            'caption': '等级',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'SaleBreedingName',
            'caption': '品种',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'MeasureUnitName',
            'caption': '计量单位',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'UnitPrice',
            'caption': '单价',
            'HeaderRequiredIcon': true,
            "fixed": false,
            'visible': true,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':4,
            'editorOptions': {
                type: 'fixedPoint',
                min: 0
            }
        },{
            'dataField': 'OldUnitPrice',
            'caption': '原单价',
            'visible': true,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':4,
            'allowEditing': false
        }
    ];
    columnSettingArr2: any[] = [{
        'dataField': 'ProductName',
        'HeaderRequiredIcon': true,
        'caption': '商品代号',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'Specification',
        'caption': '规格',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'MeasureUnitName',
        'caption': '计量单位',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'UnitPrice',
        'caption': '单价',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'visible': true,
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint':4,
        'editorOptions': {
            type: 'fixedPoint',
            min: 0
        }
    },{
        'dataField': 'OldUnitPrice',
        'caption': '原单价',
        'visible': true,
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint':4,
        'allowEditing': false
    }];
    columnSettingArr3: any[] = [{
        'dataField': 'ProductName',
        'HeaderRequiredIcon': true,
        'caption': '商品代号',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'Specification',
        'caption': '规格',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'MeasureUnitName',
        'caption': '计量单位',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'UnitPrice',
        'caption': '单价',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'visible': true,
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint':4,
        'editorOptions': {
            type: 'fixedPoint',
            min: 0
        }
    },{
        'dataField': 'OldUnitPrice',
        'caption': '原单价',
        'visible': true,
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint':4,
        'allowEditing': false
    }];
    columnSettingArr4: any[] = [{
        'dataField': 'ProductName',
        'HeaderRequiredIcon': true,
        'caption': '商品代号',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'Specification',
        'caption': '规格',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'MeasureUnitName',
        'caption': '计量单位',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    },{
        'dataField': 'UnitPrice',
        'caption': '单价',
        'HeaderRequiredIcon': true,
        "fixed": false,
        'visible': true,
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint':4,
        'editorOptions': {
            type: 'fixedPoint',
            min: 0
        }
    },{
        'dataField': 'OldUnitPrice',
        'caption': '原单价',
        'visible': true,
        'dataType': 'number',
        'alignment': 'right',
        'fixedPoint':4,
        'allowEditing': false
    }];
    title1: string = '肉禽类价格明细表';
    title2: string = '禽苗类价格明细表';
    title3: string = '饲料类价格明细表';
    title4: string = '药杂类价格明细表';
    jgVisible: boolean = false;
    JgDataSourceFilter: any=[];
    jgselectedRows: any=[];

    constructor(private _route: ActivatedRoute,private _router: Router, private _service: FarmingPriceProposalsService, private basicSettingODataContext: BasicSettingODataContext, private yhProductionODataContext: YHProductionODataContext) {
        this.mode = this._route.snapshot.queryParams.mode;
        if(this._route.snapshot.queryParams.type&&this._route.snapshot.queryParams.type=='2'){
            this.data.NumericalOrder = '';
        }
        else{
            this.data.NumericalOrder = this._route.snapshot.queryParams.numericalOrder;
        }
        this.numericalOrder = this._route.snapshot.queryParams.numericalOrder;
        this.entertype = this._route.snapshot.queryParams.type;
        this.breedingSource = this.basicSettingODataContext.getZqBreedingsetDataSource({
            select: ['BreedingID','BreedingName']
        });

        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        this.onReorder = this.onReorder.bind(this);
        this.onReorder2 = this.onReorder2.bind(this);
    }

    ngOnInit() {
        if (this.mode == 'create') {
            this.deleted = false;
            this.submited = false;
            this.reviewed=false;
            this.fileList = [];
            if(this.entertype&&this.entertype=='2'){
                this.fileList=[];
                var Param = 'NumericalOrder=' + this.numericalOrder + '&';
                this._service
                    .byKey(<any>Param)
                    .then((res: any) => {
                        if(res.isSuccess){
                            res.data[0].Number='';
                            res.data[0].NumericalOrder='';
                            res.data[0].entertype='';
                            var value = res.data[0];
                            var newValue = value;
                            this.defaultData = deepCopy(newValue);
                            this.data = newValue;

                            this.detailSource = this._service.getDetailSource();
                            value.RqDetails.forEach(element => {
                                element.OldUnitPrice = element.UnitPrice;
                                element.UnitPrice = null;
                            });
                            this._service._detailInfoUtil.initNew(value.RqDetails);

                            this.qmdetailSource = this._service.getQmDetailSource();
                            value.QmDetails.forEach(element => {
                                element.OldUnitPrice = element.UnitPrice;
                                element.UnitPrice = null;
                            });
                            this._service._qmdetailInfoUtil.initNew(value.QmDetails);

                            this.sldetailSource = this._service.getSlDetailSource();
                            value.SlDetails.forEach(element => {
                                element.OldUnitPrice = element.UnitPrice;
                                element.UnitPrice = null;
                            });
                            this._service._sldetailInfoUtil.initNew(value.SlDetails);

                            this.yzdetailSource = this._service.getYzDetailSource();
                            value.YzDetails.forEach(element => {
                                element.OldUnitPrice = element.UnitPrice;
                                element.UnitPrice = null;
                            });
                            this._service._yzdetailInfoUtil.initNew(value.YzDetails);

                            this.getDetail();
                        }
                    });
                return;
            }
            else{
                this.entertype = '';
                this._setDefault();
                this.detailSource = this._service.getDetailSource();
                this._service._detailInfoUtil.default(0);
                this.qmdetailSource = this._service.getQmDetailSource();
                this._service._qmdetailInfoUtil.default(0);
                this.sldetailSource = this._service.getSlDetailSource();
                this._service._sldetailInfoUtil.default(0);
                this.yzdetailSource = this._service.getYzDetailSource();
                this._service._yzdetailInfoUtil.default(0);
                // this._editorGrid.instance.setToolbarStatusAfterCreated();
                // this.detailSource._items=[];
                setTimeout(() => {
                    this.getDetail();
                }, 20);
            }
            // this.detailSource = this._service.getDetailSource();
            // this._setDefault();
        } else {
            var Param = 'NumericalOrder=' + this.data.NumericalOrder + '&';
            this._service
                .byKey(<any>Param)
                .then((res: any) => {
                    if(res.isSuccess){
                        var value = res.data[0];
                        var newValue = value;
                        this.defaultData = deepCopy(newValue);
                        this.data = newValue;
                        this.detailSource = this._service.getDetailSource();
                        this._service._detailInfoUtil.init(value.RqDetails);
                        this.qmdetailSource = this._service.getQmDetailSource();
                        this._service._qmdetailInfoUtil.init(value.QmDetails);
                        this.sldetailSource = this._service.getSlDetailSource();
                        this._service._sldetailInfoUtil.init(value.SlDetails);
                        this.yzdetailSource = this._service.getYzDetailSource();
                        this._service._yzdetailInfoUtil.init(value.YzDetails);

                        this.getDetail();
                    }
                });
        }
    }

    itemValueChanged(e) {
        console.log(e)
    }

    // 下拉数据控制
    giveDataSource(item) {
        return this[item.dataSource]
    }

    // 控制大表格显示隐藏
    columnSettingArrType(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].visible) {
                return false
            }
        }
        return true
    }

    // calss 类控制
    classType(item) {
        let str = []
        if (item.HeaderRequiredIcon) {
            str.push('required')
        }
        if (item.allowEditing === false) {
            str.push('disabled')
        }
        return str.join(' ')
    }
    // 结束

    private _setDefault() {
        let data = {
            DataDate: new DateTime().toString(),
            NumericalOrder: "",
            PriceType: "2301051115370000150",
            Remarks: "",
        };
        this.reviewed=false;
        this.submited = false;
        this.defaultData = deepCopy(data);
        this.data = data as any;
    }

    onDetailEditorPreparing(e) {
        if (e.dataField && e.row &&e.row.rowType && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            const _defaultValueChanged = e.editorOptions.onValueChanged;
            if(e.dataField == 'UnitPrice'){
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    newData.UnitPrice= Number(_e.value);
                    if (_e.value) {
                        newData.UnitPrice= Number(_e.value).toFixed(4);
                    }
                    this._service._detailInfoUtil.setData(e.row.key, newData);
                    this._detailGrid.instance.refresh();
                }
            }
        }
    }
    onQmDetailEditorPreparing(e) {
        if (e.dataField && e.row &&e.row.rowType && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            const _defaultValueChanged = e.editorOptions.onValueChanged;
            if(e.dataField == 'UnitPrice'){
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    newData.UnitPrice= Number(_e.value);
                    if (_e.value) {
                        newData.UnitPrice= Number(_e.value).toFixed(4);;
                    }
                    this._service._qmdetailInfoUtil.setData(e.row.key, newData);
                    this._qmdetailGrid.instance.refresh();
                }
            }
        }
    }
    onSlDetailEditorPreparing(e) {
        if (e.dataField && e.row &&e.row.rowType && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            const _defaultValueChanged = e.editorOptions.onValueChanged;
            if(e.dataField == 'UnitPrice'){
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    newData.UnitPrice= Number(_e.value);
                    if (_e.value) {
                        newData.UnitPrice= Number(_e.value).toFixed(4);;
                    }
                    this._service._sldetailInfoUtil.setData(e.row.key, newData);
                    this._sldetailGrid.instance.refresh();
                }
            }
        }
    }
    onYzDetailEditorPreparing(e) {
        if (e.dataField && e.row &&e.row.rowType && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            const _defaultValueChanged = e.editorOptions.onValueChanged;
            if(e.dataField == 'UnitPrice'){
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    newData.UnitPrice= Number(_e.value);
                    if (_e.value) {
                        newData.UnitPrice= Number(_e.value).toFixed(4);;
                    }
                    this._service._yzdetailInfoUtil.setData(e.row.key, newData);
                    this._yzdetailGrid.instance.refresh();
                }
            }
        }
    }
    /** 新增 */
    onCreate(type) {
        var title = "养殖价格方案-参照新增";
            if(type=='1'){
                title = "养殖价格方案-新增";
            }
            HomeHelper.open(
                {
                    url: `${environment.qqlwUri}/farmingpriceproposals/detail?mode=create&type=${type}&numericalOrder=${this.numericalOrder}`,
                    title: title,
                },
                () => {
                    this._router.onSameUrlNavigation = 'reload';
                    var numericalOrder = this.numericalOrder;
                    this._router.navigateByUrl('//farmingpriceproposals/detail/').then(() => {
                        this._router.navigate(['/farmingpriceproposals/detail'], {
                            queryParams: {
                                mode: 'create',
                                numericalOrder:numericalOrder,
                                type:type
                            },
                        });
                    });
                }
            );
    }
    /** 保存 */
    onSave() {
        if (this.reviewed) {
            Notify.warning('单据已审核！');
            return;
        }
        if(this.saveStatus){
            this.saveStatus=false;
        this._editorGrid.instance.save().then(() => {
            this.data.FarmingPriceProposalsDetailDto = this._service._detailInfoUtil.getSaveData();
            this.data.DataDate = new DateTime(this.data.DataDate).toString();
            const validator = new DataValidator(true);
            validator
                .requireNew(this.data, [
                    ['DataDate', '请选择制单日期'],
                    ['BreedingID', '请选择品种'],
                    ['EffectDate', '请选择生效日期'],
                ])
                .each(
                    this.data.FarmingPriceProposalsDetailDto,
                    [
                        ['ProductID', (data, value) => {
                            if (value && value != '0') return true;
                            return false;
                        }, '肉禽类价格明细表 - 第 [$INDEX] 行: 商品代号不能为空'],
                        [
                            'UnitPrice',
                            (data, value) => {
                                if (value || value >= 0) return true;
                                return false;
                            },
                            '肉禽类价格明细表 - 第 [$INDEX] 行: 单价不能为空',
                        ]
                    ],
                    '肉禽类价格明细表不能为空'
                );
            if (!validator.validation) {
                this.saveStatus=true;
                return;
            }
            
            var qmDetail = this._service._qmdetailInfoUtil.getSaveData();
            if(qmDetail&&qmDetail.length>0){
                var flag = false;
                var indexs = 0;
                var cos=[];
                qmDetail.forEach((f) => {
                    indexs++;
                    if (f.ProductID&&f.ProductID!="0") {
                        this.data.FarmingPriceProposalsDetailDto.push(f);
                        if(f.target!=DataStatus.Delete){
                            if(!f.UnitPrice&&f.UnitPrice!=0){
                                flag = true;
                                cos.push(indexs)
                            }
                        }
                    }
                });

                if (flag) {
                    this.saveStatus=true;
                    Notify.error("禽苗类价格明细表第["+cos.join()+"]行的单价为空！");
                    return;
                }
            }

            var slDetail = this._service._sldetailInfoUtil.getSaveData();
            if(slDetail&&slDetail.length>0){
                var flag = false;
                var indexs = 0;
                var cos=[];
                slDetail.forEach((f) => {
                    indexs++;
                    if (f.ProductID&&f.ProductID!="0") {
                        this.data.FarmingPriceProposalsDetailDto.push(f);
                        if(f.target!=DataStatus.Delete){
                            if(!f.UnitPrice&&f.UnitPrice!=0){
                                flag = true;
                                cos.push(indexs)
                            }
                        }
                    }
                });

                if (flag) {
                    this.saveStatus=true;
                    Notify.error("饲料类价格明细表第["+cos.join()+"]行的单价为空！");
                    return;
                }
            }

            var yzDetail = this._service._yzdetailInfoUtil.getSaveData();
            if(yzDetail&&yzDetail.length>0){
                var flag = false;
                var indexs = 0;
                var cos=[];
                yzDetail.forEach((f) => {
                    indexs++;
                    if (f.ProductID&&f.ProductID!="0") {
                        this.data.FarmingPriceProposalsDetailDto.push(f);
                        if(f.target!=DataStatus.Delete){
                            if(!f.UnitPrice&&f.UnitPrice!=0){
                                flag = true;
                                cos.push(indexs)
                            }
                        }
                    }
                });

                if (flag) {
                    this.saveStatus=true;
                    Notify.error("药杂类价格明细表第["+cos.join()+"]行的单价为空！");
                    return;
                }
            }
            this.data.EffectDate = new DateTime(this.data.EffectDate).toString();
            this.data.ModifiedDate = this.data.ModifiedDate?this.data.ModifiedDate:new DateTime().toString()
            this.data.FilesDto = this.fileList;
            if (this.mode == 'create') {
                this._service.post(this.data).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.success('保存成功');
                        this.mode = 'edit';
                        this.data.NumericalOrder = response.data.NumericalOrder;
                        this.numericalOrder= response.data.NumericalOrder;
                        this._editorGrid._remoteReveiw.instance.refresh(this.data.NumericalOrder);
                        this._onSavedResetView(this.data.NumericalOrder);
                    } else {
                        this.messageBoxVisible = true;
                        this.saveStatus=true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                }).then(()=>{
                    this.saveStatus=true;
                });
            } else {
                this._service.put(this.data).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.success('保存成功');
                        this._onSavedResetView(this.data.NumericalOrder);
                    } else {
                        this.messageBoxVisible = true;
                        this.saveStatus=true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                }).then(()=>{
                    this.saveStatus=true;
                });
            }
        });
    }
    }
    /** 保存之后状态重置 */
    private _onSavedResetView(numericalOrder) {
        var Param = 'NumericalOrder=' + numericalOrder + '&';
        return this._service
            .byKey(<any>Param)
            .then((res: any) => {
                if(res.isSuccess){
                    var value = res.data[0];
                    var newValue = value;
                    this.defaultData = deepCopy(newValue);
                    this.data = newValue;
                    this.detailSource = this._service.getDetailSource();
                    this._service._detailInfoUtil.init(value.RqDetails);
                    this.qmdetailSource = this._service.getQmDetailSource();
                    this._service._qmdetailInfoUtil.init(value.QmDetails);
                    this.sldetailSource = this._service.getSlDetailSource();
                    this._service._sldetailInfoUtil.init(value.SlDetails);
                    this.yzdetailSource = this._service.getYzDetailSource();
                    this._service._yzdetailInfoUtil.init(value.YzDetails);
                    this._editorGrid.instance.setToolbarStatusAfterSaved();
                    this.getDetail();
                }
            });
    }
    /** 撤销 */
    onCancel() {
        if (this.mode == 'create') {
            this._setDefault();
            this._editorGrid.instance.setToolbarStatusAfterCancelled();
            this._service._detailInfoUtil.default(0);
            this._service._qmdetailInfoUtil.default(0);
            this._service._sldetailInfoUtil.default(0);
            this._service._yzdetailInfoUtil.default(0);
        } else {
            this._onSavedResetView(this.data.NumericalOrder).then(() => {
                this._editorGrid.instance.setToolbarStatusAfterCancelled();
            });
        }
    }
    /** 删除 */
    onDelete() {

        if (this.reviewed) {
            Notify.warning('单据已审核不能删除！');
            return;
        }
        MessageBox.confirm('您确定要删除这张单据吗?').then(confirm => {
            if (confirm) {
                this._service.delete(this.data.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        //Notify.success('删除成功');
                        this.deleted = true;
                        this._editorGrid.instance.setToolbarStatusAfterDeleted();
                    } else {
                        // Notify.error('删除失败');
                        this.messageBoxVisible = true;
                        this.saveStatus=true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                });
            }
        });
    }

    onDetailOptionClick(e) {
        if (e.key == 'add') {
            this._addRowImpl();
        }
        else if (e.key == 'del') {
            this._deleteRowImpl();
        }
        else if (e.key == 'rowFilter') {
            this.rowFilter = !this.rowFilter;
        }
        else if (e.key == 'expand') {
            this.rqFlag = !this.rqFlag;
        }
        else if (e.key == 'addStock') {
            this.outVisible = true;
            this.outSelect = "rq";
            this.outTitle = "肉禽类价格明细添加弹出框：";
            //是否肉禽=是
            var f=[['PoultryStatus', '=', true]];
            let PurchaserIdParams = {
                filter: [
                    f,
                    ['bUse', '=', true]
                ],
                paginate: false,
            };
            this.AutoDataSourceFilter = [];
            this.AutoDataSourceFilter2 = [];
            new DataSource(this.basicSettingODataContext.getProductDataSource(PurchaserIdParams)).load().then((result) => {
                var oldData = this.detailSource._items;
                this.AutoDataSourceFilter = [];
                result.forEach((f) => {
                    var flag = true;
                    if (oldData.length>0) {
                        oldData.forEach((row) => {
                            if( row.ProductID == f.ProductID ){
                                flag = false;
                                return false;
                            }
                        });
                    }
                    if(flag){
                        this.AutoDataSourceFilter.push(f);
                    }
                });
                setTimeout(() => {
                    this.mindex = this.AutoDataSourceFilter.length;
                    this.nindex =0;
                }, 20);
            });
        }
    }

    onQmDetailOptionClick(e) {
        if (e.key == 'add') {
            this._addQmRowImpl();
        }
        else if (e.key == 'del') {
            this._deleteQmRowImpl();
        }
        else if (e.key == 'rowFilter') {
            this.qmrowFilter = !this.qmrowFilter;
        }
        else if (e.key == 'expand') {
            this.qmFlag = !this.qmFlag;
        }
        else if (e.key == 'addStock') {
            this.outVisible = true;
            this.outSelect = "qm";
            this.outTitle = "禽苗类价格明细添加弹出框：";
            var f=[
                    ['iSortPlus', '=', DataDictionary.iSortF],['PoultryStatus', '=', false]
                  ]
            let PurchaserIdParams = {
                filter: [
                    f,
                    ['bUse', '=', true]
                ],
                paginate: false,
            };
            this.AutoDataSourceFilter = [];
            this.AutoDataSourceFilter2 = [];
            new DataSource(this.basicSettingODataContext.getProductDataSource(PurchaserIdParams)).load().then((result) => {
                var oldData = this.qmdetailSource._items;
                this.AutoDataSourceFilter = [];
                result.forEach((f) => {
                    var flag = true;
                    if (oldData.length>0) {
                        oldData.forEach((row) => {
                            if( row.ProductID == f.ProductID ){
                                flag = false;
                                return false;
                            }
                        });
                    }
                    if(flag){
                        this.AutoDataSourceFilter.push(f);
                    }
                });
                setTimeout(() => {
                    this.mindex = this.AutoDataSourceFilter.length;
                    this.nindex =0;
                }, 20);
            });
        }
    }

    onSlDetailOptionClick(e) {
        if (e.key == 'add') {
            this._addSlRowImpl();
        }
        else if (e.key == 'del') {
            this._deleteSlRowImpl();
        }
        else if (e.key == 'rowFilter') {
            this.slrowFilter = !this.slrowFilter;
        }
        else if (e.key == 'expand') {
            this.slFlag = !this.slFlag;
        }
        else if (e.key == 'addStock') {
            this.outVisible = true;
            this.outSelect = "sl";
            this.outTitle = "饲料类价格明细添加弹出框：";
            var f=[
                    ['iSortPlus', '=', DataDictionary.iSortA],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortJ],
                ]
            let PurchaserIdParams = {
                filter: [
                    f,
                    ['bUse', '=', true]
                ],
                paginate: false,
            };
            this.AutoDataSourceFilter = [];
            this.AutoDataSourceFilter2 = [];
            new DataSource(this.basicSettingODataContext.getProductDataSource(PurchaserIdParams)).load().then((result) => {
                var oldData = this.sldetailSource._items;
                this.AutoDataSourceFilter = [];
                result.forEach((f) => {
                    var flag = true;
                    if (oldData.length>0) {
                        oldData.forEach((row) => {
                            if( row.ProductID == f.ProductID ){
                                flag = false;
                                return false;
                            }
                        });
                    }
                    if(flag){
                        this.AutoDataSourceFilter.push(f);
                    }
                });
                setTimeout(() => {
                    this.mindex = this.AutoDataSourceFilter.length;
                    this.nindex =0;
                }, 20);
            });
        }
    }

    onYzDetailOptionClick(e) {
        if (e.key == 'add') {
            this._addYzRowImpl();
        }
        else if (e.key == 'del') {
            this._deleteYzRowImpl();
        }
        else if (e.key == 'rowFilter') {
            this.yzrowFilter = !this.yzrowFilter;
        }
        else if (e.key == 'expand') {
            this.yzFlag = !this.yzFlag;
        }
        else if (e.key == 'addStock') {
            this.outVisible = true;
            this.outSelect = "yz";
            this.outTitle = "药杂类价格明细添加弹出框：";
            var f=[
                    ['iSortPlus', '=', DataDictionary.iSortB],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortC],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortE]
                ]
            let PurchaserIdParams = {
                filter: [
                    f,
                    ['bUse', '=', true]
                ],
                paginate: false,
            };
            this.AutoDataSourceFilter = [];
            this.AutoDataSourceFilter2 = [];
            new DataSource(this.basicSettingODataContext.getProductDataSource(PurchaserIdParams)).load().then((result) => {
                var oldData = this.yzdetailSource._items;
                this.AutoDataSourceFilter = [];
                result.forEach((f) => {
                    var flag = true;
                    if (oldData.length>0) {
                        oldData.forEach((row) => {
                            if( row.ProductID == f.ProductID ){
                                flag = false;
                                return false;
                            }
                        });
                    }
                    if(flag){
                        this.AutoDataSourceFilter.push(f);
                    }
                });
                setTimeout(() => {
                    this.mindex = this.AutoDataSourceFilter.length;
                    this.nindex =0;
                }, 20);
            });
        }else if (e.key == 'addJg') {
            this.jgVisible = true;
            this.onQuery('1');
        }
    }

    onPopupHiding() {
        this.outVisible = false;
        this.AutoDataSourceFilter = [];
        this.AutoDataSourceFilter2 = [];
        this.mindex =0;
        this.nindex =0;
    }

    onJgPopupHiding() {
        this.jgVisible = false;
        this.JgDataSourceFilter = [];
    }

    /** 增行 */
    _addRowImpl() {
        let _data = { target: DataStatus.NewButNotEdit };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._detailGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._detailGrid.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this._detailGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._detailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
        });
    }
     /** 增行 */
     _addQmRowImpl() {
        let _data = { target: DataStatus.NewButNotEdit };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._qmdetailGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._qmdetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this._qmdetailGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._qmdetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
        });
    }
     /** 增行 */
     _addSlRowImpl() {
        let _data = { target: DataStatus.NewButNotEdit };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._sldetailGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._sldetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this._sldetailGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._sldetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
        });
    }
     /** 增行 */
     _addYzRowImpl() {
        let _data = { target: DataStatus.NewButNotEdit };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._yzdetailGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._yzdetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
        });
    }
    /** 删行 */
    _deleteRowImpl() {
        let _deleteKeys: any[] = this._detailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._detailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._detailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
            this.getDetail();
        });
    }

    /** 删行 */
    _deleteQmRowImpl() {
        let _deleteKeys: any[] = this._qmdetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._qmdetailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._qmdetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
            this.getDetail();
        });
    }

     /** 删行 */
     _deleteSlRowImpl() {
        let _deleteKeys: any[] = this._sldetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._sldetailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._sldetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
            this.getDetail();
        });
    }

    /** 删行 */
    _deleteYzRowImpl() {
        let _deleteKeys: any[] = this._yzdetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._yzdetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
            this.getDetail();
        });
    }

    _saveCancelBtnStatusCtrl() {
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn').disabled = false;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = false;
    }

    _getSaveCancelBtnStatusCtrl() {
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn').disabled = true;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = true;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
    }

    setCapitaUnitPriceCellValue(data,value,oldData){
       if(oldData.TotalAmount){
        data["CapitaUnitPrice"]=(value.TotalAmount || 0) / (value.Capita);
       }else{
        data["CapitaUnitPrice"]=0;
       }
    }
    /** 获取审核信息 */
    getReviewInfo(data) {
        return this._service.getReviewInfo(data);
    }
    /** 审核操作 */
    operationReview(data) {
        if (data.IsAdd) {
            // if (this.data.SubmitStatus == 1) {
            //     Notify.warning('请先提交审核');
            //     return Promise.resolve({ code: -1 });
            // }
        }
        return this._service.operationReview(data);
    }
    /** 审核状态变更 */
    onReviewOptionChanged(e: { items: any[] }) {
        if (e.items.filter(m => m.reviewed).length > 0) {
            this.submited = true;
            this.reviewed=true;
            setTimeout(() => {
                this._getSaveCancelBtnStatusCtrl();
            }, 500);
        }else{
            this.reviewed=false;
            this.submited = false;
            this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = false;
        }
    }

    getSelection() {
        var selectedRowsData11 = this.AutoDataSourceFilter2;
        if(selectedRowsData11.length==0){
            Notify.toast("没有已选商品代号！", NotifyType.Error);
            return;
        }
        selectedRowsData11.forEach((f) => {
            f.target= DataStatus.New;
            let randomKey = undefined;
            const maxWhile = 10;
            let whileCount = 0;
            if(this.outSelect == "rq"){
                do {
                    randomKey = Math.round(Math.random() * 10000000);
                    if (whileCount > maxWhile) {
                        break;
                    }
                    whileCount++;
                } while (this._detailGrid.instance.getRowIndexByKey(randomKey) > -1);
                f[((<DataSource>this._detailGrid.dataSource).store() as CustomStore).key()] = randomKey;
                f["ProductCollectType"] = DataDictionary.ProductCollectTypeD;
                ((<DataSource>this._detailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                    this._detailGrid.instance.refresh();
                    this._saveCancelBtnStatusCtrl();
                });
            }
            else if(this.outSelect == "qm"){
                do {
                    randomKey = Math.round(Math.random() * 10000000);
                    if (whileCount > maxWhile) {
                        break;
                    }
                    whileCount++;
                } while (this._qmdetailGrid.instance.getRowIndexByKey(randomKey) > -1);
                f[((<DataSource>this._qmdetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
                f["ProductCollectType"] = DataDictionary.ProductCollectTypeA;
                ((<DataSource>this._qmdetailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                    this._qmdetailGrid.instance.refresh();
                    this._saveCancelBtnStatusCtrl();
                });
            } else if(this.outSelect == "sl"){
                do {
                    randomKey = Math.round(Math.random() * 10000000);
                    if (whileCount > maxWhile) {
                        break;
                    }
                    whileCount++;
                } while (this._sldetailGrid.instance.getRowIndexByKey(randomKey) > -1);
                f[((<DataSource>this._sldetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
                f["ProductCollectType"] = DataDictionary.ProductCollectTypeB;
                ((<DataSource>this._sldetailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                    this._sldetailGrid.instance.refresh();
                    this._saveCancelBtnStatusCtrl();
                });
            }else if(this.outSelect == "yz"){
                do {
                    randomKey = Math.round(Math.random() * 10000000);
                    if (whileCount > maxWhile) {
                        break;
                    }
                    whileCount++;
                } while (this._yzdetailGrid.instance.getRowIndexByKey(randomKey) > -1);
                f[((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
                f["ProductCollectType"] = DataDictionary.ProductCollectTypeC;
                ((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                    this._yzdetailGrid.instance.refresh();
                    this._saveCancelBtnStatusCtrl();
                });
            }
        });
        this.outVisible = false;
        this.AutoDataSourceFilter = [];
        this.AutoDataSourceFilter2 = [];
        this.mindex =0;
        this.nindex =0;
        this.getDetail();
    }
    onQuery(type) {
        if(type=="2"){
            this.formData = {
                Number: null,
                EndEffectDate: null,
                StartEffectDate: null,
                Remarks: null,
            };
            return false;
        }
        var f=[
            ['ProductCollectType', '=', DataDictionary.ProductCollectTypeC]
        ]

        if(this.formData.Number){
            f.push(['Number', 'contains', this.formData.Number])
        }

        if(this.formData.Remarks){
            f.push(['Remarks', 'contains', this.formData.Remarks])
        }

        if(this.formData.EndEffectDate){
            f.push(['EffectDate', '<=', this.formData.EndEffectDate])
        }

        if(this.formData.StartEffectDate){
            f.push(['EffectDate', '>=', this.formData.StartEffectDate])
        }

        let PurchaserIdParams = {
            filter: [
                f
            ],
            paginate: false,
        };
        this.loading = true;
        new DataSource(this.yhProductionODataContext.getPriceProposalsListDataSource(PurchaserIdParams)).load().then((result) => {
            this.loading = false;
            if(result&&result.length>0){
                 result.forEach((f) => {
                  f.CreatedDate = new DateTime(f.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
                  f.EffectDate = new DateTime(f.EffectDate).toString('yyyy/MM/dd');
                });
                this.JgDataSourceFilter = result;
            }else{
                this.JgDataSourceFilter = [];
            }
        });

    }
    getYzSelection(type) {
        if(type=="3"){
            this.JgDataSourceFilter = [];
            this.jgVisible = false;
            this.formData = {
                Number: null,
                EndEffectDate: null,
                StartEffectDate: null,
                Remarks: null,
            };
            return false;
        }

        var selectedRowsData11 = this.dataGridRef3.instance.getSelectedRowsData();
        if(selectedRowsData11.length==0){
            Notify.toast("请勾选一条明细！", NotifyType.Error);
            return;
        }if(selectedRowsData11.length>1){
            Notify.toast("只能勾选一条明细！", NotifyType.Error);
            return;
        }
        var Param = 'NumericalOrder=' + selectedRowsData11[0].NumericalOrder + '&';
        this._service
            .queryPriceProposalsDetail(<any>Param)
            .then((res: any) => {
                if(res.isSuccess){
                    var value = res.data[0];
                    var oldData = this.yzdetailSource._items;
                    value.Details.forEach((f) => {
                        var flag = true;
                        if (oldData.length>0) {
                            oldData.forEach((row) => {
                                if( row.ProductID == f.ProductID ){
                                    flag = false;
                                    row.UnitPrice = f.UnitPrice;
                                    return false;
                                }
                            });
                        }
                        if(flag){
                            f.target= DataStatus.New;
                            let randomKey = undefined;
                            const maxWhile = 10;
                            let whileCount = 0;
                            do {
                                randomKey = Math.round(Math.random() * 10000000);
                                if (whileCount > maxWhile) {
                                    break;
                                }
                                whileCount++;
                            } while (this._yzdetailGrid.instance.getRowIndexByKey(randomKey) > -1);
                            f[((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
                            f["ProductCollectType"] = DataDictionary.ProductCollectTypeC;
                            ((<DataSource>this._yzdetailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                                this._yzdetailGrid.instance.refresh();
                                this._saveCancelBtnStatusCtrl();
                            });
                        }
                    });

                    this.JgDataSourceFilter = [];
                    this.jgVisible = false;
                    this.formData = {
                        Number: null,
                        EndEffectDate: null,
                        StartEffectDate: null,
                        Remarks: null,
                    };
                    this.getDetail();
                }
            });
    }

    getDetail(){
        // var items = this._service._detailInfoUtil.getSaveData().filter(m => m.target!=DataStatus.Delete);
        // if(items.length>0){
        //     this.hasDetail = true;
        // }
        // else{
        //     this.hasDetail = false;
        // }
    }
    fileListChanged(e) {
        if (!e.isInit) {
            // this.detailGridRef.modifyDataStatusSet();
            this._saveCancelBtnStatusCtrl();
        }
        this.fileList = e.Files;
        return this;
    }

    init_uploader(): FarmingPriceProposalsDetailComponent {
        this.uploader.visible = true;
        this.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.data.NumericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);
        return this;
    }

    //拖拽事件
    onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.AutoDataSourceFilter.findIndex((item) => item.ProductID === visibleRows[e.toIndex].data.ProductID);
        const fromIndex = this.AutoDataSourceFilter.findIndex((item) => item.ProductID === e.itemData.ProductID);
        this.AutoDataSourceFilter.splice(fromIndex, 1);
        this.AutoDataSourceFilter.splice(toIndex, 0, e.itemData);
    }
    onReorder2(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.AutoDataSourceFilter2.findIndex((item) => item.ProductID === visibleRows[e.toIndex].data.ProductID);
        const fromIndex = this.AutoDataSourceFilter2.findIndex((item) => item.ProductID === e.itemData.ProductID);
        this.AutoDataSourceFilter2.splice(fromIndex, 1);
        this.AutoDataSourceFilter2.splice(toIndex, 0, e.itemData);
    }

    onFocusedCellChanging(e) {
        if(this.selectedRows.length==0){
            Notify.toast("请先勾选左边列表的明细！", NotifyType.Error);
            return;
        }
        this.selectedRows.forEach(item => {
            this.AutoDataSourceFilter.splice(this.AutoDataSourceFilter.findIndex(v => v.ProductID == item.ProductID), 1)
        })
        this.AutoDataSourceFilter2 = this.selectedRows.concat(this.AutoDataSourceFilter2);
        setTimeout(() => {
            this.mindex = this.AutoDataSourceFilter.length;
            this.nindex =this.AutoDataSourceFilter2.length;
        }, 20);
    }
    onFocusedCellChanging2(e) {
        if(this.selectedRows2.length==0){
            Notify.toast("请先勾选右边列表的明细！", NotifyType.Error);
            return;
        }
        this.selectedRows2.forEach(item => {
            this.AutoDataSourceFilter2.splice(this.AutoDataSourceFilter2.findIndex(v => v.ProductID == item.ProductID), 1)
        })
        this.AutoDataSourceFilter = this.AutoDataSourceFilter.concat(this.selectedRows2);
        setTimeout(() => {
            this.mindex = this.AutoDataSourceFilter.length;
            this.nindex =this.AutoDataSourceFilter2.length;
        }, 20);
    }

    onEditorPreparingFn3(e,type) {
        // 判单值发生改变 自动勾选
        if (e.dataField && e.row && e.row.rowType && e.row.rowType == 'data') {
            const rowData = e.row.data;
            if (e.dataField == 'UnitPrice') {
                e.editorOptions.onValueChanged = (_e) => {
                    if(!_e.value){
                        _e.value =0;
                    }
                    if(type=="1"){
                        let rowData2 = this.AutoDataSourceFilter.find((m) => m['ProductID'] == rowData['ProductID']);
                        rowData2['UnitPrice'] = Number(_e.value).toFixed(4);
                        this.dataGridRef.instance.refresh();
                        setTimeout(() => {
                            if (this.selectedRows.indexOf(e.row.key) === -1) {
                                this.selectedRows.push(e.row.key);
                            }
                        }, 20);
                    }
                    else{
                        let rowData2 = this.AutoDataSourceFilter2.find((m) => m['ProductID'] == rowData['ProductID']);
                        if(!_e.value){
                            _e.value =0;
                        }
                        rowData2['UnitPrice'] = Number(_e.value).toFixed(4);
                        this.dataGridRef2.instance.refresh();
                        setTimeout(() => {
                            if (this.selectedRows2.indexOf(e.row.key) === -1) {
                                this.selectedRows2.push(e.row.key);
                            }
                        }, 20);
                    }
                };
            }

        }
    }

}
