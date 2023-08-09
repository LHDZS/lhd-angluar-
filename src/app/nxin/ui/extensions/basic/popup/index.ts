/**
 * 弹唱组件
 */
export interface NxPopup{
    /**
     * 是否显示
     * @default false
     */
    visible?:boolean;
    /**
     * 宽度
     * @default 600
     */
    width?: number;
    /**
     * 高度
     * @default 450
     */
    height?: number;
    /**
     * 是否显示标题
     * @default true
     */
    showTitle?:boolean;
    /**
     * 显示位置
     * @default center
     */
    position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | Function;
    /**
     * 标题
     */
    title?: string;
    /**
     * 是否开启拖拽
     * @default false
     */
    dragEnabled?:boolean;
    /**
     * 是否点弹窗之外关闭弹窗
     * @default false
     */
    closeOnOutsideClick?: boolean;
    /**
     * 是否显示背景
     */
    shading?:boolean;

    /**
     * 背景色
     */
    shadingColor?:string;
    /**
     * 指定是否显示关闭按钮
     * @default true
     */
    showCloseButton?: boolean;
}