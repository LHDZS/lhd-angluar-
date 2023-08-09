import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ContentChild, Input, NgModule, OnInit } from '@angular/core';
import {
    DxCheckBoxModule,
    DxDataGridComponent,
    DxDataGridModule,
    DxPopupModule,
    DxScrollViewModule,
} from 'devextreme-angular';
import { ComboxPanelComponent, ComboxPanelModule } from '../combox-panel';
import { DateRangeBoxModule } from '../date-range-box';
import { ToolbarInfoPanelComponent, ToolbarInfoPanelModule } from '../toolbar-info-panel/toolbar-info-panel.component';

@Component({
    selector: 'grid-view',
    templateUrl: './grid-view.component.html',
    styleUrls: ['./grid-view.component.scss'],
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
            }
        `,
    ],
})
export class GridViewComponent implements OnInit, AfterContentInit, AfterViewInit {
    @ContentChild(ComboxPanelComponent, { static: false })
    _combox: ComboxPanelComponent;
    /** 工具条实例 */
    @ContentChild(ToolbarInfoPanelComponent, { static: false })
    _toolbar: ToolbarInfoPanelComponent;
    /** 列表实例 */
    @ContentChild(DxDataGridComponent, { static: false })
    _dataGrid: DxDataGridComponent;
    /** 表格列 */
    _columns: { caption: string; dataField: string; visible: boolean }[] = [];
    /** 过滤行控制 */
    _filterRowVisible: boolean = false;
    /** 列选择器控制 */
    _columnChooserVisible: boolean = false;
    @Input()
    showRecordColumn: boolean = true;
    __gridWrapperHeight: string;
    constructor() {}
    ngAfterViewInit(): void {
        if (this._dataGrid) {
            if (this._dataGrid.columns && this._dataGrid.columns.length > 0) {
                let _stateStorage = null;
                let _storageEnable = false;
                if (this._dataGrid.stateStoring.enabled) {
                    if (this._dataGrid.stateStoring.type == 'localStorage') {
                        let _storageJson = localStorage.getItem(this._dataGrid.stateStoring.storageKey);
                        _stateStorage = JSON.parse(_storageJson || null);
                        _storageEnable = _stateStorage && _stateStorage.columns && _stateStorage.columns.length > 0;
                    }
                }
                this._dataGrid.columns.forEach(column => {
                    let _dataField = column['dataField'];
                    if (this._dataGrid.instance.columnOption(_dataField, 'showInColumnChooser')) {
                        let _visible =
                            _storageEnable && _stateStorage.columns
                                ? (_stateStorage.columns as any[]).filter(m => m.dataField == _dataField)[0].visible
                                : this._dataGrid.instance.columnOption(_dataField, 'visible');
                        this._columns.push({
                            caption: column['caption'],
                            dataField: column['dataField'],
                            visible: _visible,
                        });
                        column['visible'] = _visible;
                    }
                    if (column['type'] == 'buttons') {
                        column['allowResizing'] = false;
                    }
                });
            }
            if (this._dataGrid.selection.mode === 'default') {
                this._dataGrid.instance.option('selection.mode', 'multiple');
                this._dataGrid.instance.option('selection.allowSelectAll', true);
                this._dataGrid.instance.option('selection.selectAllMode', 'page');
                this._dataGrid.instance.option('selection.showCheckBoxesMode', 'always');
            }
            this._dataGrid.allowColumnResizing = true;
            this._dataGrid.columnResizingMode = 'widget';
            this._dataGrid.errorRowEnabled = false;
            this._dataGrid.rowAlternationEnabled = true;
        }
        if (this._toolbar) {
            if (this._toolbar._buttons && this._toolbar._buttons.length > 0) {
                this._toolbar._buttons.forEach(item => {
                    if (item.elementAttr && item.elementAttr['name']) {
                        switch (item.elementAttr['name']) {
                            // 新增
                            case 'add-btn':
                                item.icon = 'iconfont iconadd-select';
                                item.text = '新增';
                                item.type = 'default';
                                break;
                            // 删除
                            case 'delete-btn':
                                item.icon = 'iconfont iconashbin';
                                item.text = '删除';
                                item.type = 'default';
                                item.disabled = true;
                                break;
                            // 批量删除
                            case 'delete-multiple-btn':
                                item.icon = 'iconfont iconashbin';
                                item.text = '批量删除';
                                item.type = 'default';
                                item.disabled = true;
                                break;
                            // 审核
                            case 'review-btn':
                                item.text = '审核';
                                item.type = 'default';
                                break;
                            // 仓库审核
                            case 'warehouse-review-btn':
                                item.text = '仓库审核';
                                item.type = 'default';
                                break;
                            // 财务审核
                            case 'finance-review-btn':
                                item.text = '财务审核';
                                item.type = 'default';
                                break;
                            // 筛选行
                            case 'filter-btn':
                                item.icon = 'iconfont iconfilter';
                                item.stylingMode = 'text';
                                item.instance.on('click', () => {
                                    this._dataGrid.instance.option({
                                        filterRow: {
                                            visible: !this._dataGrid.instance.option('filterRow.visible'),
                                        },
                                    });
                                });
                                item.hint = '筛选行';
                                break;
                            // 列选择器
                            case 'column-chooser-btn':
                                item.instance.on('click', () => {
                                    this._columnChooserVisible = !this._columnChooserVisible;
                                });
                                item.icon = 'iconfont iconset';
                                item.stylingMode = 'text';
                                item.hint = '列选择器';
                                break;
                            // 刷新
                            case 'refresh-btn':
                                item.instance.on('click', () => {
                                    this._dataGrid.instance.refresh();
                                });
                                item.icon = 'iconfont iconshuaxin';
                                item.stylingMode = 'text';
                                item.hint = '刷新';
                                break;
                            case 'print-btn':
                                item.icon = 'iconfont iconprint';
                                item.stylingMode = 'text';
                                // 打印
                                item.hint = '打印';
                                break;
                            case 'import-btn':
                                item.icon = 'iconfont iconimport';
                                item.type = 'default';
                                item.stylingMode = 'default';
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            this._toolbar._dropDownButtons.forEach(item => {
                if (item.elementAttr && item.elementAttr['name']) {
                    switch (item.elementAttr['name']) {
                        case 'more-btn':
                            item.icon = 'iconfont iconellipsis';
                            item.stylingMode = 'text';
                            item.splitButton = false;
                            item.showArrowIcon = false;
                            // 更多操作
                            item.hint = '更多操作';
                            item.dropDownOptions = Object.assign(item.dropDownOptions, {
                                width: 150,
                                minWidth: 150,
                            });
                            item.displayExpr = 'text';
                            item.keyExpr = 'type';
                            if (item.items && item.items.length > 0) {
                                item.items.forEach(i => {
                                    switch (i[item.keyExpr as string]) {
                                        // 导入
                                        case 'import':
                                            i.icon = 'iconfont iconimport';
                                            i[item.displayExpr as string] = '导入';
                                            break;
                                        // 导出
                                        case 'export':
                                            i.icon = 'iconfont iconexport';
                                            i[item.displayExpr as string] = '导出';
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
        }
    }
    ngAfterContentInit(): void {
        if (this._dataGrid) {
            let _calcH = '100%';
            if (this._toolbar) {
                if (this._toolbar.infoVisible) {
                    _calcH += ' - 100px';
                } else {
                    _calcH += ' - 56px';
                }
            }
            if (this._combox) {
                _calcH += ` - ${this._combox._comboxGroup.length * 50 + 10}px`;
            }
            this.__gridWrapperHeight = `calc(${_calcH} - 10px)`;
            if (this._dataGrid.filterRow) {
                this._dataGrid.filterRow.visible = this._filterRowVisible;
            }
            if (this._dataGrid.selection) {
                if (this._toolbar) {
                    this._dataGrid.instance.on('selectionChanged', (e: any) => {
                        let _count = e.selectedRowsData.length;
                        if (!this._toolbar._timer) {
                            this._toolbar.infoText = `已选择 ${_count} 项`;
                            this._toolbar.infoType = 'info';
                            let delete_btn = this._toolbar._buttons.find(
                                m => m.elementAttr && m.elementAttr['name'] == 'delete-btn'
                            );
                            if (delete_btn) {
                                if (_count > 0) {
                                    if (delete_btn) {
                                        delete_btn.disabled = false;
                                    }
                                } else {
                                    delete_btn.disabled = true;
                                }
                            }
                        }
                    });
                    this._toolbar.infoText = '已选择 0 项';
                    this._toolbar.defaultText = () => {
                        return `已选择 ${this._dataGrid.instance.getSelectedRowKeys().length} 项`;
                    };
                    this._toolbar.defaultType = 'info';
                }
            }
            if (this._dataGrid.paging && this._dataGrid.paging.enabled) {
                if (this._dataGrid.pager.visible == 'auto') {
                    this._dataGrid.pager.visible = true;
                }
                if (this._dataGrid.pager.showInfo == undefined || this._dataGrid.pager.showInfo == null) {
                    this._dataGrid.pager.showInfo = true;
                }
                if (
                    this._dataGrid.pager.showNavigationButtons == undefined ||
                    this._dataGrid.pager.showNavigationButtons == null
                ) {
                    this._dataGrid.pager.showNavigationButtons = true;
                }
                this._dataGrid.pager.showPageSizeSelector = true;
                if (this._dataGrid.pager.allowedPageSizes == 'auto') {
                    this._dataGrid.pager.allowedPageSizes = [10, 20, 50, 100];
                }
                if (this._dataGrid.paging.pageSize) {
                    if (
                        this._dataGrid.pager.allowedPageSizes instanceof Array &&
                        this._dataGrid.pager.allowedPageSizes.length > 2
                    ) {
                        this._dataGrid.paging.pageSize = this._dataGrid.pager.allowedPageSizes[1];
                    }
                }
            }
            if (this._dataGrid.columns) {
                let IDENTITY_RECORD_COLUMN = this._dataGrid.columns.find(m => m['dataField'] == 'IDENTITY_RECORD');
                if (IDENTITY_RECORD_COLUMN) {
                    IDENTITY_RECORD_COLUMN = Object.assign(IDENTITY_RECORD_COLUMN, {
                        fixed: true,
                        width: 60,
                        alignment: 'center',
                        fixedPosition: 'left',
                        allowEditing: false,
                        allowSorting: false,
                        caption: '序号',
                        showInColumnChooser: false,
                        cellTemplate: (_cellElement, _cellInfo) => {
                            _cellElement.innerText =
                                parseInt(_cellInfo.rowIndex) +
                                1 +
                                parseInt(_cellInfo.component.pageSize()) * parseInt(_cellInfo.component.pageIndex());
                        },
                    });
                }
            }
        }
    }
    ngOnInit() {}
    /** 工具条控制列隐藏/显示 */
    _columnChooserEvent(e, dataField) {
        this._dataGrid.instance.columnOption(dataField, 'visible', e.value);
    }
}

@NgModule({
    imports: [CommonModule, ToolbarInfoPanelModule, DxPopupModule, DxScrollViewModule, DxCheckBoxModule],
    declarations: [GridViewComponent],
    exports: [GridViewComponent, DxDataGridModule, ComboxPanelModule, ToolbarInfoPanelModule, DateRangeBoxModule],
})
export class GridViewModule {}
