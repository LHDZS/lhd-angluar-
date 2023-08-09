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
import { YHFreightSettingService } from '../yhfarmerfreightsetting.service';
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
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';

@Component({
    selector: 'app-yhfarmerfreightsetting-list',
    templateUrl: './yhfarmerfreightsetting-list.component.html',
    styleUrls: ['./yhfarmerfreightsetting-list.component.scss'],
})
export class YHFarmerFreightSettingListComponent {
    datasource: any = null;
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('toolbarInstance', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    @ViewChild('FarmGrid', { static: false })
    FarmGrid: DxDataGridComponent;
    toolbarPanel: NxToolbarPanel = new NxToolbarPanel('list');
    formList: NxDataGrid = new NxDataGrid('list');
    
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

    YHFarmerList: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
        filter: [
            ['Status', '=', true]
        ]
    }));
    BatchDataList: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
        filter: ["Status", "=", true]
    }));

    formData: any = {};

    farmDropDataSource: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource());
    
    farmDataSource: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource());

    showFarmAdder: boolean = false;

    buttonDisable: boolean = true;
    
    constructor(
        private permissionContext: PermissionContext,
        private tokenService: TokenAuthService,
        private http: HttpClient,
        private service: YHFreightSettingService,
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
        this.formList.primaryKey = 'ChickenFarmID';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhFarmerfrightSetting-state-storing';
        this.formList.export.fileName = `${this.translator.I18N.YHOutHouseRecycle.title
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
        // let filter = '';
        // this.datasource.filter('');
        this.formList.props.dataSource = this.datasource;
        this.formList.props.columnAutoWidth = true;
        this.formList.columns.push(...this.columns);
        // this.formList.events.onRowDblClick = this.rowDbClick.bind(this);
        this.formList.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.formList.commandColumn.deleteButton.confirm = this.delete.bind(this);
        // this.formList.commandColumn.editButton.onClick = this.edit.bind(this);
        this.formList.commandColumn.editButton.visible = false;
    }

    get columns() {
        
        //养户名称
        const col_ChickenFarmID = new NxDataGridColumn("养殖场名称", 'ChickenFarmID', 'string', 'ChickenFarmName');
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.allowFiltering = true;
        col_ChickenFarmID.props.filterOperations = ['contains'];
        col_ChickenFarmID.props.fixed = true;

        //地区
        const col_AreaID = new NxDataGridColumn("地区", 'AreaID', 'string', 'AreaName');
        col_AreaID.props.allowHeaderFiltering = false;
        col_AreaID.props.allowFiltering = true;
        col_AreaID.props.filterOperations = ['contains'];

        //详细地址
        const col_FullAddress = new NxDataGridColumn("详细地址", 'FullAddress', 'string');
        col_FullAddress.props.allowHeaderFiltering = false;
        col_FullAddress.props.allowFiltering = true;
        col_FullAddress.props.filterOperations = ['contains'];

        //饲料运价
        const col_TotalQuantity = new NxDataGridColumn("饲料运价", 'FeedFreight', 'number');
        col_TotalQuantity.props.alignment = "right";
        col_TotalQuantity.props.allowHeaderFiltering = false;
        col_TotalQuantity.props.allowFiltering = true;
        col_TotalQuantity.props.filterOperations = ['<', '<=', '=', '>=', '>', 'between'];

        //禽苗运价
        const col_TotalNetWeight = new NxDataGridColumn("领苗运价", 'ChickFreight', 'number');
        col_TotalNetWeight.props.alignment = "right";
        col_TotalNetWeight.props.allowHeaderFiltering = false;
        col_TotalNetWeight.props.allowFiltering = true;
        col_TotalNetWeight.props.filterOperations = ['<', '<=', '=', '>=', '>', 'between'];

        //肉禽回收运价
        const col_TotalAmount = new NxDataGridColumn("肉禽回收运价", 'ChickenRecycleFreight', 'number');
        col_TotalAmount.props.alignment = "right";
        col_TotalAmount.props.allowHeaderFiltering = false;
        col_TotalAmount.props.allowFiltering = true;
        col_TotalAmount.props.filterOperations = ['<', '<=', '=', '>=', '>', 'between'];

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycle.Remarks.text, 'Remarks', 'string');
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = true;
        col_Remarks.props.filterOperations = ['contains'];
        
        return [
            col_ChickenFarmID,
            col_AreaID,
            col_FullAddress,
            col_TotalQuantity,
            col_TotalNetWeight,
            col_TotalAmount,
            col_Remarks
        ];
    }

    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }

    delete(rowData) {
        this.service.delete(rowData.data.ChickenFarmID).then((result: Result) => {
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
            '/yhfreightsetting/create',
            rowData.rowIndex,
            this.translator.I18N.YHOutHouseRecycle.editPageTitle,
            {
                NumericalOrder: rowData.data.NumericalOrder,
            }
        )
    }

    rowDbClick(rowData){
        this.formListInstance.yheditToDetail(
            '/yhfreightsetting/create',
            rowData.rowIndex,
            this.translator.I18N.YHOutHouseRecycle.editPageTitle,
            {
                NumericalOrder: rowData.data.NumericalOrder,
            }
        )
    }

    //#endregion

    //#region 工具条配置

    init_toolbar_panel() {
        (<NxButton>this.toolbarPanel.getWidgetByKey('create')).events.onClick = this.startAddFarm.bind(this);
        // (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).events.onClick = this.rangeDelete.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('review')).props.visible = false;
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
                new ColumnSetting("养殖场名称", 'ChickenFarmID'),
                new ColumnSetting("地区", 'AreaID'),
                new ColumnSetting("详细地址", 'FullAddress'),
                new ColumnSetting("饲料运价", 'FeedFreight'),
                new ColumnSetting("禽苗运价", 'ChickFreight'),
                new ColumnSetting("肉禽回收运价", 'ChickenRecycleFreight'),
                new ColumnSetting("备注", 'Remarks'),
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
        this.toolbarPanel.storageKey = 'yhFarmerFreightSetting-columns-storage';
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
        this.formListInstance.yhcreateToDetail('/yhfreightsetting/create', this.translator.I18N.YHOutHouseRecycle.createPageTitle);
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

    // rangeDelete() {
    //     const deleteKeys = [];
    //     this.formListInstance.getSelectedRowsData().map((m) => {
    //         deleteKeys.push({ BatchID: m.BatchID });
    //     });
    //     MessageBox.confirm(`您确认要删除这 <strong>${deleteKeys.length}</strong> 项吗?`).then((require) => {
    //         if (require) {
    //             this.service.deleteList(deleteKeys).then((result: Result) => {
    //                 const response = ResponseSuccess.handle(result);
    //                 if (response.status) {
    //                     this.toolbarInstance.success(`删除${response.message}`);
    //                     this.formListInstance.dataGrid.instance.refresh();
    //                 } else {
    //                     this.toolbarInstance.error(`${response.message}`);
    //                 }
    //             });
    //         }
    //     });
    // }

    //#endregion

    //#region 搜索面板

    init_search_panel() {
        //养户名称
        const condition_YHFarmerName = new NxConditionItem();
        condition_YHFarmerName.label = "养殖场名称";
        condition_YHFarmerName.type = 'SelectBox';
        condition_YHFarmerName.dataField = 'ChickenFarmID';
        condition_YHFarmerName.widget = new NxSelectBox();
        condition_YHFarmerName.widget.props.showClearButton = true;
        condition_YHFarmerName.widget.props.dataSource = this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource();
        condition_YHFarmerName.widget.props.valueExpr = "ChickenFarmID";
        condition_YHFarmerName.widget.props.displayExpr = "ChickenFarmName";
        // condition_YHFarmerName.widget.events.onValueChanged = (value, preValue) => {
        //     this.searchPanelModel.data.YHBatch = null;
        //     if (value) {
        //         this.BatchDataList.filter([
        //             ["YHFarmerID", "=", value],
        //             ["Status", "=", true]
        //         ]);
        //         this.BatchDataList.load();
        //     }
        //     else{
        //         this.BatchDataList.filter(["Status", "=", true]);
        //         this.BatchDataList.load();
        //     }
        // }
        
        this.searchPanelModel.conditionItems.push(
            condition_YHFarmerName,
        )

        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        
        return this;
    }

    reset(data) {
        let filter = ''
        this.datasource.filter(filter);
        this.datasource.reload();
    }

    search(data) {
        let filter = [];

        if (data['ChickenFarmID']) {
            filter.push([['ChickenFarmID', '=', data['ChickenFarmID']]]);
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
    
    //#region 养殖场添加窗口
    onSelectionChangedEvent(e)
    {
        this.buttonDisable = this.FarmGrid.instance.getSelectedRowsData().length <= 0;
    }

    async startAddFarm()
    {
        this.FarmGrid.instance.clearSelection();
        this.buttonDisable = this.FarmGrid.instance.getSelectedRowsData().length <= 0;
        this.showFarmAdder = true;

        this.farmDataSource = new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource());

        this.formData = {
            ChickenFarmID: null,
            DaysOld: null,
            FeedFreight: null,
            ChickFreight: null,
            ChickenRecycleFreight: null,
            Remarks: ""
        }
    }

    async onFieldDataChanged(e) {
        switch(e.dataField) {
            case 'ChickenFarmID':
                var allChickenFarmList = (await this.datasource.load()).map(m => m.ChickenFarmID);

                if(e.value)
                {
                    this.farmDataSource.filter(m => {
                        return allChickenFarmList.indexOf(m.ChickenFarmID) == -1 && m.ChickenFarmID == e.value;
                    });
                }
                else
                {
                    this.farmDataSource.filter(m => {
                        return allChickenFarmList.indexOf(m.ChickenFarmID) == -1;
                    });
                }
                this.farmDataSource.reload();
                break;
            case 'FeedFreight':
            case 'ChickFreight':
            case 'ChickenRecycleFreight':
                if(e.value) {
                    this.formData[e.dataField] = Math.abs(e.value);
                }
                break;
            default:
                break;
        }
    }

    async onSave(){
        
        var saveDatas = this.FarmGrid.instance.getSelectedRowsData().map(m => {
            m.FeedFreight = this.formData.FeedFreight || 0;
            m.ChickFreight = this.formData.ChickFreight || 0;
            m.ChickenRecycleFreight = this.formData.ChickenRecycleFreight || 0;
            m.ComboPack = DataDictionary.ComboPackJ;
            m.Remarks = this.formData.Remarks;
            return m;
        });

        if(saveDatas.length <= 0)
        {
            Notify.warning("请先选择养殖场");
            return;
        }
        if(!(this.formData.FeedFreight || this.formData.ChickFreight || this.formData.ChickenRecycleFreight))
        {
            Notify.warning("饲料运价、禽苗运价、肉禽回收运价不可都为空");
            return;
        }

        this.service.post({YHFarmerFreightSettings:saveDatas}).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                Notify.success("添加成功");
                this.formListInstance.dataGrid.instance.refresh();
                this.showFarmAdder = false;
            } else {
                Notify.toast(response.message, NotifyType.Error);
                this.toolbarInstance.error(`${response.message}`);
            }
        });

    }
    
    //#endregion
    
}
