import { Component, NgModule, Input, ViewChild } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { DxPopoverModule } from 'devextreme-angular/ui/popover';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NxDataGrid } from '../component-model/data-grid/model';
import DataSource from 'devextreme/data/data_source';
import { DataStatus, FormOptions } from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { NxSelectBox } from '../component-model/select-box/model';
import { PermissionService } from 'src/app/providers/permission';
import { TokenAuthService } from 'src/app/shared/services';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { ReviewStatus } from '../review/review.extend';
import { DateTime } from 'src/app/providers/common/datetime';
import { RXJSService } from 'src/app/shared/services/RXJSService';
import { NxTranslateModule } from 'src/app/nxin/i18n';
import { 
    DxLoadPanelModule,
    DxDropDownBoxModule,
    DxTreeViewModule, } from 'devextreme-angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ZlwColumnContentTranslator } from 'src/app/nxin/i18n/zlwColumnContentTranslator';
import { TranslateI18N } from 'src/app/providers/i18n-translate';
import { NzToolTipModule } from 'ng-zorro-antd';
@Component({
    selector: 'nx-zlw-form-list',
    templateUrl: './nx-zlw-form-list.component.html',
    styleUrls: ['./nx-zlw-form-list.component.scss'],
})
export class NxFormListComponent {
    @ViewChild('DataGridInstance', { static: false })
    dataGrid: DxDataGridComponent;
    @Input()
    model: NxDataGrid;
    @Input()
    columnOid: string;
    $deletedData: Array<any> = [];
    isCanEdit: boolean = true;
    isCanDelete: boolean = true;
    isAddRow: boolean = true;
    isRemoveRow: boolean = true;
    permission: PermissionService = new PermissionService();
    selectRowIndex: number = -1;
    loadingVisible: boolean = false;
    isFirstLoading: boolean;
    // ctls
    deletePopoverStates: Array<boolean> = [];
    makingPermission = new PermissionService();
    constructor(
        private router: Router,
        private tokenService: TokenAuthService,
        private rxService: RXJSService,
        private http: HttpClient
    ) {
        this.isFirstLoading = true;
        this.customStateStoringLoad = this.customStateStoringLoad.bind(this);
        this.customStateStoringSave = this.customStateStoringSave.bind(this);
    }
    exportExcel(option) {
        this.dataGrid.export.fileName = option.fileName;
        this.dataGrid.instance.exportToExcel(false)
    }
    protected ngOnInit() {
        this.modelValidator();
        this.tokenService.getPermission().then((res) => {
            this.permission.refresh(res.permissions);
            this.rxService.publish(this.permission);
            console.log("permission",this.permission)
            if (this.model.commandColumn.customs.length <= 0) {
                if (this.model.commandColumn.visible) {
                    this.model.commandColumn.visible = this.permission.$$edit || this.permission.$$delete || this.permission.$$manager;
                    // this.permission.$$edit == false && this.permission.$$edit == this.permission.$$delete
                    //     ? false
                    //     : true;
                }
            }
            if (!this.permission.$$manager) {
                this.isCanEdit = this.permission.$$edit;
                this.isCanDelete = this.permission.$$delete;
            } else {
                this.isCanEdit = true;
                this.isCanDelete = true;
                // this.model.commandColumn.visible = true;
            }
        });
        if (this.model.type == 'list') {
            this.model.columns.map((m) => {
                if (!m.props.editorOptions) {
                    m.props.editorOptions = {};
                }
                if (!m.props.editorOptions.hasOwnProperty('showClearButton')) {
                    m.props.editorOptions['showClearButton'] = true;
                }
            });
        } else {
            this.model.columns.map((m) => {
                m.props.cssClass = !m.props.allowEditing ? 'disabled' : '';
            });
        }
        this.tokenService.requestTokenWithAppId('2110201047420003409').then((res) => {
            this.makingPermission.refresh(res);
        });
    }
    protected ngOnDestroy() {
        this.rxService.unSubscribe();
    }
    //#region Pretreatment
    /**
     * 模型配置验证
     */
    private modelValidator(): NxFormListComponent {
        if (!this.model) {
            throw new Error('[NxFormListComponent] model is undefined');
        }
        if (this.model.primaryKey == undefined || this.model.primaryKey == '') {
            throw new Error('[NxFormListComponent] primaryKey is required');
        }
        if (this.model.columns.length <= 0) {
            console.warn('[NxFormListComponent] columns is empty');
        }
        return this;
    }
    //#endregion
    defaultCalculateFilterExpression() {
        return this.defaultCalculateFilterExpression.apply(this, arguments);
    }
    //#region Events emitters
    /**
     * 双击行事件处理
     * @param e
     */
    onRowDblClickEvent(e) {
        if (this.model.events.onRowDblClick) {
            this.model.events.onRowDblClick({ rowIndex: e.rowIndex, data: e.data });
        }
    }
    onRowClickEvent(e) { }
    onCellClickEvent(e) {
        if (this.model.events.onCellClick) {
            if (e.rowType == 'data') {
                this.selectRowIndex = e.rowIndex != undefined ? e.rowIndex : this.selectRowIndex;
            } else {
                this.selectRowIndex = -1;
            }
            this.dataGrid.instance.selectRowsByIndexes([this.selectRowIndex]);
            this.model.events.onCellClick(e);
        }
    }
    onEditingStartEvent(e) {
        if (this.model.events.onEditingStart) {
            this.model.events.onEditingStart(e);
        }
    }
    cellLinkEvent(cell) {
        for (let i = 0; i < this.model.columns.length; i++) {
            if (this.model.columns[i].props.dataField == cell.column.dataField) {
                if (this.model.columns[i].props.cellLinkTemplate.to) {
                    this.model.columns[i].props.cellLinkTemplate.to(cell.data);
                    break;
                }
            }
        }
    }
    /**
     * 删除操作
     */
    confirmDelete(row, confirm) {
        if (confirm) {
            if (this.model.commandColumn.deleteButton.confirm)
                this.model.commandColumn.deleteButton.confirm({ rowIndex: row.rowIndex, data: row.data });
        } else {
            if (this.model.commandColumn.deleteButton.cancel) {
                this.model.commandColumn.deleteButton.cancel({ rowIndex: row.rowIndex, data: row.data });
            }
        }
        this.deletePopoverStates[row.rowIndex] = false;
    }
    onReviewSuccess(status: ReviewStatus, isCancel: boolean) {
        if (isCancel) {
            this.isCanDelete = true;
            this.isAddRow = true;
            this.isRemoveRow = true;
        } else {
            this.isCanDelete = false;
            this.isAddRow = false;
            this.isRemoveRow = false;
        }
    }
    /**
     * 编辑按钮事件
     * @param row
     */
    edit(row) {
        if (this.model.commandColumn.editButton.onClick) {
            this.model.commandColumn.editButton.onClick({ rowIndex: row.rowIndex, data: row.data });
        }
    }
    /**
     *
     * @param e 工具条配置
     */
    onToolbarPreparingEvent(e) {
        if (this.model.type == 'detail') {
            if (this.model.events.onToolbarPreparing) {
                this.model.events.onToolbarPreparing(e);
            } else {
                e.toolbarOptions.items.splice(0);
            }
        }
    }
    /**
     * 表格右键菜单，仅支持DataSource为 Array类型
     * @param e
     */
    onContextMenuPreparingEvent(e) {
        if (this.model.events.onContextMenuPreparing) {
            this.model.events.onContextMenuPreparing(e);
        }
    }
    /**
     * 表格数据更新时修改工具条的状态
     * @param e
     */
    onEditorPreparingEvent(e) {
        if (this.model.events.onEditorPreparing) {
            this.model.events.onEditorPreparing(e);
        }
    }
    //移入移出
    onCellHoverChanged(e) {
        if (this.model.events.onCellHoverChanged) {
            this.model.events.onCellHoverChanged(e);
        }
    }
    onEditorPreparedEvent(e) {
        if (this.model.events.onEditorPrepared) {
            this.model.events.onEditorPrepared(e);
        }
    }
    setCellValueEvent(newData, value, currentRowData) {
        // currentRowData.PigId = value;
        // newData.PigId = value;
    }
    onRowUpdatingEvent(e) {
        if (this.model.events.onRowUpdating) {
            this.model.events.onRowUpdating(e);
        }
    }
    onSelectionChangedEvent(e) {
        if (this.model.events.onSelectionChanged) {
            this.model.events.onSelectionChanged(e.selectedRowKeys, e.selectedRowsData);
        }
    }
    onCustomItemCreatingEvent(e, columnIndex, cell) {
        if ((<NxSelectBox>this.model.columns[columnIndex].props.cellTemplate.widget).events.onCustomItemCreating) {
            (<NxSelectBox>this.model.columns[columnIndex].props.cellTemplate.widget).events.onCustomItemCreating(
                e,
                cell
            );
        }
    }
    onOpened(e, columnIndex, cell, row) {
        if ((<NxSelectBox>this.model.columns[columnIndex].props.cellTemplate.widget).events.onOpened) {
            (<NxSelectBox>this.model.columns[columnIndex].props.cellTemplate.widget).events.onOpened(
                e,
                cell,
                row
            );
        }
    }
    editorCellTemplateOnValueChangedEvent(cell, widget, e) {
        if (widget.events.innerOnValueChanged) {
            widget.events.innerOnValueChanged(e);
        }
        cell.setValue(e.value);
    }
    editorCellTemplateOnTreeViewReadyEvent(cell, widget, e) {
        console.log(cell, widget, e,'editorCellTemplateOnTreeViewReadyEvent')
    }
    editorCellTemplateOnTreeViewSelectionChangedEvent(cell, widget, e) {
        console.log(cell, widget, e,'editorCellTemplateOnTreeViewSelectionChangedEvent')
    }
    customCommandClickEvent(instance, row) {
        if (instance.onClick) {
            instance.onClick(row);
        }
    }
    customStateStoringSave(state) {
        if (this.model.stateStoring.storageKey.indexOf('detail') >= 0 && !this.makingPermission.$$making) return;
        if (state.columns && state.columns.length > 0) {
            state.pageIndex = 0;
            state.searchText = '';
            state.selectedRowKeys = [];
            state.columns.map((m) => {
                if (m['filterValue'] != undefined || m['filterValue'] != null) {
                    m['filterValue'] = undefined;
                }
                if (m['filterValues']) {
                    m['filterValues'] = [];
                }
                if (m['selectedFilterOperation']) {
                    m['selectedFilterOperation'] = undefined;
                }
            });
            if (this.model.stateStoring.type == 'custom') {
                try {
                    //存后端
                    if (!this.isFirstLoading) {
                        if (this.model.stateStoring.storageKey.indexOf('detail') >= 0) {
                            let params = this.getRequestParamsWithCustumComponent();
                            this.http.put(`${environment.qlwAssem}/setting`, params).toPromise();
                        } else {
                            let params = this.getRequestParamsWithComponent();
                            this.http.post(`${environment.qlwCommonService}/component`, params).toPromise();
                        }
                    }
                    this.isFirstLoading = false;
                } finally {
                    //存前端
                    localStorage.setItem(`${this.model.stateStoring.storageKey}`, JSON.stringify(state));
                }
            } else {
                localStorage.setItem(`${this.model.stateStoring.storageKey}`, JSON.stringify(state));
            }
        }
    }
    customStateStoringLoad() {
        try {
            if (this.model.events.onCustomStateStoringLoad) {
                return this.model.events.onCustomStateStoringLoad(this);
            } else {
                return this.getconfigfromapi()
                    .then((data: any) => {
                        if (data && data.Columns) {
                            localStorage.setItem(`${this.model.stateStoring.storageKey}`, data.Columns);
                            if (data && data.Columns) {
                                var columns = JSON.parse(data.Columns);
                                this.model.columns.map((item, index) => {
                                    var currentColunms = columns.filter((x) => x.dataField == item.props.dataField);
                                    if (currentColunms && currentColunms.length > 0) {
                                        item.props.visible = currentColunms[0].visible;
                                        item.props.width =
                                            currentColunms[0].width <= 0 ? undefined : currentColunms[0].width;
                                        item.props.sortIndex = currentColunms[0].visibleIndex;
                                        item.props.fixed = currentColunms[0].fixed;
                                    }
                                });
                                this.model.columns.sort(
                                    (a, b) => <number>a.props.sortIndex - <number>b.props.sortIndex
                                );
                            }
                            return { colunms: JSON.parse(data.Columns) };
                        } else {
                            return;
                        }
                    })
                    .catch((r) => {
                        return;
                    });
            }
        } catch (error) {
            console.warn('can not read data from api');
            return;
        }
    }
    getRequestParamsWithComponent() {
        let columns = [];
        let c = this.dataGrid.instance.getVisibleColumns();
        this.model.columns.map((item, index) => {
            let nativeCol = c.filter((m) => m.dataField == item.props.dataField);
            columns.push({
                caption: nativeCol.length > 0 ? nativeCol[0].caption : item.props.caption,
                dataField: nativeCol.length > 0 ? nativeCol[0].dataField : item.props.dataField,
                dataType: nativeCol.length > 0 ? nativeCol[0].dataType : item.props.dataType,
                fixed: nativeCol.length > 0 ? nativeCol[0].fixed : item.props.fixed,
                visible: nativeCol.length > 0 ? nativeCol[0].visible : item.props.visible,
                visibleIndex: nativeCol.length > 0 ? nativeCol[0].visibleIndex : index,
                width: nativeCol && nativeCol.length > 0 ? nativeCol[0].width : item.props.width,
                showIndex: nativeCol.length > 0 ? nativeCol[0].visibleIndex : (item.props.sortIndex || index),
            });
        });
        var data = {
            moduleKey: this.model.stateStoring.storageKey,
            columns: columns,
        };
        return data;
    }
    getRequestParamsWithCustumComponent() {
        let columns = [];
        let c = this.dataGrid.instance.getVisibleColumns();
        this.model.columns.map((item, index) => {
            let nativeCol = c.filter((m) => m.dataField == item.props.dataField);
            columns.push({
                caption: nativeCol.length > 0 ? nativeCol[0].caption : item.props.caption,
                dataField: nativeCol.length > 0 ? nativeCol[0].dataField : item.props.dataField,
                dataType: nativeCol.length > 0 ? nativeCol[0].dataType : item.props.dataType,
                fixed: nativeCol.length > 0 ? nativeCol[0].fixed : item.props.fixed,
                visible: nativeCol.length > 0 ? nativeCol[0].visible : item.props.visible,
                width: nativeCol && nativeCol.length > 0 ? nativeCol[0].width : item.props.width,
                showCaption: item.props.showCaption,
                HeaderRequiredIcon: item.props.HeaderRequiredIcon,
                requiredDisable: item.props.requiredDisable,
                showIndex: nativeCol.length > 0 ? nativeCol[0].visibleIndex : (item.props.sortIndex || index),
            });
            item.props.width = columns[index].width;
        });
        columns.sort((a, b) => {
            return a.showIndex - b.showIndex;
        });
        var data = {
            key: this.model.stateStoring.storageKey,
            value: columns,
        };
        if (this.columnOid) {
            data['_id'] = { $oid: this.columnOid };
        }
        return data;
    }
    getconfigfromapi() {
        let params = this.getRequestParamsWithComponent();
        return this.http.post(`${environment.qlwCommonService}/component/getConfigOrUpdate`, params).toPromise();
    }

