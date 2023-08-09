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
import { Result, ResponseSuccess, ResponseError } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { DataDictionary, FormOptions } from 'src/app/providers/enums';
import { Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { yhmaterialsettingsService } from '../yhmaterialsettings.service';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { TokenAuthService } from 'src/app/shared/services';
import { DataSourceParamters } from 'src/app/providers/odataContext/helper';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxDropDownButton } from 'src/app/components/component-model/drop-down-button/model';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { NxReview } from 'src/app/components/review/review.extend';

@Component({
    selector: 'app-yhmaterialsettings-list',
    templateUrl: './yhmaterialsettings-list.component.html',
    styleUrls: ['./yhmaterialsettings-list.component.scss'],
})
export class yhmaterialsettingsListComponent {
    datasource: any = null;
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('toolbarInstance', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    toolbarPanel: NxToolbarPanel = new NxToolbarPanel('list');
    formList: NxDataGrid = new NxDataGrid('list');
    isDisplayReview: boolean = false;
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
        private service: yhmaterialsettingsService,
        private basicSettingODataContext: BasicSettingODataContext,
        private router: Router,
        private http: HttpClient,
        private permissionContext: PermissionContext,
        private qlwOdataContext: QlwODataContext,
        private statusODataContext: StatusODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private translator: TranslateService,
        private tokenService: TokenAuthService,
        private qlwCustomerContext: QlwCustomerContext,
    ) {
        this.searchPanelModel.data['DataDate'] = [new Date(new Date().setDate(1)), new Date()];

        // this.searchPanelModel.data['EffectDate'] = [new Date(new Date().getFullYear(),0), new Date()];
        
        this.init_data_grid();
        this.init_toolbar_panel();
        this.init_search_panel();
    }

    ngOnInit() { 
        
    }

