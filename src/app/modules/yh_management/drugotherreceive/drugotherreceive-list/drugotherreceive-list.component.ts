import { Component, OnInit, ViewChild } from '@angular/core';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { ResponseError, ResponseSuccess, Result } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { NxSearchPanelComponent } from 'src/app/components/search-panel/search-panel.component';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import DataSource from 'devextreme/data/data_source';
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { QlwODataContext, BasicSettingODataContext,QlwCustomerContext, PermissionContext, YHBasicSettingODataContext } from 'src/app/providers/odataContext';
import { DrugOtherReceiveService } from '../drugotherreceive.service';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services/auth.service';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { Router } from '@angular/router';
import { NxDropDownButton, NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';
import { NxReview } from 'src/app/components/review/review.extend';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { INxExcelImportComponent, NxExcelImportComponent } from 'src/app/nxin/ui/extensions/basic/excel_import';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';

@Component({
    selector: 'drugotherreceive',
    templateUrl: './drugotherreceive-list.component.html',
    styleUrls: ['./drugotherreceive-list.component.scss'],
})
export class DrugOtherReceiveListComponent {
    datasource: any = null;
    dataGridModel: NxDataGrid = new NxDataGrid('list');
    toolbarPanelModel: NxToolbarPanel = new NxToolbarPanel('list');
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('list', { static: false })
    listInstance: NxFormListComponent;
    @ViewChild('toolbar', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('searchPanel', { static: false })
    searchPanelInstance: NxSearchPanelComponent;
    permission: PermissionService = new PermissionService();
    //审核人
    reviewer: {
        CheckedByID?: string;
        CheckedByName?: string;
        Level?: number;
        IsAdd?: boolean;
        RecordID?: number;
    };
    review: NxReview = new NxReview();
    searchData: any = {};
    @ViewChild('excel', { static: false })
    excelImport: INxExcelImportComponent;
    excelModel: NxExcelImportComponent;
    constructor(
        private tokenService: TokenAuthService,
        private http: HttpClient,
        private router: Router,
        private service: DrugOtherReceiveService,
        private permissionContext: PermissionContext,
        private qlwOdataContext: QlwODataContext,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private importService: QlwImportTemplateService,
    ) {
        this.init_data_grid().init_toolbar_panel().init_search_panel();
        this.excelModel = {
            title: this.importService.drugotherreceive.title,
            xlsxTemplatePath: this.importService.drugotherreceive.xlsxPath,
            jsonTemplatePath: this.importService.drugotherreceive.jsonPath,
            importServer: this.importService.drugotherreceive.server,
            onImportSuccess: (response) => {
                this.listInstance.dataGrid.instance.refresh();
            },
        };
    }
    //#region 初始化表格配置
    init_data_grid(): DrugOtherReceiveListComponent {
        this.dataGridModel.primaryKey = 'NumericalOrder';
        const now = new Date();
        this.dataGridModel.export.fileName = `${
            this.translator.I18N.DrugOtherReceive.title
        }-${new DateTime().toString()}`;
        this.datasource = this.service.getListDataSource();
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().setDate(new Date().getDate()+3)).toLocaleDateString())],
        ];
        this.datasource.filter(filter);
        this.dataGridModel.props.dataSource = this.datasource;
        this.dataGridModel.props.columnAutoWidth = true;
        this.dataGridModel.columns.push(...this.columns);
        // this.dataGridModel.commandColumn.deleteButton.visible = false;
        this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'DrugOtherReceive-list';
        this.dataGridModel.props.remoteOperations = true;

        return this;
    }
    get columns() {

        const col_dataDate = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.DataDate.text,
            'DataDate',
            'date',
            'DataDate'
        );
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;
        // col_dataDate.props.sortOrder = 'desc';
        // col_dataDate.props.sortIndex = 1;
        col_dataDate.props.fixed = true;

        const col_numbericalorder = new NxDataGridColumn(
            this.translator.I18N.commonColumns.number.text,
            'Number',
            'string'
        );
        col_numbericalorder.props.sortOrder = 'desc';
        col_numbericalorder.props.sortIndex = 1;
        col_numbericalorder.props.filterOperations = ['contains',"="];
        col_numbericalorder.props.allowHeaderFiltering = false;
        col_numbericalorder.props.fixed = true;


        const col_YHFarmerID = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.YHFarmerID.text,
            'YHFarmerName',
            'string',
        );
        col_YHFarmerID.props.filterOperations = ['contains',"="];
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.fixed = true;

        const col_BatchName = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.YHBatch.text,
            'YHBatchName',
            'string'
        );
        col_BatchName.props.filterOperations = ['contains',"="];
        col_BatchName.props.allowHeaderFiltering = false;
        col_BatchName.props.fixed = true;


        const col_ChickenFarmID = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.ChickenFarmID.text,
            'ChickenFarmName',
            'string'
        );
        col_ChickenFarmID.props.filterOperations = ['contains',"="];
        col_ChickenFarmID.props.allowHeaderFiltering = false;

        const col_Abstract = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.Abstract.text,
            'AbstractName',
            'string',
        );
        col_Abstract.props.filterOperations = ['contains',"="];
        col_Abstract.props.allowHeaderFiltering = false;

        const col_OutWarehouseName = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.OutWarehouse.text,
            'OutWarehouseName',
            'string',
        );
        col_OutWarehouseName.props.filterOperations = ['contains',"="];
        col_OutWarehouseName.props.allowHeaderFiltering = false;

        const col_InWarehouseName = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.InWarehouse.text,
            'InWarehouseName',
            'string',
        );
        col_InWarehouseName.props.filterOperations = ['contains',"="];
        col_InWarehouseName.props.allowHeaderFiltering = false;

        const col_ReceiveType = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.ReceiveType.text,
            'ReceiveTypeName',
            'string',
        );
        col_ReceiveType.props.filterOperations = ['contains',"="];
        col_ReceiveType.props.allowHeaderFiltering = false;

        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.Quantity.text,
            'Quantity',
            'number',
        );
        col_Quantity.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Quantity.props.selectedFilterOperation = 'between';
        col_Quantity.props.allowHeaderFiltering = false;
        col_Quantity.props.alignment = 'right'

        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.Packages.text,
            'Packages',
            'number',
        );
        col_Packages.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Packages.props.selectedFilterOperation = 'between';
        col_Packages.props.allowHeaderFiltering = false;
        col_Packages.props.alignment = 'right'

        const col_AmountTotal = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.AmountTotal.text,
            'AmountTotal',
            'number',
        );
        col_AmountTotal.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_AmountTotal.props.selectedFilterOperation = 'between';
        col_AmountTotal.props.allowHeaderFiltering = false;
        col_AmountTotal.props.alignment = 'right'

        const col_ConfirmStatus = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.ConfirmStatus.text,
            'ConfirmStatus',
            'string'
        );
        col_ConfirmStatus.props.trueText = "是";
        col_ConfirmStatus.props.falseText = "否";
        col_ConfirmStatus.props.dataType="boolean";
        col_ConfirmStatus.props.allowHeaderFiltering = false;
        col_ConfirmStatus.props.alignment = 'center'

        const col_isbegin = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceive.isbegin.text,
            'isbegin',
            'boolean',
        );
        // col_ConfirmStatus.props.allowHeaderFiltering = false;
        col_isbegin.props.lookup.enabled = true;
        col_isbegin.props.lookup.dataSource = DataDictionarySource.blImmunitySource;
        col_isbegin.props.lookup.valueExpr = 'value';
        col_isbegin.props.lookup.displayExpr  = 'name';
        col_isbegin.props.alignment = 'center'


        const col_remarks = new NxDataGridColumn(
            this.translator.I18N.dataGridOptions.remarks.text,
            'Remarks',
            'string',
        );
        col_remarks.props.filterOperations = ['contains',"="];
        col_remarks.props.allowHeaderFiltering = false;

        const col_AuditName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.AuditName.text,
            'AuditName',
            'string',
        );
        col_AuditName.props.filterOperations = ['contains',"="];
        col_AuditName.props.allowHeaderFiltering = false;
        col_AuditName.props.alignment = 'center'

        const col_CreatedOwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedOwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_CreatedOwnerName.props.filterOperations = ['contains',"="];
        col_CreatedOwnerName.props.allowHeaderFiltering = false;
        col_CreatedOwnerName.props.alignment = 'center'

        const col_CreatedDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedDate.text,
            'CreatedDate',
            'date',
        );
        col_CreatedDate.props.allowHeaderFiltering = false;
        col_CreatedDate.props.format = 'yyyy/MM/dd';
        col_CreatedDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
        };
        col_CreatedDate.props.filterOperations = ['between', '='];
        col_CreatedDate.props.selectedFilterOperation = 'between';

        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
        col_OwnerName.props.allowHeaderFiltering = false;
        col_OwnerName.props.alignment = 'center'

        const col_ModifiedDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.ModifiedDate.text,
            'ModifiedDate',
            'date',
        );
        col_ModifiedDate.props.allowHeaderFiltering = false;
        col_ModifiedDate.props.format = 'yyyy/MM/dd';
        col_ModifiedDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.ModifiedDate).toString('yyyy/MM/dd HH:mm:ss');
        };
        col_ModifiedDate.props.filterOperations = ['between', '='];
        col_ModifiedDate.props.selectedFilterOperation = 'between';

        const col_AuditDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.AuditDate.text,
            'AuditDate',
            'date',
        );
        col_AuditDate.props.allowHeaderFiltering = false;
        col_AuditDate.props.format = 'yyyy/MM/dd';
        col_AuditDate.props.calculateDisplayValue = (row) => {
            if(row.AuditDate){
                return new DateTime(row.AuditDate).toString('yyyy/MM/dd HH:mm:ss');
            }
            else{
                return (row.AuditDate = null);
            }
        };
        col_AuditDate.props.filterOperations = ['between', '='];
        col_AuditDate.props.selectedFilterOperation = 'between';

        const col_IsCheck = new NxDataGridColumn(
            this.translator.I18N.commandOptions.IsCheck.text,
            'IsCheck',
            'string'
        );
        col_IsCheck.props.trueText = "已审核";
        col_IsCheck.props.falseText = "未审核";
        col_IsCheck.props.dataType="boolean";
        col_IsCheck.props.allowHeaderFiltering = false;
        col_IsCheck.props.alignment = 'center'

        return [
            col_dataDate,
            col_numbericalorder,
            col_YHFarmerID,
            col_BatchName,
            col_ChickenFarmID,
            col_Abstract,
            col_OutWarehouseName,
            col_InWarehouseName,
            col_ReceiveType,
            col_Quantity,
            col_Packages,
            col_AmountTotal,
            col_ConfirmStatus,
            col_isbegin,
            col_remarks,
            col_IsCheck,
            col_AuditName,
            col_AuditDate,
            col_CreatedOwnerName,
            col_CreatedDate,
            col_OwnerName,
            col_ModifiedDate,
        ];
    }
    delete(rowData) {
        this.service
            .deleteByKey(rowData.data.NumericalOrder)
            .then((result: Result) => {
                const res = ResponseSuccess.handle(result);
                if (res.status) {
                    this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                    this.listInstance.dataGrid.instance.clearSelection();
                    this.listInstance.dataGrid.instance.refresh();
                } else {
                    this.toolbarInstance.error(`${res.message}`);
                }
            })
            .catch((e) => {
                const message = ResponseError.handler(e);
                this.toolbarInstance.error(message);
            });
    }
    edit(rowData) {
        this.listInstance.yheditToDetail(
            '/drugotherreceive/detail',
            rowData.rowIndex,
            this.translator.I18N.DrugOtherReceive.editPageTitle,
            {
                numericalOrder: rowData.data.NumericalOrder,
            }
        );
    }
    selectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }
    //#endregion
    //#region 初始化工具条配置
    init_toolbar_panel(): DrugOtherReceiveListComponent {
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('filterRow').events.onClick = this.toogleFilterRow.bind(this);
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeReview')).props.visible = false;
        (<NxDropDownButton>this.toolbarPanelModel.getWidgetByKey('review')).events.onButtonClick = (e) => {
            this.rangeReview(true)
        };
        (<NxDropDownButton>this.toolbarPanelModel.getWidgetByKey('review')).events.onItemClick = (e) => {
            this.rangeReview(false)
        };
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeDelete')).props.visible = false; //隐藏删除按钮
        this.toolbarPanelModel.moreButton.props.visible = true;
        this.toolbarPanelModel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.commonColumns.number.text, 'Number'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.YHFarmerID.text, 'YHFarmerName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.YHBatch.text,'YHBatchName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.ChickenFarmID.text, 'ChickenFarmName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.Abstract.text, 'AbstractName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.OutWarehouse.text, 'OutWarehouseName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.InWarehouse.text, 'InWarehouseName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceive.ReceiveType.text, 'ReceiveTypeName'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceiveDetail.Quantity.text, 'Quantity'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceiveDetail.Packages.text, 'Packages'),
                new ColumnSetting(this.translator.I18N.DrugOtherReceiveDetail.AmountTotal.text,'AmountTotal'),
                new ColumnSetting( this.translator.I18N.DrugOtherReceive.ConfirmStatus.text,'ConfirmStatus'),
                new ColumnSetting( this.translator.I18N.DrugOtherReceive.isbegin.text,'isbegin'),
                new ColumnSetting(this.translator.I18N.dataGridOptions.remarks.text, 'Remarks'),
                new ColumnSetting(this.translator.I18N.commandOptions.IsCheck.text, 'IsCheck'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditName.text, 'AuditName'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditDate.text, 'AuditDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
            ]
        );
        this.toolbarPanelModel.onColumnSetting = (hiding, dataField) => {
            if (dataField == 'all') {
                this.toolbarPanelModel.settings.map((m) => {
                    setTimeout(() => {
                        m.visibled = hiding;
                    }, new Date().getMilliseconds());
                });
                this.dataGridModel.columns.map((col, index) => {
                    setTimeout(() => {
                        col.props.visible = hiding;
                    }, new Date().getMilliseconds());
                });
            } else {
                for (let index = 0; index < this.dataGridModel.columns.length; index++) {
                    const col = this.dataGridModel.columns[index];
                    if (col.props.dataField == dataField) {
                        this.listInstance.model.columns[index].props.visible = hiding;
                        break;
                    }
                }
            }
        };
        this.toolbarPanelModel.moreButton.props.items.push(
            new NxDropDownButtonItem(this.translator.I18N.importComponent.text, 'import', 'iconfont iconimport')
        );
        this.toolbarPanelModel.moreButton.events.onItemClick = (e) => {
            if (e.type == 'export') {
                this.print();
            }
            if (e.type == 'import') {
                this.excelImport.show();
            }
        };
        // 设置隐藏列缓存
        this.toolbarPanelModel.storageKey = 'DrugOtherReceive-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanelModel.storageKey));
        this.dataGridModel.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });
        return this;
    }
    print() {
        if (this.listInstance.getSelectedRowsData().length > 0) {
            this.listInstance.dataGrid.instance.exportToExcel(true);
        } else {
            this.listInstance.dataGrid.instance.exportToExcel(false);
        }
    }
    create() {
        this.listInstance.yhcreateToDetail(
            '/drugotherreceive/detail',
            this.translator.I18N.DrugOtherReceive.createPageTitle
        );
    }
    toogleFilterRow() {
        this.listInstance.toggleFilterRow();
    }
    columnchooser() {
        this.toolbarInstance.model.columnSettingDisabled = !this.toolbarInstance.model.columnSettingDisabled;
    }
    refresh() {
        this.listInstance.dataGrid.instance.refresh();
    }
    //#endregion

    //#region 初始化查询区域配置
    init_search_panel() {
        this.searchPanelModel.data['date'] = [new Date(), new Date(new Date().setDate(new Date().getDate()+3))];
        let date = new NxConditionItem();
        date.label = this.translator.I18N.DrugOtherReceive.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'date';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.DrugOtherReceive.YHFarmerID.text;
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.showClearButton = true;
        condition_YHFarmerID.widget.props.dataSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource();
        condition_YHFarmerID.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerID.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerName', 'YHPersonName', 'Phone', 'MnemonicCode'];

        const condition_BatchID = new NxConditionItem();
        condition_BatchID.label = this.translator.I18N.DrugOtherReceive.YHBatch.text;
        condition_BatchID.dataField = 'YHBatch';
        condition_BatchID.type = 'SelectBox';
        condition_BatchID.widget = new NxSelectBox();
        condition_BatchID.widget.props.showClearButton = true;
        condition_BatchID.widget.props.valueExpr = "YHBatchID";
        condition_BatchID.widget.props.displayExpr = "YHBatchName";
        condition_BatchID.widget.props.searchExpr = ['YHBatchName','MnemonicCode'];
        condition_BatchID.widget.events.onOpened = e => {
            let YHFarmerID = this.searchPanelModel.data['YHFarmerID'];
            if(YHFarmerID&&YHFarmerID!="0"){
                let filter = [['OldYHFarmerID','contains',YHFarmerID]];
                e.component.option('dataSource',this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName']
                }));
            }else{
                e.component.option('dataSource',this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: [['BatchCatalog','=',3]],
                    select: ['YHBatchID', 'YHBatchName']
                }));
            }
        };

        this.searchPanelModel.conditionItems.push(
            date,
            condition_YHFarmerID,
            condition_BatchID,
        );
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }
    reset(data) {
        let filter = [
            ['DataDate', '>=', new Date(new Date(data.date[0]).toLocaleDateString())],
            'and',
            [
                'DataDate',
                '<=',
                new Date(new Date(new Date(data.date[1]).getTime()).toLocaleDateString()),
            ],
        ];

        this.datasource.filter(filter);
        this.datasource.reload();
    }
    search(data) {
        let filter = [];
        if (data.date[0] && data.date[1]) {
            filter.push([
                ['DataDate', '>=', new Date(new Date(data.date[0]).toLocaleDateString())],
                'and',
                [
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(data.date[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (data.date[0]) {
                filter.push(['DataDate', '>=', new Date(new Date(data.date[0]).toLocaleDateString())]);
            }
            if (data.date[1]) {
                filter.push([
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(data.date[1]).getTime()).toLocaleDateString()),
                ]);
            }
        }
        if (data['YHFarmerID']&&data['YHFarmerID']!="0") {
            filter.push(['YHFarmerID', '=', data['YHFarmerID']]);
        }
        if (data['YHBatch']) {
            filter.push(['YHBatch', '=', data['YHBatch']]);
        }
        if (filter.length > 0) {
            this.datasource.filter(filter);
        } else {
            this.datasource.filter('');
        }
        this.datasource.reload();
    }

    //#endregion

    //#region 审核
    rangeReview(isReview: boolean) {
        this.permissionContext.getPermission().then((code) => {
            const permission = new PermissionService();
            permission.refresh(code);
            if (permission.$$manager) {
                // 有主管权限
                this.reviewFun(isReview)
            } else if (permission.$$audit) {
                // 有审核权限
                this.reviewFun(isReview, this.tokenService.getTokenData.user_id)
            } else {
                this.toolbarInstance.error(this.translator.I18N.reviewComponent.batchReview.noPermission);
            }
        });

    }

    reviewFun(isReview: boolean, user?: string) {
        let isReviewed = [];
        let notReviewed = []
        let idObj = {}
        let checkable = false
        this.listInstance.getSelectedRowsData().map((m) => {
            if (!idObj[m.NumericalOrder]) {
                idObj[m.NumericalOrder] = true
                if (user && (!isReview) && m.CheckedByID !== user) {//需要根据单据字段来确定
                    checkable = true
                }
                if (m['AuditName']) {//需要根据单据字段来确定
                    isReviewed.push(m.NumericalOrder)
                } else {
                    notReviewed.push(m.NumericalOrder)
                }
            }
        });
        if (checkable) {
            this.toolbarInstance.error(this.translator.I18N.reviewComponent.batchReview.notReview);
            return
        }
        let tip = ''
        if (isReview) {
            tip = this.translator.I18N.reviewComponent.batchReview.confirmText.replace(
                '{0}',
                `<strong>${this.listInstance.getSelectedRowsData().length}</strong>`
            )
        } else {
            tip = this.translator.I18N.reviewComponent.batchReview.cancelText.replace(
                '{0}',
                `<strong>${this.listInstance.getSelectedRowsData().length}</strong>`
            )
        }
        MessageBox.confirm(tip)
            .then((require) => {

                if (require) {
                    let arr = isReview ? notReviewed : isReviewed

                    if (arr.length == 0) {
                        if (isReview) {
                            this.toolbarInstance.success(
                                this.translator.I18N.reviewComponent.batchReview.allReviewedTip
                            );

                        } else {
                            this.toolbarInstance.success(
                                this.translator.I18N.reviewComponent.batchReview.allNotReviewedTip
                            );
                        }
                        return
                    }
                    this.http
                        .post(environment.review.batchReviewOperate, {
                            // 流水号
                            NumericalOrder: arr,
                            // 菜单ID
                            ReviweType: USER_INFO_CONTEXT.menuId,
                            // 审核级次
                            Level: this.review.levelOrder.indexOf(PermissionCodes.Audit) + 1,
                            // 权限
                            CheckMark: PermissionCodes.Audit,
                            // 审核人
                            CheckedByID: this.tokenService.getTokenData.user_id,
                            IsAdd: isReview, //this.reviewer.IsAdd, true or false
                            Source: environment.review.source,
                            "Sync":{
                                "KeyMode":"none",
                                "Enable":true,
                                "MasterApp":1
                            }
                            // RecordID: this.reviewer.RecordID,
                        })
                        .toPromise()
                        .then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            if (response.status) {

                                let msg = ''
                                if (isReview) {
                                    if (isReviewed.length > 0) {
                                        msg = this.translator.I18N.reviewComponent.batchReview.successTip.replace(
                                            '{0}',
                                            `${notReviewed.length}`
                                        )

                                    } else {
                                        msg = this.translator.I18N.reviewComponent.batchReview.allReviewed
                                    }

                                } else {
                                    if (notReviewed.length > 0) {
                                        msg = this.translator.I18N.reviewComponent.batchReview.success.replace(
                                            '{0}',
                                            `${isReviewed.length}`
                                        )

                                    } else {
                                        msg = this.translator.I18N.reviewComponent.batchReview.allCancel
                                    }

                                }
                                this.toolbarInstance.success(
                                    msg
                                );
                                this.listInstance.dataGrid.instance.refresh();
                                this.listInstance.dataGrid.instance.clearSelection();
                            } else {
                                this.toolbarInstance.error(`${response.message}`);
                            }
                        })
                        .catch((e) => {
                            const message = ResponseError.handler(e);
                            this.toolbarInstance.error(message);
                        });
                }
            });
    }
    //#endregion
}
