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
import { PatrolrecordService } from '../patrolrecord.service';
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

@Component({
    selector: 'patrolrecord',
    templateUrl: './patrolrecord-list.component.html',
    styleUrls: ['./patrolrecord-list.component.scss'],
})
export class PatrolrecordListComponent {
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
        private service: PatrolrecordService,
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
            title: this.importService.yhpatrolrecord.title,
            xlsxTemplatePath: this.importService.yhpatrolrecord.xlsxPath,
            jsonTemplatePath: this.importService.yhpatrolrecord.jsonPath,
            importServer: this.importService.yhpatrolrecord.server,
            onImportSuccess: (response) => {
                this.listInstance.dataGrid.instance.refresh();
            },
        };
    }
    //#region 初始化表格配置
    init_data_grid(): PatrolrecordListComponent {
        this.dataGridModel.primaryKey = 'NumericalOrder';
        const now = new Date();
        this.dataGridModel.export.fileName = `${
            this.translator.I18N.Patrolrecord.title
        }-${new DateTime().toString()}`;
        this.datasource = this.service.getListDataSource();
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
        ];
        this.datasource.filter(filter);
        this.dataGridModel.props.dataSource = this.datasource;
        this.dataGridModel.props.columnAutoWidth = true;
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.commandColumn.deleteButton.visible = true;
        this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'Patrolrecord-list';
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
            this.translator.I18N.Patrolrecord.DataDate.text,
            'DataDate',
            'date',
            'DataDate'
        );
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;

        const col_YHFarmerID = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.YHFarmerID.text,
            'YHFarmerName',
            'string',
        );
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.alignment = 'left'

        const col_YHBatch = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.YHBatch.text,
            'YHBatchName',
            'string'
        );
        col_YHBatch.props.allowHeaderFiltering = false;
        col_YHBatch.props.alignment = 'left'

        const col_ChickenFarmID = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.ChickenFarmID.text,
            'ChickenFarmName',
            'string'
        );
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.lookup.enabled = true;
        col_ChickenFarmID.props.allowHeaderFiltering = false;

        //栋舍
        const col_HenhouseID = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.HenhouseID.text,
            'HenhouseName',
            'string',
        );
        col_HenhouseID.props.allowHeaderFiltering = false;
        col_HenhouseID.props.lookup.enabled = true;
        col_HenhouseID.props.alignment = 'center'

        //管理员
        const col_PersonID = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.PersonID.text,
            'PersonID',
            'string',
        );
        col_PersonID.props.filterOperations = ['contains',"="];
        col_PersonID.props.allowHeaderFiltering = false;
        col_PersonID.props.lookup.enabled = true;
        col_PersonID.props.allowSorting = false;
        col_PersonID.props.lookup.dataSource = this.qlwOdataContext.getQlWPersonOData()
        col_PersonID.props.lookup.valueExpr = 'PersonID';
        col_PersonID.props.lookup.displayExpr = 'PersonName';
        col_PersonID.props.alignment = 'center'

        //最小日期
        const col_MinDateData = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.MinDateData.text,
            'MinDataDate',
            'date',
        );
        col_MinDateData.props.selectedFilterOperation = 'between';
        col_MinDateData.props.allowHeaderFiltering = false;
        col_MinDateData.props.alignment = 'right'

        //死亡只数
        const col_DeathQuantity = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.DeathQuantity.text,
            'DeathQuantity',
            'number',
        );
        col_DeathQuantity.props.allowHeaderFiltering = false;
        col_DeathQuantity.props.alignment = 'right'

        //淘汰只数
        const col_CullQuantity = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.CullQuantity.text,
            'CullQuantity',
            'number',
        );
        col_CullQuantity.props.allowHeaderFiltering = false;
        col_CullQuantity.props.alignment = 'right'

        //最大日期
        const col_MaxDateData = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.MaxDateData.text,
            'MaxDataDate',
            'date',
        );
        col_MaxDateData.props.allowHeaderFiltering = false;
        col_MaxDateData.props.lookup.enabled = true;
        col_MaxDateData.props.alignment = 'center'

        //饲喂件数
        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.Packages.text,
            'Packages',
            'number',
        );
        col_Packages.props.allowHeaderFiltering = false;
        col_Packages.props.lookup.enabled = true;
        col_Packages.props.alignment = 'right';

        //饲喂数量
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.Quantity.text,
            'Quantity',
            'string',
        );
        col_Quantity.props.filterOperations = ['contains',"="];
        col_Quantity.props.allowHeaderFiltering = false;
        col_Quantity.props.alignment = 'right'

        //存栏仓库
        const col_WarehouseID = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.WarehouseID.text,
            'WarehouseName',
            'number',
        );
        col_WarehouseID.props.selectedFilterOperation = 'between';
        col_WarehouseID.props.allowHeaderFiltering = false;
        col_WarehouseID.props.alignment = 'left'

        // 饲料仓库
        const col_FeedWarehouseID = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.FeedWarehouseID.text,
            'FeedWarehouseName',
            'string',
        );
        col_FeedWarehouseID.props.allowHeaderFiltering = false;
        col_FeedWarehouseID.props.alignment = 'left'


        const col_isbegin = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceive.isbegin.text,
            'isbegin',
            'boolean',
        );
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

        return [
            col_dataDate,
            col_numbericalorder,
            col_YHFarmerID,
            col_YHBatch,
            col_ChickenFarmID,
            col_HenhouseID,
            col_PersonID,
            col_MinDateData,
            col_DeathQuantity,
            col_CullQuantity,
            col_MaxDateData,
            col_Packages,
            col_Quantity,
            col_WarehouseID,
            col_FeedWarehouseID,
            col_isbegin,
            col_remarks,
            col_CreatedOwnerName,
            col_CreatedDate,
            col_OwnerName,
            col_ModifiedDate,
            col_IsCheck,
            col_AuditName,
            col_AuditDate,
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
            '/patrolrecord/detail',
            rowData.rowIndex,
            this.translator.I18N.Patrolrecord.editPageTitle,
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
    init_toolbar_panel(): PatrolrecordListComponent {
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
                new ColumnSetting(this.translator.I18N.Patrolrecord.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.YHFarmerID.text, 'YHFarmerID'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.YHBatch.text, 'YHBatch'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.ChickenFarmID.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.HenhouseID.text, 'HenhouseID'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.PersonID.text, 'PersonID'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.MinDateData.text, 'MinDateData'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.DeathQuantity.text, 'DeathQuantity'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.CullQuantity.text, 'CullQuantity'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.MaxDateData.text, 'MaxDateData'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.Packages.text, 'Packages'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.Quantity.text, 'Quantity'),
                new ColumnSetting(this.translator.I18N.Patrolrecord.isbegin.text, 'isbegin'),
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
        // this.toolbarPanelModel.storageKey = 'Patrolrecord-columns-storage';
        // const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanelModel.storageKey));
        // this.dataGridModel.columns.map((m) => {
        //     if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
        //         m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
        //     }
        // });
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
            '/patrolrecord/detail',
            this.translator.I18N.Patrolrecord.createPageTitle
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
        this.searchPanelModel.data['DataDate'] = [new Date(), new Date()];
        let date = new NxConditionItem();
        date.label = this.translator.I18N.Patrolrecord.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.Patrolrecord.YHFarmerID.text;
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource()
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']


        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.Patrolrecord.YHBatch.text;
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

        const DateDateDetail = new NxConditionItem();
        DateDateDetail.label = this.translator.I18N.Patrolrecord.DateDateDetail.text;
        DateDateDetail.type = 'StartEndDateBox';
        DateDateDetail.dataField = 'DateDateDetail';
        DateDateDetail.widget = new NxDateBox();
        DateDateDetail.widget.props.showClearButton = true;
        DateDateDetail.widget.props.max = new Date();

        const condition_PersonID = new NxConditionItem();
        condition_PersonID.label = this.translator.I18N.commandOptions.PersonID.text;
        condition_PersonID.type = 'SelectBox';
        condition_PersonID.dataField = 'PersonID';
        condition_PersonID.widget = new NxSelectBox();
        condition_PersonID.widget.props.showClearButton = true;
        condition_PersonID.widget.props.valueExpr = 'PersonID';
        condition_PersonID.widget.props.displayExpr = 'PersonName';
        condition_PersonID.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData();


        const condition_Number = new NxConditionItem();
        condition_Number.label = this.translator.I18N.commonColumns.number.text;
        condition_Number.type = 'TextBox';
        condition_Number.dataField = 'Number';
        condition_Number.widget = new NxTextBox();
        condition_Number.widget.props.showClearButton = true;


        this.searchPanelModel.conditionItems.push(
            date,
            condition_YHFarmerID,
            condition_YHBatch,
            DateDateDetail,
            condition_PersonID,
            condition_Number
        );
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
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
        let filter = [];
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
        if (data.DateDateDetail && data.DateDateDetail[0] && data.DateDateDetail[1]) {
            filter.push([
                ['MinDataDate', '>=', new Date(new Date(data.DateDateDetail[0]).toLocaleDateString())],
                'and',
                [
                    'MaxDataDate',
                    '<=',
                    new Date(new Date(new Date(data.DateDateDetail[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (data.DateDateDetail && data.DateDateDetail[0]) {
                filter.push(['MinDataDate', '>=', new Date(new Date(data.DateDateDetail[0]).toLocaleDateString())]);
            }
            if (data.DateDateDetail && data.DateDateDetail[1]) {
                filter.push([
                    'MaxDataDate',
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
        if (data['PersonID']) {
            filter.push(['PersonID', '=', data['PersonID']]);
        }
        if (data['Number']) {
            filter.push(['Number', 'contains', data['Number']]);
        }
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
