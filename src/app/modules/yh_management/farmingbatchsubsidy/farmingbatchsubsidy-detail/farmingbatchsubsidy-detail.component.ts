import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DataValidator,ValidationType } from 'src/app/providers/common/dataValidator';
import { DateTime } from 'src/app/providers/common/datetime';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { BasicSettingODataContext } from 'src/app/providers/odataContext';
// import { groupBy } from 'src/app/providers/groupby';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { EditorToolbarComponent } from 'src/app/components/editor-grid/editor-toolbar/editor-toolbar.component'
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { FarmingBatchSubsidyEntity, FarmingBatchSubsidyService } from '../farmingbatchsubsidy.service';
import CustomStore from 'devextreme/data/custom_store';
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { DataStatus } from 'src/app/components/editor-grid/util/index';
import { Distinct } from 'src/app/providers/distinct';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { environment } from 'src/environments/environment';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { PermissionService } from 'src/app/providers/permission';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { FormulaComputingComponent } from 'src/app/components/formula-computing/formula-computing.component';
import { RegExps } from 'src/app/providers/regexp';
import { groupBy } from 'src/app/providers/groupby';
import ArrayStore from 'devextreme/data/array_store';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';

@Component({
    selector: 'app-farmingbatchsubsidy-detail',
    templateUrl: './farmingbatchsubsidy-detail.component.html',
    styleUrls: ['./farmingbatchsubsidy-detail.component.scss'],
    providers: [FarmingBatchSubsidyService],
})

