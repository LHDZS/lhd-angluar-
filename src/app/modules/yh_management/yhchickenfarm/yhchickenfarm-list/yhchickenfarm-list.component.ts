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
import { yhchickenfarmService } from '../yhchickenfarm.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { TokenAuthService } from 'src/app/shared/services';
import { DataSourceParamters } from 'src/app/providers/odataContext/helper';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { INxExcelImportComponent, NxExcelImportComponent } from 'src/app/nxin/ui/extensions/basic/excel_import';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';
import { NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';


@Component({
    selector: 'app-yhchickenfarm-list',
    templateUrl: './yhchickenfarm-list.component.html',
    styleUrls: ['./yhchickenfarm-list.component.scss'],
})
export class yhchickenfarmListComponent {
    datasource: any = null;
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('toolbarInstance', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    toolbarPanel: NxToolbarPanel = new NxToolbarPanel('list');
    formList: NxDataGrid = new NxDataGrid('list');
    isDisplayReview: boolean = false;
    @ViewChild('excel', { static: false })
    excelImport: INxExcelImportComponent;
    excelModel: NxExcelImportComponent;
    constructor(
        private service: yhchickenfarmService,
        private basicSettingODataContext: BasicSettingODataContext,
        private router: Router,
        private qlwOdataContext: QlwODataContext,
        private statusODataContext: StatusODataContext,
        private translator: TranslateService,
        private tokenService: TokenAuthService,
        private qlwCustomerContext: QlwCustomerContext,
        private importService: QlwImportTemplateService,
    ) {
        this.init_data_grid();
        this.init_toolbar_panel();
        this.init_search_panel();
        this.excelModel = {
            title: this.importService.yhchickenfarm.title,
            xlsxTemplatePath: this.importService.yhchickenfarm.xlsxPath,
            jsonTemplatePath: this.importService.yhchickenfarm.jsonPath,
            importServer: this.importService.yhchickenfarm.server,
            onImportSuccess: (response) => {
                this.formListInstance.dataGrid.instance.refresh();
            },
        };
    }

    ngOnInit() {

    }

    //#region 初始化表格配置
    init_data_grid() {

        this.formList.primaryKey = 'ChickenFarmName';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhchickenfarm-state-storing';
        this.formList.export.enabled = true;

        this.datasource = this.getListDataSource();
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        this.formList.events.onRowDblClick = this.edit.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.formList.commandColumn.deleteButton.text = '设置';
        this.formList.commandColumn.deleteButton.confirmText = '确定要设置当前单据状态';
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.formList.commandColumn.editButton.onClick = this.edit.bind(this);
    }

    get columns() {
        //农场编码
        // const col_ChickenFarmNumer = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.ChickenFarmNumer.short, 'ChickenFarmNumer');
        // col_ChickenFarmNumer.props.allowHeaderFiltering = false;
        // col_ChickenFarmNumer.props.allowFiltering = false;
        // col_ChickenFarmNumer.props.filterOperations = ['contains'];
        //养殖场名称
        const col_chickenFarmName = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.ChickenFarmName.text, 'ChickenFarmName');
        col_chickenFarmName.props.allowHeaderFiltering = false;
        col_chickenFarmName.props.allowFiltering = false;
        col_chickenFarmName.props.filterOperations = ['contains'];
        col_chickenFarmName.props.fixed = true;
        //区域
        const col_CoordinateAddr = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.CoordinateAddr.text, 'AreaName');
        col_CoordinateAddr.props.allowHeaderFiltering = false;
        col_CoordinateAddr.props.allowFiltering = false;
        col_CoordinateAddr.props.filterOperations = ['contains'];
        col_CoordinateAddr.props.fixed = true;
        //详细地址
        const col_FullAddress = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.FullAddress.text, 'FullAddress');
        col_FullAddress.props.filterOperations = ['contains'];
        //栋数
        const col_HenHouseID = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.HenHouseID.text, 'HenhouseCount');
        col_HenHouseID.props.allowHeaderFiltering = false;
        col_HenHouseID.props.allowFiltering = false;
        col_HenHouseID.props.filterOperations = ['contains'];
        //容量
        const col_iCount = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.iCount.text, 'iCount');
        col_iCount.props.allowHeaderFiltering = false;
        col_iCount.props.allowFiltering = false;
        col_iCount.props.filterOperations = ['contains'];
        col_iCount.props.alignment = 'right';
        //面积
        const col_AreaSize = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.AreaSize.text, 'AreaSize');
        col_AreaSize.props.allowHeaderFiltering = false;
        col_AreaSize.props.allowFiltering = false;
        col_AreaSize.props.filterOperations = ['contains'];
        col_AreaSize.props.alignment = 'right';
        //存栏仓库
        const col_WarehouseID = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.WarehouseID.text, 'WarehouseName');
        col_WarehouseID.props.allowHeaderFiltering = false;
        col_WarehouseID.props.allowFiltering = false;
        col_WarehouseID.props.filterOperations = ['contains'];
        //饲料仓库
        const col_FeedWarehouseID = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.FeedWarehouseID.text, 'FeedWarehouseName');
        col_FeedWarehouseID.props.allowHeaderFiltering = false;
        col_FeedWarehouseID.props.allowFiltering = false;
        col_FeedWarehouseID.props.filterOperations = ['contains'];
        //药杂仓库
        const col_DrugWarehouseID = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.DrugWarehouseID.text, 'DrugWarehouseName');
        col_DrugWarehouseID.props.allowHeaderFiltering = false;
        col_DrugWarehouseID.props.allowFiltering = false;
        col_DrugWarehouseID.props.filterOperations = ['contains'];
        //养殖场类型
        const col_ChickenFarmType = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.ChickenFarmType.text, 'YHFarmTypeName');
        col_ChickenFarmType.props.allowHeaderFiltering = false;
        col_ChickenFarmType.props.allowFiltering = false;
        col_ChickenFarmType.props.alignment = 'center';
        // col_ChickenFarmType.props.lookup.enabled = true;
        // col_ChickenFarmType.props.lookup.dataSource = this.statusODataContext.getChickenFarmTypeDataSource();
        // col_ChickenFarmType.props.filterOperations = ['contains'];
        // col_ChickenFarmType.props.lookup.valueExpr = 'value';
        // col_ChickenFarmType.props.lookup.displayExpr = 'name';

        // const col_chickenFarmShortName = new NxDataGridColumn(this.service.PoultryFarmDisplayText + this.translator.I18N.chickenYHFarmSetting.ChickenFarmShortName.short, 'ChickenFarmShortName');
        // col_chickenFarmShortName.props.filterOperations = ['contains'];

        //部门
        const col_MarketName = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.MarketName.text, 'MarketID');
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
        col_MarketName.props.alignment = 'center';

        //定位
        const col_AreaID = new NxDataGridColumn(this.translator.I18N.chickenYHFarmSetting.AreaID.text, 'Location');
        col_AreaID.props.allowHeaderFiltering = false;
        col_AreaID.props.allowFiltering = false;
        col_AreaID.props.filterOperations = ['contains'];
        // col_AreaID.props.lookup.enabled = true;
        // col_AreaID.props.lookup.dataSource = [
        //     {
        //         value: 0, name: '否'
        //     },{

        //     }
        // ];
        // col_AreaID.props.lookup.valueExpr = 'MarketId';
        // col_AreaID.props.lookup.displayExpr = 'MarketName';

        //合作日期
        const col_StartDate = new NxDataGridColumn(
            this.translator.I18N.chickenYHFarmSetting.StartDate.text,
            'StartDate'
        );
        col_StartDate.props.allowHeaderFiltering = false;
        col_StartDate.props.alignment = 'center';
        // col_StartDate.props.format = 'yyyy/MM/dd';
        // col_StartDate.props.calculateDisplayValue = (row) => {
        //     return new DateTime(row.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
        // }

        //修改人
        // const col_CreatedOwnerName = new NxDataGridColumn(
        //     this.translator.I18N.commandOptions.CreatedOwnerName.text,
        //     'CreatedOwnerName',
        //     'string',
        // );
        // col_CreatedOwnerName.props.filterOperations = ['contains',"="];
        // col_CreatedOwnerName.props.allowHeaderFiltering = false;
        //创建时间
        const col_CreatedDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedDate.text,
            'CreatedDate',
            'date',
        );
        col_CreatedDate.props.allowHeaderFiltering = false;
        col_CreatedDate.props.format = 'yyyy/MM/dd';
        col_CreatedDate.props.sortIndex = 1;
        col_CreatedDate.props.sortOrder = 'desc';
        col_CreatedDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
        };
        col_CreatedDate.props.filterOperations = ['between', '='];
        col_CreatedDate.props.selectedFilterOperation = 'between';
        col_CreatedDate.props.alignment = 'center';
        //制单人
        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
        col_OwnerName.props.allowHeaderFiltering = false;
        col_OwnerName.props.alignment = 'center';

        //修改时间
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

        //状态
        const col_Status = new NxDataGridColumn(this.translator.I18N.breedingSetting.Status.text, 'Status');
        col_Status.props.trueText = this.translator.I18N.breedingSetting.Status.trueText;
        col_Status.props.falseText = this.translator.I18N.breedingSetting.Status.falseText;
        col_Status.props.dataType = 'boolean';
        col_Status.props.alignment = 'center';

        return [
            col_chickenFarmName,
            col_CoordinateAddr,
            col_FullAddress,
            col_HenHouseID,
            col_iCount,
            col_AreaSize,
            col_WarehouseID,
            col_FeedWarehouseID,
            col_DrugWarehouseID,
            col_ChickenFarmType,
            col_MarketName,
            col_AreaID,
            col_StartDate,
            col_OwnerName,
            col_CreatedDate,
            // col_CreatedOwnerName,
            // col_ModifiedDate,
            col_Status
        ];
    }

    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }

    create() {
        let createTitle = this.translator.I18N.chickenYHFarmSetting.create + this.service.PoultryFarmDisplayText;
        this.formListInstance.yhcreateToDetail('/yhchickenfarm/detail', '养殖场设置-新增');
    }

    edit(rowData) {
        let editTitle = this.translator.I18N.chickenYHFarmSetting.edit + this.service.PoultryFarmDisplayText;
        this.formListInstance.yheditToDetail(
            '/yhchickenfarm/detail',
            rowData.rowIndex,
            '养殖场设置-编辑',
            {
                ChickenFarmID: rowData.data.ChickenFarmID,
            }
        );
    }
    delete(rowData) {
        // this.formList.commandColumn.deleteButton.text = '启用';
        let status:boolean = false;
        if (rowData.data.Status) {
            // this.formList.commandColumn.deleteButton.text = '停用';
            // this.formList.commandColumn.deleteButton.confirmText = '确定停用当前养殖场';
            status = false;
        } else {
            // this.formList.commandColumn.deleteButton.confirmText = '确定启用当前养殖场';
            // this.formList.commandColumn.deleteButton.text = '启用';
            status = true;
        }
        this.service.operation({ Status: status, ChickenFarmID: rowData.data.ChickenFarmID}).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`操作成功`);
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
        this.toolbarPanel.moreButton.props.visible = true;
        this.toolbarPanel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('filterRow').events.onClick = this.toggleFilterRow.bind(this);
        this.toolbarPanel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.ChickenFarmName.text, 'ChickenFarmName'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.CoordinateAddr.text, 'CoordinateAddr'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.FullAddress.text, 'FullAddress'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.HenHouseID.text, 'HenHouseID'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.iCount.text, 'iCount'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.AreaSize.text, 'AreaSize'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.WarehouseID.text, 'WarehouseID'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.FeedWarehouseID.text, 'FeedWarehouseID'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.DrugWarehouseID.text, 'DrugWarehouseID'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.ChickenFarmType.text, 'ChickenFarmType'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.MarketName.text, 'MarketID'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.AreaID.text, 'AreaID'),
                new ColumnSetting(this.translator.I18N.chickenYHFarmSetting.StartDate.text, 'StartDate'),
                // new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                // new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                // new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                // new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
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
        // this.toolbarPanel.moreButton.props.items.push(
        //     new NxDropDownButtonItem(this.translator.I18N.importComponent.text, 'import', 'iconfont iconimport')
        // );
        this.toolbarPanel.moreButton.events.onItemClick = (e) => {
            if (e.type == 'export') {
                this.export();
            }
            if (e.type == 'import') {
                this.excelImport.show();
            }
        };
        // 设置隐藏列缓存
        this.toolbarPanel.storageKey = 'yhchickenfarm-columns-storage';
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

        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.label = '养殖场名称';
        condition_ChickenFarmID.type = 'TextBox';
        condition_ChickenFarmID.dataField = 'ChickenFarmName';
        condition_ChickenFarmID.widget = new NxTextBox();
        condition_ChickenFarmID.widget.props.showClearButton = true;

        const condition_YHFarmType = new NxConditionItem();
        condition_YHFarmType.label = "养殖场类型";
        condition_YHFarmType.type = 'SelectBox';
        condition_YHFarmType.dataField = 'YHFarmType';
        condition_YHFarmType.widget = new NxSelectBox();
        condition_YHFarmType.widget.props.showClearButton = true;
        condition_YHFarmType.widget.props.disabled = false;
        condition_YHFarmType.widget.props.valueExpr = 'value';
        condition_YHFarmType.widget.props.displayExpr = 'name';
        condition_YHFarmType.widget.props.dataSource = this.statusODataContext.getFarmType();

        this.searchPanelModel.conditionItems.push(condition_ChickenFarmID);
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }

    private getFliter() {
        var arr = []
        // if (this.service.PoultryFarmType == DataDictionary.FarmTypeA) {
        //     arr = CHICKEN_FARM_CONTEXT.BreedingFarmFilterCondition;
        // } else {
        //     arr = CHICKEN_FARM_CONTEXT.HatcheryFarmFilterCondition;
        // }

        arr = CHICKEN_FARM_CONTEXT.YHFarmTypeCondition;

        let filter = [
            [['ComboPack', '=', this.service.comboPack]],
            arr
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

        if (data['ChickenFarmName']) {
            filter.push(['ChickenFarmName', '=', data['ChickenFarmName']]);
        }
        // if (data['YHFarmType']) {
        //     filter.push();
        // }
        if (filter.length > 0) {
            this.datasource.filter(filter);

        } else {
            this.datasource.filter('');
        }
        this.datasource.reload();
    }

    //#endregion
}
