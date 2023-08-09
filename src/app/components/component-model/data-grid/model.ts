import { Paginate } from './paginate/model';
import { CommandColumn, NxDataGridColumn } from './columns/model';
import DataSource from 'devextreme/data/data_source';
import { NxDataGridSelection } from './selection/mode';
import { NxDataGridEditing } from './editing/model';
import { NxDataGridFilterRow } from './filter-row/model';
import { NxDataGridHeaderFilter } from './header-filter/model';
import { NxDataGridExport } from './export/model';
import { NxDataGridStateStoring } from './stateStoring/model';
import { NxDataGridSummary } from './summary/model';

import { NxDataGridKeyboardNavigation } from './keyboard-navigation/model';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { NxDataGridOperator } from './operator/model';

export class NxDataGrid {
    type: 'list' | 'detail' = 'list';

    /**
     * 是否显示序号列
     */
    recordDisplay: boolean = true;
    /**
     * 合计位置
     */
    InColumnText: string = NxTranslateI18N.I18N.dataGridOptions.rowOptions.index.text;
    /**
     * 是否读取列表缓存
     */
    isCacheColumn:boolean = true;
    /**
     * 主键
     */
    primaryKey: string;
    /**
     * DataGrid的所有特性
     */
    props: DataGridProps = new DataGridProps();
    /**
     * DataGrid的所有事件
     */
    events: DataGridEvents = new DataGridEvents();
    /**
     * DataGrid的所有列
     */
    columns: Array<NxDataGridColumn> = [];
    /**
     * DataGrid的操作列
     */
    commandColumn: CommandColumn = new CommandColumn();
    /**
     * DataGrid详情操作行
     */
    commandRow: {
        visible: boolean;
    } = {
        visible: true,
    };

    /**
     * DataGrid详情操作行
     */
    commandAddRow: {
        visible: boolean;
    } = {
        visible: true,
    };

    /**
     * DataGrid详情操作行
     */
     commandDelRow: {
        visible: boolean;
    } = {
        visible: true,
    };

