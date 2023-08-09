import { Injectable } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import dxCheckBox from 'devextreme/ui/check_box';
import dxDateBox from 'devextreme/ui/date_box';
import dxNumberBox from 'devextreme/ui/number_box';
import dxSelectBox from 'devextreme/ui/select_box';
import dxTagBox from 'devextreme/ui/tag_box';
import dxTextBox from 'devextreme/ui/text_box';
import { PermissionService } from 'src/app/providers/permission';
import { TokenAuthService } from 'src/app/shared/services';
import { EditorHeaderComponent } from './editor-header/editor-header.component';
import { EditorHtmlEditorComponent } from './editor-html-editor/editor-html-editor.component';
import { EditorMultipleGridComponent } from './editor-multiple-grid/editor-multiple-grid.component';
import { EditorOptionRowComponent } from './editor-option-row/editor-option-row.component';
import { EditorRemarkComponent } from './editor-remark/editor-remark.component';
import { EditorReviewComponent } from './editor-review/editor-review.component';
import { EditorToolbarComponent } from './editor-toolbar/editor-toolbar.component';
import { EditorTabsGridComponent } from './editor-tabs-grid/editor-tabs-grid.component';
import { DataStatus } from './util';

class EditorGridHelper {
    _dataGrid: DxDataGridComponent;
    _optionRow: EditorOptionRowComponent;
    _common: EditorGridCommonService;
    _toolbar: EditorGridToolbarService;
    showCheckBox: boolean = true;
    constructor(_common: EditorGridCommonService, _toolbar: EditorGridToolbarService, _showCheckBox?) {
        this._common = _common;
        this._toolbar = _toolbar;
        this.showCheckBox = _showCheckBox;
    }
    /** 表格初始化 */
    _onContentInit(_dataGrid: DxDataGridComponent, _optionRow: EditorOptionRowComponent) {
        if (!_dataGrid) return;
        if (_optionRow) this._optionRow = _optionRow;
        this._dataGrid = _dataGrid;
        this._dataSourceCheck()
            ._editingCheck()
            ._hiddenDefaultDataGridToolbarPrepare()
            ._addDefaultContentMenuPreparing()
            ._addDataGridOptionsChangedEventListeners()
            ._addDataGridCellValueChangedEventListenerWithToolbarStatusCtrl()
            ._addIdentityRecordColumn()
            ._setSelectionProperties()
            ._disabledPaginate()
            ._disbaledErrorRow()
            ._optionRowInit();
    }

   

