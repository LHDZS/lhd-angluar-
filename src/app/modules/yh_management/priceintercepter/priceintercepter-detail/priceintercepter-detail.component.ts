import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DataValidator,ValidationType } from 'src/app/providers/common/dataValidator';
import { DateTime } from 'src/app/providers/common/datetime';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { BasicSettingODataContext, YHBasicSettingODataContext } from 'src/app/providers/odataContext';
// import { groupBy } from 'src/app/providers/groupby';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { EditorToolbarComponent } from 'src/app/components/editor-grid/editor-toolbar/editor-toolbar.component'
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { PriceIntercepterEntity, PriceIntercepterService } from '../priceintercepter.service';
import CustomStore from 'devextreme/data/custom_store';
import { DataDictionary } from 'src/app/providers/enums';
import { DataStatus } from 'src/app/components/editor-grid/util/index';
import { Distinct } from 'src/app/providers/distinct';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { PermissionService } from 'src/app/providers/permission';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { RegExps } from 'src/app/providers/regexp';
import { PrintPageComponent } from 'nxin-print';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-priceintercepter-detail',
    templateUrl: './priceintercepter-detail.component.html',
    styleUrls: ['./priceintercepter-detail.component.scss'],
    providers: [PriceIntercepterService],
})

export class PriceIntercepterDetailComponent implements OnInit {
    @ViewChild('editorToolbar', { static: false })
    _editorToolbar: EditorToolbarComponent;
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    @ViewChild('detailGrid', { static: false })
    _detailGrid: DxDataGridComponent;
    @ViewChild('famerdetailGrid', { static: false })
    _famerdetailGrid: DxDataGridComponent;
    @ViewChild('review', { static: false })
    _review: EditorReviewRemoteComponent;
    mode: 'create' | 'edit';
    data: PriceIntercepterEntity = {} as any;
    defaultData: PriceIntercepterEntity = {} as any;
    lang: string = NxTranslateI18N.lang;
    /** 删除状态控制 */
    deleted: boolean = false;
    hasDetail: boolean = false;
    rowFilter: boolean = false;
    rowFamerFilter: boolean = false;
    zqHenhouseSource: any;
    UrlParam: any;
    productCollectTypeSource: any;
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
    famerdetailSource: any = [];
    showDragIcons: boolean = true;
    /** 单据 当前操作行主键 */
    currentOperationRowKey: any;
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;

    @ViewChild('gridRef2', { static: false })
    dataGridRef2: DxDataGridComponent;

    //弹出框数据
    formData: any = {
        HenhouseName: '',
        BatchName: ''
    };
    outVisible: boolean = false;
    selectedRows: any=[];
    selectedRows2: any=[];
    $form: boolean = false;
    AutoDataSourceFilter: any=[];
    AutoDataSourceFilter2: any=[];
    mindex : 0;
    nindex : 0;

    @ViewChild('gridRef3', { static: false })
    dataGridRef3: DxDataGridComponent;

    @ViewChild('gridRef4', { static: false })
    dataGridRef4: DxDataGridComponent;

