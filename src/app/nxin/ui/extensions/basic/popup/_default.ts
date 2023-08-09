import { NxPopup } from '.';

/**
 * 弹唱组件的默认实现
 */
export class NxPopupImplement implements NxPopup{
    /**
     * 宽度
     * @default 600
     */
    width: number = 800;
    /**
     * 高度
     * @default 450
     */
    height: number = 650;
    /**
     * 是否显示标题
     * @default true
     */
    showTitle:boolean = true;
    /**
     * 是否启用
     */
    visible: boolean = false;
    /**
     * 显示位置
     * @default center
     */
    position: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' = 'center';
    /**
     * 标题
     */
    title: string;
    /**
     * 是否开启拖拽
     * @default false
     */
    dragEnabled:boolean = false;
    /**
     * 是否点弹窗之外关闭弹窗
     * @default false
     */
    closeOnOutsideClick: boolean = false;
    /**
     * 是否显示背景
     */
    shading:boolean = true;
    /**
     * 背景色
     */
    shadingColor:string;
    /**
     * 指定是否显示关闭按钮
     * @default true
     */
    showCloseButton: boolean = true;
}