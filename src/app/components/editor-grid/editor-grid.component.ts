import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    NgModule,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    DxCheckBoxModule,
    DxDataGridComponent,
    DxDataGridModule,
    DxPopupModule,
    DxScrollViewModule,
    DxTreeViewModule
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { DataStatus, EditorGridUtils } from './util';
import { EditorHeaderComponent, EditorHeaderModule } from './editor-header/editor-header.component';
import { EditorTabsGridComponent, EditorTabsGridModule } from './editor-tabs-grid/editor-tabs-grid.component';
import { EditorHeaderGridComponent, EditorHeaderGridModule } from './editor-header-grid/editor-header-grid.component';
import { EditorToolbarComponent, EditorToolbarModule } from './editor-toolbar/editor-toolbar.component';
import { EditorOptionRowComponent, EditorOptionRowModule } from './editor-option-row/editor-option-row.component';
import { EditorRemarkComponent, EditorRemarkModule } from './editor-remark/editor-remark.component';
import { EditorReviewComponent, EditorReviewModule } from './editor-review/editor-review.component';
import { ReviewTypes } from './editor-review/types';
import {
    EditorMultipleGridComponent,
    EditorMultipleGridModule,
} from './editor-multiple-grid/editor-multiple-grid.component';
import {
    EditorGridCommonService,
    EditorGridHeaderService,
    EditorGridService,
    EditorGridToolbarService,
    EditorHtmlEditorService,
    EditorMultipleGridService,
} from './editor-grid.service';
import {
    EditorReviewRemoteComponent,
    EditorReviewRemoteModule,
} from './editor-review-remote/editor-review-remote.component';
import { EditorHtmlEditorComponent, EditorHtmlEditorModule } from './editor-html-editor/editor-html-editor.component';
import { EditorApprovalModule } from './editor-approval/editor-approval.component';
import { EditorCustomizeTemplateModule } from './editor-customize-template/editor-customize-template.component';

