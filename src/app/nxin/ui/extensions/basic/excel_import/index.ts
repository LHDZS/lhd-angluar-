import { DxPopupComponent } from 'devextreme-angular/ui/popup';
import { ExportInput } from 'src/app/providers/excel/export';
import { Result } from 'src/app/providers/result';

/**
 * Excel导入组件
 */
export interface NxExcelImportComponent {
    /**
     * 控制显示弹窗
     * @type boolean
     * @default false
     */
    visible?: boolean;
    /**
     * 设置弹窗标题
     */
    title?: string;
    /**
     * 宽度
     * @default auto
     */
    width?: number | string | Function;
    /**
     * 最小宽度
     * @default 600px
     */
    minWidth?: number | string | Function;
    /**
     * 高度
     * @default auto
     */
    height?: number | string | Function;
    /**
     * 最小高度
     * @default 520px
     */
    minHeight?: number | string | Function;
    /**
     * 是否显示标题
     * @default true
     */
    IsShowTitle?: boolean;
    /**
     * 显示位置
     * @default center
     */
    position?:
        | 'bottom'
        | 'center'
        | 'left'
        | 'left bottom'
        | 'left top'
        | 'right'
        | 'right bottom'
        | 'right top'
        | 'top'
        | Function;
    /**
     * 子标题
     * @default null
     */
    subTitle?: string;
    /**
     * 是否显示关闭按钮
     * @default true
     */
    isShowCloseButton?: boolean;
    /**
     * 错误提示
     */
    errorMessage?: string;
    /**
     * XLSX模板路径
     */
    xlsxTemplatePath?: string;
    /**
     * 导入数据模板路径
     */
    jsonTemplatePath?: string;
    /**
     * 后端导入接口地址
     */
    importServer?: string;
    /**
     * 模板文件名称
     */
    templateFileName?: string;
    /**
     * 自定义表单配置key,可通过该值判断是否有自定义表单配置
     * @type string
     */
    customTemplateKey?: string;
    /**
     * 自定义表单配置--下载模板名称
     * @type string
     */
    customTemplateFileName?: string;
    /**
     * 下载模板事件
     */
    onDownloadTemplate?: () => ExportInput;
    /**
     * 导入事件
     * @returns  数据
     */
    onImport?: Function;
    /**
     * 导入成功后的事件
     */
    onImportSuccess?: (response: Result) => void;
    /**
     * 导入失败后的事件
     */
    onImportFailed?: (response: Result) => void;
    /**
     * 确认按钮事件
     * @returns 错误消息
     */
    onConfirm?: Function;
    /**
     * 取消按钮事件
     */
    onCancel?: Function;
    onInitBefore?: (e: INxExcelImportComponent) => void;
}
/**
 * Excel导入组件实例
 */
export interface INxExcelImportComponent {
    /**
     * DevExtreme Popup组件
     */
    dxPopupComponent: DxPopupComponent;
    /**
     * 显示Excel导入组件
     */
    show(): void;
    /**
     * 隐藏Excel导入组件
     */
    hide(): void;
    /**
     * 导入方法的实现
     */
    importExcel(): void;
    /**
     * 导入附加参数
     */
    param:string;
}
