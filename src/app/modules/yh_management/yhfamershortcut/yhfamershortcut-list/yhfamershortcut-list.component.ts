import { Component, ViewChild } from '@angular/core';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import {
    BasicSettingODataContext,
    QlwODataContext,
    QlwCustomerContext
} from 'src/app/providers/odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { DataDictionary, FormOptions } from 'src/app/providers/enums';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { yhfamershortcutService } from '../yhfamershortcut.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { TokenAuthService } from 'src/app/shared/services';
import { DataSourceParamters } from 'src/app/providers/odataContext/helper';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';

@Component({
    selector: 'app-yhfamershortcut-list',
    templateUrl: './yhfamershortcut-list.component.html',
    styleUrls: ['./yhfamershortcut-list.component.scss'],
})
export class yhfamershortcutListComponent {
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
        private service: yhfamershortcutService,
        private basicSettingODataContext: BasicSettingODataContext,
        private router: Router,
        private qlwOdataContext: QlwODataContext,
        private statusODataContext: StatusODataContext,
        private translator: TranslateService,
        private tokenService: TokenAuthService,
        private qlwCustomerContext: QlwCustomerContext,
    ) {
        this.init_data_grid();
        this.init_toolbar_panel();
        this.init_search_panel();
    }

    ngOnInit() { 
        
    }

    //#region 初始化表格配置
    init_data_grid() {
        
        this.formList.primaryKey = 'ChickenFarmID';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhfamershortcut-state-storing';
        this.formList.export.enabled = true;

        this.datasource = this.getListDataSource();
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        this.formList.events.onRowDblClick = this.edit.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.formList.commandColumn.deleteButton.text = '禁用';
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.formList.commandColumn.editButton.onClick = this.edit.bind(this);
    }

    get columns() {
        //养户名称
        const col_YhName = new NxDataGridColumn(this.translator.I18N.YHFamerShortcutSetting.YhName.text, 'YhName');
        col_YhName.props.allowHeaderFiltering = false;
        col_YhName.props.allowFiltering = false;
        col_YhName.props.filterOperations = ['contains'];
        //姓名
        const col_province = new NxDataGridColumn('姓名', 'province');
        col_province.props.allowHeaderFiltering = false;
        col_province.props.allowFiltering = false;
        col_province.props.filterOperations = ['contains'];
        //手机号
        const col_city = new NxDataGridColumn('手机号', 'city');
        col_city.props.allowHeaderFiltering = false;
        col_city.props.allowFiltering = false;
        col_city.props.filterOperations = ['contains'];
        //身份证号
        const col_area = new NxDataGridColumn('身份证号', 'area');
        col_area.props.allowHeaderFiltering = false;
        col_area.props.allowFiltering = false;
        col_area.props.filterOperations = ['contains'];
        //家庭住址
        const col_FullAddress = new NxDataGridColumn('家庭住址', 'FullAddress');
        col_FullAddress.props.filterOperations = ['contains'];
        //性别
        const col_HenHouseID = new NxDataGridColumn('性别', 'HenHouseID');
        col_HenHouseID.props.allowHeaderFiltering = false;
        col_HenHouseID.props.allowFiltering = false;
        col_HenHouseID.props.filterOperations = ['contains'];
        //助记码
        const col_iCount = new NxDataGridColumn('助记码', 'iCount');
        col_iCount.props.allowHeaderFiltering = false;
        col_iCount.props.allowFiltering = false;
        col_iCount.props.filterOperations = ['contains'];

        //部门
        const col_MarketName = new NxDataGridColumn(this.translator.I18N.YHFamerShortcutSetting.MarketName.text, 'MarketID');
        col_MarketName.props.allowHeaderFiltering = true;
        col_MarketName.props.lookup.enabled = true;
        col_MarketName.props.allowSorting = false;
        col_MarketName.props.lookup.dataSource = this.qlwCustomerContext.getBizMarketDataSource({
            filter: [
                ['IsUse', '=', 1],
                ['isEnd', '=', 1],
            ],
            select: ['MarketId', 'MarketName',],
        });
        col_MarketName.props.lookup.valueExpr = 'MarketId';
        col_MarketName.props.lookup.displayExpr = 'MarketName';

        //合作日期
        const col_StartDate = new NxDataGridColumn(
            this.translator.I18N.YHFamerShortcutSetting.StartDate.text,
            'StartDate',
            'date',
        );
        col_StartDate.props.allowHeaderFiltering = false;
        col_StartDate.props.format = 'yyyy/MM/dd';
        col_StartDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
        }

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHFamerShortcutSetting.Remarks.text, 'Remarks');
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = false;
        col_Remarks.props.filterOperations = ['contains'];

        //修改人
        const col_CreatedOwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedOwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_CreatedOwnerName.props.filterOperations = ['contains',"="];
        col_CreatedOwnerName.props.allowHeaderFiltering = false;
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
        //制单人
        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
        col_OwnerName.props.allowHeaderFiltering = false;

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

        //状态
        const col_Status = new NxDataGridColumn(this.translator.I18N.breedingSetting.Status.text, 'Status');
        col_Status.props.trueText = this.translator.I18N.breedingSetting.Status.trueText;
        col_Status.props.falseText = this.translator.I18N.breedingSetting.Status.falseText;
        col_Status.props.dataType = 'boolean';

        return [
            col_YhName,
            col_province,
            col_city,
            col_area,
            col_FullAddress,
            col_HenHouseID,
            col_iCount,
            col_MarketName,
            col_StartDate,
            col_Remarks,
            col_OwnerName,
            col_CreatedDate,
            col_CreatedOwnerName,
            col_ModifiedDate,
            col_Status
        ];
    }

    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }

    create() {
        let createTitle = this.translator.I18N.YHFamerShortcutSetting.create + this.service.PoultryFarmDisplayText;
        this.formListInstance.yhcreateToDetail('/yhfamershortcut/detail', createTitle);
    }

    edit(rowData) {
        let editTitle = this.translator.I18N.YHFamerShortcutSetting.edit + this.service.PoultryFarmDisplayText;
        this.formListInstance.yheditToDetail(
            '/yhfamershortcut/detail',
            rowData.rowIndex,
            editTitle,
            {
                ChickenFarmID: rowData.data.ChickenFarmID,
            }
        );
    }
    delete(rowData) {
        this.service.deleteList([{ ChickenFarmID: rowData.data.ChickenFarmID }]).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`${this.translator.I18N.YHFamerShortcutSetting.delete + response.message}`);
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
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.YhName.text, 'YhName'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.province.text, 'province'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.city.text, 'city'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.area.text, 'area'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.FullAddress.text, 'FullAddress'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.HenHouseID.text, 'HenHouseID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.iCount.text, 'iCount'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.AreaSize.text, 'AreaSize'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.WarehouseID.text, 'WarehouseID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.FeedWarehouseID.text, 'FeedWarehouseID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.DrugWarehouseID.text, 'DrugWarehouseID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.ChickenFarmType.text, 'ChickenFarmType'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.PersonId.text, 'PersonID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.MarketName.text, 'MarketID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.AreaID.text, 'AreaID'),
                new ColumnSetting(this.translator.I18N.YHFamerShortcutSetting.StartDate.text, 'StartDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
                new ColumnSetting(this.translator.I18N.breedingSetting.Status.text, 'Status'),
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
        this.toolbarPanel.storageKey = 'yhfamershortcut-columns-storage';
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
            deleteKeys.push({ ChickenFarmID: m.ChickenFarmID });
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

        // const condition_type = new NxConditionItem();
        // condition_type.label = '养殖场名称';
        // condition_type.type = 'SelectBox';
        // condition_type.dataField = 'ChickenFarmID';
        // condition_type.widget = new NxSelectBox();

        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.label = '养殖场名称';
        condition_ChickenFarmID.type = 'TextBox';
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.widget = new NxTextBox();
        condition_ChickenFarmID.widget.props.showClearButton = true;

        this.searchPanelModel.conditionItems.push(condition_ChickenFarmID);
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }

    private getFliter() {
        var arr = []
        if (this.service.PoultryFarmType == DataDictionary.FarmTypeA) {
            arr = CHICKEN_FARM_CONTEXT.BreedingFarmFilterCondition;
        } else {
            arr = CHICKEN_FARM_CONTEXT.HatcheryFarmFilterCondition;
        }

        let filter = [
            arr,
            [['ComboPack', '=', this.service.comboPack]]
        ];
        
        return filter;
    }

    reset(data) {
        let filter = this.getFliter();
        this.datasource.filter(filter);
        console.log(this.datasource._items,'这啥');
        this.datasource.reload();
    }

    /**
     * 获取列表/详情数据源
     * @param ComboPack 套餐
     */
    getListDataSource(): DataSource {
        let filter = this.getFliter();
        return new DataSource({
            store: this.service.store,
            filter: filter,
        });
    }

    search(data) {
        let filter = this.getFliter();
        if (data['ChickenFarmID']) {
            filter.push(['ChickenFarmID', '=', data['ChickenFarmID']]);
        }
        if (data['PersonID']) {
            filter.push(['PersonID', '=', data['PersonID']]);
        }
        if (filter.length > 0) {
            this.datasource.filter(filter);
            
        } else {
            this.datasource.filter('');
        }
        console.log(this.datasource._items,'???/')
        this.datasource.reload();
    }

    //#endregion
}
