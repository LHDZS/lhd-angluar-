import { Component, OnInit, ViewChild } from '@angular/core';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { INxExcelImportComponent, NxExcelImportComponent } from 'src/app/nxin/ui/extensions/basic/excel_import';
// import EXCEL_TEMPLATES from 'src/app/providers/data/excel-import-templates';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import {
    BasicSettingODataContext,
    QlwProductContext,
    QlwODataContext,
    ProductODataContext,
} from 'src/app/providers/odataContext';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { environment } from 'src/environments/environment';
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { ContractService } from '../contract.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { USE_STORE } from '@ngx-translate/core';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';

import { stringHelper } from 'src/app/providers/common/stringHelper';
import { not } from '@angular/compiler/src/output/output_ast';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';
import { NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';

@Component({
    selector: 'app-contract-list',
    templateUrl: './contract-list.component.html',
    styleUrls: ['./contract-list.component.scss'],
})
export class ContractListComponent {
    datasource: any = null;
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('toolbarInstance', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    toolbarPanel: NxToolbarPanel = new NxToolbarPanel('list');
    formList: NxDataGrid = new NxDataGrid('list');
    isDisplayReview:boolean=false;
    //是否个体
    individual:boolean=false;

    //显示应用商品
    productApplyVisible: boolean = false;

    //应用按钮可用
    productApplyDisable: boolean = true;

    //商品列表
    products={};

    //编辑流水号
    NumericalOrder: String;

    //编辑包装信息
    PackageData:any

    //已选商品
    selectedProducts = {};

    //商品搜索栏
    productSearchPanelModel: NxSearchPanel = new NxSearchPanel();

    //存货类型数据源
    stockTypeSource: any;

    //商品品类数据源
    classificationSource: any;

    //商品搜索信息
    searchOpt: any = {};
    YHFarmerID:string;
    @ViewChild('excel', { static: false })
    excelImport: INxExcelImportComponent;
    excelModel: NxExcelImportComponent;
    constructor(
        private service: ContractService,
        private basicSettingODataContext: BasicSettingODataContext,
        // private ylwLambODataContext: YlwLambODataContext,
        private router: Router,
        private route: ActivatedRoute,
        // private qlwProductionODataContext: QlwProductContext,
        private productODataContext: ProductODataContext,
        private translator: TranslateService,
        private importService: QlwImportTemplateService,
    ) {
        this.YHFarmerID = this.route.queryParams['value']['YHFarmerID'];
        this.init_data_grid();
        this.init_toolbar_panel();
        this.init_search_panel();
        this.excelModel = {
            title: this.importService.yhfarmercontract.title,
            xlsxTemplatePath: this.importService.yhfarmercontract.xlsxPath,
            jsonTemplatePath: this.importService.yhfarmercontract.jsonPath,
            importServer: this.importService.yhfarmercontract.server,
            onImportSuccess: (response) => {
                this.formListInstance.dataGrid.instance.refresh();
            },
        };
    }
    ngOnInit() { }
    //#region 初始化表格配置

    init_data_grid() {
        this.formList.primaryKey = 'NumericalOrder';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'contract-state-storing';
        this.formList.export.enabled = true;
        this.formList.selection.enabled = false;
        // this.datasource = new DataSource(this.basicSettingODataContext.getProductPackageSetDataSource());
        this.datasource = this.service.getDataSource();
        this.datasource.sort({selector: "CreatedDate", desc: true})
        this.searchPanelModel.data['IsUse'] = USER_INFO_CONTEXT.childId;
        // if(USER_INFO_CONTEXT.childId&&USER_INFO_CONTEXT.childId!="0"){
        //     let filter = ['IsUse', '=', USER_INFO_CONTEXT.childId];
        //     this.datasource.filter(filter);
        // }

        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().setDate(1)).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
        ];
        if(this.YHFarmerID){
            filter=[['YHFarmerID', '=', this.YHFarmerID]];
        }
        this.datasource.filter(filter);
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        this.formList.events.onRowDblClick = this.rowDbClick.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.formList.commandColumn.editButton.onClick = this.edit.bind(this);
    }

    get columns() {
        //签定时间
        const col_DataDate = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.DataDate.text, 'DataDate', 'date');
        col_DataDate.props.format = 'yyyy/MM/dd';
        col_DataDate.props.filterOperations = ['between', '='];
        col_DataDate.props.selectedFilterOperation = 'between';
        col_DataDate.props.fixed = true;
        col_DataDate.props.fixedPosition = "left";
        col_DataDate.props.alignment = "center";

        //养户名称
        const col_YHFarmerID = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.YHFarmerName.text, 'YHFarmerID', 'string', 'YHFarmerName');
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.allowFiltering = true;
        col_YHFarmerID.props.filterOperations = ['contains'];
        col_YHFarmerID.props.fixed = true;
        col_YHFarmerID.props.fixedPosition = "left";
        col_YHFarmerID.props.alignment = "center";

        //合同编号
        const col_ContractNo = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.ContractNo.text, 'ContractNo', 'string');
        col_ContractNo.props.allowHeaderFiltering = false;
        col_ContractNo.props.allowFiltering = true;
        col_ContractNo.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_ContractNo.props.selectedFilterOperation = 'between';

        //生效日期
        const col_BeginDate = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.BeginDate.text, 'BeginDate', 'date');
        col_BeginDate.props.format = 'yyyy/MM/dd';
        col_BeginDate.props.filterOperations = ['between', '='];
        col_BeginDate.props.selectedFilterOperation = 'between';
        col_BeginDate.props.alignment = "center";

        //截止日期
        const col_EndDate = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.EndDate.text, 'EndDate', 'date');
        col_EndDate.props.format = 'yyyy/MM/dd';
        col_EndDate.props.filterOperations = ['between', '='];
        col_EndDate.props.selectedFilterOperation = 'between';
        col_EndDate.props.alignment = "center";

        //一致行动人
        const col_ConcertPerson = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.ConcertPerson.text, 'ConcertPerson', 'string', 'ConcertPersonName');
        col_ConcertPerson.props.alignment = "center";

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.Remarks.text, "Remarks", "string")
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = true;
        col_Remarks.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Remarks.props.selectedFilterOperation = 'between';

        //创建人
        const col_CreatedOwnerID = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.CreatedOwnerName.text, 'CreatedOwnerID', 'string', 'CreatedOwnerName');
        col_CreatedOwnerID.props.allowHeaderFiltering = false;
        col_CreatedOwnerID.props.allowFiltering = true;
        col_CreatedOwnerID.props.filterOperations = ['contains'];
        col_CreatedOwnerID.props.alignment = "center";

        //创建日期
        const col_CreatedDate = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.CreatedDate.text, 'CreatedDate', 'datetime');
        col_CreatedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_CreatedDate.props.filterOperations = ['between', '='];
        col_CreatedDate.props.selectedFilterOperation = 'between';
        col_CreatedDate.props.alignment = "center";

        //最后修改人
        const col_OwnerID = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.OwnerName.text, 'OwnerID', 'string', 'OwnerName');
        col_OwnerID.props.allowHeaderFiltering = false;
        col_OwnerID.props.allowFiltering = true;
        col_OwnerID.props.filterOperations = ['contains'];
        col_OwnerID.props.alignment = "center";

        //最后修改时间
        const col_ModifiedDate = new NxDataGridColumn(this.translator.I18N.YHFarmerContract.ModifiedDate.text, 'ModifiedDate', 'datetime');
        col_ModifiedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_ModifiedDate.props.filterOperations = ['between', '='];
        col_ModifiedDate.props.selectedFilterOperation = 'between';
        col_ModifiedDate.props.alignment = "center";

        return [
            col_DataDate,
            col_YHFarmerID,
            col_ContractNo,
            col_BeginDate,
            col_EndDate,
            col_ConcertPerson,
            col_Remarks,
            col_CreatedOwnerID,
            col_CreatedDate,
            col_OwnerID,
            col_ModifiedDate,
        ];
    }

    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }

    delete(rowData) {
        this.service.delete(rowData.data.NumericalOrder).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`删除${response.message}`);
                this.formListInstance.dataGrid.instance.refresh();
            } else {
                Notify.toast(response.message, NotifyType.Error);
                this.toolbarInstance.error(`${response.message}`);
            }
        });
    }

    edit(rowData) {
        this.formListInstance.yheditToDetail(
            '/Contract/create',
            rowData.rowIndex,
            this.translator.I18N.YHFarmerContract.editPageTitle,
            {
                NumericalOrder: rowData.data.NumericalOrder,
            }
        )
    }

    rowDbClick(rowData){
        this.formListInstance.yheditToDetail(
            '/Contract/create',
            rowData.rowIndex,
            this.translator.I18N.YHFarmerContract.editPageTitle,
            {
                NumericalOrder: rowData.data.NumericalOrder,
            }
        )
    }

    //#endregion

    //#region 工具条配置

    init_toolbar_panel() {
        (<NxButton>this.toolbarPanel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        // (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).events.onClick = this.rangeDelete.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('review')).props.visible = false;
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).props.visible = false;
        this.toolbarPanel.checkInfo.visible = false;
        this.toolbarPanel.moreButton.props.visible = true;
        this.toolbarPanel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('filterRow').events.onClick = this.toggleFilterRow.bind(this);
        this.toolbarPanel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.YHFarmerContract.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.YHFarmerID.text, 'YHFarmerID'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.ContractNo.text, 'ContractNo'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.BeginDate.text, 'BeginDate'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.ConcertPerson.text, 'ConcertPerson'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.EndDate.text, 'EndDate'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.Remarks.text, 'Remarks'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.CreatedOwnerID.text, 'CreatedOwnerID'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.OwnerID.text, 'OwnerID'),
                new ColumnSetting(this.translator.I18N.YHFarmerContract.ModifiedDate.text, 'ModifiedDate'),
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
        this.toolbarPanel.storageKey = 'contract-columns-storage';
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

    create() {
        this.formListInstance.yhcreateToDetail('/Contract/create', this.translator.I18N.YHFarmerContract.createPageTitle);

    }

    //#endregion

    //#region 搜索面板

    init_search_panel() {
        //日期
        this.searchPanelModel.data['DataDate'] = [new Date(new Date().setDate(1)), new Date()];
        if(this.YHFarmerID){
            this.searchPanelModel.data['DataDate'] =[];
        }
        let date = new NxConditionItem();
        date.label = this.translator.I18N.YHFarmerContract.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        //养户名称
        const condition_ProgramName = new NxConditionItem();
        condition_ProgramName.label = this.translator.I18N.YHFarmerContract.YHFarmerName.text;
        condition_ProgramName.type = 'SelectBox';
        condition_ProgramName.dataField = 'YHFarmerID';
        condition_ProgramName.widget = new NxSelectBox();
        condition_ProgramName.widget.props.showClearButton = true;
        condition_ProgramName.widget.props.dataSource = this.service.getYHFarmerDataSource();
        condition_ProgramName.widget.props.valueExpr = "YHFarmerID";
        condition_ProgramName.widget.props.displayExpr = "YHFarmerName";
        this.searchPanelModel.data['YHFarmerID'] = this.YHFarmerID;
        this.searchPanelModel.conditionItems.push(
            date,
            condition_ProgramName,
        )

        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);

        return this;
    }

    reset(data) {
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().setDate(1)).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
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

        if (data['YHFarmerID']) {
            filter.push([['YHFarmerID', '=', data['YHFarmerID']]]);
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