    fameroutVisible: boolean = false;
    famerselectedRows: any=[];
    famerselectedRows2: any=[];
    famerAutoDataSourceFilter: any=[];
    famerAutoDataSourceFilter2: any=[];
    famermindex : 0;
    famernindex : 0;

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
    gridSelectedRows: any[] = [];
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
        'dataField': 'YHFarmerName',
        'HeaderRequiredIcon': true,
        'caption': '养户名称',
        "fixed": false,
        'visible': true,
        'allowEditing': false,
    }];
    title1: string = '价格明细表';
    title2: string = '适用养户表';
    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    constructor(private _route: ActivatedRoute,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private _router: Router, private _service: PriceIntercepterService, 
        private basicSettingODataContext: BasicSettingODataContext,
        private tokenService: TokenAuthService,) 
    {
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        this.mode = this._route.snapshot.queryParams.mode;
        if(this._route.snapshot.queryParams.type&&this._route.snapshot.queryParams.type=='2'){
            this.data.NumericalOrder = '';
        }
        else{
            this.data.NumericalOrder = this._route.snapshot.queryParams.numericalOrder;
        }
        this.numericalOrder = this._route.snapshot.queryParams.numericalOrder;
        this.entertype = this._route.snapshot.queryParams.type;
        this.productCollectTypeSource = this.basicSettingODataContext.getBizDataDictDataSource({
            filter: [['DictId', '=', DataDictionary.ProductCollectTypeA],'or',['DictId', '=', DataDictionary.ProductCollectTypeB],'or',['DictId', '=', DataDictionary.ProductCollectTypeC]],
            select: ['DictId', 'DictName'],
        });

        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        this.onReorder = this.onReorder.bind(this);
        this.onReorder2 = this.onReorder2.bind(this);
    }

    ngOnInit() {
        console.log("numericalOrder",this.numericalOrder);
        console.log("entertype",this.entertype);
        console.log("mode",this.mode);
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
                            value.Details.forEach(element => {
                                element.OldUnitPrice = element.UnitPrice;
                                element.UnitPrice = null;
                            });
                            this._service._detailInfoUtil.initNew(value.Details);

                            this.famerdetailSource = this._service.getFamerDetailSource();
                            this._service._famerdetailInfoUtil.initNew(value.famerDetails);

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

                this.famerdetailSource = this._service.getFamerDetailSource();
                this._service._famerdetailInfoUtil.default(0);

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
                        this._service._detailInfoUtil.init(value.Details);

                        this.famerdetailSource = this._service.getFamerDetailSource();
                        this._service._famerdetailInfoUtil.init(value.famerDetails);

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
        if (item.errorType === true) {
            str.push('error')
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
            const tbody = document.getElementsByClassName('dx-data-row')
            if(e.dataField == 'UnitPrice'){
                let OldUnitPrice = rowData['OldUnitPrice'];
                e.editorOptions.onValueChanged = _e => {
                    // if ( OldUnitPrice && OldUnitPrice != _e.value ) {
                    //     if (this.gridSelectedRows.indexOf(e.row.key) === -1) {
                    //         this.gridSelectedRows.push(e.row.key)
                    //     }
                    // }

                    var newData = deepCopy(rowData);
                    // console.log(tbody)
                    // tbody[0].classList.add("dx-error");
                    // tbody[e.row.rowIndex].classList.add("dx-error");
                    // console.log(e)
                    // console.log(e.element.children[0].children[5].children[1].children[0].children[1].children)
                    // e.element.children[0].children[5].children[1].children[0].children[1].children[e.row.rowIndex].classList.add('dx-error')
                    // e.element.children[0].children[5].children[1].children[0].children[1].children[e.row.rowIndex].style.backgroundColor = '#F56C6C'

                    if (_e.value) {
                        newData.UnitPrice= Number(_e.value).toFixed(4);;
                    }
                    this._service._detailInfoUtil.setData(e.row.key, newData);
                    this._detailGrid.instance.refresh();
                }
            }
        }
    }
    /** 新增 */
    onCreate(type) {
            var title = "领用特殊价格-参照新增";
            if(type=='1'){
                title = "领用特殊价格-新增";
            }
            HomeHelper.open(
                {
                    url: `${environment.qqlwUri}/priceintercepter/detail?mode=create&type=${type}&numericalOrder=${this.numericalOrder}`,
                    title: title,
                },
                () => {
                    this._router.onSameUrlNavigation = 'reload';
                    var numericalOrder = this.numericalOrder;
                    this._router.navigateByUrl('//priceintercepter/detail/').then(() => {
                        this._router.navigate(['/priceintercepter/detail'], {
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
            this.data.PriceIntercepterDetailDto = this._service._detailInfoUtil.getSaveData();
            this.data.PriceIntercepterFamerDetailDto = this._service._famerdetailInfoUtil.getSaveData();
            this.data.DataDate = new DateTime(this.data.DataDate).toString();
            const validator = new DataValidator(true);
            validator
                .requireNew(this.data, [
                    ['DataDate', '请选择制单日期'],
                    ['ProductCollectType', '请选择商品类型'],
                    ['EffectDate', '请选择生效日期'],
                ])
                .each(
                    this.data.PriceIntercepterDetailDto,
                    [
                        ['ProductID', (data, value) => {
                            if (value && value != '0') return true;
                            return false;
                        }, '价格明细表 - 第 [$INDEX] 行: 商品代号不能为空'],
                        [
                            'UnitPrice',
                            (data, value) => {
                                if (value && value > 0) return true;
                                return false;
                            },
                            '价格明细表 - 第 [$INDEX] 行: 单价不能为空且必须大于0',
                        ]
                    ],
                    '价格明细表不能为空'
                );
            if (!validator.validation) {
                this.saveStatus=true;
                    return;
            }

            const validator2 = new DataValidator(true);
            validator2
                .requireNew(this.data, [
                    ['DataDate', '请选择制单日期'],
                    ['ProductCollectType', '请选择商品类型'],
                    ['EffectDate', '请选择生效日期'],
                ]).each(
                    this.data.PriceIntercepterFamerDetailDto,
                    [
                        ['YHFarmerID', (data, value) => {
                            if (value && value != '0') return true;
                            return false;
                        }, '适用养户表 - 第 [$INDEX] 行: 养户名称不能为空'],
                    ],
                    '适用养户表不能为空'
                );
            if (!validator2.validation) {
                this.saveStatus=true;
                    return;
            }

            this.data.EffectDate = new DateTime(this.data.EffectDate).toString();
            this.data.EndDate = this.data.EndDate?new DateTime(this.data.EndDate).toString("yyyy-MM-dd"):null;
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
                    this._service._detailInfoUtil.init(value.Details);

                    this.famerdetailSource = this._service.getFamerDetailSource();
                    this._service._famerdetailInfoUtil.init(value.famerDetails);

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
        else if (e.key == 'addStock') {
            if (!this.data.ProductCollectType ||this.data.ProductCollectType=='0') {
                Notify.warning('请先选择商品类型！');
                return;
            }
            this.outVisible = true;
            // 禽苗类=禽类；饲料类=饲料/稻谷；药杂类=疫苗/药品/其他
            var f=[];
            if(this.data.ProductCollectType==DataDictionary.ProductCollectTypeA){//禽苗类
                f=[
                    ['iSortPlus', '=', DataDictionary.iSortF],['PoultryStatus', '=', false]
                  ]
            }else if(this.data.ProductCollectType==DataDictionary.ProductCollectTypeB){//饲料类
                f=[
                    ['iSortPlus', '=', DataDictionary.iSortA],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortJ],
                ]
            }else if(this.data.ProductCollectType==DataDictionary.ProductCollectTypeC){//药杂类
                f=[
                    ['iSortPlus', '=', DataDictionary.iSortB],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortC],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortE]
                ]
            }
            if (f.length==0) {
                Notify.warning('请先选择商品类型！');
                return;
            }
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

    onFamerDetailOptionClick(e) {
        if (e.key == 'add') {
            this._addRowImpl();
        }
        else if (e.key == 'del') {
            this._deleteFamerRowImpl();
        }
        else if (e.key == 'rowFilter') {
            this.rowFamerFilter = !this.rowFamerFilter;
        }
        else if (e.key == 'addStock') {
            this.fameroutVisible = true;
            let PurchaserIdParams = {
                filter: [
                    ['Status', '=', true]
                ],
                paginate: false,
            };
            this.famerAutoDataSourceFilter = [];
            this.famerAutoDataSourceFilter2 = [];
            new DataSource(this.yhBasicSettingODataContext.getYHFarmerInfoDataSource(PurchaserIdParams)).load().then((result) => {
                var oldData = this.famerdetailSource._items;
                this.famerAutoDataSourceFilter = [];
                result.forEach((f) => {
                    var flag = true;
                    if (oldData.length>0) {
                        oldData.forEach((row) => {
                            if( row.YHFarmerID == f.YHFarmerID ){
                                flag = false;
                                return false;
                            }
                        });
                    }
                    if(flag){
                        this.famerAutoDataSourceFilter.push(f);
                    }
                });
                setTimeout(() => {
                    this.famermindex = this.famerAutoDataSourceFilter.length;
                    this.famernindex =0;
                }, 20);
            });
        }
    }

    onFamerPopupHiding() {
        this.fameroutVisible = false;
        this.famerAutoDataSourceFilter = [];
        this.famerAutoDataSourceFilter2 = [];
        this.famermindex =0;
        this.famernindex =0;
    }

    onPopupHiding() {
        this.outVisible = false;
        this.AutoDataSourceFilter = [];
        this.AutoDataSourceFilter2 = [];
        this.mindex =0;
        this.nindex =0;
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
    _deleteFamerRowImpl() {
        let _deleteKeys: any[] = this._famerdetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._famerdetailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._famerdetailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
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
            do {
                randomKey = Math.round(Math.random() * 10000000);
                if (whileCount > maxWhile) {
                    break;
                }
                whileCount++;
            } while (this._detailGrid.instance.getRowIndexByKey(randomKey) > -1);
            f[((<DataSource>this._detailGrid.dataSource).store() as CustomStore).key()] = randomKey;
            ((<DataSource>this._detailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                this._detailGrid.instance.refresh();
                this._saveCancelBtnStatusCtrl();
            });
        });
        this.outVisible = false;
        this.AutoDataSourceFilter = [];
        this.AutoDataSourceFilter2 = [];
        this.mindex =0;
        this.nindex =0;
        this.getDetail();
    }

    getFamerSelection() {
        var selectedRowsData11 = this.famerAutoDataSourceFilter2;
        if(selectedRowsData11.length==0){
            Notify.toast("没有已选养户名称！", NotifyType.Error);
            return;
        }
        selectedRowsData11.forEach((f) => {
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
            } while (this._famerdetailGrid.instance.getRowIndexByKey(randomKey) > -1);
            f[((<DataSource>this._famerdetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
            ((<DataSource>this._famerdetailGrid.dataSource).store() as CustomStore).insert(f).then(() => {
                this._famerdetailGrid.instance.refresh();
                this._saveCancelBtnStatusCtrl();
            });
        });
        this.fameroutVisible = false;
        this.famerAutoDataSourceFilter = [];
        this.famerAutoDataSourceFilter2 = [];
        this.famermindex =0;
        this.famernindex =0;
    }

    getDetail(){
        var items = this._service._detailInfoUtil.getSaveData().filter(m => m.target!=DataStatus.Delete);
        if(items.length>0){
            this.hasDetail = true;
        }
        else{
            this.hasDetail = false;
        }
    }
    fileListChanged(e) {
        if (!e.isInit) {
            // this.detailGridRef.modifyDataStatusSet();
            this._saveCancelBtnStatusCtrl();
        }
        this.fileList = e.Files;
        return this;
    }

    init_uploader(): PriceIntercepterDetailComponent {
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

    //拖拽事件
    onReorder3(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.famerAutoDataSourceFilter.findIndex((item) => item.YHFarmerID === visibleRows[e.toIndex].data.YHFarmerID);
        const fromIndex = this.famerAutoDataSourceFilter.findIndex((item) => item.YHFarmerID === e.itemData.YHFarmerID);
        this.famerAutoDataSourceFilter.splice(fromIndex, 1);
        this.famerAutoDataSourceFilter.splice(toIndex, 0, e.itemData);
    }
    onReorder4(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.famerAutoDataSourceFilter2.findIndex((item) => item.YHFarmerID === visibleRows[e.toIndex].data.YHFarmerID);
        const fromIndex = this.famerAutoDataSourceFilter2.findIndex((item) => item.YHFarmerID === e.itemData.YHFarmerID);
        this.famerAutoDataSourceFilter2.splice(fromIndex, 1);
        this.famerAutoDataSourceFilter2.splice(toIndex, 0, e.itemData);
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

    onFocusedCellChanging3(e) {
        if(this.famerselectedRows.length==0){
            Notify.toast("请先勾选左边列表的明细！", NotifyType.Error);
            return;
        }
        this.famerselectedRows.forEach(item => {
            this.famerAutoDataSourceFilter.splice(this.famerAutoDataSourceFilter.findIndex(v => v.YHFarmerID == item.YHFarmerID), 1)
        })
        this.famerAutoDataSourceFilter2 = this.famerselectedRows.concat(this.famerAutoDataSourceFilter2);
        setTimeout(() => {
            this.famermindex = this.famerAutoDataSourceFilter.length;
            this.famernindex =this.famerAutoDataSourceFilter2.length;
        }, 20);
    }
    onFocusedCellChanging4(e) {
        if(this.famerselectedRows2.length==0){
            Notify.toast("请先勾选右边列表的明细！", NotifyType.Error);
            return;
        }
        this.famerselectedRows2.forEach(item => {
            this.famerAutoDataSourceFilter2.splice(this.famerAutoDataSourceFilter2.findIndex(v => v.YHFarmerID == item.YHFarmerID), 1)
        })
        this.famerAutoDataSourceFilter = this.famerAutoDataSourceFilter.concat(this.famerselectedRows2);
        setTimeout(() => {
            this.famermindex = this.famerAutoDataSourceFilter.length;
            this.famernindex =this.famerAutoDataSourceFilter2.length;
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

    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=特殊领用价格`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=特殊领用价格`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        if (e.status) {
            let YHFarmerName = '';
            for (let index = 0; index < this.famerdetailSource._items.length; index++) {
                const element = this.famerdetailSource._items[index];
                YHFarmerName += element.YHFarmerName + ','
            }

            var tabId0 = {
                //日期
                DataDate: new DateTime(this.data['DataDate']).toString(),
                //商品类型
                ProductCollectTypeName:  this.data['ProductCollectTypeName'] == undefined ? '': this.data['ProductCollectTypeName'],
                //生效日期
                EffectDate:  this.data['EffectDate'] == undefined ? '': new DateTime(this.data['EffectDate']).toString(),
                //截止日期
                EndDate:this.data['EndDate'] == undefined ? '': new DateTime(this.data['EndDate']).toString(),
                //单位
                EnterpriseName:USER_INFO_CONTEXT.enterpriseName,
                // 单据号
                Number:this.data['Number'] == undefined ? '': this.data['Number'],
                // 说明
                Remarks:this.data['Remarks'] == undefined ? '': this.data['Remarks'],
                // 制单人
                creatorName: this._review._items.filter( o => o.key == 'making')[0].personName || '',
                // 审核人
                auditerName: this._review._items.filter( o => o.key == 'review')[0].personName || '',
                //适用养户
                YHFarmerName
            };

            var tabId1 = this.detailSource._items ? this.detailSource._items : this.detailSource;
            let sources = {
                tabId0: tabId0,
                tabId1: tabId1
            };
            var direct =false;
            if (e.isDirect) {
                direct = true;
            }
            this._printPage.instance.printGeneration(sources, false, false, null, { isDirect: direct,});
        }
    }

}