@Component({
    selector: 'editor-grid',
    templateUrl: './editor-grid.component.html',
    styleUrls: ['./editor-grid.component.scss'],
    styles: [
        `
            :host {
                width: 100%;
                height: 100%;
            }
        `,
    ],
})
export class EditorGridComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    _mode: 'create' | 'edit' | 'view';
    @Input()
    set mode(value: 'create' | 'edit' | 'view') {
        if (this._mode != value) {
            this.onModeChanged.emit({
                component: this,
                mode: value,
            });
        }
        this._editorCommonService.mode = value;
        this._mode = value;
        this.modeChange.emit(value);
    }
    get mode() {
        return this._mode;
    }
    
    @Output()
    onModeChanged = new EventEmitter(true);
    @Output()
    modeChange = new EventEmitter();
    /** 自适应全屏空间 */
    @Input()
    fullScreen: boolean = true;
    @Input()
    heightType: boolean = false;
    @Output()
    onAppendRow = new EventEmitter();
    @Output()
    onDeleteRow = new EventEmitter();
    @Input()
    showCheckBox: boolean = true;
    @ContentChild(DxDataGridComponent, { static: false })
    _dataGrid: DxDataGridComponent;
    @ContentChild(EditorHeaderComponent, { static: false })
    _header: EditorHeaderComponent;
    @ContentChild(EditorTabsGridComponent, { static: false })
    _tabsGrid: EditorTabsGridComponent;
    @ContentChild(EditorHeaderGridComponent, { static: false })
    _headerGrid: EditorHeaderGridComponent;
    @ContentChild(EditorToolbarComponent, { static: false })
    _toolbar: EditorToolbarComponent;
    @ContentChild(EditorOptionRowComponent, { static: false })
    _optionRow: EditorOptionRowComponent;
    @ContentChild(EditorRemarkComponent, { static: false })
    _remark: EditorRemarkComponent;
    @ContentChild(EditorReviewComponent, { static: false })
    _review: EditorReviewComponent;
    @ContentChild(EditorReviewRemoteComponent, { static: false })
    _remoteReveiw: EditorReviewRemoteComponent;
    @ContentChild(EditorMultipleGridComponent, { static: false })
    _multipleGrid: EditorMultipleGridComponent;
    @ContentChild(EditorHtmlEditorComponent, { static: false })
    _htmlEditor: EditorHtmlEditorComponent;
    _editing: boolean = false;
    __gridWrapperHeight: string;
    constructor(
        private _editorGridService: EditorGridService,
        private _editorMutipleGridService: EditorMultipleGridService,
        private _editorToolbarService: EditorGridToolbarService,
        private _editorHeaderService: EditorGridHeaderService,
        private _editorCommonService: EditorGridCommonService,
        private _editorHtmlEditorService: EditorHtmlEditorService
    ) {}
    ngOnDestroy(): void {
        this._editorCommonService.deleted = false;
        this._editorCommonService.editing = undefined;
        this._editorCommonService.mode = undefined;
        this._editorCommonService.multipleGrid = false;
        this._editorCommonService.reviewed = false;
    }
    ngAfterViewInit(): void {
        if (this._dataGrid) {
            this._dataGrid.errorRowEnabled = false;
            this._dataGrid.allowColumnResizing = true;
            this._dataGrid.columnResizingMode = 'widget';
        }
        if (this._remark) {
            this._remark._textArea.instance.on('valueChanged', e => {
                this._headerValueChange(e.value, this._remark);
            });
        }
    }
    ngAfterContentInit(): void {
        this._editorCommonService.mode = this.mode;

        if (this._multipleGrid) {
            this._editorCommonService.multipleGrid = true;
            this._editorMutipleGridService._onContentInit(this._multipleGrid,this.showCheckBox);
        } else {
            if (this.fullScreen) {
                this.__gridWrapperHeight = this._editorCommonService._calculateGridHeight(
                    this._dataGrid,
                    this._toolbar,
                    this._tabsGrid,
                    this._header,
                    this._optionRow,
                    this._remark,
                    this._review
                );
            }
            this._editorCommonService.multipleGrid = false;
            this._editorGridService._onContentInit(this._dataGrid, this._optionRow,this.showCheckBox);
        }
        this._editorToolbarService._onContentInit(this._toolbar);
        this._editorHeaderService._onContentInit(this._header);
        this._editorHtmlEditorService._onContentInit(this._htmlEditor);
        if (this._review) {
            this._review._relationToolbarStatus = this._afterReviewedBtnStatusCtrl.bind(this);
        }
        this._editorToolbarService._checkPermission();
    }
    ngOnInit() {}
    /** 增行 */
    _addRowImpl() {
        let _data = { target: DataStatus.NewButNotEdit };
        _data[((<DataSource>this._dataGrid.dataSource).store() as CustomStore).key()] =
            this._dataGrid.instance.getVisibleRows().length + 1;
        ((<DataSource>this._dataGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._dataGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
        });
    }
    /** 删行 */
    _deleteRowImpl() {
        let _deleteKeys: any[] = this._dataGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            _deleteKeys = [
                this._dataGrid.instance.getKeyByRowIndex(this._dataGrid.instance.getVisibleRows().length - 1),
            ];
        }
        ((<DataSource>this._dataGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._dataGrid.instance.refresh();
            this._saveCancelBtnStatusCtrl();
        });
    }
    /** 单元格值改变事件 */
    _onGridCellValueChangedEvent(e, _e) {
        if (this._deleted) return;
        
        this._saveCancelBtnStatusCtrl();
        e.editorOptions.onValueChanged(_e);
    }
    /** 保存和撤销按钮的状态控制 */
    _saveCancelBtnStatusCtrl(status: boolean = false) {
        if (this._toolbar) {
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn').disabled = status;
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = status;
            this._editorToolbarService._checkPermission();
        }
    }
    /** 表头数据变更控制按钮操作状态 */
    _headerValueChange(value, item) {
        if (value != item.defaultValue) {
            this._saveCancelBtnStatusCtrl();
        }
    }
    /** 审核后变更控制按钮操作状态 */
    _afterReviewedBtnStatusCtrl(skip: string[]) {
        if (this._toolbar) {
            let _ = this._review._items.find(m => m._reviewed && m.type != ReviewTypes.making);
            if (_) {
                this._toolbar._buttons.forEach(m => {
                    let _name = m.elementAttr['name'];
                    if (_name && skip.indexOf(_name) < 0 && _name != 'add-btn') {
                        m.disabled = true;
                    }
                });
            } else {
                this._toolbar._buttons.forEach(m => {
                    m.disabled = false;
                });
                if (this.mode == 'create') {
                    this.instance.useCreateStatus();
                }
                if (this.mode == 'edit') {
                    this.instance.useEditStatus();
                }
            }
        }
    }
    /** 删除单据后的表格操作状态 */
    deletedGridStatusCtrl() {
        if (this._toolbar) {
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
            this._saveCancelBtnStatusCtrl(true);
            this._deleted = true;
            this._dataGrid.instance.option('editing.allowUpdating', false);
        }
    }
    /** 禁用单据后的按钮操作状态 */
    disabledGridStatusCtrl() {
        if (this._toolbar) {
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn').disabled = true;
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = true;
            // 参照新增 - 禁用
            let refer_btn = this._toolbar._buttons.find(m => m.elementAttr['name'] == 'refer-btn');
            if (refer_btn) refer_btn.disabled = true;

        }
    }
    /** 编辑表格默认状态*/
    defaultGridStatusCtrl() {
        if (this._toolbar) {
            this._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = false;
            this._saveCancelBtnStatusCtrl(true);
            this._deleted = false;
            this._dataGrid.instance.option('editing.allowUpdating', true);
            this._dataGrid.instance.cancelEditData();
        }
    }
    get instance() {
        return new EditorGrid(this, this._editorCommonService, this._editorToolbarService, this._editorHeaderService);
    }
    get _lang() {
        return 'zh';
    }
    get _reviewed() {
        if (this._review) {
            let _ = this._review._items.find(m => m._reviewed && m.type != ReviewTypes.making);
            if (_) {
                return true;
            }
        }
        return false;
    }
    get _deleted() {
        return this._editorCommonService.deleted;
    }
    set _deleted(value: boolean) {
        this._editorCommonService.deleted = value;
    }
}