    /** 数据源检查 */
    _dataSourceCheck() {
        if (!this._dataGrid.dataSource) {
            console.warn('[Editor Grid] DataSource is not find.');
        }
        return this;
    }
    /** 编辑状态检查 */
    _editingCheck() {
        const editing = this._dataGrid.instance.option('editing');
        if (editing.enabled !== undefined) {
            this._common.editing = editing.enabled;
            this._dataGrid.instance.option('editing.mode', 'batch');
            this._dataGrid.instance.option('editing.allowUpdating', editing.enabled);
        }
        return this;
    }
    /** 隐藏 DevExtreme DataGrid 默认的工具条展示 */
    _hiddenDefaultDataGridToolbarPrepare() {
        this._dataGrid.instance.on('toolbarPreparing', (e) => {
            e.toolbarOptions.disabled = true;
            e.toolbarOptions.visible = false;
        });
        return this;
    }
    /** 右键菜单的默认实现 */
    _addDefaultContentMenuPreparing() {
        this._dataGrid.instance.on('contextMenuPreparing', (e) => {
            return;
            if (e.row && e.row.rowType === 'data') {
                e.items = [
                    {
                        text: '在上方插行',
                        onItemClick: () => {
                            this._toolbar._onValueChangedToolbarStatusCtrl();
                            e.event.preventDefault();
                        },
                    },
                    {
                        text: '在下方插行',
                        onItemClick: () => {
                            this._toolbar._onValueChangedToolbarStatusCtrl();
                            e.event.preventDefault();
                        },
                    },
                    {
                        text: '复制当前行',
                        onItemClick: () => {
                            this._toolbar._onValueChangedToolbarStatusCtrl();
                            e.event.preventDefault();
                        },
                    },
                    {
                        text: '删除当前行',
                        onItemClick: () => {
                            this._toolbar._onValueChangedToolbarStatusCtrl();
                            e.event.preventDefault();
                        },
                    },
                ];
            }
        });
        return this;
    }
    /** 添加 DevExtreme DataGrid 属性变更事件监听 */
    _addDataGridOptionsChangedEventListeners() {
        this._dataGrid.instance.on('optionChanged', (e) => {
            if (e.fullName == 'editing.enabled' && e.name == 'editing') {
                this._common.editing = e.value;
                this._dataGrid.instance.option('editing.allowUpdating', e.value);
            }
        });
        return this;
    }
    /** 添加单元格值改变监听控制工具条按钮状态 */
    _addDataGridCellValueChangedEventListenerWithToolbarStatusCtrl() {

        this._dataGrid.instance.on('editorPrepared', (e) => {
            if (e.dataField && e.parentType == 'dataRow') {
                switch (e.editorName) {
                    case 'dxSelectBox':
                        dxSelectBox
                            .getInstance(e.editorElement)
                            .on('valueChanged', (_e) => this._toolbar._onValueChangedToolbarStatusCtrl());
                        break;
                    case 'dxNumberBox':
                        dxNumberBox
                            .getInstance(e.editorElement)
                            .on('valueChanged', (_e) => this._toolbar._onValueChangedToolbarStatusCtrl());
                        break;
                    case 'dxTextBox':
                        dxTextBox
                            .getInstance(e.editorElement)
                            .on('valueChanged', (_e) => this._toolbar._onValueChangedToolbarStatusCtrl());
                        break;
                    case 'dxTagBox':
                        dxTagBox
                            .getInstance(e.editorElement)
                            .on('valueChanged', (_e) => this._toolbar._onValueChangedToolbarStatusCtrl());
                        break;
                    case 'dxDateBox':
                        dxDateBox
                            .getInstance(e.editorElement)
                            .on('valueChanged', (_e) => this._toolbar._onValueChangedToolbarStatusCtrl());
                        break;
                    case 'dxCheckBox':
                        dxCheckBox
                            .getInstance(e.editorElement)
                            .on('valueChanged', (_e) => this._toolbar._onValueChangedToolbarStatusCtrl());
                        break;
                    default:
                        break;
                }
            }
        });
        return this;
    }
    /** 添加序号列 */
    _addIdentityRecordColumn() {
        if (this._dataGrid.columns && this._dataGrid.columns instanceof Array) {
            let IDENTITY_RECORD_COLUMN = this._dataGrid.columns.find((m) => m['dataField'] == 'IDENTITY_RECORD');
            if (IDENTITY_RECORD_COLUMN) {
                IDENTITY_RECORD_COLUMN = Object.assign(IDENTITY_RECORD_COLUMN, {
                    fixed: true,
                    width: 60,
                    alignment: 'center',
                    fixedPosition: 'left',
                    allowEditing: false,
                    allowSorting: false,
                    caption: '序号',
                    cellTemplate: (_cellElement, _cellInfo) => {
                        _cellElement.innerText =
                            parseInt(_cellInfo.rowIndex) +
                            1 +
                            parseInt(_cellInfo.component.pageSize()) * parseInt(_cellInfo.component.pageIndex());
                    },
                });
            }
        }
        return this;
    }
    /** 设置选择列属性 */
    _setSelectionProperties() {
        if (this._dataGrid.selection) {
            this._dataGrid.selection.mode = this.showCheckBox ? 'multiple' : 'single';
            this._dataGrid.selection.allowSelectAll = this.showCheckBox ? true : false;
            this._dataGrid.selection.selectAllMode = 'page';
            this._dataGrid.selection.showCheckBoxesMode = this.showCheckBox ? 'always' : 'none';
        }
        // console.log(this._dataGrid.selection)
        return this;
    }
    /** 禁用分页 */
    _disabledPaginate() {
        this._dataGrid.paging.enabled = false;
        return this;
    }
    /** 禁用错误行提示 */
    _disbaledErrorRow() {
        this._dataGrid.errorRowEnabled = false;
        return this;
    }
    /** 增行实现 */
    __addRow() {
        let _data = { target: DataStatus.NewButNotEdit };
        if (this._dataGrid.dataSource instanceof DataSource) {
            if (this._dataGrid.dataSource.store() instanceof CustomStore) {
                let randomKey = undefined;
                const maxWhile = 10;
                let whileCount = 0;
                do {
                    randomKey = Math.round(Math.random() * 10000000);
                    if (whileCount > maxWhile) {
                        break;
                    }
                    whileCount++;
                } while (this._dataGrid.instance.getRowIndexByKey(randomKey) > -1);
                _data[((<DataSource>this._dataGrid.dataSource).store() as CustomStore).key()] = randomKey;
                ((<DataSource>this._dataGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
                    this._dataGrid.instance.refresh();
                    this._toolbar._onValueChangedToolbarStatusCtrl();
                });
            }
        } else if (this._dataGrid.dataSource instanceof Array) {
            if (!this._dataGrid.keyExpr) {
                throw new Error('[EditorGrid] If you dataSource type is Array, You must be set keyExpr.');
            }
            _data[`${this._dataGrid.keyExpr}`] = this._dataGrid.instance.getVisibleRows().length + 1;
            this._dataGrid.dataSource.push(_data);
            // this._dataGrid.instance.refresh();
            this._toolbar._onValueChangedToolbarStatusCtrl();
        } else {
            throw new Error('[EditorGrid] Only support Array and DataSource');
        }
    }
    /** 删行实现 */
    __deleteRow() {
        let _deleteKeys: any[] = this._dataGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            _deleteKeys = [
                this._dataGrid.instance.getKeyByRowIndex(this._dataGrid.instance.getVisibleRows().length - 1),
            ];
        }
        if (_deleteKeys.length == 0) return;
        if (this._dataGrid.dataSource instanceof DataSource) {
            ((<DataSource>this._dataGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
                this._dataGrid.instance.refresh();
                this._toolbar._onValueChangedToolbarStatusCtrl();
            });
        } else if (this._dataGrid.dataSource instanceof Array) {
            let dataSource = this._dataGrid.dataSource as number[];
            _deleteKeys.forEach((i) => {
                dataSource.splice(
                    dataSource.find((m) => m[`${this._dataGrid.keyExpr}`] == i),
                    1
                );
            });
            this._toolbar._onValueChangedToolbarStatusCtrl();
        }
    }
    /** 初始化操作行 */
    _optionRowInit() {
        if (!this._optionRow) return;
        if (this._optionRow._addDelete) {
            this._bindOptionRowAddOption()._bindOptionRowDeleteOption();
        }
    }
    /** 绑定操作行增行事件 */
    _bindOptionRowAddOption() {
        this._optionRow._addDelete.addRow = this.__addRow.bind(this);
        return this;
    }
    /** 绑定操作行删行事件 */
    _bindOptionRowDeleteOption() {
        this._optionRow._addDelete.deleteRow = this.__deleteRow.bind(this);
        return this;
    }
}

