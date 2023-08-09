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
import { RegExps } from 'src/app/providers/regexp';
import { DateTime } from 'src/app/providers/common/datetime';
import { YhBatchTransferService } from '../yhbatchtransfer.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TokenAuthService } from 'src/app/shared/services';
import { YhBatchTransferAdd } from '../yhbatchtransfer.model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { groupBy } from 'src/app/providers/groupby';
import { PrintPageComponent } from 'nxin-print';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { dealBigMoney,Distinct } from 'src/app/providers/distinct';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { YHProductionODataContext } from 'src/app/providers/odataContext/yhp.odataContext';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'yhbatchtransfer-detail',
    templateUrl: './yhbatchtransfer-detail.component.html',
    styleUrls: ['./yhbatchtransfer-detail.component.scss'],
})
export class YhBatchTransferDetailComponent {
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
    productSource: any;
    currentCount: number = 0;
    iNumericalOrderPlan: string = '0';
    dataDateFlag: boolean = false;
    pcDate: string;
    DaysOld: Number;
    editFlag : boolean = false;
    allProductBatchSource: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource:any=[];
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;
    outVisible: boolean = false;
    formData: any = {};
    $form: boolean = false;
    AutoDataSource: any;
    AutoDataSourceFilter: any;
    selectedRows: any;
    loading: boolean = false;
    BatchDataSource: any;
    ChickenFarmDataSource: any;
    HenhouseSourceall:any
    modifyVisible: boolean = false;
    HenhouseBydataSource: any;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: YhBatchTransferService,
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
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);

        this.service.getProductBatch().then((res:any)=>{
            this.allProductBatchSource = res.value;
        });

        this.YHBasicSettingODataContext.YHBatch.load().then((res:any) => {
            this.BatchDataSource = res
        })

        this.basicSettingODataContext.bizChickenFarm.load().then((res:any) => {
            this.ChickenFarmDataSource = res
        })

        this.init_data_grid().init_table_header().init_toolbar_panel();
    }
    //#region 初始化表格
    init_data_grid(): YhBatchTransferDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'YhBatchTransfer-detail';
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
        const col_HenHouseName = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.HenhouseID.text,
            'HenhouseName',
            'string',
        );
        col_HenHouseName.props.alignment = 'center';
        col_HenHouseName.props.lookup.enabled = true;
        col_HenHouseName.props.allowEditing = false;

        // 内置属性
        const col_iSortPlus = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.iSortPlus.text,
            'iSortPlusName',
            'string',
        );
        col_iSortPlus.props.alignment = 'center';
        col_iSortPlus.props.allowEditing = false;


        // 规格
        const col_Specification = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.Specification.text,
            'Specification',
            'string',
        );
        col_Specification.props.alignment = 'center';
        col_Specification.props.allowEditing = false;


        // 账存件数
        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.Packages.text,
            'Packages',
            'string',
        );
        col_Packages.props.alignment = 'center';
        col_Packages.props.allowEditing = false;

        // 账存数量
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.Quantity.text,
            'Quantity',
            'string',
        );
        col_Quantity.props.alignment = 'center';
        col_Quantity.props.allowEditing = false;

        // 养殖场仓库
        const col_WarehouseID = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.WarehouseID.text,
            'WarehouseName',
            'string',
        );
        col_WarehouseID.props.alignment = 'center';
        col_WarehouseID.props.allowEditing = false;

        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.ProductName.text,
            'ProductName',
        );
        col_ProductID.props.allowEditing = false;

        //批号
        const col_ProductBatchID = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.ProductBatchID.text,
            'ProductBatchName',
        );
        col_ProductBatchID.props.allowEditing = false;
        col_ProductBatchID.props.HeaderRequiredIcon = false;


        //计量单位
        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransferDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string',
        );
        col_MeasureUnitName.props.lookup.enabled = true;
        col_MeasureUnitName.props.allowEditing = false;
        col_MeasureUnitName.props.alignment = 'center'


        return [
            col_iSortPlus,
            col_ProductID,
            col_Specification,
            col_ProductBatchID,
            col_Quantity,
            col_MeasureUnitName,
            col_Packages,
            col_HenHouseName,
            col_WarehouseID
        ];
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            const rowData = e.row.data;
            let triggerValueChanged = true;

            switch (e.dataField) {

                case 'HenhouseID' :
                    e.editorOptions.dataSource = this.HenhouseBydataSource;
                    this.setReadOnly();
                    break;
                case 'DetailProductID' :
                    // var ProductBatchID = e.row.data['ProductBatchID'];
                    // ProductBatchID = ''
                    break;
                case 'ProductBatchID' :
                    var ProductID = e.row.data['DetailProductID'];
                    var ProductBatchID = e.row.data['ProductBatchID'];
                    var dataSource = [];
                    if (ProductID) {
                        dataSource = this.allProductBatchSource.filter((o) => o.ProductID == ProductID);
                    }
                    e.editorOptions.dataSource = Distinct(dataSource, 'ProductBatchID');
                    break;
                default:
                    break;
            }
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

        }
    }

    handleCell(e) {
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
    init_toolbar_panel(): YhBatchTransferDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('messageBox')).props.visible = false;
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('filterRow')).events.onClick = this.toogleFilterRow.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('setting')).props.visible = true;
        // this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;

        this.model.toolbar.mainPanel.push(...[]);
        return this;
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
        this.model.conditionPanel.data['YHFarmerID'] = null;
        this.model.conditionPanel.data['OldYHFarmerID'] = null;
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;
        this.getWarehouse(USER_INFO_CONTEXT.childId);
        this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        setTimeout(() => {
            this.detailInstance.createDataStatus();
            this.setReadOnly();
        }, 20);
    }
    save() {
        this.detailInstance.saveChanges().then((value) => {
            
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
            // ['DetailProductID', this.translator.I18N.YhBatchTransferDetail.ProductName.required],
            // ['TotalQuantity', this.translator.I18N.YhBatchTransferDetail.TotalQuantity.message],
            // ['UnitPrice', this.translator.I18N.YhBatchTransferDetail.UnitPrice.message],
        ]);
        return validator.validation;
    }

    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new YhBatchTransferAdd();
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.OldDataDate = value.header.OldDataDate || date;
            saveData.NumericalOrder = value.header.NumericalOrder || '0';
            saveData.OldYHFarmerID = value.header.OldYHFarmerID || '0';
            saveData.YHFarmerID = value.header.YHFarmerID || '0';
            saveData.YHBatch = value.header.YHBatch || '0';
            saveData.YHFarmerContract = value.header.YHFarmerContract || "0";
            saveData.SerialNo = value.header.SerialNo || "0";
            saveData.OldYHFarmerContract = value.header.OldYHFarmerContract || '0';
            saveData.TransferReason = value.header.TransferReason || '';
            saveData.ChickenFarmID = value.header.ChickenFarmID || '0';
            saveData.Remarks = value.header.Remarks || '';
            saveData.OldSerialNo  = value.header.OldSerialNo || '0';
            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackF;
            if (value.header.Number) {
                saveData.Number  = value.header.Number;
            }
            value.body.map((m) => {
                console.log(m);
                saveData.YhBatchTransferDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    Remarks: m.DetailRemarks || '',
                    Specification: m.Specification || '0',
                    iSortPlus: m.iSortPlus || '0',
                    HenhouseID: m.HenhouseID || '0',
                    WarehouseID: m.WarehouseID || '0',
                    ProductID: m.ProductID,
                    ProductName: m.ProductName,
                    ProductBatchID: m.ProductBatchID || '0',
                    Quantity: m.Quantity || 0,
                    MeasureUnitName: m.MeasureUnitName || '',
                    Packages: Number(m.Packages),
                    Target: m.target,
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.YhBatchTransferDetailDto.push(...value.deleted);
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
    init_table_header(): YhBatchTransferDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        //交接日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.label = this.translator.I18N.YhBatchTransfer.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = true;
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.readOnly = false;
        condition_date.widget.events.onValueChanged = (value) => {
            let YHBatch = this.model.conditionPanel.data['YHBatch']
            if (YHBatch && YHBatch != '0') {
                this.typeChickenReceiveByYhBatchID(YHBatch)
            }
        }
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        condition_date.widget.props.max = new Date();


        // 原养户名称
        const condition_OldYHFarmerID = new NxConditionItem();
        condition_OldYHFarmerID.label = this.translator.I18N.YhBatchTransfer.OldYHFarmerID.text;
        condition_OldYHFarmerID.required = true;
        condition_OldYHFarmerID.dataField = 'OldYHFarmerID';
        condition_OldYHFarmerID.type = 'SelectBox';
        condition_OldYHFarmerID.requiredDisable = true;
        condition_OldYHFarmerID.widget = new NxSelectBox();
        // condition_YHFarmerID.widget.props.showClearButton = true;
        condition_OldYHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource()
        condition_OldYHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_OldYHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_OldYHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']
        condition_OldYHFarmerID.widget.events.onValueChanged = (value) => {
            this.model.conditionPanel.data['YHBatch'] = '';
            this.model.conditionPanel.data['ChickenFarmID'] = '';
            this.model.conditionPanel.data['OldSerialNo'] = '';
            this.model.conditionPanel.data['OldYHFarmerContract'] = '';
            let filter = [['Status', '=', true],["YHFarmerID",'=',value]];
            new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
                filter: filter
            })).load().then((res:any) => {
                if(res&&res.length>0){
                    if(res.length==1){
                        this.model.conditionPanel.data['YHBatch'] = res[0].YHBatchID;
                    }
                }
            });
        }

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhBatchTransfer.YHBatch.text;
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
            let YHFarmerID = this.model.conditionPanel.data['OldYHFarmerID'];
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
                        this.model.conditionPanel.data['ChickenType'] = res[0].ChickenType;
                        this.model.conditionPanel.data['ChickenFarmID'] = res[0].ChickenFarmID;
                        this.model.conditionPanel.data['OldSerialNo'] = res[0].SerialNo;
                        this.model.conditionPanel.data['OldYHFarmerContract'] = res[0].YHFarmerContract;
                        // this.getHenhouse();
                        this.typeChickenReceiveByYhBatchID(value)
                    } else {
                        this.model.dataGrid.props.dataSource = [];
                        this.detailInstance.cacheBodyData = deepCopy([]);
                    }
                })
            } else {
                this.model.dataGrid.props.dataSource = [];
                this.detailInstance.cacheBodyData = deepCopy([]);
            }
        }

        // 养殖场
        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.required = true;
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

        // 新养户名称
        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YhBatchTransfer.YHFarmerID.text;
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
            this.model.conditionPanel.data['YHFarmerContract'] = '';
            if (value) {
                let filter = `YHFarmerID=${value}`;
                this.service.getMaxSerialNoByYHFarmerID(filter).then((res:any) => {
                    if (res && res.length > 0) {
                        this.model.conditionPanel.data['SerialNo'] = res[0].SerialNo + 1;
                    } else {
                        this.model.conditionPanel.data['SerialNo'] = ''
                    }
                })
                let filter1 = [["YHFarmerID",'=',value]];
                new DataSource(this.yhProductionODataContext.getYHFarmerContractInfoDataSource({
                    filter: filter1
                })).load().then((res:any) => {
                    if(res&&res.length>0){
                        if(res.length==1){
                            this.model.conditionPanel.data['YHFarmerContract'] = res[0].NumericalOrder;
                        }
                    }
                });
            }
        }

        // 新养殖合同
        const condition_YHFarmerContract = new NxConditionItem();
        condition_YHFarmerContract.label = this.translator.I18N.YhBatchTransfer.YHFarmerContract.text;
        condition_YHFarmerContract.required = true;
        condition_YHFarmerContract.dataField = 'YHFarmerContract';
        condition_YHFarmerContract.type = 'SelectBox';
        condition_YHFarmerContract.requiredDisable = true;
        condition_YHFarmerContract.widget = new NxSelectBox();
        condition_YHFarmerContract.widget.props.dataSource = this.yhProductionODataContext.getYHFarmerContractInfoDataSource();
        condition_YHFarmerContract.widget.events.onOpened = (e) => {
            // let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if(YHFarmerID){
                let filter = [['YHFarmerID','=',YHFarmerID]];
                e.component.option('dataSource',this.yhProductionODataContext.getYHFarmerContractInfoDataSource({
                    filter: filter,
                    paginate: false,
                }));
            } else {
                e.component.option('dataSource',this.yhProductionODataContext.getYHFarmerContractInfoDataSource());
            }
        }
        condition_YHFarmerContract.widget.props.valueExpr = 'NumericalOrder';
        condition_YHFarmerContract.widget.props.displayExpr = 'ContractNo';
        condition_YHFarmerContract.widget.props.searchExpr = ['NumericalOrder','ContractNo']

        // 原养殖合同
        const condition_OldYHFarmerContract = new NxConditionItem();
        condition_OldYHFarmerContract.label = this.translator.I18N.YhBatchTransfer.OldYHFarmerContract.text;
        condition_OldYHFarmerContract.dataField = 'OldYHFarmerContract';
        condition_OldYHFarmerContract.type = 'SelectBox';
        condition_OldYHFarmerContract.requiredDisable = true;
        condition_OldYHFarmerContract.widget = new NxSelectBox();
        condition_OldYHFarmerContract.widget.props.dataSource = this.yhProductionODataContext.getYHFarmerContractInfoDataSource();
        condition_OldYHFarmerContract.widget.props.valueExpr = 'NumericalOrder';
        condition_OldYHFarmerContract.widget.props.displayExpr = 'ContractNo';
        condition_OldYHFarmerContract.widget.props.searchExpr = ['NumericalOrder','ContractNo']
        condition_OldYHFarmerContract.widget.props.readOnly = true;

        // 新养户批次序号
        const condition_SerialNo = new NxConditionItem();
        condition_SerialNo.label = this.translator.I18N.YhBatchTransfer.SerialNo.text;
        // condition_SerialNo.required = true;
        condition_SerialNo.dataField = 'SerialNo';
        condition_SerialNo.type = 'TextBox';
        condition_SerialNo.requiredDisable = true;
        condition_SerialNo.widget = new NxTextBox();

        // 原养户批次序号
        const condition_OldSerialNo = new NxConditionItem();
        condition_OldSerialNo.label = this.translator.I18N.YhBatchTransfer.OldSerialNo.text;
        condition_OldSerialNo.dataField = 'OldSerialNo';
        condition_OldSerialNo.type = 'TextBox';
        condition_OldSerialNo.requiredDisable = true;
        condition_OldSerialNo.widget = new NxTextBox();
        condition_OldSerialNo.widget.props.readOnly = true;

        // 交接原因
        const condition_TransferReason = new NxConditionItem();
        condition_TransferReason.label = this.translator.I18N.YhBatchTransfer.TransferReason.text;
        // condition_SerialNo.required = true;
        condition_TransferReason.dataField = 'TransferReason';
        condition_TransferReason.type = 'TextBox';
        condition_TransferReason.requiredDisable = true;
        condition_TransferReason.widget = new NxTextBox();

        const condition_numericalOrder = new NxConditionItem();
        condition_numericalOrder.label = this.translator.I18N.commonColumns.numericalOrder.text;
        condition_numericalOrder.type = 'Span';
        condition_numericalOrder.headVisible = true;
        condition_numericalOrder.dataField = 'NumericalOrder';

        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'TextBox';
        condition_number.widget = new NxTextBox();
        condition_number.headVisible = true;
        condition_number.dataField = 'Number';
        condition_number.widget.props.readOnly = true;


        this.model.conditionPanel.conditionItems.push(
            ...[
                condition_date,
                condition_OldYHFarmerID,
                condition_YHBatch,
                condition_ChickenFarmID,
                condition_YHFarmerID,
                condition_YHFarmerContract,
                condition_SerialNo,
                condition_OldYHFarmerContract,
                condition_TransferReason,
                condition_OldSerialNo,
                condition_number
                // condition_numericalOrder,
            ]
        );
        return this;
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
        this.setReadOnly();
    }
    queryDetail(){
        this.service
            .getCustomDataSourceById(this.numericalOrder)
            .load()
            .then((value: Array<any>) => {
                this.editFlag = true;
                this.model.dataGrid.props.dataSource = value;
                this.model.dataGrid.props.dataSource.map((m) => (
                    m.target = DataStatus.none
                ));
                this.model.conditionPanel.data = value[0];
                this.model.conditionPanel.data['ConfirmStatus'] = value[0].ConfirmStatus ? 1 : 0;
                this.detailInstance.cacheSearchData = deepCopy(value[0]);
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
                this.model.review.ownerName = value[0].CreatedOwnerName;
                // this.typeChickenReceiveByYhBatchID(value[0].YHBatch);
                this.setReadOnly();
                setTimeout(() => {
                    this.detailInstance.saveDataAfterStatus();
                    this.editFlag = false;
                    if (value[0].ChickenSource==DataDictionary.ChickenSourceA) {
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = true;
                    }else{
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
                    }
                }, 200);
            });
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {
        e.isRightReview = true;//禁用右键
        this.model.dataGrid.commandRow.visible = false; //禁用删行、增行
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


}
