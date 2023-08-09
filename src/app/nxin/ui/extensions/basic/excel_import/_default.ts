import { NxExcelImportComponent } from '.';

export class NxExcelImportComponentImplements implements NxExcelImportComponent {
    /**
     * 控制显示弹窗
     * @type boolean
     * @default false
     */
    visible: boolean = false;
    /**
     * 是否显示关闭按钮
     * @default true
     */
    isShowCloseButton: boolean = true;
    /**
     * 错误提示
     * @default 文件格式不正确
     */
    errorMessage: string = '文件格式不正确';
    /**
     * 宽度
     * @default 800
     */
    width: number | string | Function = 'auto';
    /**
     * 最小宽度
     * @default 600px
     */
    minWidth: number | string | Function = 600;
    /**
     * 高度
     * @default 650
     */
    height: number | string | Function = 'auto';
    /**
     * 最小高度
     * @default 400
     */
    minHeight?: number | string | Function = 400;
    /**
     * 是否显示标题
     * @default true
     */
    IsShowTitle: boolean = true;
    /**
     * 显示位置
     * @default center
     */
    position:
        | 'bottom'
        | 'center'
        | 'left'
        | 'left bottom'
        | 'left top'
        | 'right'
        | 'right bottom'
        | 'right top'
        | 'top'
        | Function = 'center';
}
