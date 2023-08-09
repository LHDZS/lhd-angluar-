import { Component, OnInit, ViewChild } from '@angular/core';
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
import DataSource from 'devextreme/data/data_source';
import { DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { QlwODataContext, BasicSettingODataContext,QlwCustomerContext, PermissionContext } from 'src/app/providers/odataContext';
import { YhBatchTransferService } from '../yhbatchtransfer.service';
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
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';

@Component({
    selector: 'yhbatchtransfer',
    templateUrl: './yhbatchtransfer-list.component.html',
    styleUrls: ['./yhbatchtransfer-list.component.scss'],
})
export class YhBatchTransferListComponent {
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
        private router: Router,
        private service: YhBatchTransferService,
        private permissionContext: PermissionContext,
        private qlwOdataContext: QlwODataContext,
        private basicSettingODataContext: BasicSettingODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
    ) {
        this.init_data_grid().init_toolbar_panel().init_search_panel();
    }
    //#region 初始化表格配置
    init_data_grid(): YhBatchTransferListComponent {
        this.dataGridModel.primaryKey = 'NumericalOrder';
        const now = new Date();
        this.dataGridModel.export.fileName = `${
            this.translator.I18N.YhBatchTransfer.title
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
        // this.dataGridModel.commandColumn.deleteButton.visible = false;
        this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'YhBatchTransfer-list';
        this.dataGridModel.props.remoteOperations = true;

        return this;
    }
    get columns() {
        const col_numbericalorder = new NxDataGridColumn(
            this.translator.I18N.commonColumns.number.text,
            'Number',
            'string'
        );
        col_numbericalorder.props.filterOperations = ['contains',"="];
        col_numbericalorder.props.allowHeaderFiltering = false;
        col_numbericalorder.props.sortOrder = 'desc';
        col_numbericalorder.props.sortIndex = 1;
        col_numbericalorder.props.alignment = 'center';
        col_numbericalorder.props.fixed = true;

        const col_dataDate = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.DataDate.text,
            'DataDate',
            'date',
            'DataDate'
        );
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;
        col_dataDate.props.alignment = 'center';
        col_dataDate.props.fixed = true;


        const col_ChickenFarmID = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.ChickenFarmID.text,
            'ChickenFarmName',
            'string'
        );
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.lookup.enabled = true;
        col_ChickenFarmID.props.allowHeaderFiltering = false;
        col_ChickenFarmID.props.fixed = true;
        // col_ChickenFarmID.props.lookup.dataSource =  this.qlwCustomerContext.getSupplierDataSource();
        // col_ChickenFarmID.props.lookup.valueExpr = 'SupplierId';
        // col_ChickenFarmID.props.lookup.displayExpr = 'SupplierName';


        const col_OldYHFarmerID = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.OldYHFarmerID.text,
            'OldYHFarmerName',
            'string',
        );
        col_OldYHFarmerID.props.allowHeaderFiltering = false;
        col_OldYHFarmerID.props.alignment = 'left'

        const col_YHFarmerID = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.YHFarmerID.text,
            'YHFarmerName',
            'string',
        );
        col_YHFarmerID.props.allowHeaderFiltering = false;
        col_YHFarmerID.props.alignment = 'left'
        // col_YHFarmerID.props.lookup.enabled = true;
        // col_YHFarmerID.props.lookup.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
        //     filter: [
        //         [ 'status', '=', true ]
        //     ]
        // })
        // col_YHFarmerID.props.lookup.valueExpr = 'YHFarmerID';
        // col_YHFarmerID.props.lookup.displayExpr = 'YHFarmerName';

        const col_YHBatch = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.YHBatch.text,
            'YHBatchName',
            'string'
        );
        col_YHBatch.props.allowHeaderFiltering = false;
        col_YHBatch.props.alignment = 'left';
        // col_YHBatch.props.lookup.enabled = true;
        // col_YHBatch.props.lookup.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        // col_YHBatch.props.lookup.valueExpr = 'YHBatchID';
        // col_YHBatch.props.lookup.displayExpr = 'YHBatchName';

        //交接原因
        const col_TransferReason = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.TransferReason.text,
            'TransferReason',
            'string',
        );
        col_TransferReason.props.allowHeaderFiltering = false;
        col_TransferReason.props.lookup.enabled = true;
        col_TransferReason.props.alignment = 'left'

        const col_OldYHFarmerContract = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.OldYHFarmerContract.text,
            'OldYHFarmerContractName',
            'string',
        );
        col_OldYHFarmerContract.props.filterOperations = ['contains',"="];
        col_OldYHFarmerContract.props.allowHeaderFiltering = false;
        col_OldYHFarmerContract.props.alignment = 'left'

        const col_OldSerialNo = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.OldSerialNo.text,
            'OldSerialNo',
            'string',
        );
        col_OldSerialNo.props.filterOperations = ['contains',"="];
        col_OldSerialNo.props.allowHeaderFiltering = false;
        col_OldSerialNo.props.alignment = 'center';

        const col_YHFarmerContract = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.YHFarmerContract.text,
            'YHFarmerContractName',
            'number',
        );
        col_YHFarmerContract.props.filterOperations = ['between', '=','<>','<','<=','>','>='];
        col_YHFarmerContract.props.selectedFilterOperation = 'between';
        col_YHFarmerContract.props.allowHeaderFiltering = false;
        col_YHFarmerContract.props.alignment = 'left'

        const col_SerialNo = new NxDataGridColumn(
            this.translator.I18N.YhBatchTransfer.SerialNo.text,
            'SerialNo',
            'string',
        );
        col_SerialNo.props.filterOperations = ['contains',"="];
        col_SerialNo.props.allowHeaderFiltering = false;
        col_SerialNo.props.alignment = 'center'

        const col_remarks = new NxDataGridColumn(
            this.translator.I18N.dataGridOptions.remarks.text,
            'Remarks',
            'string',
        );
        col_remarks.props.filterOperations = ['contains',"="];
        col_remarks.props.allowHeaderFiltering = false;

        const col_AuditName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.AuditName.text,
            'AuditName',
            'string',
        );
        col_AuditName.props.filterOperations = ['contains',"="];
        col_AuditName.props.allowHeaderFiltering = false;
        col_AuditName.props.alignment = 'center'

        const col_CreatedOwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.CreatedOwnerName.text,
            'CreatedOwnerName',
            'string',
        );
        col_CreatedOwnerName.props.filterOperations = ['contains',"="];
        col_CreatedOwnerName.props.allowHeaderFiltering = false;
        col_CreatedOwnerName.props.alignment = 'center'

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

        const col_OwnerName = new NxDataGridColumn(
            this.translator.I18N.commandOptions.OwnerName.text,
            'OwnerName',
            'string',
        );
        col_OwnerName.props.filterOperations = ['contains',"="];
        col_OwnerName.props.allowHeaderFiltering = false;
        col_OwnerName.props.alignment = 'center'


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


        return [
            col_dataDate,
            col_numbericalorder,
            col_ChickenFarmID,
            col_OldYHFarmerID,
            col_YHBatch,
            col_YHFarmerID,
            col_TransferReason,
            col_YHFarmerContract,
            col_SerialNo,
            col_OldYHFarmerContract,
            col_OldSerialNo,
            col_remarks,
            col_AuditName,
            col_AuditDate,
            col_CreatedOwnerName,
            col_CreatedDate,
            col_OwnerName,
            col_ModifiedDate,
        ];
    }
    delete(rowData) {
        this.service
            .deleteByKey(rowData.data.NumericalOrder)
            .then((result: Result) => {
                const res = ResponseSuccess.handle(result);
                if (res.status) {
                    this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                    this.listInstance.dataGrid.instance.clearSelection();
                    this.listInstance.dataGrid.instance.refresh();
                } else {
                    this.toolbarInstance.error(`${res.message}`);
                }
            })
            .catch((e) => {
                const message = ResponseError.handler(e);
                this.toolbarInstance.error(message);
            });
    }
    edit(rowData) {
        this.listInstance.yheditToDetail(
            '/yhbatchtransfer/detail',
            rowData.rowIndex,
            this.translator.I18N.YhBatchTransfer.editPageTitle,
            {
                numericalOrder: rowData.data.NumericalOrder,
            }
        );
    }
    selectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }
    //#endregion
    //#region 初始化工具条配置
    init_toolbar_panel(): YhBatchTransferListComponent {
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
                new ColumnSetting(this.translator.I18N.commonColumns.number.text, 'Number'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.DataDate.text, 'DataDate'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.YHFarmerID.text, 'YHFarmerID'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.YHBatch.text, 'YHBatch'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.ChickenFarmID.text, 'ChickenFarmID'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.Abstract.text, 'Abstract'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.OutWarehouse.text, 'OutWarehouse'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.InWarehouse.text, 'InWarehouse'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.BreedName.text, 'BreedingName'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.ChickenType.text, 'ChickenType'),
                new ColumnSetting(this.translator.I18N.YhBatchTransferDetail.ProductName.text, 'ProductID'),
                new ColumnSetting(this.translator.I18N.YhBatchTransferDetail.ValueQuantity.text, 'ValueQuantity'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.TotalQuantity.text, 'TotalQuantity'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.Driver.text, 'Driver'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.ConfirmStatus.text, 'ConfirmStatus'),
                new ColumnSetting(this.translator.I18N.YhBatchTransfer.isbegin.text, 'isbegin'),
                new ColumnSetting(this.translator.I18N.dataGridOptions.remarks.text, 'Remarks'),
                // new ColumnSetting(this.translator.I18N.commandOptions.IsCheck.text, 'IsCheck'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditName.text, 'AuditName'),
                new ColumnSetting(this.translator.I18N.commandOptions.AuditDate.text, 'AuditDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.CreatedDate.text, 'CreatedDate'),
                new ColumnSetting(this.translator.I18N.commandOptions.OwnerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commandOptions.ModifiedDate.text, 'ModifiedDate'),
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
        this.toolbarPanelModel.storageKey = 'YhBatchTransfer-columns-storage';
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
    create() {
        this.listInstance.yhcreateToDetail(
            '/yhbatchtransfer/detail',
            this.translator.I18N.YhBatchTransfer.createPageTitle
        );
    }
    rangeDelete() {
        const deleteKeys = [];
        this.listInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({ NumericalOrder: m.NumericalOrder, NumericalOrderDetail: m.NumericalOrderDetail });
        });
        if (deleteKeys.length <= 0) {
            Notify.toast(this.translator.I18N.commandOptions.delete.emptyMessage, NotifyType.Warning);
            return false;
        }
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirmFormat.replace(
                '{0}',
                `<strong>${deleteKeys.length}</strong>`
            )
        ).then((require) => {
            if (require) {
                this.service
                    .delete(deleteKeys)
                    .then((result: Result) => {
                        const res = ResponseSuccess.handle(result);
                        if (res.status) {
                            this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                            this.listInstance.dataGrid.instance.clearSelection();
                            this.listInstance.dataGrid.instance.refresh();
                        } else {
                            this.toolbarInstance.error(`${res.message}`);
                        }
                    })
                    .catch((e) => {
                        const message = ResponseError.handler(e);
                        this.toolbarInstance.error(message);
                    });
            }
        });
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
        date.label = this.translator.I18N.YhBatchTransfer.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'DataDate';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();


        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YhBatchTransfer.YHFarmerID.text;
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'status', '=', true ]
            ]
        })
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']


        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhBatchTransfer.YHBatch.text;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName','MnemonicCode']
        condition_YHBatch.widget.events.onOpened = (e) => {
            let YHFarmerID = this.searchPanelModel.data['YHFarmerID'];
            if(YHFarmerID){
                let filter = [['Status', '=', true],['YHFarmerID','=',YHFarmerID]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName','MnemonicCode']
                }));
            }else{
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    select: ['YHBatchID', 'YHBatchName','MnemonicCode']
                }));
            }

        }
        //原养户id
        const condition_OldYHFarmerID = new NxConditionItem();
        condition_OldYHFarmerID.label = this.translator.I18N.YhBatchTransfer.OldYHFarmerID.text;
        condition_OldYHFarmerID.type = 'SelectBox';
        condition_OldYHFarmerID.dataField = 'OldYHFarmerID';
        condition_OldYHFarmerID.widget = new NxSelectBox();
        condition_OldYHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'status', '=', true ]
            ]
        })
        condition_OldYHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_OldYHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_OldYHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']

        //养殖场
        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.label = this.translator.I18N.YhBatchTransfer.ChickenFarmID.text;
        condition_ChickenFarmID.type = 'SelectBox';
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.props.showClearButton = true;
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource();
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';
        condition_ChickenFarmID.widget.events.onOpened = (e) => {
            let OldYHFarmerID = this.searchPanelModel.data['OldYHFarmerID'];
            if(OldYHFarmerID){
                let filter = [['YHFarmerID','=',OldYHFarmerID]];
                e.component.option('dataSource',this.basicSettingODataContext.getBizChickenFarmDataSource({
                    filter: filter,
                    select: ['ChickenFarmID','ChickenFarmName','YHFarmerID']
                }));
            }else{
                e.component.option('dataSource',this.basicSettingODataContext.getBizChickenFarmDataSource({
                    select: ['ChickenFarmID','ChickenFarmName','YHFarmerID']
                }));
            }

        }

        const condition_Number = new NxConditionItem();
        condition_Number.label = this.translator.I18N.commonColumns.number.text;
        condition_Number.type = 'TextBox';
        condition_Number.dataField = 'Number';
        condition_Number.widget = new NxTextBox();
        condition_Number.widget.props.showClearButton = true;


        this.searchPanelModel.conditionItems.push(
            date,
            condition_YHFarmerID,
            condition_YHBatch,
            condition_OldYHFarmerID,
            condition_ChickenFarmID,
            condition_Number
        );
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }
    reset(data) {
        let filter = [
            ['DataDate', '>=', new Date(new Date(data.date[0]).toLocaleDateString())],
            'and',
            [
                'DataDate',
                '<=',
                new Date(new Date(new Date(data.date[1]).getTime()).toLocaleDateString()),
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
        if (data['YHFarmerID']&&data['YHFarmerID']!="0") {
            filter.push(['YHFarmerID', '=', data['YHFarmerID']]);
        }
        if (data['OldYHFarmerID']&&data['OldYHFarmerID']!="0") {
            filter.push(['OldYHFarmerID', '=', data['OldYHFarmerID']]);
        }
        if (data['ChickenFarmID']&&data['ChickenFarmID']!="0") {
            filter.push(['ChickenFarmID', '=', data['ChickenFarmID']]);
        }
        if (data['YHBatch']) {
            filter.push(['YHBatch', '=', data['YHBatch']]);
        }
        // if (data['BatchID']) {
        //     filter.push(['BatchID', '=', data['BatchID']]);
        // }
        // if (data['Number']) {

        //     filter.push(['Number', 'contains', data['Number']]);
        // }
        // if (data['IsCheck']&&data['IsCheck']!="1") {
        //     if(data['IsCheck']=="3"){
        //         filter.push(['IsCheck', '=', true]);
        //     }
        //     else{
        //         filter.push(['IsCheck', '=', false]);
        //     }
        // }

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
