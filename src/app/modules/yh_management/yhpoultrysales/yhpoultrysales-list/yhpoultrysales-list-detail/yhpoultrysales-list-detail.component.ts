import { Component, NgModule, Input } from '@angular/core';
import { DxTextBoxModule, DxDataGridModule, DxButtonModule, DxTabPanelModule, DxPopupModule, DxFormModule, DxRadioGroupModule, DxSelectBoxModule, DxLoadPanelModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { YHPoultrySalesRoutingModule } from '../../yhpoultrysales.routing';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxHeaderSearchPanelModule } from 'src/app/components/header-search-panel/header-search-panel.component';
import { GridViewModule } from 'src/app/components/grid-view';
import { EditorGridModule } from 'src/app/components/editor-grid';
import { ViewContainerModule } from 'src/app/components/view-container/view-container.component';
import { UploadViewModule } from 'src/app/components/upload-view/upload-view.module';
import { NxExcelImportModule } from 'src/app/nxin/ui/basic_component/excel-import/excel-import.component';
import { PrintPageModule } from 'nxin-print';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { ViewChild } from '@angular/core';
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
import { DataDictionary } from 'src/app/providers/enums';
import { QlwODataContext, BasicSettingODataContext, QlwCustomerContext, PermissionContext } from 'src/app/providers/odataContext';
import { YHPoultrySalesService } from '../../yhpoultrysales.service';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services/auth.service';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { Router } from '@angular/router';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { INxExcelImportComponent, NxExcelImportComponent } from 'src/app/nxin/ui/extensions/basic/excel_import';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';
import { NxDropDownButton, NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';
import { NxReview } from 'src/app/components/review/review.extend';

@Component({
    selector: 'yhpoultrysales-list-detail',
    templateUrl: './yhpoultrysales-list-detail.component.html',
    styleUrls: ['./yhpoultrysales-list-detail.component.scss'],
})
export class YHPoultrSalesListDetailComponent  {
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
    @ViewChild('excel', { static: false })
    excelImport: INxExcelImportComponent;
    excelModel: NxExcelImportComponent;
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
    constructor(
        private tokenService: TokenAuthService,
        private http: HttpClient,
        private router: Router,
        private service: YHPoultrySalesService,
        private BasicSettingODataContext: BasicSettingODataContext,
        private qlwODataContext: QlwODataContext,
        private importService: QlwImportTemplateService,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private permissionContext: PermissionContext,
    ) {
        this.init_data_grid().init_toolbar_panel().init_search_panel();
        this.excelModel = {
            title: this.importService.yhpoultrysales.title,
            xlsxTemplatePath: this.importService.yhpoultrysales.xlsxPath,
            jsonTemplatePath: this.importService.yhpoultrysales.jsonPath,
            importServer: this.importService.yhpoultrysales.server,
            onImportSuccess: (response) => {
                this.listInstance.dataGrid.instance.refresh();
            },
        };
    }
    //#region 初始化表格配置
    init_data_grid(): YHPoultrSalesListDetailComponent {
        this.dataGridModel.primaryKey = 'recordId';
        const now = new Date();
        this.dataGridModel.export.fileName = `${this.translator.I18N.YHPoultrySales.title
            }明细-${new DateTime().toString()}`;
        this.datasource = this.service.getListDetailDataSource();
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
        ];
        this.datasource.filter(filter);
        this.dataGridModel.props.dataSource = [];
        this.dataGridModel.props.columnAutoWidth = true;
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.commandColumn.deleteButton.visible = false;
        // this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'yhpoultrysales-list-detail';
        return this;
    }
    get columns() {
        //订单日期
        const col_dataDate = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySales.DataDate.text,
            'DataDate',
            'date',
        );
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;
        col_dataDate.props.fixed = true;
        col_dataDate.props.fixedPosition = "left";
        col_dataDate.props.alignment = "center";

        //单据号
        const col_numbericalorder = new NxDataGridColumn(
            this.translator.I18N.commonColumns.number.text,
            'Number',
            'string'
        );
        col_numbericalorder.props.allowHeaderFiltering = false;
        col_numbericalorder.props.fixed = true;
        col_numbericalorder.props.fixedPosition = "left";
        col_numbericalorder.props.alignment = "center";
        col_numbericalorder.props.sortOrder = 'desc';
        col_numbericalorder.props.sortIndex = 2;

        //客户
        const col_CustomerID = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySales.CustomerID.text,
            'CustomerID',
            'string'
        );
        col_CustomerID.props.allowHeaderFiltering = false;
        col_CustomerID.props.lookup.enabled = true;
        col_CustomerID.props.lookup.dataSource = this.qlwCustomerContext.getCustomerDataSource();
        col_CustomerID.props.lookup.valueExpr = 'CustomerId';
        col_CustomerID.props.lookup.displayExpr = 'CustomerName';
        col_CustomerID.props.fixed = true;
        col_CustomerID.props.fixedPosition = "left";
        col_CustomerID.props.alignment = "center";

        //销售日期
        const col_ReqDeliveryDate = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySales.ReqDeliveryDate.text,
            'ReqDeliveryDate',
            'date',
        );
        col_ReqDeliveryDate.props.format = 'yyyy/MM/dd';
        col_ReqDeliveryDate.props.filterOperations = ['between', '='];
        col_ReqDeliveryDate.props.selectedFilterOperation = 'between';
        col_ReqDeliveryDate.props.allowHeaderFiltering = false;
        col_ReqDeliveryDate.props.alignment = "center";

        //时段
        const col_SalesPeriod = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySales.SalesPeriod.text,
            'SalesPeriod',
            'number'
        );
        col_SalesPeriod.props.allowHeaderFiltering = false;
        col_SalesPeriod.props.lookup.enabled = true;
        col_SalesPeriod.props.lookup.dataSource = [
            { value: 1, name: '上午' },
            { value: 2, name: '下午' },
        ];
        col_SalesPeriod.props.lookup.valueExpr = 'value';
        col_SalesPeriod.props.lookup.displayExpr = 'name';
        col_SalesPeriod.props.alignment = "center";



        //部门
        const col_MarketID = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySales.MarketID.text,
            'MarketID',
            'string'
        );
        col_MarketID.props.allowHeaderFiltering = false;
        col_MarketID.props.lookup.enabled = true;
        col_MarketID.props.lookup.dataSource = this.qlwCustomerContext.getBizMarketDataSource({
            filter: [['IsUse', '=', 1]],
            select: ['MarketId', 'MarketName'],
        });
        col_MarketID.props.lookup.valueExpr = 'MarketId';
        col_MarketID.props.lookup.displayExpr = 'MarketName';
        col_MarketID.props.alignment = "center";

        //业务员
        const col_SalesmanID = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySales.SalesManID.text,
            'SalesManID',
            'string'
        );
        col_SalesmanID.props.allowHeaderFiltering = false;
        col_SalesmanID.props.lookup.enabled = true;
        col_SalesmanID.props.lookup.dataSource = this.qlwODataContext.getQlWPersonOData();
        col_SalesmanID.props.lookup.valueExpr = 'PersonID';
        col_SalesmanID.props.lookup.displayExpr = 'PersonName';
        col_SalesmanID.props.alignment = "center";

        //制单人
        const col_createdOwner = new NxDataGridColumn(
            this.translator.I18N.commonColumns.producer.text,
            'CreatedOwnerName',
            'string',
        );
        col_createdOwner.props.allowHeaderFiltering = false;
        col_createdOwner.props.alignment = "center";

        //修改人
        const col_owner = new NxDataGridColumn(
            this.translator.I18N.commonColumns.ownerName.text,
            'OwnerName',
            'string',
        );
        col_owner.props.allowHeaderFiltering = false;
        col_owner.props.alignment = "center";

        //创建时间
        const col_create_date = new NxDataGridColumn(
            this.translator.I18N.commonColumns.createdDate.text,
            'CreatedDate',
            'date'
        );
        //col_create_date.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_create_date.props.format = 'yyyy/MM/dd';
        col_create_date.props.calculateDisplayValue = (row) => {
            return new DateTime(row.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
        };
        col_create_date.props.filterOperations = ['between', '='];
        col_create_date.props.selectedFilterOperation = 'between';
        col_create_date.props.alignment = "center";
        col_create_date.props.sortOrder = 'desc';
        col_create_date.props.sortIndex = 1;

        //修改时间
        const col_modify_date = new NxDataGridColumn(
            this.translator.I18N.commonColumns.modifiedDate.text,
            'ModifiedDate',
            'date'
        );
        //col_modify_date.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_modify_date.props.format = 'yyyy/MM/dd';
        col_modify_date.props.calculateDisplayValue = (row) => {
            return new DateTime(row.ModifiedDate).toString('yyyy/MM/dd HH:mm:ss');
        };
        col_modify_date.props.filterOperations = ['between', '='];
        col_modify_date.props.selectedFilterOperation = 'between';
        col_modify_date.props.alignment = "center";

        //审核
        const col_auditer = new NxDataGridColumn(
            this.translator.I18N.commandOptions.examine.text,
            'CheckedByID',
            'string'
        );
        col_auditer.props.calculateDisplayValue = (row) => {
            return row.CheckedByID ? true : false;
        }
        col_auditer.props.trueText = "已审核";
        col_auditer.props.falseText = "未审核";
        col_auditer.props.dataType = "boolean";
        col_auditer.props.alignment = "center";

        //审核时间
        const col_AuditerDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.AuditDate.text,
            'CheckedDate',
            'datetime'
        );
        col_AuditerDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_AuditerDate.props.alignment = "center";
        col_AuditerDate.props.filterOperations = ['between', '='];
        col_AuditerDate.props.selectedFilterOperation = 'between';
        col_AuditerDate.props.alignment = "center";

        const col_remarks = new NxDataGridColumn(
            '表头备注',
            'Remarks',
            'string'
        );
        // col_remarks.props.visible = true;
        col_remarks.props.filterOperations = ['contains'];

        //过磅完成
        const col_WeightStatus = new NxDataGridColumn(
            "过磅完成",
            'WeightStatus',
            'boolean'
        );
        col_WeightStatus.props.trueText = "已过磅";
        col_WeightStatus.props.falseText = "未过磅";
        col_WeightStatus.props.dataType = "boolean";
        col_WeightStatus.props.alignment = "center";

        const col_SerialNo = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.SerialNo.text,
            'SerialNo',
            'number'
        );
        col_SerialNo.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_SerialNo.props.selectedFilterOperation = 'between';
        col_SerialNo.props.allowHeaderFiltering = false;
        col_SerialNo.props.alignment = 'right';
        col_SerialNo.props.sortOrder = 'asc';
        col_SerialNo.props.sortIndex = 3;

        const col_ProductName = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.ProductID.text,
            'ProductName',
            'string'
        );
        col_ProductName.props.filterOperations = ['contains',"="];
        col_ProductName.props.allowHeaderFiltering = false;

        const col_SexType = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.SexType.text,
            'SexTypeName',
            'string'
        );
        col_SexType.props.filterOperations = ['contains',"="];
        col_SexType.props.allowHeaderFiltering = false;

        const col_PoultrySalesRankName = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.PoultrySalesRank.text,
            'PoultrySalesRankName',
            'string'
        );
        col_PoultrySalesRankName.props.filterOperations = ['contains',"="];
        col_PoultrySalesRankName.props.allowHeaderFiltering = false;

        const col_BreedingName = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.BreedingID.text,
            'BreedingName',
            'string'
        );
        col_BreedingName.props.filterOperations = ['contains',"="];
        col_BreedingName.props.allowHeaderFiltering = false;

        //只数
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.Quantity.text,
            'Quantity',
            'number'
        );
        col_Quantity.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Quantity.props.selectedFilterOperation = 'between';
        col_Quantity.props.visible = true;
        col_Quantity.props.requiredDisable = false;
        col_Quantity.props.allowHeaderFiltering = false;
        col_Quantity.props.alignment = "right";

        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string'
        );
        col_MeasureUnitName.props.filterOperations = ['contains',"="];
        col_MeasureUnitName.props.allowHeaderFiltering = false;

        const col_UnitPrice = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.UnitPrice.text,
            'UnitPrice',
            'number'
        );
        col_UnitPrice.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_UnitPrice.props.selectedFilterOperation = 'between';
        col_UnitPrice.props.visible = true;
        col_UnitPrice.props.requiredDisable = false;
        col_UnitPrice.props.allowHeaderFiltering = false;
        col_UnitPrice.props.alignment = "right";

        const col_RemarksDetail = new NxDataGridColumn(
            '明细备注',
            'RemarksDetail',
            'string'
        );
        col_RemarksDetail.props.filterOperations = ['contains',"="];
        col_RemarksDetail.props.allowHeaderFiltering = false;

        return [
            col_dataDate,
            col_numbericalorder,
            col_CustomerID,
            col_ReqDeliveryDate,
            col_SalesPeriod,
            col_SalesmanID,
            col_MarketID,
            col_SerialNo,
            col_ProductName,
            col_SexType,
            col_PoultrySalesRankName,
            col_BreedingName,
            col_Quantity,
            col_MeasureUnitName,
            col_UnitPrice,
            col_RemarksDetail,
            col_remarks,
            col_createdOwner,
            col_create_date,
            col_owner,
            col_modify_date,
            col_auditer,
            col_AuditerDate,
            col_WeightStatus
        ];
    }
    delete(rowData) {
        this.service
            .delete(rowData.data.NumericalOrder)
            .then((result: Result) => {
                const res = ResponseSuccess.handle(result);
                if (res.status) {
                    this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                    this.listInstance.dataGrid.instance.clearSelection();
                    this.listInstance.dataGrid.instance.refresh();
                } else {
                    this.toolbarInstance.error(`${res.message}`);
                    // Notify.toast(res.message, NotifyType.Error);
                }
            })
            .catch((e) => {
                const message = ResponseError.handler(e);
                this.toolbarInstance.error(message);
                // Notify.toast(message, NotifyType.Error);
            });
    }
    edit(rowData) {
        this.listInstance.yheditToDetail(
            '/yhpoultrysales/detail',
            rowData.rowIndex,
            this.translator.I18N.YHPoultrySales.editPageTitle,
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
    init_toolbar_panel(): YHPoultrSalesListDetailComponent {
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeDelete')).props.visible = false; //隐藏删除按钮
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeReview')).props.visible = false; //隐藏审核按钮
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('review')).props.visible = true;
        // this.toolbarPanelModel.checkInfo.visible = false;
        // this.toolbarPanelModel.moreButton.props.visible = false;
        this.toolbarPanelModel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('filterRow').events.onClick = this.toogleFilterRow.bind(this);

        (<NxDropDownButton>this.toolbarPanelModel.getWidgetByKey('review')).events.onButtonClick = (e) => {
            this.rangeReview(true)
        };
        (<NxDropDownButton>this.toolbarPanelModel.getWidgetByKey('review')).events.onItemClick = (e) => {
            this.rangeReview(false)
        };
        this.toolbarPanelModel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.YHPoultrySales.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.commonColumns.number.text, 'Number'),
                new ColumnSetting(this.translator.I18N.YHPoultrySales.CustomerID.text, 'CustomerID'),
                new ColumnSetting(this.translator.I18N.YHPoultrySales.ReqDeliveryDate.text, 'ReqDeliveryDate'),
                new ColumnSetting(this.translator.I18N.YHPoultrySales.SalesPeriod.text, 'SalesPeriod'),
                new ColumnSetting(this.translator.I18N.YHPoultrySales.SalesManID.text, 'SalesManID'),
                new ColumnSetting(this.translator.I18N.YHPoultrySales.MarketID.text, 'MarketID'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.SerialNo.text,'SerialNo'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.ProductID.text,'ProductName'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.SexType.text,'SexTypeName'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.PoultrySalesRank.text,'PoultrySalesRankName'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.BreedingID.text,'BreedingName'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.Quantity.text, 'Quantity'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.MeasureUnitName.text, 'MeasureUnitName'),
                new ColumnSetting(this.translator.I18N.YHPoultrySalesDetail.UnitPrice.text,'UnitPrice'),
                new ColumnSetting('明细备注','RemarksDetail'),
                new ColumnSetting('表头备注', 'Remarks'),
                new ColumnSetting(this.translator.I18N.commonColumns.createdOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commonColumns.createdDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commonColumns.ownerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commonColumns.modifiedDate.text, 'ModifiedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.examine.text, 'CheckedByID'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditDate.text, 'CheckedDate'),
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
                this.export();
            }
            if (e.type == 'import') {
                this.excelImport.show();
            }
        };
        // 设置隐藏列缓存
        this.toolbarPanelModel.storageKey = 'yhpoultrysales-list-detail-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanelModel.storageKey));
        this.dataGridModel.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });
        return this;
    }
    export() {
        if (this.listInstance.getSelectedRowsData().length > 0) {
            this.listInstance.dataGrid.instance.exportToExcel(true);
        } else {
            this.listInstance.dataGrid.instance.exportToExcel(false);
        }
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
            '/yhpoultrysales/detail',
            this.translator.I18N.YHPoultrySales.createPageTitle
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
        this.searchPanelModel.data['DataDate'] = [new Date(), new Date()];
        this.searchPanelModel.data['ReqDeliveryDate'] = [];

        //订单日期
        let date = new NxConditionItem();
        date.label = this.translator.I18N.YHPoultrySales.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;

        //客户
        const condition_CustomerID = new NxConditionItem();
        condition_CustomerID.label = this.translator.I18N.YHPoultrySales.CustomerID.text;
        condition_CustomerID.type = 'SelectBox';
        condition_CustomerID.dataField = 'CustomerID';
        condition_CustomerID.widget = new NxSelectBox();
        condition_CustomerID.widget.props.dataSource = this.qlwCustomerContext.getCustomerDataSource({
            select: ['CustomerId', 'CustomerName'],
        });
        condition_CustomerID.widget.props.valueExpr = 'CustomerId';
        condition_CustomerID.widget.props.displayExpr = 'CustomerName';

        //要求交货日期
        const ReqDeliveryDate = new NxConditionItem();
        ReqDeliveryDate.label = this.translator.I18N.YHPoultrySales.ReqDeliveryDate.text;
        ReqDeliveryDate.type = 'StartEndDateBox';
        ReqDeliveryDate.dataField = 'ReqDeliveryDate';
        ReqDeliveryDate.widget = new NxDateBox();
        ReqDeliveryDate.widget.props.showClearButton = true;

        //业务员
        const condition_SalesManID = new NxConditionItem();
        condition_SalesManID.label = this.translator.I18N.YHPoultrySales.SalesManID.text;
        condition_SalesManID.type = 'SelectBox';
        condition_SalesManID.dataField = 'SalesManID';
        condition_SalesManID.widget = new NxSelectBox();
        condition_SalesManID.widget.props.dataSource = this.qlwODataContext.getQlWPersonOData();
        condition_SalesManID.widget.props.valueExpr = 'PersonID';
        condition_SalesManID.widget.props.displayExpr = 'PersonName';

        //部门
        const condition_MarketID = new NxConditionItem();
        condition_MarketID.label = this.translator.I18N.YHPoultrySales.MarketID.text;
        condition_MarketID.type = 'SelectBox';
        condition_MarketID.dataField = 'MarketID';
        condition_MarketID.widget = new NxSelectBox();
        condition_MarketID.widget.props.dataSource = this.qlwCustomerContext.getBizMarketDataSource();
        condition_MarketID.widget.props.valueExpr = 'MarketId';
        condition_MarketID.widget.props.displayExpr = 'MarketName';

        //单据号
        const condition_Number = new NxConditionItem();
        condition_Number.label = this.translator.I18N.YHPoultrySales.Number.text;
        condition_Number.type = 'TextBox';
        condition_Number.dataField = 'Number';
        condition_Number.widget = new NxTextBox();


        // const condition_Abstract = new NxConditionItem();
        // condition_Abstract.label = this.translator.I18N.yhpoultrysales.Abstract.text;
        // condition_Abstract.type = 'SelectBox';
        // condition_Abstract.dataField = 'Abstract';
        // condition_Abstract.widget = new NxSelectBox();
        // condition_Abstract.widget.props.dataSource = this.BasicSettingODataContext.getBizDataDictDataSource({
        //     filter: [['Pid', '=', DataDictionary.SalesAbstract]],
        //     select: ['DictId', 'DictName'],
        // });
        // condition_Abstract.widget.props.valueExpr = 'DictId';
        // condition_Abstract.widget.props.displayExpr = 'DictName';

        this.searchPanelModel.conditionItems.push(date, condition_CustomerID, ReqDeliveryDate, condition_SalesManID, condition_MarketID, condition_Number);
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }

    TitleClick(e) {
        // if (e.itemData.title == '') {
        // } else {
        // }
    }

    reset(data) {
        let filter = [
            ['DataDate', '>=', new Date(new Date(data.DataDate[0]).toLocaleDateString())],
            'and',
            [
                'DataDate',
                '<=',
                new Date(new Date(new Date(data.DataDate[1]).getTime()).toLocaleDateString()),
            ],
        ];

        this.datasource.filter(filter);
        this.datasource.reload();
    }

    search(data) {
        console.log("data", data);
        let filter = [];
        //订单日期
        if (data.DataDate[0] && data.DataDate[1]) {
            filter.push([
                ['DataDate', '>=', new Date(new Date(data.DataDate[0]).toLocaleDateString())],
                'and',
                [
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(data.DataDate[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (data.DataDate[0]) {
                filter.push(['DataDate', '>=', new Date(new Date(data.DataDate[0]).toLocaleDateString())]);
            }
            if (data.DataDate[1]) {
                filter.push([
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(data.DataDate[1]).getTime()).toLocaleDateString()),
                ]);
            }
        }

        //客户
        if (data['CustomerID']) {
            filter.push(['CustomerID', '=', data['CustomerID']]);
        }

        //交货日期
        if (data.ReqDeliveryDate[0] && data.ReqDeliveryDate[1]) {
            filter.push([
                ['ReqDeliveryDate', '>=', new Date(new Date(data.ReqDeliveryDate[0]).toLocaleDateString())],
                'and',
                [
                    'ReqDeliveryDate',
                    '<=',
                    new Date(new Date(new Date(data.ReqDeliveryDate[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (data.ReqDeliveryDate[0]) {
                filter.push(['ReqDeliveryDate', '>=', new Date(new Date(data.ReqDeliveryDate[0]).toLocaleDateString())]);
            }
            if (data.ReqDeliveryDate[1]) {
                filter.push([
                    'ReqDeliveryDate',
                    '<=',
                    new Date(new Date(new Date(data.ReqDeliveryDate[1]).getTime()).toLocaleDateString()),
                ]);
            }
        }

        //业务员
        if (data['SalesManID']) {
            filter.push(['SalesManID', '=', data['SalesManID']]);
        }

        //部门
        if (data['MarketID']) {
            filter.push(['MarketID', '=', data['MarketID']]);
        }

        //单据号
        if (data['Number']) {
            filter.push(['Number', 'contains', data['Number']]);
        }

        if (filter.length > 0) {
            this.datasource.filter(filter);
        } else {
            this.datasource.filter('');
        }

        // this.datasource.reload();
        this.datasource
            .reload()
            .then((result) => {
                this.searchPanelModel.searchButton.props.disabled = false;
            })
            .catch((e) => {
                this.searchPanelModel.searchButton.props.disabled = false;
            });
            this.dataGridModel.props.dataSource = this.datasource;
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
                if (m['CheckedByID']) {//需要根据单据字段来确定
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
        MessageBox.confirm(tip).then((require) => {

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
                this.http.post(environment.review.batchReviewOperate, {
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
                    "Sync": {
                        "KeyMode": "none",
                        "Enable": true,
                        "MasterApp": 1
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
        YHPoultrySalesRoutingModule,
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
    exports: [YHPoultrSalesListDetailComponent],
    declarations: [YHPoultrSalesListDetailComponent],
})
export class YHPoultrSalesListDetailModule {}