    //#endregion

    //#region ctls
    /**
     * 控制列表页删除弹窗
     * @param row
     * @param e
     */
    deletePopoverCtl(row, e) {
        // this.model.dataGrid.commandColumn.deleteButton.onClick(row);
        this.deletePopoverStates[row.rowIndex] = !this.deletePopoverStates[row.rowIndex];
    }
    /**
     * 详情页行内删除
     * @param row
     */
    deleteRow(row) {
        if (!this.model.editing.allowUpdating) {
            return;
        }
        if ((<Array<any>>this.model.props.dataSource).length <= 1) {
            return;
        }
        let deletedRowData = (<Array<any>>this.model.props.dataSource).splice(this.calcRowsOptionIndex(row), 1);
        this.dataGrid.instance.deleteRow(row.row.rowIndex);
        if (deletedRowData[0].target != DataStatus.newline) {
            deletedRowData[0].target = DataStatus.deleted;
            this.$deletedData.push(...deletedRowData);
        }
        if (this.model.commandColumn.trashButton.onClick) {
            this.model.commandColumn.trashButton.onClick({ rowIndex: row.rowIndex, data: row.data });
        }
        this.dataGrid.instance.refresh();
    }
    addRow(row) {
        if (!this.model.editing.allowUpdating) {
            return;
        }
        if (this.model.commandColumn.addRowButton.onClick) {
            const newRowIndex = this.calcRowsOptionIndex({ row: row }) + 1;
            (<Array<any>>this.model.props.dataSource).splice(newRowIndex, 0, this.emptyRow);
            // this.model.commandColumn.addRowButton.onClick(
            //     { rowIndex: row.rowIndex, data: row.data },
            //     { rowIndex: newRowIndex, data: (<Array<any>>this.model.props.dataSource)[newRowIndex] }
            // );
        }
    }
    copyRow(row) {
        if (!this.model.editing.allowUpdating) {
            return;
        }
        const clone = deepCopy(row.data);
        clone[`${this.model.primaryKey}`] = new DateTime().randomValue.toString();
        clone.target = DataStatus.newline;
        (<Array<any>>this.model.props.dataSource).splice(this.calcRowsOptionIndex({ row: row }) + 1, 0, clone);
        // if (this.model.commandColumn.copyRowButton.onClick) {
        //     this.model.commandColumn.copyRowButton.onClick({
        //         rowIndex: row.rowIndex + 1,
        //         data: (<Array<any>>this.model.props.dataSource)[row.rowIndex + 1],
        //     });
        // }
    }
    //#endregion

