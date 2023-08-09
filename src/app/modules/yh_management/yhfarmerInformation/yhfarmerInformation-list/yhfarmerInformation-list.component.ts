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
import { yhfarmerInformationService } from '../yhfarmerInformation.service';
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
    selector: 'app-yhfarmerInformation-list',
    templateUrl: './yhfarmerInformation-list.component.html',
    styleUrls: ['./yhfarmerInformation-list.component.scss'],
})
export class yhfarmerInformationListComponent {
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
        private service: yhfarmerInformationService,
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
            title: this.importService.yhfarmerinfomation.title,
            xlsxTemplatePath: this.importService.yhfarmerinfomation.xlsxPath,
            jsonTemplatePath: this.importService.yhfarmerinfomation.jsonPath,
            importServer: this.importService.yhfarmerinfomation.server,
            onImportSuccess: (response) => {
                this.formListInstance.dataGrid.instance.refresh();
            },
        };
    }

    ngOnInit() {

    }

    //#region 初始化表格配置
    init_data_grid() {

        this.formList.primaryKey = 'NumericalOrder';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhfarmerInformation-state-storing';
        this.formList.export.enabled = true;

        this.datasource = this.getListDataSource();
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        this.formList.events.onRowDblClick = this.edit.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        // this.formList.commandColumn.deleteButton.text = '禁用';
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.formList.commandColumn.editButton.onClick = this.edit.bind(this);
    }

    get columns() {
        //养户名称
        const col_YHFarmerName = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.YhName.text, 'YHFarmerName');
        col_YHFarmerName.props.filterOperations = ['contains'];
        col_YHFarmerName.props.fixed = true;
        col_YHFarmerName.props.alignment = 'center';

        //姓名
        const col_YHPersonName = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.YHPersonName.text, 'YHPersonName');
        col_YHPersonName.props.filterOperations = ['contains'];
        col_YHPersonName.props.fixed = true;
        col_YHPersonName.props.alignment = 'center';

        //手机号
        const col_Phone = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.Phone.text, 'Phone');
        // col_Phone.props.allowFiltering = false;
        col_Phone.props.filterOperations = ['contains'];

        //身份证号
        const col_IdCardNumber = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.IdCardNumber.text, 'IdCardNumber');
        // col_IdCardNumber.props.allowHeaderFiltering = false;
        // col_IdCardNumber.props.allowFiltering = false;
        col_IdCardNumber.props.filterOperations = ['contains'];

        //家庭住址
        const col_FullAddress = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.FullAddress.text, 'Address');
        col_FullAddress.props.filterOperations = ['contains'];

        //性别
        const col_Sex = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.Sex.text, 'Sex');
        // col_Sex.props.allowHeaderFiltering = false;
        // col_Sex.props.allowFiltering = false;
        col_Sex.props.filterOperations = ['contains'];
        col_Sex.props.lookup.enabled = true;
        col_Sex.props.allowSorting = false;
        col_Sex.props.lookup.dataSource = [
            { name: '男', value: true },
            { name: '女', value: false }
        ];
        col_Sex.props.lookup.valueExpr = 'value';
        col_Sex.props.lookup.displayExpr = 'name';
        col_Sex.props.alignment = 'center';



        //助记码
        const col_MnemonicCode = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.MnemonicCode.text, 'MnemonicCode');
        // col_MnemonicCode.props.allowHeaderFiltering = false;
        // col_MnemonicCode.props.allowFiltering = false;
        col_MnemonicCode.props.filterOperations = ['contains'];

        //一致行动人
        const col_FullName = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.FullName.text, 'FullName');
        // col_FullName.props.allowHeaderFiltering = false;
        // col_FullName.props.allowFiltering = false;
        col_FullName.props.filterOperations = ['contains'];
        //部门
        const col_MarketName = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.MarketName.text, 'MarketID');
        // col_MarketName.props.allowHeaderFiltering = true;
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

        //管理员
        const col_PersonName = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.PersonName.text, 'PersonName');
        // col_PersonName.props.allowHeaderFiltering = false;
        col_PersonName.props.allowFiltering = false;
        col_PersonName.props.filterOperations = ['contains'];

        //合作日期
        const col_StartDate = new NxDataGridColumn(
            this.translator.I18N.yhfarmerInformationSetting.StartDate.text,
            'StartDate'
        );
        col_StartDate.props.allowHeaderFiltering = false;
        col_StartDate.props.alignment = 'center';

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.Remarks.text, 'Remarks');
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
        col_CreatedOwnerName.props.alignment = 'center';

        // 创建时间
        const col_CreatedDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedDate.text,
            'CreatedDate',
            'date',
        );
        col_CreatedDate.props.sortIndex = 1;
        col_CreatedDate.props.sortOrder = 'desc';
        col_CreatedDate.props.format = 'yyyy/MM/dd';
        col_CreatedDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.CreatedDate).toString('yyyy/MM/dd HH:mm:ss');
        };
        col_CreatedDate.props.filterOperations = ['between', '='];
        col_CreatedDate.props.selectedFilterOperation = 'between';
        col_CreatedDate.props.alignment = 'center';

        //制单人
        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
        col_OwnerName.props.alignment = 'center';

        // 修改时间
        const col_ModifiedDate = new NxDataGridColumn(
            this.translator.I18N.commandOptions.ModifiedDate.text,
            'ModifiedDate',
            'date',
        );
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
            col_YHFarmerName,
            col_YHPersonName,
            col_Phone,
            col_IdCardNumber,
            col_FullAddress,
            col_Sex,
            col_MnemonicCode,
            col_FullName,
            col_MarketName,
            col_PersonName,
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
        let createTitle = this.translator.I18N.yhfarmerInformationSetting.create + this.service.PoultryFarmDisplayText;
        this.formListInstance.yhcreateToDetail('/yhfarmerInformation/detail', '养户设置-新增');
    }

    edit(rowData) {
        this.formListInstance.yheditToDetail(
            '/yhfarmerInformation/detail',
            rowData.rowIndex,
            '养户设置-编辑',
            {
                numericalOrder: rowData.data.NumericalOrder,
            }
        );
    }
    delete(rowData) {
        this.service.delete(rowData.data.NumericalOrder).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`${this.translator.I18N.yhfarmerInformationSetting.delete + response.message}`);
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
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.YhName.text, 'YHFarmerName'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.YHPersonName.text, 'YHPersonName'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.Phone.text, 'Phone'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.IdCardNumber.text,'IdCardNumber'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.FullAddress.text, 'Address'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.Sex.text, 'Sex'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.MnemonicCode.text,'MnemonicCode'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.FullName.text, 'FullName'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.MarketName.text, 'MarketID'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.PersonName.text,'PersonName'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.Remarks.text, 'Remarks'),
                new ColumnSetting(this.translator.I18N.yhfarmerInformationSetting.StartDate.text, 'StartDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
                new ColumnSetting(this.translator.I18N.breedingSetting.Status.text, 'Status'),
            ]
        );

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
        this.toolbarPanel.storageKey = 'yhfarmerInformation-columns-storage';
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

        const condition_YHFarmerName = new NxConditionItem();
        condition_YHFarmerName.label = '养户名称';
        condition_YHFarmerName.type = 'TextBox';
        condition_YHFarmerName.dataField = 'YHFarmerName';
        condition_YHFarmerName.widget = new NxTextBox();
        condition_YHFarmerName.widget.props.showClearButton = true;


        const condition_Phone = new NxConditionItem();
        condition_Phone.label = '手机号';
        condition_Phone.type = 'TextBox';
        condition_Phone.dataField = 'Phone';
        condition_Phone.widget = new NxTextBox();
        condition_Phone.widget.props.showClearButton = true;


        //养户批次
        const condition_PersonName = new NxConditionItem();
        condition_PersonName.label = '管理员';
        condition_PersonName.dataField = 'PersonName';
        condition_PersonName.type = 'SelectBox';
        condition_PersonName.widget = new NxSelectBox();
        condition_PersonName.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData({
        select:['PersonID','PersonName']
        });
        condition_PersonName.widget.props.valueExpr = 'PersonID';
        condition_PersonName.widget.props.displayExpr = 'PersonName';

        const condition_FullName = new NxConditionItem();
        condition_FullName.label = '一致行动人';
        condition_FullName.type = 'TextBox';
        condition_FullName.dataField = 'FullName';
        condition_FullName.widget = new NxTextBox();
        condition_FullName.widget.props.showClearButton = true;

        this.searchPanelModel.conditionItems.push(condition_YHFarmerName,condition_Phone,condition_PersonName,condition_FullName);
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

        let filter = [
            [['ComboPack', '=', this.service.comboPack]]
        ];

        return filter;
    }

    reset(data) {
        let filter = this.getFliter();
        this.datasource.filter(filter);
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
        if (data['YHFarmerName']) {
            filter.push(['YHFarmerName', 'contains', data['YHFarmerName']]);
        }
        if (data['Phone']) {
            filter.push(['Phone', 'contains', data['Phone']]);
        }

        if(data['PersonName']){
            filter.push(['PersonID', 'contains', data['PersonName']]);
        }

        if(data['FullName']){
            filter.push(['FullName', 'contains', data['FullName']]);
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
