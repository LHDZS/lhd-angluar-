import { NxDataGridColumn } from './columns';
import { NxColumnChooser } from './columns/column_chooser';
import { NxColumnFixing } from './columns/cloumn_fix';
import DataSource from 'devextreme/data/data_source';
import { NxEditingTexts } from './editing/edit_texts';

/**
 * 表格对象
 */
export interface NxDataGrid {
    /**
     * 焦点设置到小部件的快捷键
     */
    accessKey?: string;
    //#region 属性
    /**
     * 与用户交互时，小部件是否更改其状态
     * @default false
     * @type boolean
     */
    activeStateEnabled?:boolean;
    /**
     * 是否可以重新排序
     * @type boolean
     * @default false
     */
    allowColumnReordering?:boolean;
    /**
     * @ 是否可以调整列的大小
     * @type boolean
     * @default false
     */
    allowColumnResizing?:boolean;
    /**
     * 自动滚动到焦点行的位置
     * @type boolean
     * @default false
     */
    autoNavigateToFocusedRow?:boolean;
    /**
     * 是否开启数据缓冲
     * @type boolean
     * @default true
     */
    cacheEnabled?:boolean;
    /**
     * 是否开启 当鼠标停在内容被截断的单元格时候 显示提示
     * @type boolean
     * @default true
     */
    cellHintEnabled?:boolean;
    /**
     * 指定列是否应该根据内容调整宽度
     * @type boolean
     * @default false
     */
    columnAutoWidth?:boolean;
    /** 
     * 配置列选择器
     */
    columnChooser?:NxColumnChooser;
    /**
     * 配置列
     */
    columnFixing?:NxColumnFixing;
    /**
     * 是否隐藏列 适配屏幕尺寸
     */
    columnHidingEnabled?:boolean;
    /**
     * 列最小宽度
     * @default undefined
     */
    columnMinWidth?:number;
    /**
     * 窗口小部件怎么调整列的大小
     * @default nextColumn
     */
    columnResizingMode?:'nextColumn' | 'widget';
    /**
     * 列
     * @default 默认值： []
     * @type Array<NxDataGridColumn>
     */
    //#endregion
    columns?: Array<NxDataGridColumn>;
    /**
     * 指定所有列的宽度  
     * 优先级低于column.width
     */
    columnWidth?:number;
    /**
     * 数据源
     */
    dataSource?: Array<any> | DataSource;
    /**
     * 指定应将日期时间值发送到服务器的格式
     */
    dateSerializationFormat?:string;
    /**
     * 指定小部件是否响应用户交互
     */
    disabled?:boolean;
    /**
     * 指定编辑操作
     */
    editing?: NxEditingTexts;
    /**
     * 指定附加到小部件的根元素的属性
     */
    elementAttr?:object;
    /**
     * 是否显示错误行
     * @default true
     */
    errorRowEnabled?: boolean;
    // export?:
    //#region 事件
    /**
     * 双击行事件执行前
     * @param rowIndex
     * @param rowData
     */
    onRowDblClickBefore?: Function;
    /**
     * 双击行事件
     * @param rowIndex
     * @param rowData
     */
    onRowDblClick?: Function;
    /**
     * 双击行事件执行后
     * @param rowIndex
     * @param rowData
     */
    onRowDblClickAfter?: Function;
    /**
     * 在表格渲染之前，自定义列配置
     * @param columns 列的配置项
     */
    customizeColumns?: Function;
    /**
     * 该方法在 onExporting 和 onExported 之间执行，可以自定义导出的数据
     * @param columns 所有列对象
     * @param rows 所有行对象
     */
    customizeExportData?: Function;
    /**
     * 在展示自适应详情信息行之前执行
     * @param e
     */
    onAdaptiveDetailRowPreparing?: Function;
    /**
     * 点击cell之前触发
     */
    onCellClickBefore?: Function;
    /**
     * 点击cell的时候触发
     * @param object
     */
    onCellClick?: Function;
    /**
     * 点击cell后触发
     */
    onCellClickAfter?: Function;
    /**
     * 双击cell前触发
     */
    onCellDblClickBefore?: Function;
    /**
     * 双击cell的时候触发
     * @param object
     */
    onCellDblClick?: Function;
    /**
     * 双击cell后触发
     */
    onCellDblClickAfter?: Function;
    /**
     * 鼠标进入或离开cell之前触发
     * @param object
     */
    onCellHoverChangedBefore?: Function;
    /**
     * 鼠标进入或离开cell的时候触发
     */
    onCellHoverChanged?: Function;
    /**
     * 鼠标进入或离开cell之后触发
     */
    onCellHoverChangedAfter?: Function;
    /**
     * cell创建之前触发
     * @param object
     */
    onCellPreparedBefore?: Function;
    /**
     * cell创建触发之后触发
     * @param object
     */
    onCellPrepared?: Function;
    /**
     * 当小部件的内容准备就绪并且每次更改内容的时候执行
     * @param object
     */
    onContentReady?: Function;
    /**
     * 在右键菜单初始化之前执行
     * @param e
     */
    onContextMenuPreparing?: Function;
    /**
     *数据源中发生错误时候触发该方法
     * @param object
     */
    onDataErrorOccurred?: Function;
    /**
     * 在处理小部件之前触发该方法
     * @param object
     */
    onDisposing?: Function;
    /**
     *在单元格或行切换到编辑状态之前的时候执行该方法
     * @param object
     */
    onEditingStart?: Function;
    /**
     *在单元格或行切换到编辑状态之后的时候执行该方法
     * @param object
     */
    onEditingEnd?: Function;
    /**
     * 创建编辑器后执行的方法(不适用于带有editCellTemplate的单元格)
     * @param object
     */
    onEditorPrepared?: Function;
    /**
     * 用于自定义或替换默认编辑器的触发(不适用于带有editCellTemplate的单元格)
     * @param object
     */
    onEditorPreparing?: Function;
    /**
     * 导出数据后执行的方法
     * @param object
     */
    onExported?: Function;
    /**
     * 导出数据之前执行的方法
     * @param object
     */
    onExporting?: Function;
    /**
     * 在将具有导出数据的文件保存到用户的本地存储之前执行的功能
     * @param object
     */
    onFileSaving?: Function;
    /**
     * 焦点单元更改后执行
     * @param object
     */
    onFocusedCellChanged?: Function;
    /**
     * 焦点单元更改前执行
     */
    onFocusedCellChanging?: Function;
    /**
     * 焦点行更改后执行的函数。仅在focusedRowEnabled为true时应用
     * @param object
     */
    onFocusedRowChanged?: Function;
    /**
     * 焦点行更改前执行的函数 
     * @description 仅在focusedRowEnabled为true时有效
     * @param object
     */
    onFocusedRowChanging?: Function;
    /**
     * JavaScript框架中用于保存小部件实例的函数
     */
    onInitialized?: Function;
    /**
     * 在将新行添加到窗口小部件之前执行的功能
     * @param object
     */
    onInitNewRow?: Function;
    /**
     * 当小部件处于焦点状态并且按下一个键时执行的功能
     * @param object
     */
    onKeyDown?: Function;
    /**
     * 在小部件选项更改后执行
     * @param object
     */
    onOptionChanged?: Function;

