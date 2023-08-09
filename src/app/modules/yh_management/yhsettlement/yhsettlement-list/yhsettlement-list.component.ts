import { Component, ViewChild } from '@angular/core';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import {
    BasicSettingODataContext,
    QlwCustomerContext,
    QlwODataContext,
    YHProductionODataContext,
    YHBasicSettingODataContext,
    PermissionContext,
} from 'src/app/providers/odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { DataDictionary, FormOptions } from 'src/app/providers/enums';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { yhsettlementService } from '../yhsettlement.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { TokenAuthService } from 'src/app/shared/services';
import { DataSourceParamters } from 'src/app/providers/odataContext/helper';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';

@Component({
    selector: 'app-yhsettlement-list',
    templateUrl: './yhsettlement-list.component.html',
    styleUrls: ['./yhsettlement-list.component.scss'],
})
export class yhsettlementListComponent {
    datasource: any = null;
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('toolbarInstance', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    toolbarPanel: NxToolbarPanel = new NxToolbarPanel('list');
    formList: NxDataGrid = new NxDataGrid('list');
    isDisplayReview: boolean = false;

    constructor(
        private service: yhsettlementService,
        private basicSettingODataContext: BasicSettingODataContext,
        private router: Router,
        private qlwOdataContext: QlwODataContext,
        private statusODataContext: StatusODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private translator: TranslateService,
        private tokenService: TokenAuthService,
        private qlwCustomerContext: QlwCustomerContext,
    ) {
        this.searchPanelModel.data['DataDate'] = [new Date(), new Date()];

        this.searchPanelModel.data['AccountMonth'] = [new Date(new Date().getFullYear(), 0), new Date()];

        this.init_data_grid();
        this.init_toolbar_panel();
        this.init_search_panel();
    }

    ngOnInit() {

    }

    //#region 初始化表格配置
    init_data_grid() {

        this.formList.primaryKey = 'NumericalOrder';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhsettlement-state-storing';
        this.formList.export.enabled = true;

        this.datasource = this.getListDataSource();
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        this.formList.events.onRowDblClick = this.edit.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.formList.commandColumn.editButton.onClick = this.edit.bind(this);
    }

    get columns() {
        //结算日期
        const col_DataDate = new NxDataGridColumn(
            this.translator.I18N.yhsettlementSetting.DataDate.text,
            'DataDate',
            'date',
        );
        col_DataDate.props.allowHeaderFiltering = false;
        col_DataDate.props.format = 'yyyy/MM/dd';
        col_DataDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.DataDate).toString('yyyy/MM/dd');
        }
        col_DataDate.props.alignment = 'center'
        //单据号
        const col_Number = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.Number.text, 'Number');
        col_Number.props.allowHeaderFiltering = false;
        col_Number.props.allowFiltering = false;
        col_Number.props.filterOperations = ['contains'];

        //养户名称
        const col_YhName = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.YhName.text, 'YHFarmerName');
        col_YhName.props.allowHeaderFiltering = false;
        col_YhName.props.allowFiltering = false;
        col_YhName.props.filterOperations = ['contains'];

        //养户批次
        const col_YHBatch = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.YHBatch.text, 'YHBatchName');
        col_YHBatch.props.allowHeaderFiltering = false;
        col_YHBatch.props.allowFiltering = false;
        col_YHBatch.props.filterOperations = ['contains'];

        //养户可提利润
        const col_FarmingCanProfit = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.FarmingCanProfit.text, 'FarmingCanProfit');
        col_FarmingCanProfit.props.allowHeaderFiltering = false;
        col_FarmingCanProfit.props.allowFiltering = false;
        col_FarmingCanProfit.props.filterOperations = ['contains'];
        col_FarmingCanProfit.props.alignment = 'center'

        //转入保证金
        const col_RollInMarginBalance = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.RollInMarginBalance.text, 'RollInMarginBalance');
        col_RollInMarginBalance.props.allowHeaderFiltering = false;
        col_RollInMarginBalance.props.allowFiltering = false;
        col_RollInMarginBalance.props.filterOperations = ['contains'];
        col_RollInMarginBalance.props.alignment = 'center'

        //账期月份
        const col_AccountMonth = new NxDataGridColumn(
            this.translator.I18N.yhsettlementSetting.AccountMonth.text,
            'AccountMonth',
            'date',
        );
        col_AccountMonth.props.allowHeaderFiltering = false;
        col_AccountMonth.props.format = 'yyyy/MM';
        col_AccountMonth.props.calculateDisplayValue = (row) => {
            return new DateTime(row.AccountMonth).toString('yyyy/MM');
        }
        col_AccountMonth.props.alignment = 'center'

        //管理员
        const col_PersonID = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.PersonID.text, 'PersonName');
        col_PersonID.props.allowHeaderFiltering = false;
        col_PersonID.props.allowFiltering = false;
        col_PersonID.props.filterOperations = ['contains'];
        col_PersonID.props.alignment = 'center'

        //养殖价格方案
        const col_FarmingPriceID = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.FarmingPriceID.text, 'FarmingPriceNumber');
        col_FarmingPriceID.props.allowHeaderFiltering = false;
        col_FarmingPriceID.props.allowFiltering = false;
        col_FarmingPriceID.props.filterOperations = ['contains'];

        //养殖合同编号
        const col_YHFarmerContract = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.YHFarmerContract.text, 'ContractNo');
        col_YHFarmerContract.props.allowHeaderFiltering = false;
        col_YHFarmerContract.props.allowFiltering = false;
        col_YHFarmerContract.props.filterOperations = ['contains'];

        //养户批次序号
        const col_SerialNo = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.SerialNo.text, 'SerialNo');
        col_SerialNo.props.allowHeaderFiltering = false;
        col_SerialNo.props.allowFiltering = false;
        col_SerialNo.props.filterOperations = ['contains'];
        col_SerialNo.props.alignment = 'center';

        //养殖场
        const col_ChickenFarmID = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.ChickenFarmID.text, 'ChickenFarmName');
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.allowFiltering = false;
        col_ChickenFarmID.props.filterOperations = ['contains'];

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.yhsettlementSetting.Remarks.text, 'Remarks');
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = false;
        col_Remarks.props.filterOperations = ['contains'];

        //修改人
        const col_CreatedOwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedOwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_CreatedOwnerName.props.filterOperations = ['contains', "="];
        col_CreatedOwnerName.props.allowHeaderFiltering = false;
        col_CreatedOwnerName.props.alignment = 'center'

        // 创建时间
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
        col_CreatedDate.props.alignment = 'center';
        col_CreatedDate.props.sortOrder = 'desc';
        col_CreatedDate.props.sortIndex = 1;

        //养户确认
        const col_ConfirmStatus = new NxDataGridColumn(
            '养户确认',
            'ConfirmStatus',
            'string',
        );
        col_ConfirmStatus.props.filterOperations = ['contains', "="];
        col_ConfirmStatus.props.allowHeaderFiltering = false;
        col_ConfirmStatus.props.alignment = 'center';
        col_ConfirmStatus.props.trueText = "是";
        col_ConfirmStatus.props.falseText = "否";
        col_ConfirmStatus.props.dataType = "boolean";
        col_ConfirmStatus.props.allowHeaderFiltering = false;

        //养户确认时间
        const col_ConfirmDate = new NxDataGridColumn(
            '养户确认时间',
            'ConfirmDate',
            'date',
        );
        col_ConfirmDate.props.allowHeaderFiltering = false;
        col_ConfirmDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_ConfirmDate.props.filterOperations = ['between', '='];
        col_ConfirmDate.props.selectedFilterOperation = 'between';
        col_ConfirmDate.props.alignment = 'center';
        col_ConfirmDate.props.sortOrder = 'desc';
        col_ConfirmDate.props.sortIndex = 1;

        //制单人
        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains', "="];
        col_OwnerName.props.allowHeaderFiltering = false;
        col_OwnerName.props.alignment = 'center';

        // 修改时间
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
        col_AuditDate.props.format = 'yyyy/MM/dd';
        col_AuditDate.props.calculateDisplayValue = (row) => {
            if (row.AuditDate) {
                return new DateTime(row.AuditDate).toString('yyyy/MM/dd HH:mm:ss');
            }
            else {
                return (row.AuditDate = null);
            }
        };
        col_AuditDate.props.filterOperations = ['between', '='];
        col_AuditDate.props.selectedFilterOperation = 'between';
        col_AuditDate.props.alignment = 'center';

        const col_IsCheck = new NxDataGridColumn(
            this.translator.I18N.commandOptions.IsCheck.text,
            'IsCheck',
            'string'
        );
        col_IsCheck.props.trueText = "已审核";
        col_IsCheck.props.falseText = "未审核";
        col_IsCheck.props.dataType = "boolean";
        col_IsCheck.props.allowHeaderFiltering = false;
        col_IsCheck.props.alignment = 'center';

        return [
            col_DataDate,
            col_Number,
            col_YhName,
            col_YHBatch,
            col_FarmingCanProfit,
            col_RollInMarginBalance,
            col_PersonID,
            col_FarmingPriceID,
            col_YHFarmerContract,
            col_SerialNo,
            col_ChickenFarmID,
            col_AccountMonth,
            col_Remarks,
            col_ConfirmStatus,
            col_ConfirmDate,
            col_OwnerName,
            col_CreatedDate,
            col_CreatedOwnerName,
            col_ModifiedDate,
            col_IsCheck,
            col_AuditDate
        ];
    }

    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }

    create() {
        // let createTitle = this.translator.I18N.yhsettlementSetting.create + this.service.PoultryFarmDisplayText;
        this.formListInstance.yhcreateToDetail('/yhsettlement/detail', this.translator.I18N.yhsettlementSetting.create);
    }

    edit(rowData) {
        let editTitle = this.translator.I18N.yhsettlementSetting.edit;
        this.formListInstance.yheditToDetail(
            '/yhsettlement/detail',
            rowData.rowIndex,
            editTitle,
            {
                // 审核接口需要
                mode: 'edit',
                numericalOrder: rowData.data.NumericalOrder,
            }
        );
    }
    delete(rowData) {
        this.service.delete(rowData.data.NumericalOrder).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`${this.translator.I18N.yhsettlementSetting.delete + response.message}`);
                this.formListInstance.dataGrid.instance.refresh();
            } else {
                Notify.toast(response.message, NotifyType.Error);
                // this.toolbarInstance.error(`${response.message}`);
            }
        });
    }

    //#endregion

    //#region 工具条配置

    init_toolbar_panel() {
        (<NxButton>this.toolbarPanel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).events.onClick = this.rangeDelete.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('review')).props.visible = false;
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).props.visible = false;
        this.toolbarPanel.checkInfo.visible = false;
        this.toolbarPanel.moreButton.props.visible = false;
        this.toolbarPanel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('filterRow').events.onClick = this.toggleFilterRow.bind(this);
        this.toolbarPanel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.Number.text, 'Number'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.YhName.text, 'YhName'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.YHBatch.text, 'YHBatch'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.FarmingCanProfit.text, 'FarmingCanProfit'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.RollInMarginBalance.text, 'RollInMarginBalance'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.AccountMonth.text, 'AccountMonth'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.PersonID.text, 'PersonID'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.FarmingPriceID.text, 'FarmingPriceID'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.YHFarmerContract.text, 'YHFarmerContract'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.SerialNo.text, 'SerialNo'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.ChickenFarmID.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.yhsettlementSetting.Remarks.text, 'Remarks'),
                new ColumnSetting('养户确认', 'ConfirmStatus'),
                new ColumnSetting('养户确认时间', 'ConfirmDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.IsCheck.text, 'IsCheck'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditDate.text, 'AuditDate'),
            ]
        );
        this.toolbarPanel.onColumnSetting = (hiding, dataField) => {
            for (let index = 0; index < this.formList.columns.length; index++) {
                const col = this.formList.columns[index];
                if (col.props.dataField == dataField) {
                    this.formListInstance.model.columns[index].props.visible = hiding;
                    break;
                }
            }
        };
        // 设置隐藏列缓存
        this.toolbarPanel.storageKey = 'yhsettlement-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanel.storageKey));
        this.formList.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });

    }

    export() {
        if (this.formListInstance.getSelectedRowsData().length > 0) {
            this.formListInstance.dataGrid.instance.exportToExcel(true);
        } else {
            this.formListInstance.dataGrid.instance.exportToExcel(false);
        }
    }

    columnchooser() {
        this.toolbarInstance.model.columnSettingDisabled = !this.toolbarInstance.model.columnSettingDisabled;
    }

    refresh() {
        this.formListInstance.dataGrid.instance.refresh();
    }

    toggleFilterRow() {
        this.formListInstance.toggleFilterRow();
    }

    rangeDelete() {
        const deleteKeys = [];
        this.formListInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({ numericalOrder: m.numericalOrder });
        });
        MessageBox.confirm(`您确认要删除这 <strong>${deleteKeys.length}</strong> 项吗?`).then((require) => {
            if (require) {
                this.service.deleteList(deleteKeys).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        this.toolbarInstance.success(`删除${response.message}`);
                        this.formListInstance.dataGrid.instance.refresh();
                    } else {
                        this.toolbarInstance.error(`${response.message}`);
                    }
                });
            }
        });
    }

    //#endregion

    //#region 搜索面板

    init_search_panel() {
        //结算日期

        let date = new NxConditionItem();
        date.label = this.translator.I18N.yhsettlementSetting.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        //养户名称
        const condition_YHFarmerName = new NxConditionItem();
        condition_YHFarmerName.label = this.translator.I18N.YHBatch.YHFarmerName.text;
        condition_YHFarmerName.type = 'SelectBox';
        condition_YHFarmerName.dataField = 'YHFarmerID';
        condition_YHFarmerName.widget = new NxSelectBox();
        condition_YHFarmerName.widget.props.showClearButton = true;
        condition_YHFarmerName.widget.props.dataSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource()
        condition_YHFarmerName.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerName.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerName.widget.props.searchExpr = ['YHFarmerID', 'YHFarmerName', 'Phone', 'YHPersonName', 'MnemonicCode']

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhChickenReceive.YHBatch.text;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.dataSource = this.yhBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName', 'MnemonicCode'];
        condition_YHBatch.widget.events.onOpened = e => {
            let YHFarmerID = this.searchPanelModel.data['YHFarmerID'];
            if (YHFarmerID && YHFarmerID != "0") {
                let filter = [['OldYHFarmerID', 'contains', YHFarmerID]];
                e.component.option('dataSource', this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName']
                }));
            } else {
                e.component.option('dataSource', this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: [['BatchCatalog', '=', 3]],
                    select: ['YHBatchID', 'YHBatchName']
                }));
            }
        };

        //账期月份
        const condition_AccountMonth = new NxConditionItem();
        condition_AccountMonth.label = this.translator.I18N.yhsettlementSetting.AccountMonth.text;
        condition_AccountMonth.type = 'StartEndDateBox';
        condition_AccountMonth.dataField = 'AccountMonth';
        condition_AccountMonth.format = 'yyyy-MM';
        condition_AccountMonth.placeHolder = ['开始月份', '结束月份'];
        condition_AccountMonth.widget = new NxDateBox();
        condition_AccountMonth.widget.props.showClearButton = true;
        condition_AccountMonth.widget.props.max = new Date();

        //养殖价格方案
        const condition_FarmingPrice = new NxConditionItem();
        condition_FarmingPrice.label = this.translator.I18N.yhsettlementSetting.FarmingPriceID.text;
        condition_FarmingPrice.dataField = 'FarmingPriceID';
        condition_FarmingPrice.type = 'SelectBox';
        condition_FarmingPrice.widget = new NxSelectBox();
        condition_FarmingPrice.widget.props.dataSource = this.yhProductionODataContext.getFarmingPriceProposalsListDataSource();
        condition_FarmingPrice.widget.props.valueExpr = 'NumericalOrder';
        condition_FarmingPrice.widget.props.displayExpr = 'Number';

        //单据号
        const condition_Number = new NxConditionItem();
        condition_Number.label = this.translator.I18N.yhsettlementSetting.Number.text;
        condition_Number.type = 'TextBox';
        condition_Number.dataField = 'Number';
        condition_Number.widget = new NxTextBox();
        condition_Number.widget.props.showClearButton = true;

        this.searchPanelModel.conditionItems.push(
            date,
            condition_YHFarmerName,
            condition_YHBatch,
            condition_AccountMonth,
            condition_FarmingPrice,
            condition_Number
        );
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }

    private getFliter() {

        let filter = []
        if (this.searchPanelModel.data['DataDate'] && this.searchPanelModel.data['DataDate'][0] && this.searchPanelModel.data['DataDate'][1]) {
            filter.push([
                ['DataDate', '>=', new Date(new Date(this.searchPanelModel.data['DataDate'][0]).toLocaleDateString())],
                'and',
                [
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(this.searchPanelModel.data['DataDate'][1]).getTime()).toLocaleDateString()),
                ],
            ]);
        }

        return filter;
    }

    reset(data) {
        let filter = this.getFliter();
        if (filter.length > 0) {
            this.datasource.filter(filter);

        } else {
            this.datasource.filter('');
        }
        this.datasource.reload();
    }

    /**
     * 获取列表/详情数据源
     * @param ComboPack 套餐
     */
    getListDataSource(): DataSource {
        let filter = this.getFliter();
        console.log(filter, 'filter')
        return new DataSource({
            store: this.service.store,
            filter: filter.length > 0 ? filter : '',
        });
    }

    search(data) {
        let filter = this.getFliter();

        if (data['YHFarmerID']) {
            filter.push(['YHFarmerID', '=', data['YHFarmerID']]);
        }
        if (data['YHBatch']) {
            filter.push(['YHBatch', '=', data['YHBatch']]);
        }
        if (data['AccountMonth'] && data['AccountMonth'][0] && data['AccountMonth'][1]) {
            filter.push([
                ['AccountMonth', '>=', new Date(new Date(new DateTime(data['AccountMonth'][0].toString()).toString('yyyy-MM') + '-01').toLocaleDateString())],
                'and',
                [
                    'AccountMonth',
                    '<=',
                    new Date(new Date(new DateTime(data['AccountMonth'][1].toString()).toString('yyyy-MM') + '-01').toLocaleDateString()),
                ],
            ]);
        }
        if (data['FarmingPriceID']) {
            filter.push(['FarmingPriceID', '=', data['FarmingPriceID']]);
        }
        if (data['Number']) {
            filter.push(['Number', 'contains', data['Number']]);
        }


        if (filter.length > 0) {
            this.datasource.filter(filter);

        } else {
            this.datasource.filter('');
        }

        this.datasource.reload();
    }

    //#endregion
}