class EditorGrid {
    constructor(
        private _component: EditorGridComponent,
        private _editorCommonService: EditorGridCommonService,
        private _editorToolbarService: EditorGridToolbarService,
        private _editorHeaderService: EditorGridHeaderService
    ) {}
    toolbar: EditorToolbar = new EditorToolbar(this._component,this._editorToolbarService);
    save(): Promise<void> {
        if (this._component._multipleGrid) {
            let _dataGridSaveEditorActions = [];
            this._component._multipleGrid._tabs.forEach(m => {
                m._items.forEach(_ => {
                    _dataGridSaveEditorActions.push(_._dataGrid.instance.saveEditData);
                });
            });
            return Promise.resolve(
                _dataGridSaveEditorActions.forEach(f => {
                    f();
                })
            );
        } else {
            return new Promise((resolve, reject) => {
                let validation = (this._component._dataGrid.instance as any).getController('validating').validate(true);
                validation.then(vaild => {
                    if (vaild) {
                        this._component._dataGrid.instance.saveEditData();
                        resolve();
                    }
                });
            });
        }
    }
    refresh() {
        this._component._dataGrid.instance.refresh();
        return this;
    }
    /**
     *  撤销
     * @deprecated 请使用 setToolbarStatusAfterCancelled
     */
    cancel() {
        if (this._component.mode == 'create') this.useCreateStatus();
        if (this._component.mode == 'edit') this.useEditStatus();
        return this;
    }
    /** 设置工具条组件在撤销后的工具条状态 */
    setToolbarStatusAfterCancelled() {
        this._editorToolbarService._onContentInitToolbarStatusCtrl();
        this.cancelAll();
        return this;
    }
    /** 撤销全部更改 */
    cancelAll() {
        if (this._component._multipleGrid) {
            this._component._multipleGrid._tabs.forEach(t => {
                t._items.forEach(m => {
                    m._dataGrid.instance.cancelEditData();
                });
            });
        } else {
            this._component._dataGrid.instance.cancelEditData();
        }
        return this;
    }
    /**
     * 新增页面状态
     * @deprecated 请使用 setToolbarStatusAfterCreated
     */
    useCreateStatus() {
        this._component._deleted = false;
        this._component._toolbar._buttons.forEach(m => {
            m.disabled = false;
        });
        this.toolbar.useCreateStatus();
        this._component._dataGrid.instance.cancelEditData();
        return this;
    }
    /** 设置工具条组件在创建新单据后的工具条状态 */
    setToolbarStatusAfterCreated() {
        this._editorCommonService.deleted = false;
        this._editorCommonService.mode = 'create';
        this._editorCommonService.reviewed = false;
        this.cancelAll();
        this._editorToolbarService._onContentInitToolbarStatusCtrl();
        return this;
    }
    /**
     * 编辑页面状态
     * @deprecated 请使用 setToolbarStatusAfterSaved
     */
    useEditStatus() {
        this._component._deleted = false;
        this._component._toolbar._buttons.forEach(m => {
            m.disabled = false;
        });
        this.toolbar.useEditStatus();
        this._component._dataGrid.instance.cancelEditData();
        return this;
    }
    /** 设置保存后的工具条状态 */
    setToolbarStatusAfterSaved() {
        this._editorCommonService.mode = 'edit';
        this._editorToolbarService._onContentInitToolbarStatusCtrl();
        return this;
    }
    /**
     * 已审核页面状态
     * @deprecated 请使用 setToolbarStatusAfterReviewed
     */
    useReviewedStatus(skip: string[]) {
        this._component._afterReviewedBtnStatusCtrl(skip);
        return this;
    }
    /** 设置审核之后的工具条状态 */
    setToolbarStatusAfterReviewed() {
        this._editorToolbarService._onReviewedToolbarStatusCtrl();
        return this;
    }
    /** 设置取消审核之后的工具条状态 */
    setToolbarStatusAfterUnreviewed() {
        this._editorCommonService.reviewed = false;
        this._editorToolbarService._onUnreviewToolbarStatusCtrl();
        return this;
    }
    /**
     * 单据被删除状态
     * @deprecated 请使用 setToolbarStatusAfterDeleted
     */
    useDeletedStatus() {
        this._component._deleted = true;
        this._component._toolbar._buttons.forEach(m => {
            m.disabled = true;
        });
        this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'add-btn').disabled = false;
        return this;
    }
    /** 设置删除之后的工具条状态 */
    setToolbarStatusAfterDeleted() {
        if (this._editorCommonService.mode == 'view') return this;
        this._editorCommonService.deleted = true;
        this._editorToolbarService._onDeletedToolbarStatusCtrl();
        return this;
    }
    /** 设置在值变更之后的工具条状态 */
    setToolbarStatusAfterOnValueChanged() {
        if (this._editorCommonService.mode == 'view') return this;
        this._editorToolbarService._onValueChangedToolbarStatusCtrl();
        return this;
    }
    /** 设置页面数据初始化后的工具条状态 */
    setToolbarStatusAfterOnContentInit() {
        this._editorToolbarService._onContentInitToolbarStatusCtrl();
        return this;
    }
    /** 设置在进行复制操作之后的工具条状态 */
    setToolbarStatusAfterOnCopied() {
        this._editorCommonService.mode = 'create';
        this._editorToolbarService._onContentInitToolbarStatusCtrl();
        this._editorToolbarService._onValueChangedToolbarStatusCtrl();
    }
    /** 设置EditorGrid模式 */
    setEditorGridMode(mode: 'create' | 'edit' | 'view') {
        this._editorCommonService.mode = mode;
        return this;
    }
    /** 插入行 */
    insertRow(data: any) {
        let _data = Object.assign(data, { target: DataStatus.NewButNotEdit });
        ((<DataSource>this._component._dataGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this._component._dataGrid.instance.refresh();
            this._component._saveCancelBtnStatusCtrl();
        });
    }
    /** 切换页面状态为仅查看状态 */
    changeToViewMode() {
        this._component.mode = 'view';
        this._component.modeChange.emit('view');
        this._editorToolbarService._onPageViewToolbarStatusCtrl();
    }
    /** 设置页面数据初始化后的工具条状态 */
    setToolbarStatusAllDisabledOnInit() {
        this.toolbar.useDisabledStatus();
    }
}
class EditorToolbar {
    constructor(private _component: EditorGridComponent,private _editorToolbarService: EditorGridToolbarService) {}
    /** 创建页的工具条状态 */
    useCreateStatus() {
        if (this._component._toolbar && this._component._toolbar._buttons) {
            // 新增 - 禁用
            let add_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'add-btn');
            if (add_btn) add_btn.disabled = true;
            // 删除 - 禁用
            let delete_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn');
            if (delete_btn) delete_btn.disabled = true;
            // 保存 - 禁用
            let save_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn');
            if (save_btn) save_btn.disabled = true;
            // 撤销 - 禁用
            let cancel_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn');
            if (cancel_btn) cancel_btn.disabled = true;
            // 参照新增 - 禁用
            let refer_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'refer-btn');
            if (refer_btn) refer_btn.disabled = true;