    /**
     * 某一行被点击前执行
     */
    onRowClickBefore?: Function;
    /**
     * 某一行被点击或点击时执行
     * @param object
     */
    onRowClick?: Function;
    /**
     * 某一行被点击后
     * @param object
     */
    onRowClickAfter?: Function;

    /**
     * 在折叠行后执行
     * @param object
     */
    onRowCollapsed?: Function;
    /**
     * 在折叠行之前执行
     * @param object
     */
    onRowCollapsing?: Function;
    /**
     * 在行展开后执行
     * @param object
     */
    onRowExpanded?: Function;
    /**
     * 在行展开前执行
     * @param object
     */
    onRowExpanding?: Function;
    /**
     * 在数据源中插入新行之后执行
     * @param object
     */
    onRowInserted?: Function;
    /**
     * 在数据源中插入新行之前执行
     * @param object
     */
    onRowInserting?: Function;
    /**
     * 创建新行之后执行
     * @param object
     */
    onRowPrepared?: Function;
    /**
     * 移除新行之后执行
     * @param object
     */
    onRowRemoved?: Function;
    /**
     * 移除新行之前执行
     * @param object
     */
    onRowRemoving?: Function;
    /**
     * 行更新之后执行
     * @param object
     */
    onRowUpdated?: Function;
    /**
     * 新行更新前执行
     * @param object
     */
    onRowUpdating?: Function;
    /**
     *在根据验证规则验证行中的单元格之后执行
     * @param object
     */
    onRowValidating?: Function;
    /**
     * 在选定一行或清除其选定内容后执行
     * @param object
     */
    onSelectionChanged?: Function;
    /**
     * 在创建工具栏之前执行
     * @param object
     */
    onToolbarPreparing?: Function;
    //#endregion
}

export class test{
    a: NxDataGrid
    constructor(){
        // this.a.onFocusedRowChangi
        // this.a.acti
    }
}