@Injectable()
export class EditorGridService {
    constructor(private _toolbar: EditorGridToolbarService, private _common: EditorGridCommonService) {}
    _onContentInit(_dataGrid: DxDataGridComponent, _optionRow: EditorOptionRowComponent, _showCheckBox) {
        new EditorGridHelper(this._common, this._toolbar, _showCheckBox)._onContentInit(_dataGrid, _optionRow);
    }
}

@Injectable()
export class EditorMultipleGridService {
    constructor(private _common: EditorGridCommonService, private _toolbar: EditorGridToolbarService) {}
    _onContentInit(_multipleGrid: EditorMultipleGridComponent, _showCheckBox) {
        _multipleGrid._tabs.forEach((tab) => {
            tab._items.forEach((item) => {
                new EditorGridHelper(this._common, this._toolbar, _showCheckBox)._onContentInit(
                    item._dataGrid,
                    item._optionRow
                );
            });
        });
    }
}

@Injectable()
export class EditorGridToolbarService {
    _toolbar: EditorToolbarComponent;
    permission: PermissionService = new PermissionService();
    constructor(private _common: EditorGridCommonService, private tokenService: TokenAuthService) {}
    _onContentInit(_toolbar: EditorToolbarComponent) {
        if (!_toolbar) return;
        this._toolbar = _toolbar;
        this._defaultButtonsConfiguration()._onContentInitToolbarStatusCtrl();
    }
    _checkPermission() {
        if(!this._toolbar){
            return;
        }
        this.tokenService.getPermission().then((res) => {
            this.permission.refresh(res.permissions);
            // 新增 - 禁用
            let add_btn = this._toolbar._buttons.find(m => m.elementAttr['name'] == 'add-btn');
            if (add_btn&&!this.permission.$$add&&!this.permission.$$manager) {
                 add_btn.disabled = true;
            }
            // 删除 - 禁用
            let delete_btn = this._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn');
            if (delete_btn&&!this.permission.$$delete&&!this.permission.$$manager){
                delete_btn.disabled = true;
            } 
            // 保存 - 禁用
            let save_btn = this._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn');
            if (save_btn&&!this.permission.$$add&&!this.permission.$$edit&&!this.permission.$$manager){
                save_btn.disabled = true;
            }
            // 撤销 - 禁用
            let cancel_btn = this._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn');
            if (cancel_btn&&!this.permission.$$add&&!this.permission.$$edit&&!this.permission.$$manager){
                cancel_btn.disabled = true;
            }
            // 参照新增 - 禁用
            let refer_btn = this._toolbar._buttons.find(m => m.elementAttr['name'] == 'refer-btn');
            if (refer_btn&&!this.permission.$$add&&!this.permission.$$manager){
                refer_btn.disabled = true;
            } 
        });
    }
    _defaultButtonsConfiguration() {
        this._toolbar._buttons.forEach((item) => {
            if (item.elementAttr && item.elementAttr['name']) {
                switch (item.elementAttr['name']) {
                    case 'add-btn':
                        item.icon = 'iconfont iconadd-select';
                        // 新增
                        item.text = '新增';
                        item.type = 'default';
                        break;
                    case 'delete-btn':
                        item.icon = 'iconfont iconashbin';
                        // 删除
                        item.text = '删除';
                        item.type = 'default';
                        break;
                    case 'edit-btn':
                        item.icon = '';
                        // 修改
                        item.text = '编辑';
                        item.type = 'default';
                        break;
                    case 'save-btn':
                        item.icon = 'iconfont iconsave';
                        // 保存
                        item.text = '保存';
                        item.type = 'default';
                        item.disabled = true;
                        break;
                    case 'cancel-btn':
                        item.icon = 'iconfont iconresonserate';
                        // 撤销
                        item.text = '撤销';
                        item.type = 'default';
                        item.disabled = true;
                        break;
                    case 'print-btn':
                        item.icon = 'iconfont iconprint';
                        item.stylingMode = 'text';
                        // 打印
                        item.hint = '打印';
                        break;
                    case 'import-btn':
                        item.icon = 'iconfont iconimport';
                        item.text = '导入';
                        item.type = 'default';
                        item.stylingMode = 'default';
                        break;
                        case 'refer-btn':
                            //item.icon = 'iconfont';
                            // 新增
                            item.text = '参照新增';
                            item.type = 'default';
                            break;
                    // case 'column-chooser-btn':
                    //     item.instance.on('click', () => {
                    //         this._common.columnChooserVisible = !this._common.columnChooserVisible;
                    //     });
                    //     item.icon = 'iconfont iconset';
                    //     item.stylingMode = 'text';
                    //     item.hint = '列选择器';
                    //     break;
                    default:
                        break;
                }
            }
        });
        return this;
    }
    /**
     * 页面初始化按钮状态控制
     * ### 规则
     * 新增状态下
     * - 新增、删除按钮为禁用状态
     * - 保存、撤销按钮为禁用状态, 数据变更后变为启用状态
     *
     * 编辑状态下
     * - 新增、删除按钮为启用状态
     * - 保存、撤销按钮为禁用状态, 数据变更后变为启用状态
     *
     * 编辑状态 & 已审核
     * - 新增、删除、保存、撤销都为禁用状态, 已审核单据不可以操作
     */
    _onContentInitToolbarStatusCtrl() {
        if (this._common.mode == 'create') {
            ['add-btn', 'delete-btn', 'save-btn', 'cancel-btn', 'refer-btn'].forEach((key) => {
                let btn = this._toolbar._buttons.find((m) => m.elementAttr['name'] == key);
                if (btn) btn.disabled = true;
            });
            this._checkPermission();
            return;
        }
        if (this._common.mode == 'edit') {
            ['add-btn', 'delete-btn', 'refer-btn'].forEach((key) => {
                let btn = this._toolbar._buttons.find(
                    (m) =>
                        m.elementAttr['name'] == key &&
                        (m.elementAttr['customDisabled'] == false || m.elementAttr['customDisabled'] == undefined)
                );
                if (btn) btn.disabled = this._common.reviewed;
            });
            ['save-btn', 'cancel-btn'].forEach((key) => {
                let btn = this._toolbar._buttons.find((m) => m.elementAttr['name'] == key);
                if (btn) btn.disabled = true;
            });
            this._checkPermission();
            return;
        }
        if (this._common.mode == 'view') {
            this._onPageViewToolbarStatusCtrl();
        }
    }

