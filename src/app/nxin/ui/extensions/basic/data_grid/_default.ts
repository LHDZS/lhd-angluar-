import { NxDataGrid } from '.';
import { NxDataGridColumn } from './columns';

/**
 * NxDataGrid默认实现类
 * @extends NxDataGrid
 */
export class NxDataGridImplements implements NxDataGrid {
    //#region 属性
    /**
     * 与用户交互时，小部件是否更改其状态
     * @default false
     * @type boolean
     */
    activeStateEnabled: boolean = false;
    /**
     * 是否可以重新排序
     * @type boolean
     * @default false
     */
    allowColumnReordering: boolean = false;
    /**
     * @ 是否可以调整列的大小
     * @type boolean
     * @default false
     */
    allowColumnResizing: boolean = false;
    /**
     * 自动滚动到焦点行的位置
     * @type boolean
     * @default false
     */
    autoNavigateToFocusedRow: boolean = false;
    /**
     * 是否开启数据缓冲
     * @type boolean
     * @default true
     */
    cacheEnabled: boolean = true;
    /**
     * 是否开启 当鼠标停在内容被截断的单元格时候 显示提示
     * @type boolean
     * @default true
     */
    cellHintEnabled: boolean = true;
    /**
     * 指定列是否应该根据内容调整宽度
     * @type boolean
     * @default false
     */
    columnAutoWidth: boolean = false;
}
