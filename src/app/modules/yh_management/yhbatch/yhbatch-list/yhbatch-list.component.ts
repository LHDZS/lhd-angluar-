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
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';
import { NxDataGridColumn, NxDataGridCommandColumnCustomItem } from 'src/app/components/component-model/data-grid/columns/model';
import { yhBatchService } from '../yhbatch.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { USE_STORE } from '@ngx-translate/core';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { stringHelper } from 'src/app/providers/common/stringHelper';
import { not } from '@angular/compiler/src/output/output_ast';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { YHBasicSettingODataContext } from 'src/app/providers/odataContext/yh.odataContext';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';

@Component({
    selector: 'app-yhbatch-list',
    templateUrl: './yhbatch-list.component.html',
    styleUrls: ['./yhbatch-list.component.scss'],
})
export class yhBatchListComponent {
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
    YHBatchID: String;

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
    @ViewChild('excel', { static: false })
    excelImport: INxExcelImportComponent;
    excelModel: NxExcelImportComponent;
    constructor(
        private service: yhBatchService,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        // private ylwLambODataContext: YlwLambODataContext,
        private router: Router,
        // private qlwProductionODataContext: QlwProductContext,
        private productODataContext: ProductODataContext,
        private translator: TranslateService,
        private importService: QlwImportTemplateService,
    ) {
        this.init_search_panel();
        this.init_toolbar_panel();
        this.init_data_grid();
        this.excelModel = {
            title: this.importService.yhbatch.title,
            xlsxTemplatePath: this.importService.yhbatch.xlsxPath,
            jsonTemplatePath: this.importService.yhbatch.jsonPath,
            importServer: this.importService.yhbatch.server,
            onImportSuccess: (response) => {
                this.formListInstance.dataGrid.instance.refresh();
            },
        };
    }
    ngOnInit() { }

    //#region 搜索面板