    /**
     * 保存成功后工具条状态控制
     * ### 规则
     * - mode 变为 edit
     * - 使用编辑页面的初始化状态
     */
    _onSaveChangedToolbarStatusCtrl() {
        this._common.mode = 'edit';
        this._onContentInitToolbarStatusCtrl();
    }
    /**
     * 表单值变更后工具条状态控制
     * ### 规则
     * - 保存、撤销设置为启用状态
     */
    _onValueChangedToolbarStatusCtrl() {
        if (!this._common.mode||this._common.mode == 'view') return this;
        ['save-btn', 'cancel-btn'].forEach((key) => {
            let btn = this._toolbar._buttons.find((m) => m.elementAttr['name'] == key);
            if (btn) btn.disabled = false;
        });
        this._checkPermission();
    }
    /**
     * 删除成功后工具条状态控制
     * ### 规则
     * - 新增为启用状态
     * - 保存、撤销、删除为禁用状态
     */
    _onDeletedToolbarStatusCtrl() {
        this._common.deleted = true;
        ['add-btn', 'delete-btn', 'save-btn', 'cancel-btn', 'refer-btn'].forEach((key) => {
            let btn = this._toolbar._buttons.find((m) => m.elementAttr['name'] == key);
            if (btn) {
                if (key == 'add-btn') {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }
        });
        this._checkPermission();
    }
    /**
     * 审核成功后工具条状态控制
     * ### 规则
     * - 新增为启用状态
     * - 保存、撤销、删除为禁用状态
     */
    _onReviewedToolbarStatusCtrl() {
        this._common.reviewed = true;
        ['add-btn', 'delete-btn', 'save-btn', 'cancel-btn', 'refer-btn'].forEach((key) => {
            let btn = this._toolbar._buttons.find((m) => m.elementAttr['name'] == key);
            if (btn) {
                if (key == 'add-btn') {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }
        });
        this._checkPermission();

    }
    /**
     * 取消审核工具条状态控制
     * ### 规则
     * - reviewd 设置为 false
     * - 使用默认初始化页面状态
     */
    _onUnreviewToolbarStatusCtrl() {
        this._common.reviewed = false;
        this._onContentInitToolbarStatusCtrl();
    }

    /** 当页面为 View 时的工具条状态 */
    _onPageViewToolbarStatusCtrl() {
        ['add-btn', 'delete-btn', 'save-btn', 'cancel-btn', 'refer-btn'].forEach((key) => {
            let btn = this._toolbar._buttons.find((m) => m.elementAttr['name'] == key);
            if (btn) {
                if (key == 'add-btn') {
                    btn.disabled = false;
                } else {
                    btn.disabled = true;
                }
            }
        });
        this._checkPermission();
    }
}

@Injectable()
export class EditorGridHeaderService {
    _header: EditorHeaderComponent;
    constructor(private _toolbar: EditorGridToolbarService) {}
    _onContentInit(_header: EditorHeaderComponent) {
        if (!_header) return;
        this._header = _header;
        this._addHeaderItemValueChangedListenerWithToolbarStatusCtrl();
    }
    _addHeaderItemValueChangedListenerWithToolbarStatusCtrl() {

        this._header._headerGroups.forEach((g:any) => {
            g._items.forEach((m) => {
                if (m._dateBox)
                    m._dateBox.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                if (m._selectBox)
                    m._selectBox.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                if (m._textBox)
                    m._textBox.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                if (m._tagBox)
                    m._tagBox.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                if (m._textArea) {
                    m._textArea.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                }
                if (m._checkBox) {
                    m._checkBox.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                }
                if (m._numberBox) {
                    m._numberBox.instance.on('valueChanged', (e) => {
                        this._headerEditorValueChangedCompareEmitter(e.value, m.defaultValue);
                    });
                }
            });
        });
        return this;
    }
    private _headerEditorValueChangedCompareEmitter(value, defaultValue) {
        if (value != defaultValue) {
            this._toolbar._onValueChangedToolbarStatusCtrl();
        }
    }
}

@Injectable()
export class EditorGridCommonService {
    constructor() {}
    /** 模式 */
    mode: 'create' | 'edit' | 'view';
    /** 编辑状态 */
    editing: boolean = true;
    /** 审核状态 */
    reviewed: boolean = false;
    /** 删除状态 */
    deleted: boolean = false;
    /** 多表 */
    multipleGrid: boolean = false;
    /** 计算表格容器高度 */
    _calculateGridHeight(
        _dataGrid: DxDataGridComponent,
        _toolbar: EditorToolbarComponent,
        _tabsGrid: EditorTabsGridComponent,
        _header: EditorHeaderComponent,
        _optionRow: EditorOptionRowComponent,
        _remark: EditorRemarkComponent,
        _review: EditorReviewComponent
    ) {
        let _calcH = '100%';
        if (_header) {
            _calcH += ` - ${_header._headerGroups.length * 50 + 10}px`;
        }
        if (_optionRow) {
            _calcH += ' - 50px';
        }
        if (_remark) {
            _calcH += ' - 55px';
        }
        if (_review) {
            _calcH += ' - 40px';
        }
        return `calc(${_calcH} - 20px)`;
    }
}

@Injectable()
export class EditorHtmlEditorService {
    _editorHtmlEditor: EditorHtmlEditorComponent;
    constructor(private _toolbar: EditorGridToolbarService) {}
    _onContentInit(_editorHtmlEditor: EditorHtmlEditorComponent) {
        if (!_editorHtmlEditor) return;
        this._editorHtmlEditor = _editorHtmlEditor;
        this._configureHtmlEditorToolbarItems()._addValueChangedEventListenerWithToolbarStatusCtrl();
    }
    /** 配置富文本工具条操作按钮项 */
    _configureHtmlEditorToolbarItems() {
        this._editorHtmlEditor._editor.toolbar.items = this._defaultToolbarItems();
        return this;
    }
    /** 富文本工具条支持的按钮项 */
    _defaultToolbarItems() {
        let _items = [];
        [
            'undo',
            'redo',
            'separator',
            { name: 'size', values: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'] },
            {
                name: 'font',
                values: [
                    'Arial',
                    'Courier New',
                    'Georgia',
                    'Impact',
                    'Lucida Console',
                    'Tahoma',
                    'Times New Roman',
                    'Verdana',
                ],
            },
            'separator',
            'bold',
            'italic',
            'strike',
            'underline',
            'separator',
            'alignLeft',
            'alignCenter',
            'alignRight',
            'alignJustify',
            'separator',
            'orderedList',
            'bulletList',
            'separator',
            { name: 'header', values: [false, 1, 2, 3, 4, 5] },
            'separator',
            'color',
            'background',
            'separator',
            'link',
            'image',
            'separator',
            'clear',
            'codeBlock',
            'blockquote',
            'separator',
            'increaseIndent',
            'insertTable',
            'deleteTable',
            // 'insertRowAbove',
            // 'insertRowBelow',
            // 'deleteRow',
            // 'insertColumnLeft',
            // 'insertColumnRight',
            // 'deleteColumn',
        ].forEach((m) => {
            if (typeof m === 'string') {
                _items.push({
                    formatName: m,
                });
            } else {
                _items.push({
                    formatName: m.name,
                    formatValues: m.values,
                });
            }
        });
        return _items;
    }
    /** 添加值变更事件控制工具条按钮状态 */
    _addValueChangedEventListenerWithToolbarStatusCtrl() {
        this._editorHtmlEditor._editor.instance.on('valueChanged', (e) => {
            if (e.value != this._editorHtmlEditor.defaultValue) {
                this._toolbar._onValueChangedToolbarStatusCtrl();
            }
        });
    }
}
