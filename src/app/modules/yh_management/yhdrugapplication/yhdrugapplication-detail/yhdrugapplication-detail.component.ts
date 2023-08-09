import { Component, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { DataStatus, FormOptions,DataDictionary,DataDictionarySource } from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import {
    QlwODataContext,
    BasicSettingODataContext,
    QlwCustomerContext
} from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { DateTime } from 'src/app/providers/common/datetime';
import { YhDrugApplicationService } from '../yhdrugapplication.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxTagBox } from 'src/app/components/component-model/tagbox/model';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { YhDrugApplicationAdd } from '../yhdrugapplication.model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { HttpClient } from '@angular/common/http';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { groupBy } from 'src/app/providers/groupby';
import { dealBigMoney,Distinct } from 'src/app/providers/distinct';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { YHProductionODataContext } from 'src/app/providers/odataContext/yhp.odataContext';
import DataSource from 'devextreme/data/data_source';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { RegExps } from 'src/app/providers/regexp';
import { PrintPageComponent } from 'nxin-print';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'yhdrugapplication-detail',
    templateUrl: './yhdrugapplication-detail.component.html',
    styleUrls: ['./yhdrugapplication-detail.component.scss'],
})
export class YhDrugApplicationDetailComponent {
    @ViewChild('myDetailGrid', { static: false })
    myDetailGrid: DxDataGridComponent;
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    /**
     * 流水号
     */
    numericalOrder: string;
    @ViewChild('dataGrid', { static: false })
    dataGrid: DxDataGridComponent;
    batchSource: any = [];
    currentCount: number = 0;
    iNumericalOrderPlan: string = '0';
    dataDateFlag: boolean = false;
    pcDate: string;
    DaysOld: Number;
    editFlag : boolean = false;
    outVisible: boolean = false;
    $form: boolean = false;
    AutoDataSource: any;
    AutoDataSourceFilter: any;
    selectedRows: any = [];
    loading: boolean = false;
    BatchDataSource: any;
    ChickenFarmDataSource: any;
    HenhouseSourceall:any
    modifyVisible: boolean = false;
    HenhouseBydataSource: any;
    AllCommonNameSource: any;
    CommonNameSource: any;
    AllMeasureUnitNameSource: any;
    MeasureUnitNameSource: any;
    AllProductSource: any;
    citeVisible: boolean = false;
    citeDataSourceAll: any;
    citeDataSource: any;
    formData: any = {
        QuoteStatus: 2
    };
    ReferenceStateSource: any = [
        {
            name: '已引用',
            value: 1
        },
        {
            name: '未引用',
            value: 2
        }
    ];
    datasource: any;
    colorStatusArr: any = {
        0:{color:'#E6A23C'},
        1:{color:'#67C23A'},
        2:{color:'#F56C6C'},
        3:{color:'#67C23A'},
        4:{color:'#67C23A'}
    };
    ProductSource: any;
    citeTitle: string = '引用免疫提示';
    bjType: boolean;

    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource:any=[];
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: YhDrugApplicationService,
        private http: HttpClient,
        private qlwOdataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private StatusODataContext: StatusODataContext
    ) {
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;

        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);

        this.YHBasicSettingODataContext.YHBatch.load().then((res:any) => {
            this.BatchDataSource = res
        })

        //通用名
        this.basicSettingODataContext.Product.load().then((res:any) => {
            let data = res;
            this.AllCommonNameSource = Distinct(res,'CommonName');
            this.AllMeasureUnitNameSource = Distinct(data,'MeasureUnitName');
        })

        //商品代号
        this.basicSettingODataContext.Product.load().then((res:any) => {
            this.AllProductSource = res;
        })

        this.basicSettingODataContext.bizChickenFarm.load().then((res:any) => {
            this.ChickenFarmDataSource = res
        })

        this.init_data_grid().init_table_header().init_toolbar_panel();
    }
    //#region 初始化表格
    init_data_grid(): YhDrugApplicationDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'YhDrugApplication-detail';
        this.model.dataGrid.stateStoring.enabled = true;

        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.summary.enabled = true;

        const summaryItem_total_Packages = new NxDataGridSummaryTotal();
        summaryItem_total_Packages.column = 'Packages';
        summaryItem_total_Packages.summaryType = 'sum';
        summaryItem_total_Packages.valueFormat = '0';

        const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        summaryItem_total_Quantity.column = 'Quantity';
        summaryItem_total_Quantity.summaryType = 'sum';
        summaryItem_total_Quantity.valueFormat = '0';

        this.model.dataGrid.summary.totalItems = [summaryItem_total_Packages,summaryItem_total_Quantity];
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        return this;
    }

    get columns() {
        //行号
        const col_SerialNo = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.SerialNo.text,
            'SerialNo',
            'number',
        );
        col_SerialNo.props.width = 80;
        col_SerialNo.props.allowEditing = false;
        col_SerialNo.props.alignment = 'center';

        // 通用名
        const col_CommonName = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.CommonName.text,
            'CommonName',
            'string',
            'CommonName'
        );
        col_CommonName.props.alignment = 'left';
        col_CommonName.props.HeaderRequiredIcon = true;
        col_CommonName.props.allowEditing = true;
        col_CommonName.props.lookup.enabled = true;
        col_CommonName.props.lookup.dataSource = [];
        col_CommonName.props.lookup.valueExpr = 'CommonName';
        col_CommonName.props.lookup.displayExpr = 'CommonName';

        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.ProductName.text,
            'ProductID',
            'string',
        );
        col_ProductID.props.lookup.enabled = true;
        col_ProductID.props.allowEditing = true;
        col_ProductID.props.lookup.showClearButton = true;
        col_ProductID.props.lookup.dataSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortB],
                'or', 
                ['iSortPlus', '=', DataDictionary.iSortC]
            ]
        });
        // const col_ProductID_required = new NxDataGridColumnValidationRule('required');
        col_ProductID.props.lookup.valueExpr = 'ProductID';
        col_ProductID.props.lookup.displayExpr = 'ProductName';

        //计量单位
        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string',
            'MeasureUnitName'
        );
        col_MeasureUnitName.props.lookup.enabled = true;
        col_MeasureUnitName.props.allowEditing = true;
        col_MeasureUnitName.props.width = 80;
        col_MeasureUnitName.props.alignment = 'center';
        col_MeasureUnitName.props.lookup.dataSource = [];
        col_MeasureUnitName.props.lookup.valueExpr = 'MeasureUnitName';
        col_MeasureUnitName.props.lookup.displayExpr = 'MeasureUnitName';


        // 数量
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.Quantity.text,
            'Quantity',
            'number',
        );
        col_Quantity.props.alignment = 'right';
        col_Quantity.props.width = 100;
        col_Quantity.props.HeaderRequiredIcon = true;
        col_Quantity.props.allowEditing = true;

        // 方式
        const col_DrugsWay = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.DrugsWay.text,
            'DrugsWay',
            'string',
        );
        col_DrugsWay.props.alignment = 'left';
        col_DrugsWay.props.allowEditing = true;
        col_DrugsWay.props.lookup.enabled = true;
        col_DrugsWay.props.lookup.dataSource = this.basicSettingODataContext.getBizRemindGroupDataSource({
            filter: [[
                        'PID', '=', DataDictionary.DrugsWay
                    ]],
            select: ['RemindID', 'RemindName'],
        });
        col_DrugsWay.props.lookup.valueExpr = 'RemindID';
        col_DrugsWay.props.lookup.displayExpr = 'RemindName';
        

        // 方法
        const col_DrugMethod = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.DrugMethod.text,
            'DrugMethod',
            'string',
        );
        col_DrugMethod.props.alignment = 'left';
        col_DrugMethod.props.allowEditing = true;


        // 备注
        const col_Remarks = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.Remarks.text,
            'DetailRemarks',
            'string',
        );
        col_Remarks.props.alignment = 'left';
        col_Remarks.props.allowEditing = true;

        // 生产厂家
        const col_Vendor = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.Vendor.text,
            'Vendor',
            'string',
        );
        col_Vendor.props.alignment = 'left';
        col_Vendor.props.allowEditing = true;

        // 程序名称
        const col_ProcessName = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.ProcessName.text,
            'ProcessName',
            'string',
        );
        col_ProcessName.props.alignment = 'left';
        col_ProcessName.props.allowEditing = false;
        col_ProcessName.props.cssClass = 'disabled';
        col_ProcessName.props.visible = true;
        col_ProcessName.props.sortIndex = 11;

        // 程序号
        const col_ProcessNo = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.ProcessNo.text,
            'ProcessNo',
            'string',
        );
        col_ProcessNo.props.alignment = 'right';
        col_ProcessNo.props.allowEditing = false;
        col_ProcessNo.props.cssClass = 'disabled';
        col_ProcessNo.props.width = 80;
        col_ProcessNo.props.visible = true;
        col_ProcessNo.props.sortIndex = 12;

        // 免疫项目
        const col_ImmuneSubjectName = new NxDataGridColumn(
            this.translator.I18N.YhDrugApplicationDetail.ImmuneSubjectName.text,
            'ImmuneSubjectName',
            'string',
        );
        col_ImmuneSubjectName.props.alignment = 'left';
        col_ImmuneSubjectName.props.allowEditing = false;
        col_ImmuneSubjectName.props.cssClass = 'disabled';
        col_ImmuneSubjectName.props.visible = true;
        col_ImmuneSubjectName.props.sortIndex = 13;


        return [
            col_SerialNo,
            col_CommonName,
            col_ProductID,
            col_MeasureUnitName,
            col_Quantity,
            col_DrugsWay,
            col_DrugMethod,
            col_Remarks,
            col_Vendor,
            col_ProcessName,
            col_ProcessNo,
            col_ImmuneSubjectName
        ];
    }

    onEditorPreparingFn2(e) {
        if (e.parentType == 'dataRow') {
            const rowData = e.row.data;
            switch (e.dataField) {
                case 'ProductID' :
                    if (rowData['ProductCommonName']) {
                        e.editorOptions.dataSource = this.ProductSource.filter(o => o.CommonName === rowData['ProductCommonName']);
                    } else {
                        e.editorOptions.dataSource = this.ProductSource;
                    }
                    e.editorOptions.onValueChanged = (args) => {
                        if (this.selectedRows.indexOf(e.row.key) === -1) {
                            this.selectedRows.push(e.row.key)
                        }
                        const selected = args.component.option('selectedItem');
                        console.log(selected,'????????????');
                        rowData['ProductCommonName'] = selected.CommonName;
                        rowData['ProductID'] =  args.value;
                        rowData['MeasureUnitName'] = selected.MeasureUnitName;
                    }
                    break;
                case 'MeasureUnitName' :
                    let MdataSource = [];
                    console.log(this.MeasureUnitNameSource)
                    if (rowData['ProductID']) {
                        MdataSource = this.MeasureUnitNameSource.filter(o => o.ProductID === rowData['ProductID']);
                    } else {
                        MdataSource = this.MeasureUnitNameSource;
                    }
                    e.editorOptions.dataSource = MdataSource;
                    e.editorOptions.onValueChanged = (args) => {
                        if (this.selectedRows.indexOf(e.row.key) === -1) {
                            this.selectedRows.push(e.row.key)
                        }
                        rowData['MeasureUnitName'] = args.value
                    }
                    break;
                default:
                    e.editorOptions.onValueChanged = (args) => {
                        if (this.selectedRows.indexOf(e.row.key) === -1) {
                            this.selectedRows.push(e.row.key)
                        }
                        // 用setTimeout延迟支持获取选中的文本值
                        setTimeout(() => {
                            // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
                            e.setValue(args.value, args.component._changedValue);
                        }, 0);
                    }
                    break;
            }
            
        }
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            const rowData = e.row.data;
            let triggerValueChanged = true;
            if (triggerValueChanged) {
                //没有这个，编辑datagrid不会激活保存按钮
                e.editorOptions.onValueChanged = (args) => {
                    if (!args.previousValue && args.previousValue != 0 && !args.value && args.value != 0) { }
                    else {
                        this.detailInstance.modifyDataStatusSet();
                        setTimeout(() => {
                            e.setValue(args.value, args.component._changedValue);
                        }, 0);
                    }
                };
            }
            let OrderingType = this.model.conditionPanel.data['OrderingType'];
            switch (e.dataField) {
                case 'CommonName' :
                    if (OrderingType === 1) {
                        e.editorOptions.dataSource = this.AllCommonNameSource.filter(o => o.iSortPlus == DataDictionary.iSortB );
                    } else {
                        e.editorOptions.dataSource = this.AllCommonNameSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
                    }
                    e.editorOptions.onValueChanged = (args) => {
                        const selected = args.component.option('selectedItem');
                        rowData['CommonName'] = args.value;
                        rowData['ProductID'] = selected.ProductID;
                        rowData['MeasureUnitName'] = selected.MeasureUnitName;
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    }
                    break;
                case 'ProductID' :
                    let PdataSource = [];
                    if (OrderingType === 1) {
                        PdataSource = this.AllProductSource.filter(o => o.iSortPlus == DataDictionary.iSortB );
                    } else {
                        PdataSource = this.AllProductSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
                    }
                    if (rowData['CommonName']) {
                        e.editorOptions.dataSource = PdataSource.filter(o => o.CommonName === rowData['CommonName']);
                    } else {
                        e.editorOptions.dataSource = PdataSource;
                    }
                    e.editorOptions.onValueChanged = (args) => {
                        const selected = args.component.option('selectedItem');
                        console.log(selected)
                        rowData['CommonName'] = selected.CommonName;
                        rowData['ProductID'] =  args.value;
                        rowData['MeasureUnitName'] = selected.MeasureUnitName;
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    }
                    break;
                case 'MeasureUnitName' :
                    let MdataSource = [];
                    if (OrderingType === 1) {
                        e.editorOptions.dataSource = this.AllMeasureUnitNameSource.filter(o => o.iSortPlus == DataDictionary.iSortB );
                    } else {
                        e.editorOptions.dataSource = this.AllMeasureUnitNameSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
                    }
                    e.editorOptions.onValueChanged = (args) => {
                        rowData['MeasureUnitName'] = args.value;
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    }
                    break;
                default:
                    break;
            }
        }
    }

    handleCell(e) {
        console.log(e)
        let OrderingType = this.model.conditionPanel.data['OrderingType'];
        if (e.row) {
            if (e.column.dataField == 'MeasureUnitName') {
                if (e.data['ProductID'] && e.data['ProductID']!="0" && OrderingType == 3) {
                    e.column.allowEditing = false;
                } else {
                    e.column.allowEditing = true;
                }
            }
        }
    }
    setReadOnly(){
        var flag = false;
        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            if((m.DetailProductID&&m.DetailProductID!="0")||(m.HenhouseID&&m.HenhouseID!="0")){
                flag = true;
                return false;
            }
        })
        if(flag){
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = true;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = true;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = true;
            // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ReceiveType")[0].widget.props.readOnly = true;
        }
        else{
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = false;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = false;
            // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ReceiveType")[0].widget.props.readOnly = false;
        }
    }
    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): YhDrugApplicationDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;

        const yhImmunetips_type = new ToolbarPanelType();
        yhImmunetips_type.key = 'addHang';
        yhImmunetips_type.widget = new NxButton('引用免疫提醒');
        yhImmunetips_type.widget.events.onClick = this.openImmunetips.bind(this);

        const yhhealthtips_type = new ToolbarPanelType();
        yhhealthtips_type.key = 'addHang';
        yhhealthtips_type.widget = new NxButton('引用保健提醒');
        yhhealthtips_type.widget.events.onClick = this.openHealthtips.bind(this);

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('messageBox')).props.visible = false;
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('filterRow')).events.onClick = this.toogleFilterRow.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('setting')).props.visible = true;
        // this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;

        this.model.toolbar.mainPanel.push(...[yhImmunetips_type,yhhealthtips_type]);
        return this;
    }

    onFieldDataChanged(e) {
        switch (e.dataField) {
            case 'QuoteStatus' :
                if (e.value) {
                    this.citeDataSource = this.citeDataSourceAll.filter( o => o.QuoteStatus == e.value);
                } else {
                    this.citeDataSource = this.citeDataSourceAll
                }
                console.log(this.citeDataSource,'this.citeDataSource')
                break;
            default:
                break;
        }
    }

    //引用免疫提示
    async openImmunetips () {
        this.citeTitle = '引用免疫提示';
        let OrderingType = this.model.conditionPanel.data['OrderingType'];
        this.formData.QuoteStatus = 2;
        this.bjType = false;
        this.ProductSource = this.AllProductSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
        this.MeasureUnitNameSource = this.AllMeasureUnitNameSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        let YHBatch = this.model.conditionPanel.data['YHBatch'];
        if (!YHFarmerID || YHFarmerID == '0' || !YHBatch || YHBatch == '0') {
            return Notify.toast('请先选择养户名称和养护批次', NotifyType.Error);
        };
        if (OrderingType != 3) {
            return Notify.toast('请先选择订药类型为程序引用', NotifyType.Error);
        };
        this.selectedRows = [];
        this.getHealthTipsDataSource(YHFarmerID,YHBatch);
        this.citeVisible = true;
    }
    /**
     * 获取列表/详情数据源
     */
    getHealthTipsDataSource(YHFarmerID,YHBatch) {
        this.service.getImmuneTipsList(YHFarmerID,YHBatch).load().then((res:any) => {
            this.citeDataSourceAll = res.map( m => {
                m['SourceType'] = 1;
                return m
            });
            this.citeDataSource = this.citeDataSourceAll.filter( o => o.QuoteStatus == 2);
            if (res.length > 0) {
                let object = res[0];
                for (const key in object) {
                    if (key != 'QuoteStatus') {
                        this.formData[key] = object[key]
                    }
                }
            }
        })
    }

    //引用保健提示
    openHealthtips () {
        this.citeTitle = '引用保健提示';
        let OrderingType = this.model.conditionPanel.data['OrderingType'];
        this.formData.QuoteStatus = 2;
        this.bjType = true;
        this.ProductSource = this.AllProductSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
        this.MeasureUnitNameSource = this.AllMeasureUnitNameSource.filter(o => o.iSortPlus == DataDictionary.iSortB || o.iSortPlus == DataDictionary.iSortC );
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        let YHBatch = this.model.conditionPanel.data['YHBatch'];
        if (!YHFarmerID || YHFarmerID == '0' || !YHBatch || YHBatch == '0') {
            return Notify.toast('请先选择养户名称和养护批次', NotifyType.Error);
        };
        if (OrderingType != 3) {
            return Notify.toast('请先选择订药类型为程序引用', NotifyType.Error);
        };
        this.selectedRows = [];
        this.getHealthTipsListDataSource(YHFarmerID,YHBatch);
        this.citeVisible = true;
    }

    /**
     * 获取列表/详情数据源
     */
    getHealthTipsListDataSource(YHFarmerID,YHBatch) {
        this.service.getHealthTipsList(YHFarmerID,YHBatch).load().then((res:any) => {
            this.citeDataSourceAll = res.map( m => {
                m['SourceType'] = 2;
                return m
            });
            this.citeDataSource = this.citeDataSourceAll.filter( o => o.QuoteStatus == 2);
            if (res.length > 0) {
                let object = res[0];
                for (const key in object) {
                    if (key != 'QuoteStatus') {
                        this.formData[key] = object[key]
                    }
                }
            }
        })
    }
    
    getSelection(type) {
        if (type == '3') {
            this.citeVisible = false;
            return false;
        }
        setTimeout(async () => {
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var selectedRowsData11 = this.myDetailGrid.instance.getSelectedRowsData();
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let arry = [];
            (<Array<any>>oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.model.dataGrid.primaryKey && x != 'target' && x != 'SerialNo'
                ); //过滤主键跟target
                for (const prop of props) {
                    if (data[prop] != null && data[prop] != '' && data[prop] != undefined) {
                        isAllEmpty = false;
                        break;
                    }
                }
                if (!isAllEmpty) {
                    arry.push(data);
                }
            });
            let SerialNo = 0;
            (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                if(m.SerialNo > SerialNo) SerialNo = m.SerialNo;
            });
            
            selectedRowsData11.forEach((f, i) => {
                var row = deepCopy(f);
                row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                row.target = DataStatus.newline;
                row['CommonName'] = f.ProductCommonName;
                row["SerialNo"] = ++SerialNo;
                row['NumericalOrderSource'] = f.NumericalOrder;
                row['NumericalOrderDetailSource'] = f.NumericalOrderDetail;
                arry.push(row);
            });

            
            this.model.dataGrid.props.dataSource = arry;
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
            this.detailInstance.modifyDataStatusSet();
            

            if (type == '1') {
                this.citeVisible = false;
            }
            this.setReadOnly()
        },200)
    }

    // 状态色值
    typeColor(type) {
        return this.colorStatusArr[type]
    }

    toogleFilterRow() {
        this.detailInstance.dataGrid.toggleFilterRow()
    }
    // 批量增行
    addHang () {
        if (!this.model.conditionPanel.data.DataDate) {
            return Notify.toast('请选择日期', NotifyType.Error);
        }

        if (!this.model.conditionPanel.data.OutWarehouse) {
            return Notify.toast('请选择出库仓库', NotifyType.Error);
        }

        this.outVisible = true;

    }
    create() {
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['OrderingType'] = 1;
        this.model.conditionPanel.data['YHFarmerID'] = null;
        this.model.conditionPanel.data['OldYHFarmerID'] = null;
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;
        //人员
        new DataSource(this.qlwOdataContext.getQlWPersonOData()).load().then(res => {
            let obj = res.filter(m => m.UserID == USER_INFO_CONTEXT.userId )
            this.model.conditionPanel.data['PersonID'] = obj[0].PersonID;
        })
        this.getWarehouse(USER_INFO_CONTEXT.childId);
        this.itemsOrderingType(1);

        
        // this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        setTimeout(() => {
            // this.detailInstance.createDataStatus();
        }, 20);
    }
    save() {
        this.detailInstance.saveChanges('SerialNo').then((value) => {
            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data) {
                        this.service.create(data).then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                this.model.conditionPanel.data['NumericalOrder'] = result.data.NumericalOrder;
                                this.numericalOrder = result.data.NumericalOrder;
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.numericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;

                                this.queryDetail();
                            } else {
                                // Notify.toast(response.message, NotifyType.Error);
                                this.detailInstance.messageBox.show(response.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                },
                () => {
                    if (this.detailInstance.reviewValidation()) {
                        const data = this.getSaveData(value);
                        if (data) {
                            this.service.update(data).then((result: Result) => {
                                const res = ResponseSuccess.handle(result);
                                if (res.status) {
                                    Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                    // this.detailInstance.saveDataAfterStatus();
                                    this.queryDetail();
                                } else {
                                    // Notify.toast(res.message, NotifyType.Error);
                                    this.detailInstance.messageBox.show(res.message);
                                    this.detailInstance.saveDataError();
                                }
                            });
                        }
                    }
                }
            );
        });
    }
    delete() {
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirm,
            this.translator.I18N.commandOptions.delete.confirmTitle
        ).then((require) => {
            if (require) {
                this.detailInstance.dataGrid.dataGrid.instance;
                this.service.deleteByKey(this.model.conditionPanel.data.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.delete.success, NotifyType.Success);
                        this.detailInstance.deletedStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        this.detailInstance.messageBox.show(response.message);
                        this.detailInstance.saveDataError();
                    }
                });
            }
        });
    }
    cancel() {
        if (this.detailInstance.$open == FormOptions.$create) {
            this.create();
        } else {
            this.queryDetail();
        }
    }
    private dataValidation(data): boolean {
        const validator = new DataValidator();
        validator.forObjRequire(data, [
            // ['TotalQuantity', this.translator.I18N.YhDrugApplicationDetail.TotalQuantity.message],
            // ['UnitPrice', this.translator.I18N.YhDrugApplicationDetail.UnitPrice.message],
        ]);
        return validator.validation;
    }

    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new YhDrugApplicationAdd();
            console.log(value.header,'////')
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.NumericalOrder = value.header.NumericalOrder || '0';
            saveData.NumericalOrderExtend = value.header.NumericalOrderExtend || '0';
            saveData.YHFarmerID = value.header.YHFarmerID || '0';
            saveData.YHBatch = value.header.YHBatch || '0';
            saveData.OrderingType = value.header.OrderingType;
            saveData.SymptomID = value.header.SymptomID ? value.header.SymptomID.join(',') : '0';
            saveData.DiseaseID = value.header.DiseaseID ? value.header.DiseaseID.join(',') : '0';
            saveData.CurrentInventory = value.header.CurrentInventory || 0;
            saveData.PersonID = value.header.PersonID || '0';
            saveData.ChickenFarmID = value.header.ChickenFarmID || '0';
            saveData.Remarks = value.header.Remarks || '';
            saveData.DaysOld = value.header.DaysOld || '0';
            saveData.NumericalOrderRefNO = value.header.NumericalOrderRefNO  || '0';
            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackF;
            saveData.InputSource = '0';
            if (value.header.Number) {
                saveData.Number  = value.header.Number;
            }
            value.body.map((m) => {
                saveData.YhDrugApplicationDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    SerialNo: m.SerialNo,
                    Remarks: m.DetailRemarks || '',
                    ProductID: m.ProductID || '0',
                    ProductName: m.ProductName || '',
                    CommonName: m.CommonName || '',
                    DrugsWay: m.DrugsWay || '0',
                    DrugMethod: m.DrugMethod || '',
                    Quantity: m.Quantity || 0,
                    MeasureUnitName: m.MeasureUnitName || '',
                    NumericalOrderSource: m.NumericalOrderSource || '0',
                    NumericalOrderDetailSource: m.NumericalOrderDetailSource || '0',
                    SourceType: m.SourceType || '0',
                    ProcessNo: m.ProcessNo || '0',
                    ImmuneSubjectID: m.ImmuneSubjectID || '0',
                    Vendor: m.Vendor || '',
                    Target: m.target,
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.YhDrugApplicationDetailDto.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }

    typeChickenReceiveByYhBatchID(value) {
        let page = `YHBatchID=${value}&`;
        if (this.model.conditionPanel.data['DataDate']) {
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            page += `DataDate=${DataDate}&`
        }
        if (this.model.conditionPanel.data['OldYHFarmerID']) {
            page += `YHFarmerID=${this.model.conditionPanel.data['OldYHFarmerID']}&`
        }
        if (this.model.conditionPanel.data['ChickenFarmID']) {
            page += `ChickenFarmID=${this.model.conditionPanel.data['ChickenFarmID']}&`
        }
        this.service.getBatchTransferDetailDatas(page).then((res:any) => {
            this.model.dataGrid.props.dataSource = res;
            this.detailInstance.cacheBodyData = deepCopy(res);
            // setTimeout(() => {
            //     this.detailInstance.saveDataAfterStatus();
            // }, 200);
        })
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YhDrugApplicationDetailComponent {
        
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        //交接日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.label = this.translator.I18N.YhDrugApplication.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = true;
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.readOnly = false;
        condition_date.widget.events.onValueChanged = (value) => {
            let YHBatch = this.model.conditionPanel.data['YHBatch']
            if (value && YHBatch) {
                //计算日龄
                this.updateDaysOld();
                
                let UrlParam = 'BuyBackDate=' + new DateTime(value).toString('yyyy-MM-dd') + '&';
                UrlParam += 'YHBatchID=' + YHBatch + '&type= 2';
                this.service.getTransferdataData(UrlParam).then((res:any) => {
                    if(res&&res.length>0){
                        let TotalQuantity = 0;
                        for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            TotalQuantity += element.TotalQuantity;
                        }
                        this.model.conditionPanel.data['CurrentInventory'] = TotalQuantity;
                    } else {
                        this.model.conditionPanel.data['CurrentInventory'] = 0;
                    }
                })
            }
        }
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        // condition_date.widget.props.max = new Date();

        // 养户名称
        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YhDrugApplication.YHFarmerID.text;
        condition_YHFarmerID.required = true;
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.requiredDisable = true;
        condition_YHFarmerID.widget = new NxSelectBox();
        // condition_YHFarmerID.widget.props.showClearButton = true;
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource()
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode'];
        condition_YHFarmerID.widget.events.onValueChanged = (value) => {
            this.model.conditionPanel.data['YHBatch'] = '';
            if (value) {
                let filter1 = [['Status', '=', true],["YHFarmerID",'=',value]];
                new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter1
                })).load().then((res:any) => {
                    if(res&&res.length>0){
                        if(res.length==1){
                            this.model.conditionPanel.data['YHBatch'] = res[0].YHBatchID;
                        }
                    }
                });
            }
        }

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhDrugApplication.YHBatch.text;
        condition_YHBatch.required = true;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.requiredDisable = true;
        condition_YHBatch.widget = new NxSelectBox();
        // condition_YHBatch.widget.props.showClearButton = false;
        condition_YHBatch.widget.props.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName','MnemonicCode']
        condition_YHBatch.widget.events.onOpened = (e) => {
            // let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if(YHFarmerID){
                let filter = [['Status', '=', true],["YHFarmerID",'=',YHFarmerID]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName','MnemonicCode'],
                }));
            }else{
                let filter = [['Status', '=', true]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName','MnemonicCode'],
                }));
            }

        }
        condition_YHBatch.widget.events.onValueChanged = (value) => {
            if (value) {
                let filter = [['YHBatchID', '=', value]];
                new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter
                })).load().then((res:any) => {
                    if(res&&res.length>0){
                        this.DaysOld = res[0].DaysOld;
                        this.pcDate = res[0].DaysOldDate;
                        this.updateDaysOld();
                        this.model.conditionPanel.data['Abstract'] = res[0].ChickAbstract;
                        this.model.conditionPanel.data['YHFarmerID'] = res[0].YHFarmerID;
                        this.model.conditionPanel.data['BreedingID'] = res[0].BreedingID;
                        this.model.conditionPanel.data['BreedingName'] = res[0].BreedingName;
                        this.model.conditionPanel.data['ChickenFarmID'] = res[0].ChickenFarmID;
                    } else {
                        this.model.conditionPanel.data['ChickenFarmID'] = '';
                        this.model.conditionPanel.data['DaysOld'] = 0;
                        this.model.conditionPanel.data['BreedingName'] = '';
                        this.model.conditionPanel.data['BreedingID'] = '';
                    }
                })


                let UrlParam = 'BuyBackDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd') + '&';
                UrlParam += 'YHBatchID=' + value + '&type= 2';
                this.service.getTransferdataData(UrlParam).then((res:any) => {
                    if(res&&res.length>0){
                        let TotalQuantity = 0;
                        for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            TotalQuantity += element.TotalQuantity;
                        }
                        this.model.conditionPanel.data['CurrentInventory'] = TotalQuantity;
                    } else {
                        this.model.conditionPanel.data['CurrentInventory'] = 0;
                    }
                })
            } else {
                this.model.conditionPanel.data['ChickenFarmID'] = '';
                this.model.conditionPanel.data['DaysOld'] = 0;
                this.model.conditionPanel.data['BreedingName'] = '';
                this.model.conditionPanel.data['BreedingID'] = '';
                this.model.conditionPanel.data['CurrentInventory'] = 0;
            }
        }

        // 养殖场
        const condition_ChickenFarmID = new NxConditionItem();   
        condition_ChickenFarmID.requiredDisable = true;
        condition_ChickenFarmID.label = '养殖场';
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.type = 'SelectBox';
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.props.showClearButton = false;
        condition_ChickenFarmID.widget.props.readOnly = true;
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource({
            filter: CHICKEN_FARM_CONTEXT.ChickenFarmFilterCondition,
            select: ['ChickenFarmID', 'ChickenFarmName'],
        });
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';

        //申请人
        const condition_PersonID = new NxConditionItem();
        condition_PersonID.label = this.translator.I18N.YhDrugApplication.PersonID.text;
        condition_PersonID.required = true;
        condition_PersonID.type = 'SelectBox';
        condition_PersonID.dataField = 'PersonID';
        condition_PersonID.widget = new NxSelectBox();
        condition_PersonID.widget.props.showClearButton = true;
        condition_PersonID.widget.props.disabled = false;
        condition_PersonID.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData();
        condition_PersonID.widget.props.valueExpr = 'PersonID';
        condition_PersonID.widget.props.displayExpr = 'PersonName';
        

        // 订药类型
        const condition_OrderingType = new NxConditionItem();
        condition_OrderingType.label = this.translator.I18N.YhDrugApplication.OrderingType.text;
        condition_OrderingType.required = true;
        condition_OrderingType.dataField = 'OrderingType';
        condition_OrderingType.type = 'SelectBox';
        condition_OrderingType.requiredDisable = true;
        condition_OrderingType.widget = new NxSelectBox();
        condition_OrderingType.widget.props.showClearButton = false;
        condition_OrderingType.widget.props.dataSource = this.StatusODataContext.getOrderingType();
        condition_OrderingType.widget.events.onValueChanged = (e) => {
            this.itemsOrderingType(e);
        }
        condition_OrderingType.widget.props.valueExpr = 'value';
        condition_OrderingType.widget.props.displayExpr = 'name';

        // 症状
        const condition_Symptom = new NxConditionItem();
        condition_Symptom.label = this.translator.I18N.YhDrugApplication.Symptom.text;
        condition_Symptom.dataField = 'SymptomID';
        condition_Symptom.type = 'TagBox';
        condition_Symptom.requiredDisable = true;
        condition_Symptom.widget = new NxTagBox();
        condition_Symptom.widget.props.dataSource = this.basicSettingODataContext.getBizRemindGroupDataSource({
            filter: [
                ['Status', '=', true],
                [
                    'PID', '=', '2201051734480011180'
                ]
            ],
            select: ['RemindID', 'RemindName'],
        })
        condition_Symptom.widget.props.valueExpr = 'RemindID';
        condition_Symptom.widget.props.displayExpr = 'RemindName';
        condition_Symptom.widget.events.onValueChanged = (e) => {
            // console.log(e);
            if (!e || e.element) return
            this.detailInstance.modifyDataStatusSet();
        }

        // 疾病
        const condition_Diagnose = new NxConditionItem();
        condition_Diagnose.label = this.translator.I18N.YhDrugApplication.Diagnose.text;
        condition_Diagnose.dataField = 'DiseaseID';
        condition_Diagnose.type = 'TagBox';
        condition_Diagnose.requiredDisable = true;
        condition_Diagnose.widget = new NxTagBox();
        condition_Diagnose.widget.props.dataSource = this.basicSettingODataContext.getBizDiseaseDataSource();
        condition_Diagnose.widget.props.valueExpr = 'DiseaseID';
        condition_Diagnose.widget.props.displayExpr = 'DiseaseName';
        condition_Diagnose.widget.events.onValueChanged = (e) => {
            if (!e || e.element) return
            this.detailInstance.modifyDataStatusSet();
        }

        // 批次品种
        const condition_BreedName = new NxConditionItem();
        condition_BreedName.label = this.translator.I18N.YhDrugApplication.BreedingName.text;
        condition_BreedName.dataField = 'BreedingName';
        condition_BreedName.type = 'TextBox';
        condition_BreedName.requiredDisable = true;
        condition_BreedName.widget = new NxTextBox();
        condition_BreedName.widget.props.readOnly = true;
        

        // 当前日龄
        const condition_DaysOld = new NxConditionItem();
        condition_DaysOld.label = this.translator.I18N.YhDrugApplication.DaysOld.text;
        condition_DaysOld.dataField = 'DaysOld';
        condition_DaysOld.type = 'TextBox';
        condition_DaysOld.requiredDisable = true;
        condition_DaysOld.widget = new NxTextBox();
        condition_DaysOld.widget.props.readOnly = true;

        // 当前存栏
        const condition_CurrentInventory = new NxConditionItem();
        condition_CurrentInventory.label = this.translator.I18N.YhDrugApplication.CurrentInventory.text;
        condition_CurrentInventory.dataField = 'CurrentInventory';
        condition_CurrentInventory.type = 'TextBox';
        condition_CurrentInventory.requiredDisable = true;
        condition_CurrentInventory.widget = new NxTextBox();
        condition_CurrentInventory.widget.props.readOnly = true;

        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'TextBox';
        condition_number.widget = new NxTextBox();
        condition_number.headVisible = true;
        condition_number.dataField = 'Number';
        condition_number.widget.props.readOnly = true;

        const condition_NumericalOrderRef = new NxConditionItem();
        condition_NumericalOrderRef.label = '药杂领用' + this.translator.I18N.commonColumns.number.text;
        condition_NumericalOrderRef.type = 'Span';
        condition_NumericalOrderRef.dataField = 'NumericalOrderRefNO';
        condition_NumericalOrderRef.headVisible = true;
        // condition_NumericalOrderRef.widget = new NxTextBox();
        // condition_NumericalOrderRef.widget.props.readOnly = true;


        this.model.conditionPanel.conditionItems.push(
            ...[
                condition_date,
                condition_YHFarmerID,
                condition_YHBatch,
                condition_OrderingType,
                condition_Symptom,
                condition_Diagnose,
                condition_PersonID,
                condition_ChickenFarmID,
                condition_BreedName,
                condition_DaysOld,
                condition_CurrentInventory,
                condition_number,
                condition_NumericalOrderRef
            ]
        );
        return this;
    }

    //订药类型显示判断
    itemsOrderingType(e,type?) {
        if (e == 3) {
            this.model.dataGrid.columns.filter(q => q.props.dataField == "CommonName")[0].props.allowEditing = false;
            this.model.dataGrid.columns.filter(q => q.props.dataField == "CommonName")[0].props.cssClass = 'disabled';
            this.model.dataGrid.columns.filter(q => q.props.dataField == "ProcessName")[0].props.visible = true;
            this.model.dataGrid.columns.filter(q => q.props.dataField == "ProcessNo")[0].props.visible = true;
            this.model.dataGrid.columns.filter(q => q.props.dataField == "ImmuneSubjectName")[0].props.visible = true;
            this.model.dataGrid.commandAddRow.visible = false;
            this.detailInstance.isRightReview = false;
            (<Array<any>>this.model.dataGrid.props.dataSource) = [];
            this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        } else {
            this.model.dataGrid.columns.filter(q => q.props.dataField == "CommonName")[0].props.allowEditing = true;
            this.model.dataGrid.columns.filter(q => q.props.dataField == "CommonName")[0].props.cssClass = '';
            this.model.dataGrid.columns.filter(q => q.props.dataField == "ProcessName")[0].props.visible = false;
            this.model.dataGrid.columns.filter(q => q.props.dataField == "ProcessNo")[0].props.visible = false;
            this.model.dataGrid.columns.filter(q => q.props.dataField == "ImmuneSubjectName")[0].props.visible = false;
            this.model.dataGrid.commandAddRow.visible = true;
            this.detailInstance.isRightReview = true;
            // 清空明细
            var emptyDatas = [];
            for (let index = 0; index < 1; index++) {
                let empty = {};
                empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                empty['target'] = DataStatus.newline;
                empty["SerialNo"] = index+1;
                emptyDatas.push(empty);
            }
            (<Array<any>>this.model.dataGrid.props.dataSource) = emptyDatas;
            this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        }
        if (type) return;
        
    }

    getWarehouse(value){
        if(this.editFlag){
            return;
        }
        if (value&&value!="0") {
            var param = "ChickenFarmID="+value+"&Billtype=zjyz&";
            this.service
                .queryWarehouseByFarm(<any>param)
                .then((res: any) => {
                    if(res&&res.WarehouseID&&res.WarehouseID!="0"){
                        this.model.conditionPanel.data['WarehouseID'] = res.WarehouseID;
                    }
                    else{
                        this.model.conditionPanel.data['WarehouseID'] = null;
                    }
                });
        }
        else{
            this.model.conditionPanel.data['WarehouseID'] = null;
        }
    }

    updateDaysOld() {
        if(this.editFlag){
            return;
        }
        var DaysOld = "";
        if(this.pcDate&&this.DaysOld&&this.model.conditionPanel.data['DataDate']){
            let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let start = new Date(DataDate);
            let end= new Date(pcDate);
            let diff = new DateTime().diff(start, end);
            DaysOld = Number(diff)+Number(this.DaysOld)+"";
         }
         this.model.conditionPanel.data['DaysOld'] = DaysOld;
    }
    removeRow() {

        // 底部删除选中行
        // 获取到用户当前选中的key
        // 删除数据的时候需要把数据标记为delete
        if (!this.detailInstance.dataGrid.model.editing.allowUpdating) {
            Notify.toast('当前状态不可以操作', NotifyType.Warning);
            return;
        }
        if((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length==0){
            return;
        }
        if (this.detailInstance.dataGrid.selectRowIndex == -1) {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1);
            // splice源数据删除
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(
                (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1,
                1
            );
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.detailInstance.dataGrid.$deletedData.push(...deletedRowData);
            }
        } else {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow(this.detailInstance.dataGrid.selectRowIndex);
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(this.detailInstance.dataGrid.selectRowIndex, 1);
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.detailInstance.dataGrid.$deletedData.push(...deletedRowData);
            }
        }
        this.detailInstance.dataGrid.dataGrid.instance.refresh();
        if (this.detailInstance.dataGrid.model.commandColumn.deleteButton.onClick) {
            this.detailInstance.dataGrid.model.commandColumn.deleteButton.onClick();
        }
        this.detailInstance.dataGrid.selectRowIndex = -1;
    }
    queryDetail(){
        this.service
            .postCustomDataSourceById({NumericalOrder: this.numericalOrder})
            .then((res: any) => {
                this.editFlag = true;
                let data = res.Datas[0];
                this.itemsOrderingType(data.OrderingType,true);
                let value:any = data.YhDrugApplicationDetailResultDto.map( m => {
                    m.target = DataStatus.none
                    return m
                });
                (<Array<any>>this.model.dataGrid.props.dataSource) = value;
                this.model.conditionPanel.data = data;
                this.model.conditionPanel.data['SymptomID'] = data.SymptomID ? data.SymptomID.split(',') : [];
                this.model.conditionPanel.data['DiseaseID'] = data.DiseaseID ? data.DiseaseID.split(',') : [];
                this.model.conditionPanel.data['ConfirmStatus'] = data.ConfirmStatus ? 1 : 0;
                this.detailInstance.cacheSearchData = deepCopy(data);
                this.detailInstance.cacheBodyData = deepCopy(value);
                //开启审核功能
                this.model.review.visible = true;
                this.model.review.numericalOrder = this.numericalOrder;
                // this.qlwOdataContext.personODataStore
                // .byKey(value[0].OwnerID)
                // .then((value) => {
                //     if(value&&value.length>0&&value[0].PersonName){
                //         this.model.review.ownerName = value[0].PersonName;
                //     }
                // });
                this.model.review.ownerName = data.CreatedOwnerName;
                // this.typeChickenReceiveByYhBatchID(value[0].YHBatch);
                setTimeout(() => {
                    this.detailInstance.saveDataAfterStatus();
                    this.editFlag = false;
                }, 200);
            });
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {
        e.isRightReview = true;//禁用右键
        // this.model.dataGrid.commandRow.visible = false; //禁用删行、增行
        //详情进入编辑页面
        if (this.route.queryParams['value']['$open'] == FormOptions.$modify) {
            setTimeout(() => {
                this.queryDetail();
            }, 500);
        } else {
            setTimeout(() => {
                this.create();
            }, 500);
        }
        setTimeout(() => {
            this.detailInstance.dataGrid.removeRow = this.removeRow.bind(this);
        }, 1000);
    }
    ngAfterViewInit() {
        //重写删行
        var dfRemoveRow = this.detailInstance.dataGrid.removeRow.bind(this.detailInstance.dataGrid);
        this.detailInstance.dataGrid.removeRow = () => {
            let selectRow;
            if(this.detailInstance.dataGrid.selectRowIndex == -1)
            {
                selectRow = (<Array<any>>this.model.dataGrid.props.dataSource)[(<Array<any>>this.model.dataGrid.props.dataSource).length-1];
            }
            else
            {
                selectRow = (<Array<any>>this.model.dataGrid.props.dataSource)[this.detailInstance.dataGrid.selectRowIndex];
            }

            if(selectRow.NumericalOrderDetailBuyBack)
            {
                Notify.warning("该行明细已被药杂领用单引用，不可删除！");
                return;
            }
            else
            {
                dfRemoveRow();
            }
        }

        //重写增行
        this.detailInstance.dataGrid.appendRow = () => {
            let SerialNo = 0;
            (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                if(m.SerialNo > SerialNo) SerialNo = m.SerialNo;
            });
            let empty = {};
            empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
            empty["SerialNo"] = ++SerialNo;
            empty['target'] = DataStatus.newline;

            // 增行一次五行
            if (!this.model.dataGrid.editing.allowUpdating || !this.detailInstance.dataGrid.isAddRow) {
                return;
            }
            if (this.model.dataGrid.commandColumn.addRowButton.onClick) {
                this.model.dataGrid.commandColumn.addRowButton.onClick(empty);
            } else {
                for (let index = 0; index < 1; index++) {
                    (<Array<any>>this.model.dataGrid.props.dataSource).push(empty);
                }
            }
            // 工具条状态控制
            this.model.dataGrid.commandColumn.addRowButton.statusCtrl();
            this.detailInstance.dataGrid.selectRowIndex = -1;
        }
    }

     //跳转模板
     jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=订药申请`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=订药申请`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        if (!this.numericalOrder) {
            Notify.error('未完成单据不支持打印！');
            return
        }
        if (e.status) {
            var tabid1 = [];
            this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m: any, index) => {
                var obj = {
                    //行号
                    XuHao: index + 1,
                    SerialNo:m.data.SerialNo,
                    CommonName: m.data.CommonName,
                    ProductName: m.data.ProductName,
                    MeasureUnitName:m.data.MeasureUnitName,
                    Quantity:m.data.Quantity,
                    DrugsWayName:m.data.DrugsWayName,
                    DrugMethod:m.data.DrugMethod,
                    ProcessName:m.data.ProcessName,
                    Vendor: m.data.Vendor,
                    ProcessNo: m.data.ProcessNo,
                    ImmuneSubjectName: m.data.ImmuneSubjectName,
                    DetailRemarks:m.data.DetailRemarks,
                };
                tabid1.push(obj);
            });

            var tabId0 = this.model.conditionPanel.data;
            tabId0['DataDate'] = new DateTime(this.model.conditionPanel.data['DataDate']).toString()
            tabId0['creatorName'] = this.model.review.ownerName;
            tabId0['auditerName'] = this.model.review.reviewName;
            tabId0['EnterpriseName'] = USER_INFO_CONTEXT.enterpriseName;
            tabId0 = {
                //日期
                DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                //养户
                YHFarmerName:  this.model.conditionPanel.data['YHFarmerName'] == undefined ? '': this.model.conditionPanel.data['YHFarmerName'],
                //批次
                YHBatchName:  this.model.conditionPanel.data['YHBatchName'] == undefined ? '': this.model.conditionPanel.data['YHBatchName'],
                //申请人
                PersonName:this.model.conditionPanel.data['PersonName'] == undefined ? '': this.model.conditionPanel.data['PersonName'],
                //养殖场
                ChickenFarmName:this.model.conditionPanel.data['ChickenFarmName'] == undefined ? '': this.model.conditionPanel.data['ChickenFarmName'],
                //订药类型
                OrderingTypeName:this.model.conditionPanel.data['OrderingTypeName'] == undefined ? '': this.model.conditionPanel.data['OrderingTypeName'],
                //症状
                SymptomName:this.model.conditionPanel.data['SymptomName'] == undefined ? '': this.model.conditionPanel.data['SymptomName'],
                //疾病
                DiseaseName:this.model.conditionPanel.data['DiseaseName'] == undefined ? '': this.model.conditionPanel.data['DiseaseName'],
                //批次品种
                BreedingName:this.model.conditionPanel.data['BreedingName'] == undefined ? '': this.model.conditionPanel.data['BreedingName'],
                //当前存栏
                CurrentInventory:this.model.conditionPanel.data['CurrentInventory'] == undefined ? '': this.model.conditionPanel.data['CurrentInventory'],
                //日龄
                DaysOld:this.model.conditionPanel.data['DaysOld'] == undefined ? '': this.model.conditionPanel.data['DaysOld'],
                //单位
                EnterpriseName:USER_INFO_CONTEXT.enterpriseName,
                // 单据号
                Number:this.model.conditionPanel.data['Number'] == undefined ? '': this.model.conditionPanel.data['Number'],
                // 药杂单据号
                NumericalOrderRefNO:this.model.conditionPanel.data['NumericalOrderRefNO'] == undefined ? '': this.model.conditionPanel.data['NumericalOrderRefNO'],
                // 说明
                Remarks:this.model.conditionPanel.data['Remarks'] == undefined ? '': this.model.conditionPanel.data['Remarks'],
                // 制单人
                creatorName: this.model.review.ownerName,
                // 审核人
                auditerName: this.model.review.reviewName,
            };
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