    /**
    * 分页配置
     */
    paginate: Paginate = new Paginate();
    /**
     * 多选配置
     */
    selection: NxDataGridSelection = new NxDataGridSelection();
    /**
     * 指定表格的编辑模式
     */
    editing: NxDataGridEditing = new NxDataGridEditing();
    /**
     * 行过滤器配置
     */
    filterRow: NxDataGridFilterRow = new NxDataGridFilterRow();
    /**
     * 头部过滤器
     */
    headerFilter: NxDataGridHeaderFilter = new NxDataGridHeaderFilter();
    /**
     * 导出
     */
    export: NxDataGridExport = new NxDataGridExport();
    /**
     * 用户操作缓存
     */
    stateStoring: NxDataGridStateStoring = new NxDataGridStateStoring();
    /**
     * 合计
     */
    summary: NxDataGridSummary = new NxDataGridSummary();
    /**
     * 向上取整配置
     */
    operator:NxDataGridOperator = new NxDataGridOperator();
    /**
     * 键盘操作配置
     */
    keyboardNavigation: NxDataGridKeyboardNavigation = new NxDataGridKeyboardNavigation();
    constructor(type?: 'list' | 'detail') {
        if (type != undefined) {
            this.type = type;
            if (type == 'list') {
                this.commandColumn.props.width = 130;
            }
            if (type == 'detail') {
                this.commandColumn.props.width = 150;
                this.filterRow.visible = false;
                this.headerFilter.visible = false;
                this.selection.enabled = false;
                this.paginate.paging.enabled = false;
                this.paginate.pager.visible = false;
                this.editing.enabled = true;
                this.paginate.pager.visible = 'auto';
            }
        }
    }
}
export class DataGridProps {
    /**
     * 设置快捷键聚焦组件，HTML的accessKey属性
     * Type: String
     * Default Value: null
     */
    accessKey: String = null;
    /**
     * 设置在用户交互时是否启用状态变更
     * Type: Boolean
     * Default Value: false
     */
    activeStateEnabled: Boolean = false;
    /**
     * 设置用户是否可以对列排序
     * Type: Boolean
     * Default Value: true
     */
    allowColumnReordering: Boolean = true;
    /**
     * 设置用户是否可以拖动列的宽度
     * Type: Boolean
     * Default Value: true
     */
    allowColumnResizing: Boolean = true;
    /**
     * 更改focusedRowKey时自动滚动到对应行
     * Type: Boolean
     * Default Value: true
     */
    autoNavigateToFocusedRow: Boolean = true;
    /**
     * 设置是否开启缓存，开启缓存后会缓存第一次加载的数据，排序、分组、分页等操作会从缓存中获取数据
     * 如果需要更新缓存数据调用 refresh() 或 load() 方法
     * Type: Boolean
     * Default Value: false
     */
    cacheEnabled: Boolean = false;
    /**
     * 鼠标滑过单元格时显示被截断的内容
     * Type: Boolean
     * Default Value: true
     */
    cellHintEnabled: Boolean = true;
    /**
     * 列宽度自适应
     * Type: Boolean
     * Default Value: true
     */
    columnAutoWidth: Boolean = false;
    /**
     * 是否通过隐藏一些列来自适应宽度，如果 allowColumnResizing 为 true，并且 columnResizingMode 为 ‘widget’ 时忽略
     * Type: Boolean
     * Default Value: false
     */
    columnHidingEnabled: Boolean = false;
    /**
     * 设置列的最小宽度
     * Type: Number
     * Default Value: undefined
     */
    columnMinWidth: Number = undefined;
    /**
     * 设置用户拖动列的模式，前提是 'allowColumnResizing' 为 true
     * Type: String
     * Default Value: 'widget'
     */
    columnResizingMode: 'nextColumn' | 'widget' = 'widget';
    /**
     * 设置所有列的宽度
     * Type: Number
     * Default Value: undefined
     */
    columnWidth: Number = undefined;
    /**
     * DataGrid绑定的数据源
     * @default null
     */
    dataSource: String | Array<any> | DataSource = [];
    /**
     * 日期序列化，仅在没有数据源时使用
     * @type String
     * @param 'yyyy-MM-dd'
     * @param 'yyyy-MM-ddTHH:mm:ss'
     * @param 'yyyy-MM-ddTHH:mm:ssZ'
     * @param 'yyyy-MM-ddTHH:mm:ssx'
     */
    dateSerializationFormat: String;
    /**
     * 设置是否禁用
     * @type Boolean
     * @default false
     */
    disabled: Boolean = false;
    /**
     * 设置DataGrid的HTML特性
     * @type Object
     * @default {}
     */
    elementAttr: Object = {};
    /**
     * 设置DataGrid发生错误时，是否显示错误行提示
     * @type Boolean
     * @default false
     */
    errorRowEnabled: Boolean = false;
    /**
     * 过滤器配置
     * @type Object
     * @default {}
     */
    filterBuilder: Object = {};
    /**
     * 过滤器的弹窗配置
     * @type Object
     * @default {}
     */
    filterBuilderPopup: Object = {};
    /**
     * 设置是否同步 'filter row'、'header filter'、'filter builder' 的过滤条件
     * @type Boolean | String
     * @default auto
     */
    filterSyncEnabled: Boolean | String = 'auto';
    /**
     * 自定义条件过滤表达式
     * @type Array<any>
     * @default null
     * @event 触发事件 optionChanged
     */
    filterValue: Array<any> = null;
    /**
     * 包含焦点单元格的列索引
     * @type Number
     * @default -1
     * @event 触发事件 focusedCellChanged
     */
    focusedColumnIndex: Number = -1;
    focusedRowEnabled: Boolean = true;
    focusedRowIndex: number = 0;
    focusedRowKey: any = undefined;
    focusStateEnabled: Boolean = false;
    height: String | Number | Function = '100%';
    highlightChanges: Boolean = false;
    hint: String = undefined;
    hoverStateEnabled: Boolean = true;
    keyExpr: String = undefined;
    noDataText: String = NxTranslateI18N.I18N.dataGridOptions.emptyData;
    renderAsync: Boolean = false;
    repaintChangesOnly: Boolean = false;
    rowAlternationEnabled: Boolean = true;
    rtlEnabled: Boolean = false;
    selectedRowKeys: Array<any>;
    selectionFilter: Array<any> = [];
    showBorders: Boolean = true;
    showColumnHeaders: Boolean = true;
    showColumnLines: Boolean = true;
    showRowLines: Boolean = true;
    tabIndex: Number = 0;
    twoWayBindingEnabled: Boolean = true;
    visible: Boolean = true;
    width: String | Number | Function = '100%';
    wordWrapEnabled: Boolean = false;
    remoteOperations: boolean | object | string = 'auto';
}
export class DataGridEvents {
    /**
     * 在表格渲染之前，自定义列配置
     * @type Function
     * @param columns 列的配置项
     */
    customizeColumns: Function = null;
    /**
     * 该方法在 onExporting 和 onExported 之间执行，可以自定义导出的数据
     * @type Function
     * @param columns 所有列对象
     * @param rows 所有行对象
     */
    customizeExportData: Function = null;
    onAdaptiveDetailRowPreparing: Function = null;
    onCellClick: Function = null;
    onCellDblClick: Function = null;
    onCellHoverChanged: Function = null;
    onCellPrepared: Function = null;
    onContentReady: Function = null;
    onContextMenuPreparing: Function = null;
    onDataErrorOccurred: Function = null;
    onDisposing: Function = null;
    onEditingStart: Function = null;
    onEditorPrepared: Function = null;
    onEditorPreparing: Function = null;
    onExported: Function = null;
    onExporting: Function = null;
    onFileSaving: Function = null;
    onFocusedCellChanged: Function = null;
    onFocusedCellChanging: Function = null;
    onFocusedRowChanged: Function = null;
    onFocusedRowChanging: Function = null;
    onInitialized: Function = null;
    onInitNewRow: Function = null;
    onKeyDown: Function = null;
    onOptionChanged: Function = null;
    onRowClick: Function = null;
    onRowCollapsed: Function = null;
    onRowCollapsing: Function = null;
    onRowDblClick: Function = null;
    onRowExpanded: Function = null;
    onRowExpanding: Function = null;
    onRowInserted: Function = null;
    onRowInserting: Function = null;
    onRowPrepared: Function = null;
    onRowRemoved: Function = null;
    onRowRemoving: Function = null;
    onRowUpdated: Function = null;
    onRowUpdating: Function = null;
    onRowValidating: Function = null;
    onSelectionChanged: Function = null;
    onToolbarPreparing: Function = null;
    onCustomStateStoringLoad: (instance:any) => Promise<any> = null;
}
