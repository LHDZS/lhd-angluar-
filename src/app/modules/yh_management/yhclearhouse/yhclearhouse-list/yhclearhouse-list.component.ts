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
    YHBasicSettingODataContext,
    PermissionContext,
} from 'src/app/providers/odataContext';
import { Result, ResponseSuccess, ResponseError } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { environment } from 'src/environments/environment';
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDropDownButton, NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { YHClearHouseService } from '../yhclearhouse.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { USE_STORE } from '@ngx-translate/core';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { stringHelper } from 'src/app/providers/common/stringHelper';
import { not } from '@angular/compiler/src/output/output_ast';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { HttpClient } from '@angular/common/http';
import { TokenAuthService } from 'src/app/shared/services';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { NxReview } from 'src/app/components/review/review.extend';

@Component({
    selector: 'app-yhclearhouse-list',
    templateUrl: './yhclearhouse-list.component.html',
    styleUrls: ['./yhclearhouse-list.component.scss'],
})
export class YHClearHouseListComponent {
    datasource: any = null;
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('toolbarInstance', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    toolbarPanel: NxToolbarPanel = new NxToolbarPanel('list');
    formList: NxDataGrid = new NxDataGrid('list');
    isDisplayReview:boolean=false;

    YHFarmerList: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
        filter: [
            ['Status', '=', true]
        ]
    }));
    BatchDataList: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
        filter: ["Status", "=", true]
    }));

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

    constructor(
        private permissionContext: PermissionContext,
        private tokenService: TokenAuthService,
        private http: HttpClient,
        private service: YHClearHouseService,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        // private ylwLambODataContext: YlwLambODataContext,
        private router: Router,
        // private qlwProductionODataContext: QlwProductContext,
        private productODataContext: ProductODataContext,
        private translator: TranslateService
    ) {
        this.init_data_grid();
        this.init_toolbar_panel();
        this.init_search_panel();
        // this.init_product_search_pannel();
    }
    async ngOnInit() {
    }
    //#region 初始化表格配置

    init_data_grid() {
        this.formList.primaryKey = 'NumericalOrder';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhClearHouse-state-storing';
        this.formList.export.fileName = `${this.translator.I18N.YHClearHouse.title
        }-${new DateTime().toString()}`;
        this.formList.export.enabled = true;
        this.formList.selection.enabled = true;
        // this.datasource = new DataSource(this.basicSettingODataContext.getProductPackageSetDataSource());
        this.datasource = this.service.getDataSource();
        this.datasource.sort({selector: "Number", desc: true})
        this.searchPanelModel.data['IsUse'] = USER_INFO_CONTEXT.childId;
        // if(USER_INFO_CONTEXT.childId&&USER_INFO_CONTEXT.childId!="0"){
        //     let filter = ['IsUse', '=', USER_INFO_CONTEXT.childId];
        //     this.datasource.filter(filter);
        // }
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
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
    }

    get columns() {
        const col_DataDate = new NxDataGridColumn(this.translator.I18N.YHClearHouse.DataDate.text, 'DataDate', 'date');
        col_DataDate.props.format = 'yyyy/MM/dd';
        col_DataDate.props.filterOperations = ['between', '='];
        col_DataDate.props.selectedFilterOperation = 'between';
        col_DataDate.props.fixed = true;
        col_DataDate.props.fixedPosition = "left";

        //养户名称
        const col_YHFarmerID = new NxDataGridColumn(this.translator.I18N.YHClearHouse.YHFarmerID.text, 'YHFarmerName', 'string');
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.allowFiltering = true;
        col_YHFarmerID.props.filterOperations = ['contains'];
        col_YHFarmerID.props.fixed = true;
        col_YHFarmerID.props.fixedPosition = "left";

        //养户批次
        const col_Batch = new NxDataGridColumn(this.translator.I18N.YHClearHouse.YHBatch.text, 'YHBatchName', 'string');
        col_Batch.props.allowHeaderFiltering = false;
        col_Batch.props.allowFiltering = true;
        col_Batch.props.filterOperations = ['contains'];
        col_Batch.props.fixed = true;
        col_Batch.props.fixedPosition = "left";

        //养殖场
        const col_ChickenFarmID = new NxDataGridColumn(this.translator.I18N.YHClearHouse.ChickenFarmID.text, 'ChickenFarmName', 'string');
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.allowFiltering = true;
        // col_ChickenFarmID.props.filterOperations = ['contains'];
        col_ChickenFarmID.props.fixed = true;
        col_ChickenFarmID.props.fixedPosition = "left";

        //养殖场仓库
        const col_WareHouse = new NxDataGridColumn(this.translator.I18N.YHClearHouse.WarehouseID.text, 'WarehouseName', 'string');
        col_WareHouse.props.allowHeaderFiltering = false;
        col_WareHouse.props.allowFiltering = true;
        col_WareHouse.props.filterOperations = ['contains'];

        //栋舍
        const col_HenhouseID = new NxDataGridColumn("栋舍", 'HenhouseName', 'string');
        col_HenhouseID.props.allowHeaderFiltering = false;
        col_HenhouseID.props.allowFiltering = true;
        col_HenhouseID.props.filterOperations = ['contains'];

        //品种
        const col_BreedingName = new NxDataGridColumn("品种", 'BreedingName', 'string');
        col_BreedingName.props.allowHeaderFiltering = false;
        col_BreedingName.props.allowFiltering = true;
        col_BreedingName.props.filterOperations = ['contains'];

        //不明去向只数
        const col_UnknownQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.UnknownQuantity.text, 'UnknownQuantity', 'number');
        col_UnknownQuantity.props.allowHeaderFiltering = false;
        col_UnknownQuantity.props.allowFiltering = true;
        col_UnknownQuantity.props.filterOperations = ['<', '<=', '=', '>=', '>', 'between'];

        //补登死亡
        const col_DeathCullOuter = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.DeathCullOuter.text, 'DeathCullOuter', 'number');
        col_DeathCullOuter.props.allowHeaderFiltering = false;
        col_DeathCullOuter.props.allowFiltering = true;
        col_DeathCullOuter.props.filterOperations = ['<', '<=', '=', '>=', '>', 'between'];

        //补登淘汰
        const col_WeedOuter = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.WeedOuter.text, 'WeedOuter', 'number');
        col_WeedOuter.props.allowHeaderFiltering = false;
        col_WeedOuter.props.allowFiltering = true;
        col_WeedOuter.props.filterOperations = ['<', '<=', '=', '>=', '>', 'between'];

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHClearHouse.Remarks.text, 'Remarks', 'string');
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = true;
        col_Remarks.props.filterOperations = ['contains'];

        //审核状态
        const col_AuditStatus = new NxDataGridColumn("审核状态", 'CheckedByName', 'string');
        col_AuditStatus.props.calculateDisplayValue = ((e) => {
            return e.CheckedByID ? true : false;
        })
        col_AuditStatus.props.trueText = "已审核";
        col_AuditStatus.props.falseText = "未审核";
        col_AuditStatus.props.dataType = "boolean";
        col_AuditStatus.props.alignment = "center";

        //审核人
        const col_CheckedByID = new NxDataGridColumn(this.translator.I18N.YHClearHouse.CheckedByName.text, 'ChekckedByName', 'string');
        col_CheckedByID.props.alignment = "center";

        //审核日期
        const col_CheckedDate = new NxDataGridColumn(this.translator.I18N.YHClearHouse.CheckedDate.text, 'CheckedDate', 'datetime');
        col_CheckedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_CheckedDate.props.filterOperations = ['between', '='];
        col_CheckedDate.props.selectedFilterOperation = 'between';
        col_CheckedDate.props.alignment = "center";

        //创建人
        const col_CreatedOwnerID = new NxDataGridColumn(this.translator.I18N.YHClearHouse.CreatedOwnerID.text, 'CreatedOwnerName', 'string');

        //创建日期
        const col_CreatedDate = new NxDataGridColumn(this.translator.I18N.YHClearHouse.CreatedDate.text, 'CreatedDate', 'datetime');
        col_CreatedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_CreatedDate.props.filterOperations = ['between', '='];
        col_CreatedDate.props.selectedFilterOperation = 'between';

        //最后修改人
        const col_OwnerID = new NxDataGridColumn(this.translator.I18N.YHClearHouse.OwnerID.text, 'OwnerName', 'string');
        col_OwnerID.props.allowHeaderFiltering = false;
        col_OwnerID.props.allowFiltering = true;
        col_OwnerID.props.filterOperations = ['contains'];

        //最后修改时间
        const col_ModifiedDate = new NxDataGridColumn(this.translator.I18N.YHClearHouse.ModifiedDate.text, 'ModifiedDate', 'datetime');
        col_ModifiedDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_ModifiedDate.props.filterOperations = ['between', '='];
        col_ModifiedDate.props.selectedFilterOperation = 'between';

        return [
            col_DataDate,
            col_YHFarmerID,
            col_Batch,
            col_ChickenFarmID,
            col_WareHouse,
            col_HenhouseID,
            col_BreedingName,
            col_UnknownQuantity,
            col_DeathCullOuter,
            col_WeedOuter,
            col_Remarks,
            col_AuditStatus,
            col_CheckedByID,
            col_CheckedDate,
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
            '/yhclearhouse/create',
            rowData.rowIndex,
            this.translator.I18N.YHClearHouse.editPageTitle,
            {
                NumericalOrder: rowData.data.NumericalOrder,
            }
        )
    }

    rowDbClick(rowData){
        this.formListInstance.yheditToDetail(
            '/yhclearhouse/create',
            rowData.rowIndex,
            this.translator.I18N.YHClearHouse.editPageTitle,
            {
                NumericalOrder: rowData.data.NumericalOrder,
            }
        )
    }

    //#endregion

    //#region 工具条配置

    init_toolbar_panel() {
        (<NxButton>this.toolbarPanel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).events.onClick = this.rangeDelete.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('review')).props.visible = true;
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).props.visible = false;
        this.toolbarPanel.checkInfo.visible = false;
        this.toolbarPanel.moreButton.props.visible = true;
        this.toolbarPanel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('filterRow').events.onClick = this.toggleFilterRow.bind(this);

        (<NxDropDownButton>this.toolbarPanel.getWidgetByKey('review')).events.onButtonClick = (e) => {
            this.rangeReview(true)
        };
        (<NxDropDownButton>this.toolbarPanel.getWidgetByKey('review')).events.onItemClick = (e) => {
            this.rangeReview(false)
        };
        this.toolbarPanel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.YHClearHouse.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.YHFarmerID.text, 'YHFarmerID'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.YHBatch.text, 'YHBatch'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.ChickenFarmID.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.WarehouseID.text, 'WarehouseID'),
                new ColumnSetting(this.translator.I18N.YHClearHouseDetail.HenhouseID.text, 'HenhouseID'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.BreedingID.text, 'BreedingID'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.Remarks.text, 'Remarks'),
                new ColumnSetting(this.translator.I18N.YHClearHouseDetail.UnknownQuantity.text, 'UnknownQuantity'),
                new ColumnSetting(this.translator.I18N.YHClearHouseDetail.DeathCullOuter.text, 'DeathCullOuter'),
                new ColumnSetting(this.translator.I18N.YHClearHouseDetail.WeedOuter.text, 'WeedOuter'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.CreatedOwnerID.text, 'CreatedOwnerID'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.OwnerID.text, 'OwnerID'),
                new ColumnSetting(this.translator.I18N.YHClearHouse.ModifiedDate.text, 'ModifiedDate'),
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
        this.toolbarPanel.storageKey = 'yhClearHouse-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanel.storageKey));
        this.formList.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });this.toolbarPanel.moreButton.events.onItemClick = (e) => {
            if (e.type == 'export') {
                this.export();
            }
        };
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
        this.formListInstance.yhcreateToDetail('/yhclearhouse/create', this.translator.I18N.YHClearHouse.createPageTitle);
        // HomeHelper.open(
        //     {
        //         url: `${environment.zlwUri}/productPackageSet/create?$option=${FormOptions.$create}&BatchID=-1`,
        //         title: this.translator.I18N.productPackageSet.createPageTitle,
        //     },
        //     () => {
        //         this.router.navigate(['/productPackageSet/create'], {
        //             queryParams: { $option: FormOptions.$create, BatchID: -1 },
        //         });
        //     }
        // );
    }

    rangeDelete() {
        const deleteKeys = [];
        this.formListInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({ BatchID: m.BatchID });
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
        //日期
        this.searchPanelModel.data['DataDate'] = [new Date(), new Date()];
        let date = new NxConditionItem();
        date.label = this.translator.I18N.YHClearHouse.DataDate.text;
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
        condition_YHFarmerName.widget.props.dataSource = this.YHFarmerList;
        condition_YHFarmerName.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerName.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerName.widget.events.onValueChanged = (value, preValue) => {
            this.searchPanelModel.data.YHBatch = null;
            if (value) {
                this.BatchDataList.filter([
                    ["YHFarmerID", "=", value],
                    ["Status", "=", true]
                ]);
                this.BatchDataList.load();
            }
            else{
                this.BatchDataList.filter(["Status", "=", true]);
                this.BatchDataList.load();
            }
        }

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhChickenReceive.YHBatch.text;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.dataSource = this.BatchDataList;
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';

        this.searchPanelModel.conditionItems.push(
            date,
            condition_YHFarmerName,
            condition_YHBatch
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

        if (data['YHBatch']) {
            filter.push([['YHBatch', '=', data['YHBatch']]]);
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
        this.formListInstance.getSelectedRowsData().map((m) => {
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
                `<strong>${this.formListInstance.getSelectedRowsData().length}</strong>`
            )
        } else {
            tip = this.translator.I18N.reviewComponent.batchReview.cancelText.replace(
                '{0}',
                `<strong>${this.formListInstance.getSelectedRowsData().length}</strong>`
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
                        this.formListInstance.dataGrid.instance.refresh();
                        this.formListInstance.dataGrid.instance.clearSelection();
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
