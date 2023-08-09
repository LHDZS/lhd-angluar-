import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DataValidator,ValidationType } from 'src/app/providers/common/dataValidator';
import { DateTime } from 'src/app/providers/common/datetime';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { BasicSettingODataContext, QlwCustomerContext, YHBasicSettingODataContext } from 'src/app/providers/odataContext';
// import { groupBy } from 'src/app/providers/groupby';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { EditorToolbarComponent } from 'src/app/components/editor-grid/editor-toolbar/editor-toolbar.component'
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { BuyBackPlanEntity, BuyBackPlanService } from '../buybackplan.service';
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
import { RegExps } from 'src/app/providers/regexp';
import { PrintPageComponent } from 'nxin-print';
import { TokenAuthService } from 'src/app/shared/services';

@Component({
    selector: 'app-buybackplan-detail',
    templateUrl: './buybackplan-detail.component.html',
    styleUrls: ['./buybackplan-detail.component.scss'],
    providers: [BuyBackPlanService],
})

export class BuyBackPlanDetailComponent implements OnInit {
    @ViewChild('editorToolbar', { static: false })
    _editorToolbar: EditorToolbarComponent;
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    @ViewChild('detailGrid', { static: false })
    _detailGrid: DxDataGridComponent;
    @ViewChild('review', { static: false })
    _review: EditorReviewRemoteComponent;
    mode: 'create' | 'edit';
    data: BuyBackPlanEntity = {} as any;
    defaultData: BuyBackPlanEntity = {} as any;
    lang: string = NxTranslateI18N.lang;
    /** 删除状态控制 */
    deleted: boolean = false;
    hasDetail: boolean = false;
    rowFilter: boolean = false;
    rowFilter2: boolean = false;
    rowFilter3: boolean = false;
    zqHenhouseSource: any;
    UrlParam: any;
    breedingsetSource: any;
    yHFarmerSource: any;
    customerSource: any;
    salesPeriodSource:any = [
        { value: 1, name: '上午' },
        { value: 2, name: '下午' },
    ];
    loading: boolean = false;
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
    showDragIcons: boolean = true;
    /** 单据 当前操作行主键 */
    currentOperationRowKey: any;
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;

    @ViewChild('gridRef2', { static: false })
    dataGridRef2: DxDataGridComponent;

