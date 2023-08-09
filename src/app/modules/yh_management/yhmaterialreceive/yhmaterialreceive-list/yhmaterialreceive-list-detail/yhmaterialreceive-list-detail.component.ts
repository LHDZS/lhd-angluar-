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
import { QlwODataContext, BasicSettingODataContext,QlwCustomerContext, PermissionContext } from 'src/app/providers/odataContext';
import { YhMaterialReceiveService } from '../../yhmaterialreceive.service';
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
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';
import { INxExcelImportComponent, NxExcelImportComponent } from 'src/app/nxin/ui/extensions/basic/excel_import';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import {
    DxDataGridModule,
    DxFormModule,
    DxPopupModule,
    DxButtonModule,
    DxRadioGroupModule,
    DxSelectBoxModule,
    DxLoadPanelModule,
    DxTabPanelModule,
} from 'devextreme-angular';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { PrintPageModule } from 'nxin-print';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { YhMaterialReceiveRoutingModule } from '../../yhmaterialreceive.routing';

@Component({
    selector: 'yhmaterialreceive-list-detail',
    templateUrl: './yhmaterialreceive-list-detail.component.html',
    styleUrls: ['./yhmaterialreceive-list-detail.component.scss'],
})
export class YhMaterialReceiveListDetailComponent {
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
        private service: YhMaterialReceiveService,
        private permissionContext: PermissionContext,
        private qlwOdataContext: QlwODataContext,
        private basicSettingODataContext: BasicSettingODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private importService: QlwImportTemplateService,
    ) {
        this.init_data_grid().init_toolbar_panel().init_search_panel();
        this.excelModel = {
            title: this.importService.materialreceive.title,
            xlsxTemplatePath: this.importService.materialreceive.xlsxPath,
            jsonTemplatePath: this.importService.materialreceive.jsonPath,
            importServer: this.importService.materialreceive.server,
            onImportSuccess: (response) => {
                this.listInstance.dataGrid.instance.refresh();
            },
        };
    }
    //#region 初始化表格配置
    init_data_grid(): YhMaterialReceiveListDetailComponent {
        this.dataGridModel.primaryKey = 'NumericalOrder';
        const now = new Date();
        this.dataGridModel.export.fileName = `${
            this.translator.I18N.YhMaterialReceive.title
        }-${new DateTime().toString()}`;
        this.datasource = this.service.getListDetailDataSource();
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().setDate(new Date().getDate()+3)).toLocaleDateString())],
        ];
        this.datasource.filter(filter);
        this.dataGridModel.props.dataSource = this.datasource;
        this.dataGridModel.props.columnAutoWidth = true;
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.commandColumn.deleteButton.visible = false;
        // this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'YhMaterialReceive-list-detail';
        this.dataGridModel.props.remoteOperations = true;

        return this;
    }
    get columns() {
        const col_numbericalorder = new NxDataGridColumn(
            this.translator.I18N.commonColumns.number.text,
            'Number',
            'string'
        );
        col_numbericalorder.props.filterOperations = ['contains',"="];
        col_numbericalorder.props.allowHeaderFiltering = false;
        col_numbericalorder.props.sortOrder = 'desc';
        col_numbericalorder.props.sortIndex = 1;

        const col_dataDate = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.DataDate.text,
            'DataDate',
            'date',
            'DataDate'
        );
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;

        const col_YHFarmerID = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.YHFarmerID.text,
            'YHFarmerName',
            'string',
        );
        col_YHFarmerID.props.filterOperations = ['contains',"="];
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.alignment = 'center'
        // col_YHFarmerID.props.lookup.enabled = true;
        // col_YHFarmerID.props.lookup.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
        //     filter: [
        //         [ 'status', '=', true ]
        //     ]
        // })
        // col_YHFarmerID.props.lookup.valueExpr = 'YHFarmerID';
        // col_YHFarmerID.props.lookup.displayExpr = 'YHFarmerName';

        const col_YHBatch = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.YHBatch.text,
            'YHBatchName',
            'string'
        );
        col_YHBatch.props.filterOperations = ['contains',"="];
        col_YHBatch.props.allowHeaderFiltering = false;
        col_YHBatch.props.alignment = 'center'
        // col_YHBatch.props.lookup.enabled = true;
        // col_YHBatch.props.lookup.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        // col_YHBatch.props.lookup.valueExpr = 'YHBatchID';
        // col_YHBatch.props.lookup.displayExpr = 'YHBatchName';

        const col_Abstract = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.Abstract.text,
            'AbstractName',
            'string',
        );
        col_Abstract.props.filterOperations = ['contains',"="];
        col_Abstract.props.allowHeaderFiltering = false;
        col_Abstract.props.alignment = 'center'

        // col_Abstract.props.lookup.dataSource = this.basicSettingODataContext.getBizDataDictDataSource({
        //     filter: [[
        //         ['DictId', '=', DataDictionary.ChickenSourceA],
        //         'or',
        //         ['DictId', '=', DataDictionary.ChickenSourceB],
        //     ]],
        //     select: ['DictId', 'DictName'],
        // });
        // col_Abstract.props.lookup.valueExpr = 'DictId';
        // col_Abstract.props.lookup.displayExpr = 'DictName';

        const col_ReceiveType = new NxDataGridColumn(
            '类别',
            'ReceiveTypeName',
            'string',
        );
        col_ReceiveType.props.filterOperations = ['contains',"="];
        col_ReceiveType.props.allowHeaderFiltering = false;
        col_ReceiveType.props.alignment = 'center'

        const col_OutWarehouse = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.OutWarehouse.text,
            'OutWarehouseName',
            'string',
        );
        col_OutWarehouse.props.filterOperations = ['contains',"="];
        col_OutWarehouse.props.allowHeaderFiltering = false;
        col_OutWarehouse.props.alignment = 'center'

        const col_InWarehouse = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.InWarehouse.text,
            'InWarehouseName',
            'string',
        );
        col_InWarehouse.props.filterOperations = ['contains',"="];
        col_InWarehouse.props.allowHeaderFiltering = false;
        col_InWarehouse.props.alignment = 'center'


        const col_Driver = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.Driver.text,
            'DriverName',
            'string',
        );
        col_Driver.props.filterOperations = ['contains',"="];
        col_Driver.props.allowHeaderFiltering = false;
        col_Driver.props.alignment = 'center'


        const col_ChickenFarmID = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.ChickenFarmID.text,
            'ChickenFarmName',
            'string'
        );
        col_ChickenFarmID.props.filterOperations = ['contains',"="];
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.alignment = 'center'
        // col_ChickenFarmID.props.lookup.dataSource =  this.qlwCustomerContext.getSupplierDataSource();
        // col_ChickenFarmID.props.lookup.valueExpr = 'SupplierId';
        // col_ChickenFarmID.props.lookup.displayExpr = 'SupplierName';


        const col_ValueTotal = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.ValueQuantity.text,
            'ValueQuantity',
            'number',
        );
        col_ValueTotal.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_ValueTotal.props.selectedFilterOperation = 'between';
        col_ValueTotal.props.allowHeaderFiltering = false;
        col_ValueTotal.props.alignment = 'right'

        const col_CalcFeeStatus = new NxDataGridColumn(
            '计算运费',
            'CalcFeeStatus',
            'number',
        );
        col_CalcFeeStatus.props.lookup.enabled = true;
        col_CalcFeeStatus.props.lookup.dataSource = DataDictionarySource.blImmunitySource;
        col_CalcFeeStatus.props.lookup.valueExpr = 'value';
        col_CalcFeeStatus.props.lookup.displayExpr  = 'name';
        col_CalcFeeStatus.props.alignment = 'center'

        const col_ConfirmStatus = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceive.ConfirmStatus.text,
            'ConfirmStatus',
            'boolean',
        );
        // col_ConfirmStatus.props.allowHeaderFiltering = false;
        col_ConfirmStatus.props.lookup.enabled = true;
        col_ConfirmStatus.props.lookup.dataSource = DataDictionarySource.blImmunitySource;
        col_ConfirmStatus.props.lookup.valueExpr = 'value';
        col_ConfirmStatus.props.lookup.displayExpr  = 'name';
        col_ConfirmStatus.props.alignment = 'center'

        const col_isbegin = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceive.isbegin.text,
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
            '表头备注',
            'Remarks',
            'string',
        );
        col_remarks.props.filterOperations = ['contains',"="];
        col_remarks.props.allowHeaderFiltering = false;
        col_remarks.props.alignment = 'center'

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
        col_ModifiedDate.props.alignment = 'center';

        const col_AuditDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.AuditDate.text,
            'AuditDate',
            'date',
        );
        col_AuditDate.props.allowHeaderFiltering = false;
        col_AuditDate.props.alignment = 'center';
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

        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.ProductName.text,
            'ProductName',
            'string',
        );
        col_ProductID.props.filterOperations = ['contains',"="];
        col_ProductID.props.allowHeaderFiltering = false;
        col_ProductID.props.alignment = 'center'

        const col_Specification = new NxDataGridColumn(
            this.translator.I18N.EggGoodsSalesOrderDetail.Specification.text,
            'Specification',
            'string',
        );
        col_Specification.props.filterOperations = ['contains',"="];
        col_Specification.props.allowHeaderFiltering = false;
        col_Specification.props.alignment = 'center'
        
        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.Packages.text,
            'Packages',
            'number',
        );
        col_Packages.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Packages.props.selectedFilterOperation = 'between';
        col_Packages.props.allowHeaderFiltering = false;
        col_Packages.props.alignment = 'right';

        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.Quantity.text,
            'Quantity',
            'number',
        );
        col_Quantity.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Quantity.props.selectedFilterOperation = 'between';
        col_Quantity.props.allowHeaderFiltering = false;
        col_Quantity.props.alignment = 'right';

        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string',
        );
        col_MeasureUnitName.props.filterOperations = ['contains',"="];
        col_MeasureUnitName.props.allowHeaderFiltering = false;
        col_MeasureUnitName.props.alignment = 'center'

        const col_UnitPrice = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.UnitPrice.text,
            'UnitPrice',
            'number',
        );
        col_UnitPrice.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_UnitPrice.props.selectedFilterOperation = 'between';
        col_UnitPrice.props.allowHeaderFiltering = false;
        col_UnitPrice.props.alignment = 'right';

        const col_AmountTotal = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.AmountTotal.text,
            'AmountTotal',
            'number',
        );
        col_AmountTotal.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_AmountTotal.props.selectedFilterOperation = 'between';
        col_AmountTotal.props.allowHeaderFiltering = false;
        col_AmountTotal.props.alignment = 'right';

        const col_Gift = new NxDataGridColumn(
            this.translator.I18N.EggGoodsSalesOrderDetail.Gift.text,
            'Gift',
            'string'
        );
        col_Gift.props.trueText = "是";
        col_Gift.props.falseText = "否";
        col_Gift.props.dataType="boolean";
        col_Gift.props.allowHeaderFiltering = false;
        col_Gift.props.alignment = 'center'

        const col_HenhouseName = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.HenhouseID.text,
            'HenhouseName',
            'string',
        );
        col_HenhouseName.props.filterOperations = ['contains',"="];
        col_HenhouseName.props.allowHeaderFiltering = false;
        col_HenhouseName.props.alignment = 'center'

        const col_ProductBatchName = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.ProductBatchID.text,
            'ProductBatchName',
            'string',
        );
        col_ProductBatchName.props.filterOperations = ['contains',"="];
        col_ProductBatchName.props.allowHeaderFiltering = false;
        col_ProductBatchName.props.alignment = 'center'

        const col_DetailRemarks = new NxDataGridColumn(
            '明细备注',
            'DetailRemarks',
            'string',
        );
        col_DetailRemarks.props.filterOperations = ['contains',"="];
        col_DetailRemarks.props.allowHeaderFiltering = false;
        col_DetailRemarks.props.alignment = 'center'

        return [
            col_dataDate,
            col_numbericalorder,
            col_YHFarmerID,
            col_YHBatch,
            col_ProductID,
            col_Specification,
            col_Packages,
            col_Quantity,
            col_MeasureUnitName,
            col_UnitPrice,
            col_AmountTotal,
            col_Gift,
            col_HenhouseName,
            col_ProductBatchName,
            col_DetailRemarks,
            col_ChickenFarmID,
            col_Abstract,
            col_OutWarehouse,
            col_InWarehouse,
            col_ReceiveType,
            col_Driver,
            col_CalcFeeStatus,
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
            '/yhmaterialreceive/detail',
            rowData.rowIndex,
            this.translator.I18N.YhMaterialReceive.editPageTitle,
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
    init_toolbar_panel(): YhMaterialReceiveListDetailComponent {
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
                new ColumnSetting(this.translator.I18N.commonColumns.number.text, 'Number'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.YHFarmerID.text, 'YHFarmerID'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.YHBatch.text, 'YHBatch'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.ProductName.text, 'ProductName'),
                new ColumnSetting(this.translator.I18N.EggGoodsSalesOrderDetail.Specification.text, 'Specification'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.Packages.text, 'Packages'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.Quantity.text, 'Quantity'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.MeasureUnitName.text, 'MeasureUnitName'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.UnitPrice.text, 'UnitPrice'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.AmountTotal.text, 'AmountTotal'),
                new ColumnSetting(this.translator.I18N.EggGoodsSalesOrderDetail.Gift.text, 'Gift'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.HenhouseID.text, 'HenhouseName'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceiveDetail.ProductBatchID.text, 'ProductBatchName'),
                new ColumnSetting('明细备注', 'DetailRemarks'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.ChickenFarmID.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.Abstract.text, 'Abstract'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.OutWarehouse.text, 'OutWarehouse'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.InWarehouse.text, 'InWarehouse'),
                new ColumnSetting('类别', 'ReceiveType'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.Driver.text, 'Driver'),
                new ColumnSetting('计算运费', 'CalcFeeStatus'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.ConfirmStatus.text, 'ConfirmStatus'),
                new ColumnSetting(this.translator.I18N.YhMaterialReceive.isbegin.text, 'isbegin'),
                new ColumnSetting('表头备注', 'Remarks'),
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
        this.toolbarPanelModel.storageKey = 'YhMaterialReceive-list-detail-storage';
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
            '/yhmaterialreceive/detail',
            this.translator.I18N.YhMaterialReceive.createPageTitle
        );
    }
    rangeDelete() {
        const deleteKeys = [];
        this.listInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({ NumericalOrder: m.NumericalOrder, NumericalOrderDetail: m.NumericalOrderDetail });
        });
        if (deleteKeys.length <= 0) {
            Notify.toast(this.translator.I18N.commandOptions.delete.emptyMessage, NotifyType.Warning);
            return false;
        }
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirmFormat.replace(
                '{0}',
                `<strong>${deleteKeys.length}</strong>`
            )
        ).then((require) => {
            if (require) {
                this.service
                    .delete(deleteKeys)
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
        });
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
        date.label = this.translator.I18N.YhMaterialReceive.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'date';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        // const condition_SupplierId = new NxConditionItem();
        // condition_SupplierId.label = this.translator.I18N.YhMaterialReceive.SupplierID.text;
        // condition_SupplierId.type = 'SelectBox';
        // condition_SupplierId.dataField = 'SupplierID';
        // condition_SupplierId.widget = new NxSelectBox();
        // condition_SupplierId.widget.props.disabled = false;
        // condition_SupplierId.widget.props.dataSource = this.qlwCustomerContext.getSupplierDataSource({
        //     //filter: [['IsUse', '=', true]],
        // });
        // condition_SupplierId.widget.props.valueExpr = 'SupplierId';
        // condition_SupplierId.widget.props.displayExpr = 'SupplierName';

        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YhMaterialReceive.YHFarmerID.text;
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource()
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']


        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhMaterialReceive.YHBatch.text;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName','MnemonicCode'];
        condition_YHBatch.widget.events.onOpened = e => {
            let YHFarmerID = this.searchPanelModel.data['YHFarmerID'];
            if(YHFarmerID&&YHFarmerID!="0"){
                let filter = [['OldYHFarmerID','contains',YHFarmerID]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName']
                }));
            }else{
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: [['BatchCatalog','=',3]],
                    select: ['YHBatchID', 'YHBatchName']
                }));
            }
        };

        // const condition_Audit = new NxConditionItem();
        // condition_Audit.label = this.translator.I18N.commandOptions.IsCheck.text;
        // condition_Audit.type = 'SelectBox';
        // condition_Audit.dataField = 'IsCheck';
        // condition_Audit.widget = new NxSelectBox();
        // condition_Audit.widget.props.showClearButton = true;
        // condition_Audit.widget.props.valueExpr = 'ID';
        // condition_Audit.widget.props.displayExpr = 'Name';
        // condition_Audit.widget.props.dataSource = DataDictionarySource.AuditSource;

        // const condition_Number = new NxConditionItem();
        // condition_Number.label = this.translator.I18N.commonColumns.number.text;
        // condition_Number.type = 'TextBox';
        // condition_Number.dataField = 'Number';
        // condition_Number.widget = new NxTextBox();
        // condition_Number.widget.props.showClearButton = true;


        this.searchPanelModel.conditionItems.push(
            date,
            // condition_SupplierId,
            condition_YHFarmerID,
            condition_YHBatch,

            // condition_Audit,
            // condition_Number
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
        // if (data['BatchID']) {
        //     filter.push(['BatchID', '=', data['BatchID']]);
        // }
        // if (data['Number']) {

        //     filter.push(['Number', 'contains', data['Number']]);
        // }
        // if (data['IsCheck']&&data['IsCheck']!="1") {
        //     if(data['IsCheck']=="3"){
        //         filter.push(['IsCheck', '=', true]);
        //     }
        //     else{
        //         filter.push(['IsCheck', '=', false]);
        //     }
        // }

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
@NgModule({
    imports: [CommonModule,
        YhMaterialReceiveRoutingModule,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        DxTabPanelModule,
        NxFormListModule,
        NxFormDetailModule,
        DxPopupModule,
        DxDataGridModule,
        DxFormModule,
        DxPopupModule,
        DxButtonModule,
        DxRadioGroupModule,
        NxHeaderSearchPanelModule,
        DxSelectBoxModule,
        GridViewModule,
        EditorGridModule,
        ViewContainerModule,
        UploadViewModule,
        DxLoadPanelModule,
        PrintPageModule,
        NxExcelImportModule,],
    exports: [YhMaterialReceiveListDetailComponent],
    declarations: [YhMaterialReceiveListDetailComponent],
})
export class YhMaterialReceiveListDetailModule {}