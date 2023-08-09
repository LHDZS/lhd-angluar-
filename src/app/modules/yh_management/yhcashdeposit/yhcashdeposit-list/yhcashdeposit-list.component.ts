import { Component, OnInit, ViewChild } from '@angular/core';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxSearchPanel } from 'src/app/components/search-panel/search-panel-extend';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { ResponseError, ResponseSuccess, Result } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { ZlwBasicSettingODataContext, QlwODataContext, QlwProductContext, PermissionContext, YHBasicSettingODataContext, } from 'src/app/providers/odataContext';
import {   PigDataDictionary, ProductClassification, QlwDataDictionary } from 'src/app/providers/enums';
import { INxExcelImportComponent, NxExcelImportComponent } from 'src/app/nxin/ui/extensions/basic/excel_import';
import { NxDropDownButton, NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';
import { QlwImportTemplateService } from 'src/app/providers/data/excel-import-templates';
import { DateTime } from 'src/app/providers/common/datetime';
import { NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { TokenAuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslateI18N, TranslateService } from 'src/app/providers/i18n-translate';
import { NxReview } from 'src/app/components/review/review.extend';
import DataSource from 'devextreme/data/data_source';
import { ActivatedRoute } from '@angular/router';
import { YhCashDepositService } from '../yhcashdeposit.service';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';

@Component({
    selector: 'app-yhcashdeposit',
    templateUrl: './yhcashdeposit-list.component.html',
    styleUrls: ['./yhcashdeposit-list.component.scss'],
})
export class YhCashDepositListComponent {
    datasource: any = null;
    dataGridModel: NxDataGrid = new NxDataGrid('list');
    toolbarPanelModel: NxToolbarPanel = new NxToolbarPanel('list');
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    @ViewChild('list', { static: false })
    listInstance: NxFormListComponent;
    @ViewChild('toolbar', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    permission: PermissionService = new PermissionService();
    //审核人
    reviewer: {
        CheckedByID?: string;
        CheckedByName?: string;
        Level?: number;
        IsAdd?: boolean;
        RecordID?: number;
    };
    // 传入导入组件的配置对象
    @ViewChild('excel', { static: false })
    excelImport: INxExcelImportComponent;
    excelModel: NxExcelImportComponent;
    review: NxReview = new NxReview();
    constructor(
        private tokenService: TokenAuthService,
        private http: HttpClient,
        private service: YhCashDepositService,
        private translator: TranslateService,
        private permissionContext: PermissionContext,
        private importService: QlwImportTemplateService,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private _statusODataContext: StatusODataContext,
    ) {
        this.init_data_grid().init_toolbar_panel().init_search_panel();
        this.excelModel = {
            title: this.importService.yhcashdeposit.title,
            xlsxTemplatePath: this.importService.yhcashdeposit.xlsxPath,
            jsonTemplatePath: this.importService.yhcashdeposit.jsonPath,
            importServer: this.importService.yhcashdeposit.server,
            onImportSuccess: (response) => {
                this.listInstance.dataGrid.instance.refresh();
            },
        };
    }

    //#region 初始化表格配置
    init_data_grid(): YhCashDepositListComponent {
        this.dataGridModel.primaryKey = 'NumericalOrderDetail';
        const now = new Date();
        this.dataGridModel.export.fileName = `${this.translator.I18N.YHCashDeposit.title}-${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}`;

        this.datasource = this.service.getListCustomDataSource();
        let filter = [
            ['DataDate', '>=', new Date(new Date(new Date().getTime()).toLocaleDateString())],
            'and',
            ['DataDate', '<', new Date(new Date(new Date().getTime()).toLocaleDateString())],
        ];

        this.datasource.filter(filter);

        this.dataGridModel.props.dataSource = this.datasource
        this.dataGridModel.props.columnAutoWidth = true;
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.events.onSelectionChanged = this.selectionChanged.bind(this);
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.stateStoring.storageKey = 'yhcashdeposit-list';
        this.dataGridModel.props.remoteOperations=true;//后端处理分页等
        return this;
    }
    get columns() {

        const numbericalorder = new NxDataGridColumn(
            this.translator.I18N.commonColumns.numericalOrder.text,
            'NumericalOrder',
            'string'
        );
        numbericalorder.props.visible = false;

        //日期
        const col_dataDate = new NxDataGridColumn(
            this.translator.I18N.YHCashDeposit.DataDate.text,
            'DataDate',
            'date'
        );
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;
        col_dataDate.props.allowFiltering = false;
        col_dataDate.props.fixed = true;
        col_dataDate.props.fixedPosition = "left";
        col_dataDate.props.alignment = "center";
        //单据号
        const col_number = new NxDataGridColumn(
            this.translator.I18N.commonColumns.number.text,
            'Number',
            'string'
        );
        col_number.props.fixed = true;
        col_number.props.fixedPosition = "left";
        col_number.props.alignment = "center";
        //养户姓名
        const col_farmerName = new NxDataGridColumn(
            this.translator.I18N.YHCashDeposit.YHFarmerID.text,
            'YHFarmerName',
            'string'
        );
        col_farmerName.props.allowHeaderFiltering = false;
        col_farmerName.props.allowFiltering = false;
        col_farmerName.props.fixed = true;
        col_farmerName.props.fixedPosition = "left";
        col_farmerName.props.alignment = "center";
        //收支类型
        const col_accountType = new NxDataGridColumn(
            this.translator.I18N.YHCashDeposit.AccountType.text,
            'AccountTypeName',
            'string'
        );
        col_accountType.props.allowHeaderFiltering = false;
        col_accountType.props.allowFiltering = false;
        col_accountType.props.fixed = true;
        col_accountType.props.fixedPosition = "left";
        col_accountType.props.alignment = "center";
        // 关联单据类型
        const condition_quoteBillType = new NxDataGridColumn('关联单据','QuoteBillType','string');
        condition_quoteBillType.props.lookup.enabled = true;
        condition_quoteBillType.props.lookup.valueExpr = 'DictId';
        condition_quoteBillType.props.lookup.displayExpr = 'DictName';
        condition_quoteBillType.props.lookup.dataSource =  this._statusODataContext.getQuoteBillTypeDataSource();

        // 关联单据号
        const condition_quoteNumber = new NxDataGridColumn('关联单号','QuoteNumber','string');
        condition_quoteNumber.props.customizeText = (cellInfo) => {
            // 验证是否有值
            if(cellInfo.value==0){
                return ''
            } else{
                return  cellInfo.value;
            }
        }

        // 金额
        const col_amount = new NxDataGridColumn('金额','Amount','number');
        // 备注
        const col_remark = new NxDataGridColumn('备注','Remarks','string');


        const col_createdOwner = new NxDataGridColumn(
            this.translator.I18N.commonColumns.createdOwnerName.text,
            'CreatedOwnerName',
            'string'
        );

        const col_owner = new NxDataGridColumn(
            this.translator.I18N.commonColumns.ownerName.text,
            'OwnerName',
            'string'
        );

        const col_checker = new NxDataGridColumn(
            this.translator.I18N.commonColumns.auditName.text,
            'AuditName',
            'string'
        );
        const col_checker_date = new NxDataGridColumn(
            this.translator.I18N.commonColumns.auditDate.text,
            'AuditDate',
            'date'
        );
        col_checker_date.props.format = 'yyyy-MM-dd';
        col_checker_date.props.filterOperations = ['between', '='];
        col_checker_date.props.selectedFilterOperation = 'between';
        col_checker_date.props.customizeText = (cellInfo) => {
            // 验证是否有值
            if(cellInfo.value){
                // 判断是是否是过滤行 在行过滤中使用 yyyy-MM-dd 的格式
                if(cellInfo.target == 'filterRow'){
                    return new DateTime(cellInfo.value).toString()
                } else{
                    // 在列表中使用 yyyy-MM-dd HH:mm:ss 的格式
                    return new DateTime(cellInfo.value).toString('yyyy-MM-dd HH:mm:ss')
                }
            } else{
                return ''
            }
        }

        const col_create_date = new NxDataGridColumn(
            this.translator.I18N.commonColumns.createdDate.text,
            'CreatedDate',
            'date'
        );
        col_create_date.props.format = 'yyyy-MM-dd';
        col_create_date.props.customizeText = (cellInfo) => {
            // 验证是否有值
            if(cellInfo.value){
                // 判断是是否是过滤行 在行过滤中使用 yyyy-MM-dd 的格式
                if(cellInfo.target == 'filterRow'){
                    return new DateTime(cellInfo.value).toString()
                } else{
                    // 在列表中使用 yyyy-MM-dd HH:mm:ss 的格式
                    return new DateTime(cellInfo.value).toString('yyyy-MM-dd HH:mm:ss')
                }
            } else{
                return ''
            }
        }
        col_create_date.props.filterOperations = ['between', '='];
        col_create_date.props.selectedFilterOperation = 'between';
        col_create_date.props.sortOrder = 'desc';
        col_create_date.props.sortIndex = 2;

        const col_modify_date = new NxDataGridColumn(
            this.translator.I18N.commonColumns.modifiedDate.text,
            'ModifiedDate',
            'date'
        );
        col_modify_date.props.format = 'yyyy-MM-dd';
        col_modify_date.props.customizeText = (cellInfo) => {
            // 验证是否有值
            if(cellInfo.value){
                // 判断是是否是过滤行 在行过滤中使用 yyyy-MM-dd 的格式
                if(cellInfo.target == 'filterRow'){
                    return new DateTime(cellInfo.value).toString()
                } else{
                    // 在列表中使用 yyyy-MM-dd HH:mm:ss 的格式
                    return new DateTime(cellInfo.value).toString('yyyy-MM-dd HH:mm:ss')
                }
            } else{
                return ''
            }
        }
        col_modify_date.props.filterOperations = ['between', '='];
        col_modify_date.props.selectedFilterOperation = 'between';

        return [
            numbericalorder,col_dataDate,col_number,col_farmerName,col_accountType,col_amount,condition_quoteBillType,condition_quoteNumber,col_remark,
            col_createdOwner,
            col_create_date,
            col_owner,
            col_modify_date,
            col_checker,
            col_checker_date,
        ];
    }
    get columnMap() {
        return this.columns.map((m) => {
            return {
                dataField: m.props.dataField,
                caption: m.props.caption,
            };
        });
    }
    delete(rowData) {
        this.service
            .deleteByKey(rowData.data.NumericalOrder)
            .then((result: Result) => {
                const res = ResponseSuccess.handle(result,this.columnMap, true);
                if (res.status) {
                    this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                    this.listInstance.dataGrid.instance.refresh();
                    this.listInstance.dataGrid.instance.clearSelection();
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
        this.listInstance.editToDetail(
            '/yhcashdeposit/detail',
            rowData.rowIndex,
            this.translator.I18N.YHCashDeposit.editPageTitle,
            {
                numericalOrder: rowData.data.NumericalOrder,
            }
        );
    }
    selectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }
    //#endregion

    //#region
    init_toolbar_panel(): YhCashDepositListComponent {
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeDelete')).events.onClick = this.rangeDelete.bind(this);
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeDelete')).props.visible=false;
        (<NxDropDownButton>this.toolbarPanelModel.getWidgetByKey('review')).events.onButtonClick = (e) => {
            this.rangeReview(true)
        };
        (<NxDropDownButton>this.toolbarPanelModel.getWidgetByKey('review')).events.onItemClick = (e) => {
            this.rangeReview(false)
        };

        this.toolbarPanelModel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('filterRow').events.onClick = this.toogleFilterRow.bind(this);

        let columnsSetting = [];
        this.dataGridModel.columns.map((m) => {
            if (m.props.visible == true) {
                columnsSetting.push({
                    caption: m.props.caption,
                    dataField: m.props.dataField,
                });
            }
        });
        this.toolbarPanelModel.settings = columnsSetting;


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
        this.toolbarPanelModel.moreButton.props.items.push(new NxDropDownButtonItem(this.translator.I18N.importComponent.text, 'import', 'iconfont iconimport'));
        this.toolbarPanelModel.moreButton.events.onItemClick = (e) => {
            if (e.type == 'export') {
                this.export();
            }
            if (e.type == 'import') {
                this.excelImport.show();
            }
        };
        this.toolbarPanelModel.storageKey = 'YhCashDeposit-setting-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanelModel.storageKey));
        this.dataGridModel.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });
        return this;
    }
    init_search_panel() {
        this.searchPanelModel.data['date'] = [new Date(), new Date()];
        let date = new NxConditionItem();
        date.label = this.translator.I18N.YHCashDeposit.DataDate.text;
        date.type = 'StartEndDateBox';
        date.dataField = 'date';
        date.widget = new NxDateBox();
        date.widget.props.showClearButton = true;
        date.widget.props.max = new Date();

        //养户姓名 文本框，因为引入开户申请的话，还没有生成养户记录
        const condition_farmerName = new NxConditionItem();
        condition_farmerName.label =  this.translator.I18N.YHCashDeposit.YHFarmerID.text;
        condition_farmerName.type = 'SelectBox';
        condition_farmerName.dataField = 'YHFarmerID';
        condition_farmerName.widget = new NxSelectBox();
        condition_farmerName.widget.props.showClearButton = true;
        condition_farmerName.widget.props.disabled = false;
        condition_farmerName.widget.props.dataSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                ['Status', '=', true]
            ]
        });
        condition_farmerName.widget.props.valueExpr = "YHFarmerID";
        condition_farmerName.widget.props.displayExpr = "YHFarmerName";
        condition_farmerName.widget.props.searchExpr = ['YHFarmerName', 'YHPersonName', 'Phone', 'MnemonicCode'];

        const condition_accountType = new NxConditionItem();
        condition_accountType.label =  this.translator.I18N.YHCashDeposit.AccountType.text;
        condition_accountType.type = 'SelectBox';
        condition_accountType.dataField = 'AccountType';
        condition_accountType.widget = new NxSelectBox();
        condition_accountType.widget.props.showClearButton = false;
        condition_accountType.widget.props.disabled = false;
        condition_accountType.widget.props.dataSource = this._statusODataContext.getAccountTypeDataSource();
        condition_accountType.widget.props.valueExpr = "DictId";
        condition_accountType.widget.props.displayExpr = "DictName";
        condition_accountType.widget.props.placeholder="全部";

        const condition_quoteBillType = new NxConditionItem();
        condition_quoteBillType.label =  this.translator.I18N.YHCashDeposit.QuoteBillType.text;
        condition_quoteBillType.type = 'SelectBox';
        condition_quoteBillType.dataField = 'QuoteBillType';
        condition_quoteBillType.widget = new NxSelectBox();
        condition_quoteBillType.widget.props.showClearButton = false;

        condition_quoteBillType.widget.props.disabled = false;
        condition_quoteBillType.widget.props.dataSource = this._statusODataContext.getQuoteBillTypeDataSource();
        condition_quoteBillType.widget.props.valueExpr = "DictId";
        condition_quoteBillType.widget.props.displayExpr = "DictName";

        const condition_quoteNumber = new NxConditionItem();
        condition_quoteNumber.label =  this.translator.I18N.YHCashDeposit.QuoteNumericalOrder.text;
        condition_quoteNumber.type = 'TextBox';
        condition_quoteNumber.dataField = 'QuoteNumber';
        condition_quoteNumber.widget = new NxTextBox();
        condition_quoteNumber.widget.props.showClearButton = false;


        this.searchPanelModel.conditionItems.push(
            date,
            condition_farmerName,
            condition_accountType,
            condition_quoteBillType,
            condition_quoteNumber
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
                '<',
                new Date(new Date(new Date(data.date[1]).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()),
            ],
        ];

        this.datasource.filter(filter);
        this.datasource.reload();
    }
    search(data) {
        let filter = [];
        if (data.date[0] && data.date[1]) {
            filter.push([
                ['DataDate', '>=', new Date(new Date(data.date[0]).toLocaleDateString())],
                'and',
                [
                    'DataDate',
                    '<',
                    new Date(new Date(new Date(data.date[1]).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()),
                ],
            ]);
        } else {
            if (data.date[0]) {
                filter.push(['DataDate', '>=', new Date(new Date(data.date[0]).toLocaleDateString())]);
            }
            if (data.date[1]) {
                filter.push([
                    'DataDate',
                    '<',
                    new Date(new Date(new Date(data.date[1]).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()),
                ]);
            }
        }
        if (data['YHFarmerID']) {
            filter.push(['YHFarmerID', '=', data['YHFarmerID']]);
        }
        if (data['AccountType']) {
            filter.push(['AccountType', '=', data['AccountType']]);
        }
        if (data['QuoteBillType']) {
            filter.push(['QuoteBillType', '=', data['QuoteBillType']]);
        }
        if (data['QuoteNumber']) {
            filter.push(['QuoteNumber', 'contains', data['QuoteNumber']]);
        }
        if (filter.length > 0) {
            this.datasource.filter(filter);
        } else {
            this.datasource.filter('');
        }

        this.datasource.reload();
    }

    export() {
        if (this.listInstance.getSelectedRowsData().length > 0) {
            this.listInstance.dataGrid.instance.exportToExcel(true);
        } else {
            this.listInstance.dataGrid.instance.exportToExcel(false);
        }
    }
    create() {
        this.listInstance.createToDetail('/yhcashdeposit/detail',this.translator.I18N.YHCashDeposit.createPageTitle);
    }
    rangeDelete() {
        const deleteKeys = [];
        this.listInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({ NumericalOrder: m.NumericalOrder});
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
                this.listInstance.loadingVisible = true;
                this.service
                    .deleteBatch(deleteKeys)
                    .then((result: Result) => {
                        const res = ResponseSuccess.handle(result,this.columnMap, true);
                        this.listInstance.loadingVisible = false;
                        if (res.status) {
                            this.toolbarInstance.success(this.translator.I18N.commandOptions.delete.success);
                            this.listInstance.dataGrid.instance.refresh();
                            this.listInstance.dataGrid.instance.clearSelection();
                        } else {
                            this.toolbarInstance.error(`${res.message}`);
                        }
                    })
                    .catch((e) => {
                        this.listInstance.loadingVisible = false;
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
        this.listInstance.dataGrid.instance.clearSelection();
        this.listInstance.dataGrid.instance.refresh();
    }
    //#endregion

    //#region  审核


    rangeReview(isReview:boolean) {
        this.permissionContext.getPermission().then((code) => {
            const permission = new PermissionService();
            permission.refresh(code);
                if (permission.$$manager) {
                    // 有主管权限
                    this.reviewFun(isReview)
                } else if (permission.$$audit) {
                    // 有审核权限
                    this.reviewFun(isReview,this.tokenService.getTokenData.user_id)
                } else {
                    this.toolbarInstance.error(this.translator.I18N.reviewComponent.batchReview.noPermission);
                }
        });

    }
    reviewFun(isReview:boolean,user?:string){
        let isReviewed = [];
        let notReviewed = []
        let idObj = {}
        let checkable = false
        this.listInstance.getSelectedRowsData().map((m) => {
            if(!idObj[m.NumericalOrder]){
                idObj[m.NumericalOrder] = true
                if(user &&(!isReview) && m.AuditID !== user){//需要根据单据字段来确定
                    checkable =true
                }
                if(m['AuditName']){//需要根据单据字段来确定
                    isReviewed.push(m.NumericalOrder)

                }else{
                    notReviewed.push(m.NumericalOrder)
                }
            }

        });
        if(checkable){
            this.toolbarInstance.error(this.translator.I18N.reviewComponent.batchReview.notReview);
            return
        }
        let tip = ''
        if(isReview){
            tip = this.translator.I18N.reviewComponent.batchReview.confirmText.replace(
                '{0}',
                `<strong>${this.listInstance.getSelectedRowsData().length}</strong>`
            )
        }else{
            tip = this.translator.I18N.reviewComponent.batchReview.cancelText.replace(
                '{0}',
                `<strong>${this.listInstance.getSelectedRowsData().length}</strong>`
            )
        }
        MessageBox.confirm(tip)
        .then((require) => {

            if (require) {
                let arr = isReview ? notReviewed  :  isReviewed

                if(arr.length == 0){
                    if(isReview){
                        this.toolbarInstance.success(
                            this.translator.I18N.reviewComponent.batchReview.allReviewedTip
                        );

                    }else{
                        this.toolbarInstance.success(
                            this.translator.I18N.reviewComponent.batchReview.allNotReviewedTip
                        );
                    }
                    return
                }
                this.http
                    .post(environment.review.batchReviewOperate, {
                        // 流水号
                        NumericalOrder: arr ,
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
                    })
                    .toPromise()
                    .then((result: Result) => {
                        const response = ResponseSuccess.handle(result);
                        if (response.status) {

                            let msg = ''
                            if(isReview){
                                if(isReviewed.length > 0){
                                    msg = this.translator.I18N.reviewComponent.batchReview.successTip.replace(
                                        '{0}',
                                        `${notReviewed.length}`
                                    )

                                }else{
                                    msg = this.translator.I18N.reviewComponent.batchReview.allReviewed
                                }

                            }else{
                                if(notReviewed.length > 0){
                                    msg = this.translator.I18N.reviewComponent.batchReview.success.replace(
                                        '{0}',
                                        `${isReviewed.length}`
                                    )

                                }else{
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