export class FarmingBatchSubsidyDetailComponent implements OnInit {
    @ViewChild('editorToolbar', { static: false })
    _editorToolbar: EditorToolbarComponent;
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    @ViewChild('detailGrid', { static: false })
    _detailGrid: DxDataGridComponent;
    @ViewChild('review', { static: false })
    _review: EditorReviewRemoteComponent;
    mode: 'create' | 'edit';
    data: FarmingBatchSubsidyEntity = {} as any;
    defaultData: FarmingBatchSubsidyEntity = {} as any;
    lang: string = NxTranslateI18N.lang;
    /** 删除状态控制 */
    deleted: boolean = false;
    hasDetail: boolean = false;
    rowFilter: boolean = false;
    zqHenhouseSource: any;
    UrlParam: any;
    yhFarmerSource: any;
    yhBatchSource: any;
    allSource: any;
    // 商品数据源
    productSource: any;
    uploader:NxUploader=new NxUploader();
    numericalOrder: string = '';
    entertype: string = '';
    permission: PermissionService = new PermissionService();
    //附件
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];
    editFlag: boolean = false;
    sumDetailSource: any;
    detailSource: any = [];
    showDragIcons: boolean = true;
    /** 单据 当前操作行主键 */
    currentOperationRowKey: any;
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;

    @ViewChild('gridRef2', { static: false })
    dataGridRef2: DxDataGridComponent;
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
    loading: boolean = false;
    selectionModel: "single";
    editFlag1: boolean = false;
    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];
    columnSettingArr: any[] = [
       {
            'dataField': 'YHSubsidyName',
            'caption': '项目名称',
            "fixed": false,
            'visible': true,
            'allowEditing': false
        },{
            'dataField': 'Expression',
            'caption': '默认计算公式',
            "fixed": false,
            'visible': true,
            'allowEditing': false
        },{
            'dataField': 'SunsidyAmount',
            'caption': '补扣金额',
            'visible': true,
            "fixed": false,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':2,
            'allowEditing': false
        },{
            'dataField': 'AdjustFactor',
            'caption': '调整系数/调整固定金额',
            "fixed": false,
            'visible': true,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':4,
            'editorOptions': {
                type: 'fixedPoint',
            }
        },{
            'dataField': 'AdjustExpression',
            'caption': '调整后计算公式',
            "fixed": false,
            'visible': true,
            'allowEditing': false
        },{
            'dataField': 'AdjustAmount',
            'caption': '调整后金额',
            'visible': true,
            "fixed": false,
            'dataType': 'number',
            'alignment': 'right',
            'fixedPoint':2,
            'allowEditing': false
        },{
            'dataField': 'Remarks',
            'caption': '备注',
            "fixed": false,
            'visible': true,
            'allowEditing': true
        },
    ];
    columnSettingArr2: any[] = [];
    title1: string = '补扣项目明细';

    visible: boolean = false;
    limitCharacter = RegExps.Forbidcharacter;
    limitNumberCharacter = RegExps.IntNumber;
    limitNumber2Character = RegExps.AllNumber4;
    limitNumber3Character= RegExps.AllNumber;
    @ViewChild('formulaComputing', { static: false })
    formulaComputing: FormulaComputingComponent;
    ExpType: number = 0;
    Expression: string = "";
    fieldsSource: any = [];
    fieldsSource2: any = [];
    @ViewChild('form', { static: false })
    formInstance: DxFormComponent;
    formData: any = {};
    calculatorParams: any = {};

    constructor(private _route: ActivatedRoute,
        private _router: Router, 
        private _service: FarmingBatchSubsidyService, 
        private basicSettingODataContext: BasicSettingODataContext,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private zone:NgZone,
        public changeDetectorRef: ChangeDetectorRef) {
        this.mode = this._route.snapshot.queryParams.mode;
        if(this._route.snapshot.queryParams.type&&this._route.snapshot.queryParams.type=='2'){
            this.data.NumericalOrder = '';
        }
        else{
            this.data.NumericalOrder = this._route.snapshot.queryParams.numericalOrder;
        }
        this.numericalOrder = this._route.snapshot.queryParams.numericalOrder;
        this.entertype = this._route.snapshot.queryParams.type;

        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        this.onReorder = this.onReorder.bind(this);
        this.onReorder2 = this.onReorder2.bind(this);
        
        if(this.mode != 'create'){
            this.editFlag1 = true;
            this.yhFarmerSource =  this.YHBasicSettingODataContext.getYHFarmerInfoDataSource();
            this.yhBatchSource =  this.YHBasicSettingODataContext.getYHBatchDataSource();
        }
        else{
            this.loading = true;
            this._service.getClearHouseAndRecycleWeight("").then((res: any) => {
                this.loading = false;
                if(res&&res.length>0){
                    res.forEach(element => {
                        element.YHBatchID = element.YHBatch;
                    });
                    this.allSource = res;
                    this.yhFarmerSource = Distinct(res,"YHFarmerID");
                }
                else{
                    this.allSource = [];
                    this.yhFarmerSource = [];
                }
            });
        }
        

        this.fieldsSource2 = new DataSource({
            store: new ArrayStore({
              data: DataDictionarySource.fieldsSource,
              key: 'fieldText',
            }),
            group: 'Category',
        });
        let _groupBy = groupBy(DataDictionarySource.fieldsSource, (item) => {
            return item.Category;
        });
        _groupBy.forEach(g => {
            this.fieldsSource.push({
                fieldText: g[0].Category,
                children : g
            })
        });
        var _this = this;
        //在页面初始化的时候监听message事件
        window.parent.addEventListener('message',(obj) => {
            let data = obj.data;
            if (data && data.calculatorParams) {
                //反序列化组件返回值，返回参数详见下表
                let { calculatorParams, closeIframe } = data;
                _this.calculatorParams = JSON.parse(calculatorParams);
                _this.Expression = _this.calculatorParams.script;
                _this.formData.Expression = _this.calculatorParams.script;
                if (closeIframe) {
                    _this.sureFormula("");

                }
            }
        },false);

    }

    sureFormula(e) {
        // let formula = document.getElementById('formula');
        // let Expression = document.getElementById('Expression');
        // Expression.textContent = this.Expression;
        // if (formula) {
        //     formula.style.display = 'none';
        // }
        this.zone.run(() => {
            this.visible = false;
        })
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
                            this.editFlag = true;
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
                            setTimeout(() => {
                                this.editFlag = false;
                            }, 20);
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
                        this.editFlag = true;
                        var value = res.data[0];
                        var newValue = value;
                        this.defaultData = deepCopy(newValue);
                        this.data = newValue;
                        this.detailSource = this._service.getDetailSource();
                        this._service._detailInfoUtil.init(value.Details);
                        this.getDetail();
                        setTimeout(() => {
                            this.editFlag = false;
                        }, 20);
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
            ComboPack: DataDictionary.ComboPackJ,
            Remarks: "",
            YHBatch:'',
            YHBatchName:'',
            ChickenFarmID:'',
            ChickenFarmName:'',
            YHFarmerID:'',
            YHFarmerName:'',
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
            if(e.dataField == 'AdjustFactor'){
                if(!e.row.data.AllowAdjust||rowData.ExpType==3){
                    e.editorOptions.disabled = true;
                }
                if(rowData.ExpType==3){

                }
                e.editorOptions.onValueChanged = async _e => {
                    var newData = deepCopy(rowData);
                    if (_e.value) {
                        if(newData.ExpType==1){
                            newData.AdjustFactor= Number(_e.value).toFixed(4);
                            newData.AdjustExpression = "["+newData.AdjustIndicator+"]*"+newData.AdjustFactor;
                            await this.getSubsidyProgrammeData(newData);
                        }
                        else if(newData.ExpType==2){
                            newData.AdjustFactor= Number(_e.value).toFixed(2);
                            newData.AdjustExpression = newData.AdjustFactor;
                            newData.AdjustAmount = newData.AdjustFactor;
                        }
                    }
                    this._service._detailInfoUtil.setData(e.row.key, newData);
                    this._detailGrid.instance.refresh();
                }
            }
        }
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
            this.data.FarmingBatchSubsidyDetailDto = this._service._detailInfoUtil.getSaveData();
            this.data.DataDate = new DateTime(this.data.DataDate).toString();
            const validator = new DataValidator(true);
            validator
                .requireNew(this.data, [
                    ['DataDate', '请选择制单日期'],
                    ['YHFarmerID', '请选择养户'],
                    ['YHBatch', '请选择批次'],
                ])
                .each(
                    this.data.FarmingBatchSubsidyDetailDto,
                    [
                    ],
                    '明细表不能为空'
                );
            if (!validator.validation) {
                this.saveStatus=true;
                    return;
                }
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
                    this.editFlag = true;
                    var value = res.data[0];
                    var newValue = value;
                    this.defaultData = deepCopy(newValue);
                    this.data = newValue;
                    this.detailSource = this._service.getDetailSource();
                    this._service._detailInfoUtil.init(value.Details);
                    this._editorGrid.instance.setToolbarStatusAfterSaved();
                    this.hasDetail = true;
                    setTimeout(() => {
                        this.editFlag = false;
                    }, 20);
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
            var selectedRowsData = this._detailGrid.instance.getSelectedRowsData();
            if (!selectedRowsData || selectedRowsData.length == 0) {
                Notify.error('请选勾选明细！');
                return false;
            }
            if (selectedRowsData.length > 1) {
                Notify.error('请选勾选一条明细！');
                return false;
            }
            if(!selectedRowsData[0].AllowAdjust){
                Notify.error('当前项目不允许调整！');
                return false;
            }
            this.outVisible = true;
            this.formData.YHSubsidyName = selectedRowsData[0].YHSubsidyName;
            this.ExpType = selectedRowsData[0].ExpType;
            if(selectedRowsData[0].ExpType==1){
                this.formData.Indicator = selectedRowsData[0].AdjustIndicator;
                if(selectedRowsData[0].AdjustFactor){
                    this.formData.Factor = selectedRowsData[0].AdjustFactor;
                }
                else{
                    this.formData.Factor = selectedRowsData[0].Factor;
                }
            }else if(selectedRowsData[0].ExpType==2){
                if(selectedRowsData[0].AdjustExpression){
                    this.formData.Amount = selectedRowsData[0].AdjustExpression;
                }
                else{
                    this.formData.Amount = selectedRowsData[0].Expression;
                }
            }
            else if(selectedRowsData[0].ExpType==3){
                if(selectedRowsData[0].AdjustExpression){
                    this.Expression = selectedRowsData[0].AdjustExpression;
                }
                else{
                    this.Expression = selectedRowsData[0].Expression;
                }
                let Expression = document.getElementById('Expression');
                if(Expression&&Expression.textContent){
                    Expression.textContent = this.Expression;
                }
            }
            console.log("selectedRowsData",selectedRowsData);
        }
    }

    onHiding(e) {
        this.outVisible = false;
        this.formData = {};
        this.Expression = "";
    }

    onCreate(type) {
        this.editFlag1 = false;
        var title = "养殖批次补扣-参照新增";
            if(type=='1'){
                title = "养殖批次补扣-新增";
            }
            HomeHelper.open(
                {
                    url: `${environment.qqlwUri}/farmingbatchsubsidy/detail?mode=create&type=${type}&numericalOrder=${this.numericalOrder}`,
                    title: title,
                },
                () => {
                    this._router.onSameUrlNavigation = 'reload';
                    var numericalOrder = this.numericalOrder;
                    this._router.navigateByUrl('//farmingbatchsubsidy/detail/').then(() => {
                        this._router.navigate(['/farmingbatchsubsidy/detail'], {
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

    async onFormSubmit() {
        let validation = this.formInstance.instance.validate().isValid;
        if (validation) {
            var selectedRowsData = this._detailGrid.instance.getSelectedRowsData();
            var newData = deepCopy(selectedRowsData[0]);
            if(this.ExpType==2){
                newData.AdjustFactor= Number(this.formData.Amount).toFixed(2);
                newData.AdjustExpression = newData.AdjustFactor;
                newData.AdjustAmount = newData.AdjustFactor;
            }
            else{
                if(newData.ExpType==1){
                    newData.AdjustFactor= Number(this.formData.Factor).toFixed(4);
                    newData.AdjustIndicator= this.formData.Indicator;
                    newData.AdjustExpression = "["+newData.AdjustIndicator+"]*"+newData.AdjustFactor;
                }
                else if(newData.ExpType==3){
                    newData.AdjustExpression = this.Expression;
                }
                await this.getSubsidyProgrammeData(newData);
                
            }
            this._service._detailInfoUtil.setData(newData.RecordID, newData);
            this._detailGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
            this.outVisible = false;
            this.formData = {};
            this.Expression = "";
        }
    }
    openFormula(){
        this.visible = true;
        
        setTimeout(() => {
            this.formulaComputing.script = this.Expression;
            this.formulaComputing.fields = this.fieldsSource;
            this.formulaComputing.isGroup = true;
            this.formulaComputing.sureFormula(); 
        }, 0);
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

    init_uploader(): FarmingBatchSubsidyDetailComponent {
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

    onFarmerChanged(e) {
        if(this.editFlag1){
            return;
        }
        if(this.data.YHFarmerID&&this.data.YHFarmerID!="0"){
            var data = deepCopy(this.allSource.filter(o => o.YHFarmerID == this.data.YHFarmerID));
            this.yhBatchSource = Distinct(data,"YHBatch");
            if(data.length==1){
                this.data.YHBatch=data[0].YHBatch;
                this.data.YHBatchName=data[0].YHBatchName;
            }
            else{
                this.data.YHBatch='';
                this.data.YHBatchName = "";
            }
        }
        else{
            this.yhBatchSource = [];
            this.data.YHBatch='';
            this.data.YHBatchName = "";
        }
    }

    async getSubsidyProgrammeData(data){
        this.loading = true;
        let Param ={
            YHFarmerID:this.data.YHFarmerID,
            YHBatchID:this.data.YHBatch,
            ChickenFarmID:this.data.ChickenFarmID,
            AdjustExpression:data.AdjustExpression
        }
        await this._service.getSubsidyProgrammeData(Param).then((res: any) => {
            this.loading = false;
            if(res&&res.length>0){
                console.log(res,"res")
                data.AdjustAmount = res[0].SunsidyAmount;
            }
        });
    }
    
    onYHBatchChanged(e) {
        if(this.editFlag1){
            return;
        }
        if(this.data.YHBatch&&this.data.YHBatch!='0'){
            var data = deepCopy(this.allSource.filter(o => o.YHFarmerID == this.data.YHFarmerID));
            this.data.ChickenFarmID=data[0].ChickenFarmID;
            this.data.ChickenFarmName=data[0].ChickenFarmName;
        }else{
            this.data.ChickenFarmID='';
            this.data.ChickenFarmName = "";
        }
        if(this.editFlag){
            return;
        }
        this.loading = true;
        if(this.data.YHFarmerID&&this.data.YHFarmerID!="0"
            &&this.data.YHBatch&&this.data.YHBatch!="0"
            &&this.data.ChickenFarmID&&this.data.ChickenFarmID!="0"){
                // var Param = 'YHFarmerID=' + this.data.YHFarmerID + '&YHBatchID='+ this.data.YHBatch + '&ChickenFarmID='+ this.data.ChickenFarmID + '&';
                let Param ={
                    YHFarmerID:this.data.YHFarmerID,
                    YHBatchID:this.data.YHBatch,
                    ChickenFarmID:this.data.ChickenFarmID,
                }
                this._service.getSubsidyProgrammeData(Param).then((res: any) => {
                    console.log(res)
                    this.loading = false;
                    if(res&&res.length>0){
                        res.forEach(_data => {
                            _data.target = DataStatus.New ;
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
                        });
                        this.hasDetail = true;
                    }
                });
        }
    }
}