            this._editorToolbarService._checkPermission();
        }
    }
    /** 编辑页的工具条状态 */
    useEditStatus() {
        // 新增 - 启用
        let add_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'add-btn');
        if (add_btn) add_btn.disabled = false;
        // 删除 - 禁用
        let delete_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn');
        if (delete_btn) delete_btn.disabled = false;
        // 保存 - 禁用
        let save_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn');
        if (save_btn) save_btn.disabled = true;
        // 撤销 - 禁用
        let cancel_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn');
        if (cancel_btn) cancel_btn.disabled = true;
        // 参照新增 - 启用
        let refer_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'refer-btn');
        if (refer_btn) refer_btn.disabled = false;

        this._editorToolbarService._checkPermission();
    }
      /** 禁用工具条状态 */
    useDisabledStatus() {
        if (this._component._toolbar && this._component._toolbar._buttons) {
            // 新增 - 禁用
            let add_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'add-btn');
            if (add_btn) add_btn.disabled = true;
            // 删除 - 禁用
            let delete_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn');
            if (delete_btn) delete_btn.disabled = true;
            // 保存 - 禁用
            let save_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'save-btn');
            if (save_btn) save_btn.disabled = true;
            // 撤销 - 禁用
            let cancel_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn');
            if (cancel_btn) cancel_btn.disabled = true;
            // 参照新增 - 禁用
            let refer_btn = this._component._toolbar._buttons.find(m => m.elementAttr['name'] == 'refer-btn');
            if (refer_btn) refer_btn.disabled = true;
            this._editorToolbarService._checkPermission();
        }
    }
}

/** 表格编辑组件 */
@NgModule({
    imports: [CommonModule, DxPopupModule, DxScrollViewModule, DxCheckBoxModule, DxTreeViewModule],
    exports: [
        EditorGridComponent,
        DxDataGridModule,
        EditorHeaderModule,
        EditorTabsGridModule,
        EditorHeaderGridModule,
        EditorToolbarModule,
        EditorOptionRowModule,
        EditorRemarkModule,
        EditorReviewModule,
        EditorMultipleGridModule,
        EditorReviewRemoteModule,
        EditorHtmlEditorModule,
        EditorApprovalModule,
        EditorCustomizeTemplateModule,
    ],
    providers: [
        EditorGridService,
        EditorMultipleGridService,
        EditorGridHeaderService,
        EditorGridToolbarService,
        EditorGridCommonService,
        EditorHtmlEditorService,
    ],
    declarations: [EditorGridComponent],
})
export class EditorGridModule {}
