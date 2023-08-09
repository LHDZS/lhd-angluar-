import { Component, ViewChild } from '@angular/core';
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
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { QlwODataContext,BasicSettingODataContext, PermissionContext} from 'src/app/providers/odataContext';
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
import { NxDropDownButton } from 'src/app/components/component-model/drop-down-button/model';
import { NxReview } from 'src/app/components/review/review.extend';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { FarmingPriceProposalsService } from '../farmingpriceproposals.service';

@Component({
    selector: 'app-farmingpriceproposals-list',
    templateUrl: './farmingpriceproposals-list.component.html',
    styleUrls: ['./farmingpriceproposals-list.component.scss'],
    providers: [FarmingPriceProposalsService],
})
export class FarmingPriceProposalsListComponent {
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
    constructor(
        private tokenService: TokenAuthService,
        private http: HttpClient,
        private _router: Router,
        private permissionContext: PermissionContext,
        private service: FarmingPriceProposalsService,
        private BasicSettingODataContext: BasicSettingODataContext,
        private qlwODataContext: QlwODataContext,
        private translator: TranslateService
    ) {
        this.init_data_grid().init_toolbar_panel().init_search_panel();
    }
    //#region 初始化表格配置
    init_data_grid(): FarmingPriceProposalsListComponent {
        this.dataGridModel.primaryKey = 'NumericalOrder';
        const now = new Date();
        this.dataGridModel.export.fileName = `${
            "养殖价格方案"
        }-${new DateTime().toString()}`;
        this.datasource = this.service.getListDataSource();
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().setDate(1)).toLocaleDateString())],
            'and',
            ['DataDate', '<=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
        ];
        this.datasource.filter(filter);
        this.dataGridModel.props.dataSource = this.datasource;
        this.dataGridModel.props.columnAutoWidth = true;
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'farmingpriceproposals-list';
        return this;
    }
    get columns() {

        const col_number = new NxDataGridColumn(
            this.translator.I18N.commonColumns.number.text,
            'Number',
            'string'
        );
        col_number.props.allowHeaderFiltering = false;

        const col_dataDate = new NxDataGridColumn(
            '制单日期',
            'DataDate',
            'date',
            'DataDate'
        );
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;

        const col_Breeding = new NxDataGridColumn(
            '品种',
            'BreedingID',
            'string',
            'BreedingName'
        );
        col_Breeding.props.allowHeaderFiltering = false;
        col_Breeding.props.lookup.enabled = true;
        col_Breeding.props.lookup.dataSource = this.BasicSettingODataContext.getZqBreedingsetDataSource({
            select: ['BreedingID','BreedingName']
        });
        col_Breeding.props.lookup.valueExpr = 'BreedingID';
        col_Breeding.props.lookup.displayExpr = 'BreedingName';

        const col_EffectDate = new NxDataGridColumn(
            '生效日期',
            'EffectDate',
            'date',
            'EffectDate'
        );
        col_EffectDate.props.format = 'yyyy/MM/dd';
        col_EffectDate.props.filterOperations = ['between', '='];
        col_EffectDate.props.selectedFilterOperation = 'between';

        const col_AuditName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.AuditName.text,
            'AuditName',
            'string',
        );
        col_AuditName.props.filterOperations = ['contains',"="];
        col_AuditName.props.allowHeaderFiltering = false;

        const col_CreatedOwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedOwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_CreatedOwnerName.props.filterOperations = ['contains',"="];
        col_CreatedOwnerName.props.allowHeaderFiltering = false;

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
        col_CreatedDate.props.sortOrder = 'desc';
        col_CreatedDate.props.sortIndex = 1;

        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
        col_OwnerName.props.allowHeaderFiltering = false;


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

        const col_remarks = new NxDataGridColumn(
            this.translator.I18N.dataGridOptions.remarks.text,
            'Remarks',
            'string',
        );
        col_remarks.props.filterOperations = ['contains',"="];
        col_remarks.props.allowHeaderFiltering = false;

        const col_IsCheck = new NxDataGridColumn(
            this.translator.I18N.commandOptions.IsCheck.text,
            'IsCheck',
            'string'
        );
        col_IsCheck.props.trueText = "已审核";
        col_IsCheck.props.falseText = "未审核";
        col_IsCheck.props.dataType="boolean";
        col_IsCheck.props.allowHeaderFiltering = false;

        return [
            col_dataDate,
            col_number,
            col_Breeding,
            col_EffectDate,
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
        this.service.delete(rowData.data.NumericalOrder).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                this.listInstance.dataGrid.instance.clearSelection();
                this.listInstance.dataGrid.instance.refresh();
            } else {
                this.toolbarInstance.error(`${response.message}`);
            }
        });
    }
    create() {
        HomeHelper.open(
            {
                title: '养殖价格方案-新增',
                url: `${environment.qqlwUri}/farmingpriceproposals/detail?mode=create`,
            },
            () => {
                this._router.navigate(['/farmingpriceproposals/detail'], {
                    queryParams: {
                        mode: 'create',
                    },
                });
            }
        );
    }
    edit(rowData) {
        HomeHelper.open(
            {
                title: '养殖价格方案-编辑',
                url: `${environment.qqlwUri}/farmingpriceproposals/detail?mode=edit&numericalOrder=${rowData.data.NumericalOrder}`,
            },
            () => {
                this._router.navigate(['/farmingpriceproposals/detail'], {
                    queryParams: {
                        mode: 'edit',
                        numericalOrder: rowData.data.NumericalOrder,
                    },
                });
            }
        );
    }
    selectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }
    //#endregion
    //#region 初始化工具条配置
    init_toolbar_panel(): FarmingPriceProposalsListComponent {
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
                new ColumnSetting('制单日期', 'DataDate'),
                new ColumnSetting(this.translator.I18N.commonColumns.number.text, 'Number'),
                new ColumnSetting("品种", 'BreedingID'),
                new ColumnSetting("生效日期", 'EffectDate'),
                new ColumnSetting(this.translator.I18N.dataGridOptions.remarks.text, 'Remarks'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.IsCheck.text, 'IsCheck'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditName.text, 'AuditName'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditDate.text, 'AuditDate'),
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
        this.toolbarPanelModel.moreButton.events.onItemClick = (e) => {
            if (e.type == 'export') {
                this.print();
            }
        };
        // 设置隐藏列缓存
        this.toolbarPanelModel.storageKey = 'farmingpriceproposals-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanelModel.storageKey));
        this.dataGridModel.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });
        return this;
    }
    print() {
        if (this.listInstance.getSelectedRowsData().length > 0) {
            this.listInstance.dataGrid.instance.exportToExcel(true);
        } else {
            this.listInstance.dataGrid.instance.exportToExcel(false);
        }
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
        this.searchPanelModel.data['DataDate'] = [new Date(new Date().setDate(1)), new Date()];
        let date = new NxConditionItem();
        date.label = '制单日期';
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        const condition_Breed = new NxConditionItem();
        condition_Breed.label = "品种";
        condition_Breed.type = 'SelectBox';
        condition_Breed.dataField = 'BreedingID';
        condition_Breed.widget = new NxSelectBox();
        condition_Breed.widget.props.showClearButton = true;
        condition_Breed.widget.props.disabled = false;
        condition_Breed.widget.props.valueExpr = 'BreedingID';
        condition_Breed.widget.props.displayExpr = 'BreedingName';
        condition_Breed.widget.props.dataSource = this.BasicSettingODataContext.getZqBreedingsetDataSource({
            select: ['BreedingID','BreedingName']
        });
        condition_Breed.widget.props.searchExpr = ['BreedingName', 'MnemonicCode'];

        let EffectDate = new NxConditionItem();
        EffectDate.label = '生效日期';
        EffectDate.type = 'StartEndDateBox';
        EffectDate.dataField = 'EffectDate';
        EffectDate.widget = new NxDateBox();
        EffectDate.widget.props.showClearButton = true;
        EffectDate.widget.props.max = new Date();

        this.searchPanelModel.conditionItems.push(
            date,
            condition_Breed,
            EffectDate,
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
        if (data['BreedingID']) {
            filter.push(['BreedingID', '=', data['BreedingID']]);
        }

        if (data.EffectDate&&data.EffectDate[0] && data.EffectDate[1]) {
            filter.push([
                ['EffectDate', '>=', new Date(new Date(data.EffectDate[0]).toLocaleDateString())],
                'and',
                [
                    'EffectDate',
                    '<=',
                    new Date(new Date(new Date(data.EffectDate[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (data.EffectDate&&data.EffectDate[0]) {
                filter.push(['EffectDate', '>=', new Date(new Date(data.EffectDate[0]).toLocaleDateString())]);
            }
            if (data.EffectDate&&data.EffectDate[1]) {
                filter.push([
                    'EffectDate',
                    '<=',
                    new Date(new Date(new Date(data.EffectDate[1]).getTime()).toLocaleDateString()),
                ]);
            }
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
        this.listInstance.getSelectedRowsData().map((m) => {
            if (!idObj[m.NumericalOrder]) {
                idObj[m.NumericalOrder] = true
                console.log("m",m,isReview,user)
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
                            // Source: environment.review.source,
                            Source: 1,
                            // "Sync":{
                            //     "KeyMode":"none",
                            //     "Enable":true,
                            //     "MasterApp":1
                            // }
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