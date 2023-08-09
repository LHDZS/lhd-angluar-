import { NxColumnChooser } from '.';

/**
 * 列选择器接口的默认实现
 */
export class NxColumnChooserImplements implements NxColumnChooser{
    /**
     * 是否允许搜索
     * @type boolean
     * @default false
     */
    allowSearch:boolean = false;
    /**
     * 指定列选择器为空时显示的文本
     * @type boolean
     * @default null 
     */
    emptyPanelText:string = null;
    /**
     * 是否开启列选择器
     * @type boolean
     * @default false
     */
    enabled:boolean = false;
    /**
     * 指定列选择器的高度
     * @type boolean
     * @default 260
     */
    height:number = 260;
    /**
     * 指定用户如何使用列选择器管理列
     * @type 'dragAndDrop' | 'select'
     * @default 'dragAndDrop'
     */
    mode: 'dragAndDrop';
    /**
     * 从开始输入到执行查询的时间间隔
     * @type number
     * @default 500
     */
    searchTimeout:number = 500;
    /**
     * 指定列选择器的标题
     * @type string
     * @default 显示隐藏列
     */
    title:string = '显示隐藏列';
    /**
     * 列选择器的宽度
     * @type number
     * @default 250
     */
    width:number = 250;
}