    //#region 初始化表格配置
    init_data_grid() {
        
        this.formList.primaryKey = 'numericalOrder';
        this.formList.stateStoring.enabled = true;
        this.formList.stateStoring.storageKey = 'yhmaterialsettings-state-storing';
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
        //制单日期
        const col_DataDate = new NxDataGridColumn(
            this.translator.I18N.yhmaterialsettingsSetting.DataDate.text,
            'DataDate',
            'date',
        );
        col_DataDate.props.allowHeaderFiltering = false;
        col_DataDate.props.format = 'yyyy/MM/dd';
        col_DataDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.DataDate).toString('yyyy/MM/dd');
        }
        col_DataDate.props.alignment = 'center'
        col_DataDate.props.fixed = true;
        //单据号
        const col_Number = new NxDataGridColumn(this.translator.I18N.yhmaterialsettingsSetting.Number.text, 'Number');
        col_Number.props.allowHeaderFiltering = false;
        col_Number.props.allowFiltering = false;
        col_Number.props.filterOperations = ['contains'];
        col_Number.props.fixed = true;


        //生效日期
        const col_EffectDate = new NxDataGridColumn(
            this.translator.I18N.yhmaterialsettingsSetting.EffectDate.text,
            'EffectDate',
            'date',
        );
        col_EffectDate.props.allowHeaderFiltering = false;
        col_EffectDate.props.format = 'yyyy/MM/dd';
        col_EffectDate.props.calculateDisplayValue = (row) => {
            return new DateTime(row.EffectDate).toString('yyyy/MM/dd');
        }
        col_EffectDate.props.alignment = 'center'
        col_EffectDate.props.fixed = true;


        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.yhmaterialsettingsSetting.Remarks.text, 'Remarks');
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = false;
        col_Remarks.props.filterOperations = ['contains'];

        //创建人
        const col_CreatedOwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedOwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_CreatedOwnerName.props.filterOperations = ['contains',"="];
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

        //修改人
        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
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
            if(row.AuditDate){
                return new DateTime(row.AuditDate).toString('yyyy/MM/dd HH:mm:ss');
            }
            else{
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
        col_IsCheck.props.dataType="boolean";
        col_IsCheck.props.allowHeaderFiltering = false;
        col_IsCheck.props.alignment = 'center';

        return [
            col_DataDate,
            col_Number,
            col_EffectDate,
            col_Remarks,
            col_CreatedOwnerName,
            col_CreatedDate,
            col_OwnerName,
            col_ModifiedDate,
            col_IsCheck,
            col_AuditDate
        ];
    }

    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }

    create() {
        // let createTitle = this.translator.I18N.yhmaterialsettingsSetting.create + this.service.PoultryFarmDisplayText;
        this.formListInstance.yhcreateToDetail('/yhmaterialsettings/detail', this.translator.I18N.yhmaterialsettingsSetting.create);
    }

    edit(rowData) {
        let editTitle = this.translator.I18N.yhmaterialsettingsSetting.edit;
        this.formListInstance.yheditToDetail(
            '/yhmaterialsettings/detail',
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
                this.toolbarInstance.success(`${this.translator.I18N.yhmaterialsettingsSetting.delete + response.message}`);
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
        // (<NxButton>this.toolbarPanel.getWidgetByKey('review')).props.visible = false;
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeDelete')).props.visible = false;
        this.toolbarPanel.checkInfo.visible = false;
        this.toolbarPanel.moreButton.props.visible = false;
        this.toolbarPanel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanel.getOtherWidgetByKey('filterRow').events.onClick = this.toggleFilterRow.bind(this);
        (<NxButton>this.toolbarPanel.getWidgetByKey('rangeReview')).props.visible = false;
        (<NxDropDownButton>this.toolbarPanel.getWidgetByKey('review')).events.onButtonClick = (e) => {
            this.rangeReview(true)
        };
        (<NxDropDownButton>this.toolbarPanel.getWidgetByKey('review')).events.onItemClick = (e) => {
            this.rangeReview(false)
        };
        this.toolbarPanel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.Number.text, 'Number'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.YhName.text, 'YhName'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.YHBatch.text, 'YHBatch'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.FarmingCanProfit.text, 'FarmingCanProfit'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.RollInMarginBalance.text, 'RollInMarginBalance'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.EffectDate.text, 'EffectDate'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.PersonID.text, 'PersonID'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.FarmingPriceID.text, 'FarmingPriceID'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.YHFarmerContract.text, 'YHFarmerContract'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.SerialNo.text, 'SerialNo'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.ChickenFarmID.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.yhmaterialsettingsSetting.Remarks.text, 'Remarks'),
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
        this.toolbarPanel.storageKey = 'yhmaterialsettings-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanel.storageKey));
        this.formList.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });

    }

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
        let checkable = false;
        this.formListInstance.getSelectedRowsData().map((m) => {
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
        //制单日期
        let date = new NxConditionItem();
        date.label = this.translator.I18N.yhmaterialsettingsSetting.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        // date.widget.props.max = new Date();

        //单据号
        const condition_Number = new NxConditionItem();
        condition_Number.label = this.translator.I18N.yhmaterialsettingsSetting.Number.text;
        condition_Number.type = 'TextBox';
        condition_Number.dataField = 'Number';
        condition_Number.widget = new NxTextBox();
        condition_Number.widget.props.showClearButton = true;

        //生效日期
        const condition_EffectDate = new NxConditionItem();
        condition_EffectDate.label = this.translator.I18N.yhmaterialsettingsSetting.EffectDate.text;
        condition_EffectDate.type = 'StartEndDateBox';
        condition_EffectDate.dataField = 'EffectDate';
        condition_EffectDate.widget = new NxDateBox();
        condition_EffectDate.widget.props.showClearButton = true;
        // condition_EffectDate.widget.props.max = new Date();

        

        this.searchPanelModel.conditionItems.push(
            date,
            condition_Number,
            condition_EffectDate
            
        );
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }

    private getFliter() {

        let filter = []
        let data = this.searchPanelModel.data;
        if (data['DataDate'][0] && data['DataDate'][1]) {
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
        console.log(filter,'filter')
        return new DataSource({
            store: this.service.store,
            filter: filter.length > 0 ? filter : '',
        });
    }

    search(data) {
        let filter = this.getFliter();

        if (data['EffectDate'] && data['EffectDate'][0] && data['EffectDate'][1]) {
            filter.push([
                ['EffectDate', '>=', new Date(new Date(data['EffectDate'][0]).toLocaleDateString())],
                'and',
                [
                    'EffectDate',
                    '<=',
                    new Date(new Date(new Date(data['EffectDate'][1]).getTime()).toLocaleDateString()),
                ],
            ]);
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