    //#region other methods

    /**
     * 数据行内跳转详情页
     * @param path 路由
     * @param rowClickIndex 点击行索引
     * @param title Home标签页的标题名称
     * @param params 路由参数
     * @param iframeName Home的iframe名称（可选）
     * @param target Home标签的打开方式：0 标签打开，1 新标签页打开，默认为0
     */
    editToDetail(
        path: string,
        rowClickIndex: string,
        title: string,
        params?: Object,
        iframeName?: string,
        target: number = 0
    ) {
        let urlParams = this.initUrlParams(rowClickIndex, FormOptions.$modify);
        urlParams = this.setUrlParams(params, urlParams);
        urlParams['lang'] = TranslateI18N.lang;
        if (!urlParams['appid']) {
            urlParams['appid'] = this.tokenService.getTokenData.menu_id;
        }
        if (!urlParams['enterpriseId']) {
            urlParams['enterpriseId'] = this.tokenService.getTokenData.enterprise_id;
        } //urlParams["childEnterpriseId"]= this.tokenService.getTokenData.child_enterprise_id;
        if (!urlParams['groupId']) {
            urlParams['groupId'] = this.tokenService.getTokenData.group_id;
        }
        if (!urlParams['gId']) {
            var params2 = window.location.href.split('?');
            if(params2.length>1){
                let index = params2[1].indexOf('gId=');
                let groupId = index>=0?params2[1].substr(index+4).split('&')[0]:'0';
                urlParams['gId'] = groupId;
            }
        }
        if (environment.production && window.parent['$open']) {
            // 跳转 Home
            let url: string = `${environment.qqlwUri}/${path}`;
            if (urlParams) {
                url += '?';
                for (const key in urlParams) {
                    const value = urlParams[key];
                    url += `${key}=${value.toString()}&`;
                }
            }
            HomeHelper.open({
                id: new DateTime().randomValue,
                url: url,
                title: title,
                target: target,
                iframeName: iframeName,
            });
        } else {
            // 本地跳转
            this.router.navigate([path], {
                queryParams: urlParams,
            });
        }
    }
    yheditToDetail(
        path: string,
        rowClickIndex: string,
        title: string,
        params?: Object,
        iframeName?: string,
        target: number = 0
    ) {
        let urlParams = this.initUrlParams(rowClickIndex, FormOptions.$modify);
        urlParams = this.setUrlParams(params, urlParams);
        urlParams['lang'] = TranslateI18N.lang;
        if (!urlParams['appid']) {
            urlParams['appid'] = this.tokenService.getTokenData.menu_id;
        }
        if (!urlParams['enterpriseId']) {
            urlParams['enterpriseId'] = this.tokenService.getTokenData.enterprise_id;
        } //urlParams["childEnterpriseId"]= this.tokenService.getTokenData.child_enterprise_id;
        if (!urlParams['groupId']) {
            urlParams['groupId'] = this.tokenService.getTokenData.group_id;
        }
        if (!urlParams['gId']) {
            var params2 = window.location.href.split('?');
            if(params2.length>1){
                let index = params2[1].indexOf('gId=');
                let groupId = index>=0?params2[1].substr(index+4).split('&')[0]:'0';
                urlParams['gId'] = groupId;
            }
        }
        if (environment.production && window.parent['$open']) {
            // 跳转 Home
            let url: string = `${environment.qqlwUri}/${path}`;
            if (urlParams) {
                url += '?';
                for (const key in urlParams) {
                    const value = urlParams[key];
                    url += `${key}=${value.toString()}&`;
                }
            }
            HomeHelper.open({
                id: new DateTime().randomValue,
                url: url,
                title: title,
                target: target,
                iframeName: iframeName,
            });
        } else {
            // 本地跳转
            this.router.navigate([path], {
                queryParams: urlParams,
            });
        }
    }
    /**
     * 新增按钮跳转详情页
     * @param path 路由
     * @param title Home标签页标题名称
     * @param params 路由参数
     * @param iframeName Home的iframe名称（可选）
     * @param target Home标签的打开方式：0 标签打开，1 新标签页打开，默认为0
     */
    createToDetail(path: string, title: string, params?: Object, iframeName?: string, target: number = 0) {
        let urlParams = this.initUrlParams(-1, FormOptions.$create);
        urlParams = this.setUrlParams(params, urlParams);
        urlParams['lang'] = TranslateI18N.lang;
        if (!urlParams['appid']) {
            urlParams['appid'] = this.tokenService.getTokenData.menu_id;
        }
        if (!urlParams['enterpriseId']) {
            urlParams['enterpriseId'] = this.tokenService.getTokenData.enterprise_id;
        } //urlParams["childEnterpriseId"]= this.tokenService.getTokenData.child_enterprise_id;
        if (!urlParams['groupId']) {
            urlParams['groupId'] = this.tokenService.getTokenData.group_id;
        }
        if (!urlParams['gId']) {
            var params2 = window.location.href.split('?');
            if(params2.length>1){
                let index = params2[1].indexOf('gId=');
                let groupId = index>=0?params2[1].substr(index+4).split('&')[0]:'0';
                urlParams['gId'] = groupId;
            }
        }
        if (environment.production && window.parent['$open']) {
            // 跳转 Home
            let url: string = `${environment.qqlwUri}/${path}`;
            if (urlParams) {
                url += '?';
                for (const key in urlParams) {
                    const value = urlParams[key];
                    url += `${key}=${value.toString()}&`;
                }
            }
            HomeHelper.open({
                id: new DateTime().randomValue,
                url: url,
                title: title,
                target: target,
                iframeName: iframeName,
            });
        } else {
            // 本地跳转
            this.router.navigate([path], {
                queryParams: urlParams,
            });
        }
    }
    yhcreateToDetail(path: string, title: string, params?: Object, iframeName?: string, target: number = 0) {
        let urlParams = this.initUrlParams(-1, FormOptions.$create);
        urlParams = this.setUrlParams(params, urlParams);
        urlParams['lang'] = TranslateI18N.lang;
        if (!urlParams['appid']) {
            urlParams['appid'] = this.tokenService.getTokenData.menu_id;
        }
        if (!urlParams['enterpriseId']) {
            urlParams['enterpriseId'] = this.tokenService.getTokenData.enterprise_id;
        } //urlParams["childEnterpriseId"]= this.tokenService.getTokenData.child_enterprise_id;
        if (!urlParams['groupId']) {
            urlParams['groupId'] = this.tokenService.getTokenData.group_id;
        }
        if (!urlParams['gId']) {
            var params2 = window.location.href.split('?');
            if(params2.length>1){
                let index = params2[1].indexOf('gId=');
                let groupId = index>=0?params2[1].substr(index+4).split('&')[0]:'0';
                urlParams['gId'] = groupId;
            }
        }
        if (environment.production && window.parent['$open']) {
            // 跳转 Home
            let url: string = `${environment.qqlwUri}/${path}`;
            if (urlParams) {
                url += '?';
                for (const key in urlParams) {
                    const value = urlParams[key];
                    url += `${key}=${value.toString()}&`;
                }
            }
            HomeHelper.open({
                id: new DateTime().randomValue,
                url: url,
                title: title,
                target: target,
                iframeName: iframeName,
            });
        } else {
            // 本地跳转
            this.router.navigate([path], {
                queryParams: urlParams,
            });
        }
    }
    /**
     * 条件过滤
     * @param conditions 条件，例如：[ ['id','=','1'],['name','contains','王'] ]
     */
    filter(conditions: Array<Array<string | number | Date>>) {
        let effectiveConditions = [];
        conditions.map((m, i) => {
            if (!(m[2] == undefined || m[2] == '' || m[2] == null)) {
                effectiveConditions.push(m);
            }
        });
        if (effectiveConditions.length > 0) {
            (<DataSource>this.model.props.dataSource).filter(effectiveConditions);
            (<DataSource>this.model.props.dataSource).reload();
        } else {
            (<DataSource>this.model.props.dataSource).filter(null);
            (<DataSource>this.model.props.dataSource).reload();
        }
    }
    /**
     * 获取选中行的数据
     */
    getSelectedRowsData() {
        return this.dataGrid.instance.getSelectedRowsData();
    }
    /**
     * 重新加载
     */
    refresh() {
        this.dataGrid.instance.clearSelection();
        this.dataGrid.instance.refresh();
    }
    toggleFilterRow() {
        this.model.filterRow.visible = !this.model.filterRow.visible;
    }
    /**
     * 当前页索引
     */
    get pageIndex() {
        return this.dataGrid.instance.pageIndex();
    }
    /**
     * 分页大小
     */
    get pageSize() {
        return this.dataGrid.instance.pageSize();
    }
    /**
     * 总页数
     */
    get pageCount() {
        return this.dataGrid.instance.pageCount();
    }
    /**
     * 当前显示行数
     */
    get visibleRowSize() {
        return this.dataGrid.instance.getVisibleRows().length;
    }