    init_search_panel() {
        //日期
        this.searchPanelModel.data['DataDate'] = [new Date(new Date(new Date().setMonth(0)).setDate(1)), new Date()];
        let date = new NxConditionItem();
        date.label = this.translator.I18N.YHBatch.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        //批次名称
        const condition_YHBatchName = new NxConditionItem();
        condition_YHBatchName.label = this.translator.I18N.YHBatch.YHBatchName.text;
        condition_YHBatchName.type = 'TextBox';
        condition_YHBatchName.dataField = 'YHBatchName';
        condition_YHBatchName.widget = new NxTextBox();
        condition_YHBatchName.widget.props.showClearButton = true;

        //养户名称
        const condition_YHFarmerName = new NxConditionItem();
        condition_YHFarmerName.label = this.translator.I18N.YHBatch.YHFarmerName.text;
        condition_YHFarmerName.type = 'SelectBox';
        condition_YHFarmerName.dataField = 'YHFarmerID';
        condition_YHFarmerName.widget = new NxSelectBox();
        condition_YHFarmerName.widget.props.showClearButton = true;
        condition_YHFarmerName.widget.props.dataSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                ['Status', '=', true]
            ]
        });
        condition_YHFarmerName.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerName.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerName.widget.props.searchEnabled = true;
        condition_YHFarmerName.widget.props.searchExpr = ["YHFarmerName", "MnemonicCode", "YHPersonName", "Phone"];

        this.searchPanelModel.conditionItems.push(
            date,
            condition_YHBatchName,
            condition_YHFarmerName,
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

        if (data['YHBatchName']) {
            filter.push([['YHBatchName', 'contains', data['YHBatchName']]]);
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
                new ColumnSetting(this.translator.I18N.YHBatch.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.YHBatch.YHBatchName.text, 'YHBatchName'),
                new ColumnSetting(this.translator.I18N.YHBatch.YHFarmerName.text, 'YHFarmerName'),
                new ColumnSetting(this.translator.I18N.YHBatch.ChickenFarmName.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.YHBatch.BreedingName.text, 'BreedingName'),
                new ColumnSetting(this.translator.I18N.YHBatch.ProductName.text, 'ProductName'),
                new ColumnSetting(this.translator.I18N.YHBatch.YHFarmerContract.text, 'ContractNo'),
                new ColumnSetting(this.translator.I18N.YHBatch.SerialNo.text, 'SerialNo'),
                new ColumnSetting(this.translator.I18N.YHBatch.OneMedicineFee.text, 'OneMedicineFee'),
                new ColumnSetting(this.translator.I18N.YHBatch.IsTransfer.text, 'IsTransfer'),
                // new ColumnSetting(this.translator.I18N.YHBatch.ChickSourceType.text, 'ChickSourceTypeName'),
                // new ColumnSetting(this.translator.I18N.YHBatch.ChickSource.text, 'ChickSourceName'),
                new ColumnSetting(this.translator.I18N.YHBatch.ChickenType.text, 'ChickenTypeName'),
                new ColumnSetting(this.translator.I18N.YHBatch.DaysOldDate.text, 'DaysOldDate'),
                new ColumnSetting(this.translator.I18N.YHBatch.DaysOld.text, 'DaysOld'),
                new ColumnSetting(this.translator.I18N.YHBatch.Remarks.text, 'Remarks'),
                new ColumnSetting(this.translator.I18N.YHBatch.Status.text, 'Status'),
                new ColumnSetting(this.translator.I18N.YHBatch.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.YHBatch.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.YHBatch.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.YHBatch.ModifiedDate.text, 'ModifiedDate'),
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
        this.toolbarPanel.storageKey = 'yhbatch-columns-storage';
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
        this.formListInstance.yhcreateToDetail('/yhbatch/create', this.translator.I18N.YHBatch.createPageTitle);

    }

    //#endregion

    //#region 初始化表格配置

    init_data_grid() {
        this.formList.primaryKey = 'YHBatchID';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhbatch-list';
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
            ['DataDate', '>=', new Date(new Date(new Date(new Date().setMonth(0)).setDate(1)).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
        ];
        this.datasource.filter(filter);
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        this.formList.events.onRowDblClick = this.rowDbClick.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.formList.commandColumn.editButton.onClick = this.edit.bind(this);

        //结束|启用 按钮
        var endStartButton = new NxDataGridCommandColumnCustomItem();
        endStartButton.label = (data) => {
            return data.Status ? '结束' : '启用'
        };
        endStartButton.isVisible = (r) => {
            return true;
        }
        endStartButton.onClick = (row) => {
            let data = deepCopy(row.data)
            data.Status = !row.data.Status
            if(data.DaysOld == null){
                data.DaysOld = -1;
            }
            this.service.put(data).then(()=>{
                this.formListInstance.dataGrid.instance.refresh();
            });
        }

        this.formList.commandColumn.customs.push(endStartButton);
    }

    get columns() {
        //签定时间
        const col_DataDate = new NxDataGridColumn(this.translator.I18N.YHBatch.DataDate.text, 'DataDate', 'date');
        col_DataDate.props.format = 'yyyy/MM/dd';
        col_DataDate.props.filterOperations = ['between', '='];
        col_DataDate.props.selectedFilterOperation = 'between';
        col_DataDate.props.fixed = true;
        col_DataDate.props.fixedPosition = "left";

        //批次名称
        const col_YHBatchID = new NxDataGridColumn(this.translator.I18N.YHBatch.YHBatchName.text, 'YHBatchName', 'string');
        col_YHBatchID.props.allowHeaderFiltering = false;
        col_YHBatchID.props.allowFiltering = true;
        col_YHBatchID.props.filterOperations = ['contains'];
        col_YHBatchID.props.fixed = true;
        col_YHBatchID.props.fixedPosition = "left";
        col_YHBatchID.props.alignment = 'center';

        //养户名称
        const col_YHFarmerID = new NxDataGridColumn(this.translator.I18N.YHBatch.YHFarmerName.text, 'YHFarmerID', 'string', 'YHFarmerName');
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.allowFiltering = true;
        col_YHFarmerID.props.filterOperations = ['contains'];

        //养殖场
        const col_ChickenFarmID = new NxDataGridColumn(this.translator.I18N.YHBatch.ChickenFarmName.text, 'ChickenFarmID', 'string', 'ChickenFarmName');
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.allowFiltering = true;
        col_ChickenFarmID.props.filterOperations = ['contains'];

        //品种
        const col_BreedingID = new NxDataGridColumn(this.translator.I18N.YHBatch.BreedingName.text, 'BreedingID', 'string', 'BreedingName');
        col_BreedingID.props.allowHeaderFiltering = false;
        col_BreedingID.props.allowFiltering = true;
        col_BreedingID.props.filterOperations = ['contains'];

        //商品代号
        const col_ProductID = new NxDataGridColumn(this.translator.I18N.YHBatch.ProductName.text, 'ProductID', 'string', 'ProductName');
        col_ProductID.props.allowHeaderFiltering = false;
        col_ProductID.props.allowFiltering = true;
        col_ProductID.props.filterOperations = ['contains'];

        //养殖合同
        const col_YHFarmerContract = new NxDataGridColumn(this.translator.I18N.YHBatch.YHFarmerContract.text, 'YHFarmerContract', 'string', 'ContractNo');
        col_YHFarmerContract.props.allowHeaderFiltering = false;
        col_YHFarmerContract.props.allowFiltering = true;
        col_YHFarmerContract.props.filterOperations = ['contains'];

        //养户批次序号
        const col_SerialNo = new NxDataGridColumn(this.translator.I18N.YHBatch.SerialNo.text, 'SerialNo', 'number');
        col_SerialNo.props.filterOperations = ['between', '='];
        col_SerialNo.props.selectedFilterOperation = 'between';


        //只药费
        const col_OneMedicineFee = new NxDataGridColumn(this.translator.I18N.YHBatch.OneMedicineFee.text, 'OneMedicineFee', 'Number');
        col_OneMedicineFee.props.allowHeaderFiltering = false;
        col_OneMedicineFee.props.allowFiltering = true;
        col_OneMedicineFee.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_OneMedicineFee.props.selectedFilterOperation = 'between';

        //批次交接
        const col_Transfer = new NxDataGridColumn(this.translator.I18N.YHBatch.IsTransfer.text, 'IsTransfer', 'boolean');
        col_Transfer.props.trueText = "是";
        col_Transfer.props.falseText = "否";
        col_Transfer.props.allowHeaderFiltering = false;
        col_Transfer.props.alignment = 'center';

        // //苗源类型
        // const col_ChickenSourceType = new NxDataGridColumn(this.translator.I18N.YHBatch.ChickSourceType.text, 'ChickSourceType', 'string', 'ChickSourceTypeName');
        // col_ChickenSourceType.props.allowHeaderFiltering = false;
        // col_ChickenSourceType.props.allowFiltering = true;
        // col_ChickenSourceType.props.filterOperations = ['contains'];

        // //苗源类型
        // const col_ChickenSource = new NxDataGridColumn(this.translator.I18N.YHBatch.ChickSource.text, 'ChickSource', 'string', 'ChickSourceName');
        // col_ChickenSource.props.allowHeaderFiltering = false;
        // col_ChickenSource.props.allowFiltering = true;
        // col_ChickenSource.props.filterOperations = ['contains'];

        //家禽类型
        const col_ChickenType = new NxDataGridColumn(this.translator.I18N.YHBatch.ChickenType.text, 'ChickenType', 'string', 'ChickenTypeName');
        col_ChickenType.props.allowHeaderFiltering = false;
        col_ChickenType.props.allowFiltering = true;
        col_ChickenType.props.filterOperations = ['contains'];

        //日龄日期
        const col_DaysOldDate = new NxDataGridColumn(this.translator.I18N.YHBatch.DaysOldDate.text, 'DaysOldDate', 'date');
        col_DaysOldDate.props.format = 'yyyy/MM/dd';
        col_DaysOldDate.props.filterOperations = ['between', '='];
        col_DaysOldDate.props.selectedFilterOperation = 'between';

        //日龄
        const col_DaysOld = new NxDataGridColumn(this.translator.I18N.YHBatch.DaysOld.text, 'DaysOld', 'Number');
        col_DaysOld.props.allowHeaderFiltering = false;
        col_DaysOld.props.allowFiltering = true;
        col_DaysOld.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_DaysOld.props.selectedFilterOperation = 'between';
        col_DaysOld.props.calculateCellValue = (row) => {
            if (row.DaysOld && row.DaysOld < 0) { //日龄小于0意味着空
                return null;
            }
            else {
                return row.DaysOld;
            }
        }

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHBatch.Remarks.text, "Remarks", "string")
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = true;
        col_Remarks.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_Remarks.props.selectedFilterOperation = 'between';

        //状态
        const col_Status = new NxDataGridColumn(this.translator.I18N.YHBatch.Status.text, 'Status', 'boolean');
        col_Status.props.trueText = "启用";
        col_Status.props.falseText = "未启用";
        col_Status.props.allowHeaderFiltering = false;
        col_Status.props.alignment = 'center';

        //创建人
        const col_CreatedOwnerID = new NxDataGridColumn(this.translator.I18N.YHBatch.CreatedOwnerName.text, 'CreatedOwnerID', 'string', 'CreatedOwnerName');
        col_CreatedOwnerID.props.allowHeaderFiltering = false;
        col_CreatedOwnerID.props.allowFiltering = true;
        col_CreatedOwnerID.props.filterOperations = ['contains'];

        //创建日期
        const col_CreatedDate = new NxDataGridColumn(this.translator.I18N.YHBatch.CreatedDate.text, 'CreatedDate', 'datetime');
        col_CreatedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_CreatedDate.props.filterOperations = ['between', '='];
        col_CreatedDate.props.selectedFilterOperation = 'between';

        //最后修改人
        const col_OwnerID = new NxDataGridColumn(this.translator.I18N.YHBatch.OwnerName.text, 'OwnerID', 'string', 'OwnerName');
        col_OwnerID.props.allowHeaderFiltering = false;
        col_OwnerID.props.allowFiltering = true;
        col_OwnerID.props.filterOperations = ['contains'];

        //最后修改时间
        const col_ModifiedDate = new NxDataGridColumn(this.translator.I18N.YHBatch.ModifiedDate.text, 'ModifiedDate', 'datetime');
        col_ModifiedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_ModifiedDate.props.filterOperations = ['between', '='];
        col_ModifiedDate.props.selectedFilterOperation = 'between';

        return [
            col_DataDate,
            col_YHBatchID,
            col_YHFarmerID,
            col_ChickenFarmID,
            col_BreedingID,
            col_ProductID,
            col_YHFarmerContract,
            col_SerialNo,
            col_OneMedicineFee,
            col_Transfer,
            // col_ChickenSourceType,
            // col_ChickenSource,
            col_ChickenType,
            col_DaysOldDate,
            col_DaysOld,
            col_Remarks,
            col_Status,
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
        this.service.delete(rowData.data.YHBatchID).then((result: Result) => {
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
            '/yhbatch/create',
            rowData.rowIndex,
            this.translator.I18N.YHBatch.editPageTitle,
            {
                YHBatchID: rowData.data.YHBatchID,
            }
        )
    }

    rowDbClick(rowData){
        this.formListInstance.yheditToDetail(
            '/yhbatch/create',
            rowData.rowIndex,
            this.translator.I18N.YHBatch.editPageTitle,
            {
                YHBatchID: rowData.data.YHBatchID,
            }
        )
    }

    //#endregion

}