    //弹出框数据
    formData: any = {
        CustomerID: null,
        ProductID: null,
        SalesPeriod: null,
        YHFarmerID: null,
        EndDaysOld: null,
        StartDaysOld: null,
        BreedingID: null,
    };
    outVisible: boolean = false;
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
            'dataField': 'YHFarmerName',
            'HeaderRequiredIcon': true,
            'caption': '养户名称',
            'width': 150,
            "fixed": true,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'YHBatchName',
            'HeaderRequiredIcon': true,
            'caption': '养户批次',
            'width': 150,
            "fixed": true,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'ChickenFarmName',
            'HeaderRequiredIcon': true,
            'caption': '养殖场',
            'width': 150,
            "fixed": true,
            'visible': true,
            'allowEditing': false,
        },{
            'dataField': 'HenhouseName',
            'caption': '栋舍',
            "fixed": false,
            'visible': true,
            'width': 110,
            'allowEditing': false,
        },{
            'dataField': 'BreedingName',
            'caption': '批次品种',
            "fixed": false,
            'visible': true,
            'width': 110,
            'allowEditing': false,
        },{
            'dataField': 'DaysOld',
            'caption': '日龄',
            "fixed": false,
            'visible': true,
            'width': 50,
            'allowEditing': false,
            'dataType': 'number',
            'alignment': 'right',
        },{
            'dataField': 'TotalQuantity',
            'caption': '总存栏',
            "fixed": false,
            'visible': true,
            'width': 80,
            'allowEditing': false,
            'dataType': 'number',
            'alignment': 'right',
        },{
            'dataField': 'KyQuantity',
            'caption': '可用存栏',
            "fixed": false,
            'visible': true,
            'width': 80,
            'allowEditing': false,
            'dataType': 'number',
            'alignment': 'right',
        },{
            'dataField': 'NumericalOrderRefNO',
            'caption': '肉禽销售订单号',
            "fixed": false,
            'visible': true,
            'width': 120,
            'allowEditing': false,
        },
        {
            'dataField': 'CustomerName',
            'caption': '客户',
            "fixed": false,
            'visible': true,
            'width': 120,
            'allowEditing': false,
        },{
            'dataField': 'SalesPeriodText',
            'caption': '时段',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'width': 50,
        },{
            'dataField': 'SerialNo',
            'caption': '行号',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'dataType': 'number',
            'alignment': 'right',
            'width': 50,
        },{
            'dataField': 'ProductName',
            'caption': '商品代号',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'width': 120,
        },{
            'dataField': 'SexTypeName',
            'caption': '公母',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'width': 50,
        },{
            'dataField': 'PoultrySalesRankName',
            'caption': '等级',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'width': 50,
        },{
            'dataField': 'SaleBreedingName',
            'caption': '销售品种',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'width': 110,
        },
        {
            'dataField': 'OrderQuantity',
            'caption': '订单只数',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'dataType': 'number',
            'alignment': 'right',
            'width': 90,
        },{
            'dataField': 'Quantity',
            'caption': '只数',
            'HeaderRequiredIcon': true,
            "fixed": false,
            'visible': true,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':0,
            'width': 90,
            'editorOptions': {
                type: 'fixedPoint',
                min: 0
            }
        },{
            'dataField': 'MeasureUnitName',
            'caption': '计量单位',
            "fixed": false,
            'visible': true,
            'allowEditing': false,
            'width': 90,
        },{
            'dataField': 'UnitPrice',
            'caption': '单价',
            'visible': true,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':4,
            'width': 90,
            'allowEditing': false
        },{
            'dataField': 'Remarks',
            'caption': '备注',
            'width': 110,
            "fixed": false,
            'visible': true,
        }
    ];
    columnSettingArr2: any[] = [];
    title1: string = '明细表';

    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource:any=[];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private qlwCustomerContext: QlwCustomerContext, 
        private _service: BuyBackPlanService,
        private tokenService: TokenAuthService,
        private yHBasicSettingODataContext: YHBasicSettingODataContext,
         private basicSettingODataContext: BasicSettingODataContext,) {
        this.mode = this._route.snapshot.queryParams.mode;
        if(this._route.snapshot.queryParams.type&&this._route.snapshot.queryParams.type=='2'){
            this.data.NumericalOrder = '';
        }
        else{
            this.data.NumericalOrder = this._route.snapshot.queryParams.numericalOrder;
        }
        this.numericalOrder = this._route.snapshot.queryParams.numericalOrder;
        this.entertype = this._route.snapshot.queryParams.type;
        this.breedingsetSource = this.basicSettingODataContext.getZqBreedingsetDataSource({
            select: ['BreedingID', 'BreedingName'],
        });
        this.yHFarmerSource = this.yHBasicSettingODataContext.getYHFarmerInfoDataSource({
            select: ['YHFarmerID', 'YHFarmerName'],
        });
        this.productSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                ['PoultryStatus', '=', true],
            ],
            select: ['ProductID', 'ProductName','MnemonicCode'],
        });

        this.customerSource = this.qlwCustomerContext.getCustomerDataSource();

        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;

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
                            value.Details.forEach(element => {
                                element.OldUnitPrice = element.UnitPrice;
                                element.UnitPrice = null;
                            });
                            this._service._detailInfoUtil.initNew(value.Details);
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
            // BuyBackDate: new DateTime().toString(),
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
            if(e.dataField == 'Quantity'){
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    if (!_e.value) {
                        _e.value = 0;
                    }
                    newData.Quantity= Number(_e.value).toFixed(0);
                    this._service._detailInfoUtil.setData(e.row.key, newData);
                    this._detailGrid.instance.refresh();
                }
            }else if(e.dataField == 'Remarks'){
                e.editorOptions.onValueChanged = _e => {
                    var newData = deepCopy(rowData);
                    newData.Remarks= _e.value;
                    this._service._detailInfoUtil.setData(e.row.key, newData);
                    this._detailGrid.instance.refresh();
                }
            }
        }
    }
    /** 新增 */
    onCreate(type) {
        var title = "回收销售计划-参照新增";
            if(type=='1'){
                title = "回收销售计划-新增";
            }
            HomeHelper.open(
                {
                    url: `${environment.qqlwUri}/buybackplan/detail?mode=create&type=${type}&numericalOrder=${this.numericalOrder}`,
                    title: title,
                },
                () => {
                    this._router.onSameUrlNavigation = 'reload';
                    var numericalOrder = this.numericalOrder;
                    this._router.navigateByUrl('//buybackplan/detail/').then(() => {
                        this._router.navigate(['/buybackplan/detail'], {
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
            this.data.BuyBackPlanDetailDto = this._service._detailInfoUtil.getSaveData();
            this.data.DataDate = new DateTime(this.data.DataDate).toString();
            const validator = new DataValidator(true);
            validator
                .requireNew(this.data, [
                    ['DataDate', '请选择制单日期'],
                    ['BuyBackDate', '请选择回收日期'],
                ])
                .each(
                    this.data.BuyBackPlanDetailDto,
                    [
                        ['YHFarmerID', (data, value) => {
                            if (value && value != '0') return true;
                            return false;
                        }, '明细表 - 第 [$INDEX] 行: 养户名称不能为空'],
                        ['YHBatch', (data, value) => {
                            if (value && value != '0') return true;
                            return false;
                        }, '明细表 - 第 [$INDEX] 行: 养户批次不能为空'],
                        ['ChickenFarmID', (data, value) => {
                            if (value && value != '0') return true;
                            return false;
                        }, '明细表 - 第 [$INDEX] 行: 养殖场不能为空'],
                        [
                            'Quantity',
                            (data, value) => {
                                if (value && value > 0) return true;
                                return false;
                            },
                            '明细表 - 第 [$INDEX] 行: 只数不能为空且必须大于0',
                        ]
                    ],
                    '明细表不能为空'
                );
            if (!validator.validation) {
                this.saveStatus=true;
                    return;
                }
            this.data.BuyBackDate = new DateTime(this.data.BuyBackDate).toString();
            this.data.ModifiedDate = this.data.ModifiedDate?this.data.ModifiedDate:new DateTime().toString()
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
            this.formData = {
                CustomerID: null,
                ProductID: null,
                SalesPeriod: null,
                YHFarmerID: null,
                EndDaysOld: null,
                StartDaysOld: null,
                BreedingID: null,
            };
            if (!this.data.BuyBackDate) {
                Notify.warning('请先选择回收日期！');
                return;
            }
            this.outVisible = true;
            this.onFocusedCellChanging2();
        }
    }

    onPopupHiding() {
        this.formData = {
            CustomerID: null,
            ProductID: null,
            SalesPeriod: null,
            YHFarmerID: null,
            EndDaysOld: null,
            StartDaysOld: null,
            BreedingID: null,
        };
        this.outVisible = false;
        this.AutoDataSourceFilter = [];
        this.AutoDataSourceFilter2 = [];

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

    _saveCancelBtnStatusCtrl() {
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn').disabled = false;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = false;
    }

    _getSaveCancelBtnStatusCtrl() {
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn').disabled = true;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = true;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
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

    getSelection(type) {

        if (type == '3') {
            this.outVisible = false;
            this.AutoDataSourceFilter = [];
            this.AutoDataSourceFilter2 = [];
            this.formData = {
                CustomerID: null,
                ProductID: null,
                SalesPeriod: null,
                YHFarmerID: null,
                EndDaysOld: null,
                StartDaysOld: null,
                BreedingID: null,
            };
            return false;
        }

        var selectedRowsData11 = this.dataGridRef.instance.getSelectedRowsData();
        if(!selectedRowsData11||selectedRowsData11.length==0){
            Notify.toast("请选择养户存栏明细！", NotifyType.Error);
            return;
        }
        if(selectedRowsData11.length>1){
            Notify.toast("只能选择一条养户存栏明细！", NotifyType.Error);
            return;
        }
        var selectedRowsData22 = this.dataGridRef2.instance.getSelectedRowsData();
        if(!selectedRowsData22||selectedRowsData22.length==0){
            Notify.toast("请选择肉禽销售单明细！", NotifyType.Error);
            return;
        }
        setTimeout(async () => {
            selectedRowsData22.forEach((f) => {
                var Quantity = f.Quantity;
                Object.keys(selectedRowsData11[0]).forEach((x) => {
                    f[x] = selectedRowsData11[0][x];
                });
                f.Quantity = Quantity;
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
            this.getDetail();
            if (type == '2') {
                this.onFocusedCellChanging();
                this.onFocusedCellChanging2();
            }
            if (type == '1') {
                this.outVisible = false;
                this.AutoDataSourceFilter = [];
                this.AutoDataSourceFilter2 = [];
                this.formData = {
                    CustomerID: null,
                    ProductID: null,
                    SalesPeriod: null,
                    YHFarmerID: null,
                    EndDaysOld: null,
                    StartDaysOld: null,
                    BreedingID: null,
                };
            }

        },200)
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

    init_uploader(): BuyBackPlanDetailComponent {
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

    onFocusedCellChanging() {
        let UrlParam = 'BuyBackDate='+new DateTime(this.data.BuyBackDate).toString('yyyy-MM-dd')+'&';
        let arr = []
        if (this.formData.BreedingID) {
            arr.push(`BreedingID=${this.formData.BreedingID}`)
        }
        if (this.formData.StartDaysOld) {
            if(!RegExps.PositiveInteger1.exec(this.formData.StartDaysOld)){
                Notify.toast("日龄请输入整数！", NotifyType.Error);
                return false;
            }
            arr.push(`StartDaysOld=${this.formData.StartDaysOld}`)
        }
        if (this.formData.EndDaysOld) {
            if(!RegExps.PositiveInteger1.exec(this.formData.EndDaysOld)){
                Notify.toast("日龄请输入整数！", NotifyType.Error);
                return false;
            }
            arr.push(`EndDaysOld=${this.formData.EndDaysOld}`)
        }
        if (this.formData.YHFarmerID) {
            arr.push(`YHFarmerID=${this.formData.YHFarmerID}`)
        }
        if (this.data.NumericalOrder) {
            arr.push(`NumericalOrder=${this.data.NumericalOrder}`)
        }
        if (arr.length != 0) {
            UrlParam += arr.join(`&`);
        }
        this.loading = true;
        this._service.getTransferdataData(UrlParam).then((res: any) => {
            this.loading = false;
            var oldData = this.detailSource._items;
            console.log("oldData",oldData)
            this.AutoDataSourceFilter = [];
            res.forEach((f) => {
                if (oldData.length>0) {
                    oldData.forEach((row) => {
                        var OldHenhouseID = "0";
                        if(f.systemstart){
                            OldHenhouseID = row.HenhouseID;
                        }
                        if (f.YHFarmerID == row.YHFarmerID && f.ChickenFarmID == row.ChickenFarmID && f.YHBatch == row.YHBatch && OldHenhouseID==f.HenhouseID) {
                            var Quantity = 0;
                            if(row.Quantity){
                                Quantity = Number(row.Quantity);
                            }
                            // f.KyQuantity-=Quantity;
                        }
                    });
                }
                if(f.KyQuantity>0){
                    this.AutoDataSourceFilter.push(f);
                }
            });
            // setTimeout(() => {
            //     this.famermindex = this.famerAutoDataSourceFilter.length;
            //     this.famernindex =0;
            // }, 20);
        });
    }
    onFocusedCellChanging2() {

        let UrlParam = 'BuyBackDate='+new DateTime(this.data.BuyBackDate).toString('yyyy-MM-dd')+'&';
        let arr = []
        if (this.formData.SalesPeriod) {
            arr.push(`SalesPeriod=${this.formData.SalesPeriod}`)
        }
        if (this.formData.ProductID) {
            arr.push(`ProductID=${this.formData.ProductID}`)
        }
        if (this.formData.CustomerID) {
            arr.push(`CustomerID=${this.formData.CustomerID}`)
        }
        if (this.data.NumericalOrder) {
            arr.push(`NumericalOrder=${this.data.NumericalOrder}`)
        }
        if (arr.length != 0) {
            UrlParam += arr.join(`&`);
        }
        this.loading = true;
        this._service.getPoultrySalesOrderData(UrlParam).then((res: any) => {
            this.loading = false;
            var oldData = this.detailSource._items;
            this.AutoDataSourceFilter2 = [];
            res.forEach((f) => {
                if (oldData.length>0) {
                    oldData.forEach((row) => {
                        if(row.NumericalOrderRefDetail == f.NumericalOrderRefDetail ){
                            var Quantity = 0;
                            if(row.Quantity){
                                Quantity = Number(row.Quantity);
                            }
                            f.Quantity-=Quantity;
                        }
                    });
                }
                if(f.Quantity>0){
                    f['SalesPeriodName'] = f.SalesPeriod == 1 ? '上午' : f.SalesPeriod == 2 ? '下午' : '';
                    this.AutoDataSourceFilter2.push(f);
                }
            });
            // setTimeout(() => {
            //     this.famermindex = this.famerAutoDataSourceFilter.length;
            //     this.famernindex =0;
            // }, 20);
        });
    }

    onEditorPreparingFn3(e,type) {
        // 判单值发生改变 自动勾选
        if (e.dataField && e.row && e.row.rowType && e.row.rowType == 'data') {
            const rowData = e.row.data;
            if (e.dataField == 'Quantity') {
                e.editorOptions.onValueChanged = (_e) => {
                    if(!_e.value){
                        _e.value =0;
                    }
                    let rowData2 = this.AutoDataSourceFilter2.find((m) => m['NumericalOrderRefDetail'] == rowData['NumericalOrderRefDetail']);
                    if(!_e.value){
                        _e.value =0;
                    }
                    rowData2['Quantity'] = Number(_e.value).toFixed(0);
                    this.dataGridRef2.instance.refresh();
                    setTimeout(() => {
                        if (this.selectedRows2.indexOf(e.row.key) === -1) {
                            this.selectedRows2.push(e.row.key);
                        }
                    }, 20);
                };
            }else if (e.dataField == 'Remarks') {
                e.editorOptions.onValueChanged = (_e) => {
                    let rowData2 = this.AutoDataSourceFilter2.find((m) => m['NumericalOrderRefDetail'] == rowData['NumericalOrderRefDetail']);
                    rowData2['Remarks'] = _e.value;
                    this.dataGridRef2.instance.refresh();
                    setTimeout(() => {
                        if (this.selectedRows2.indexOf(e.row.key) === -1) {
                            this.selectedRows2.push(e.row.key);
                        }
                    }, 20);
                };
            }

        }
    }

    setRowFilter(type){
        this[type] = !this[type];
    }
    setReset(type){
        if(type=='1'){
            this.formData = {
                YHFarmerID: null,
                EndDaysOld: null,
                StartDaysOld: null,
                BreedingID: null,
            };
        }
        else{
            this.formData = {
                CustomerID: null,
                ProductID: null,
                SalesPeriod: null,
            };
        }
    }

    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=回收销售计划`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=回收销售计划`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        console.log(this._review)
        if (!this.numericalOrder) {
            Notify.error('未完成单据不支持打印！');
            return
        }
        if (e.status) {
            var tabid1 = [];
            tabid1 = this.detailSource._items ? this.detailSource._items : this.detailSource;
            
            var tabId0 = {
                   //日期
                   DataDate: new DateTime(this.data['DataDate']).toString(),
                   //回收日期
                   BuyBackDate:  new DateTime(this.data['BuyBackDate']).toString(),
                   //备注
                   Remarks:  this.data['Remarks'] || '',
                   //单位
                   EnterpriseName: USER_INFO_CONTEXT.enterpriseName,
                   // 单据号
                   Number:this.data['Number'] == undefined ? '': this.data['Number'],
                   // 制单人
                   creatorName: this._review._items.filter( o => o.key == 'making')[0].personName || '',
                   // 审核人
                   auditerName: this._review._items.filter( o => o.key == 'review')[0].personName || '',
            };
            console.log(tabId0,tabid1,'sadasdasd')
            let sources = {
                tabId0: tabId0,
                tabId1: tabid1,
            };
            var direct =false;
            if (e.isDirect) {
                direct = true;
            }
            this._printPage.instance.printGeneration(sources, false, false, null, { isDirect: direct,});
        }
    }
}