    //#endregion

    //#region private methods
    /**
     * 初始化表单详情页需要的路由参数
     * @param rowIndex 点击行索引,新增按钮点击为-1
     * @param $open 打开方式 $create | $modify
     */
    private initUrlParams(rowIndex, $open) {
        return {
            // $size: this.pageSize,
            // $index: this.pageIndex,
            // $rowIndex: rowIndex,
            // $count: this.pageCount,
            // $visibles: this.visibleRowSize,
            $option: $open,
            $open: $open,
        };
    }
    /**
     * 拼接路由参数
     * @param params 元参数
     * @param urlParams 自定义参数
     */
    private setUrlParams(params, urlParams) {
        if (params) {
            for (const key in params) {
                if (!urlParams.hasOwnProperty(key)) {
                    urlParams[key] = params[key];
                }
            }
        }
        return urlParams;
    }
    get emptyRow() {
        let empty = {};
        empty[`${this.model.primaryKey}`] = new DateTime().randomValue.toString();
        empty['target'] = DataStatus.newline;
        return empty;
    }
    calcRowsOptionIndex(e) {
        let newIndex = this.pageIndex * this.pageSize + e.row.rowIndex;
        return newIndex;
    }
    help(col, e) { }
    calculateRecord(row) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + row.rowIndex + 1;
    }
    appendRow() {
        // 增行一次五行
        if (!this.model.editing.allowUpdating) {
            return;
        }
        if (this.model.commandColumn.addRowButton.onClick) {
            this.model.commandColumn.addRowButton.onClick(this.emptyRow);
        } else {
            for (let index = 0; index < 1; index++) {
                (<Array<any>>this.model.props.dataSource).push(this.emptyRow);
            }
        }
        // 工具条状态控制
        this.model.commandColumn.addRowButton.statusCtrl();
        this.selectRowIndex = -1;
    }
    removeRow() {
        // 底部删除选中行
        // 获取到用户当前选中的key
        // 删除数据的时候需要把数据标记为delete
        if (!this.model.editing.allowUpdating) {
            Notify.toast('当前状态不可以操作', NotifyType.Warning);
            return;
        }
        if((<Array<any>>this.model.props.dataSource).length==0){
            return;
        }
        if (this.selectRowIndex == -1) {
            this.dataGrid.instance.deleteRow((<Array<any>>this.model.props.dataSource).length - 1);
            // splice源数据删除
            let deletedRowData = (<Array<any>>this.model.props.dataSource).splice(
                (<Array<any>>this.model.props.dataSource).length - 1,
                1
            );
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.$deletedData.push(...deletedRowData);
            }
        } else {
            this.dataGrid.instance.deleteRow(this.selectRowIndex);
            let deletedRowData = (<Array<any>>this.model.props.dataSource).splice(this.selectRowIndex, 1);
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.$deletedData.push(...deletedRowData);
            }
        }
        this.dataGrid.instance.refresh();
        if (this.model.commandColumn.deleteButton.onClick) {
            this.model.commandColumn.deleteButton.onClick();
        }
        this.selectRowIndex = -1;
    }
    //#endregion
}

@NgModule({
    imports: [
        CommonModule,
        DxDataGridModule,
        DxPopoverModule,
        DxButtonModule,
        DxDropDownButtonModule,
        DxTagBoxModule,
        DxSelectBoxModule,
        NxTranslateModule,
        DxLoadPanelModule,
        NzToolTipModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
    ],
    declarations: [NxFormListComponent],
    exports: [NxFormListComponent],
    providers: [RXJSService, ZlwColumnContentTranslator],
})
export class NxFormListModule { }
