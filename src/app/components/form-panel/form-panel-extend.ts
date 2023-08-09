export class NxSearchPanel {
    key: string = 'header1';
    data: any = {};
    conditionItems: Array<NxConditionItem> = [];
    default: Boolean = true;
    initialization: Function = null;
    onFieldDataChanged: Function = null;
    visible: boolean = true;
    readOnly: boolean = false;
    caption: string = '';
    columnSettingDisabled: boolean = false;
    hasQrcode: boolean = false;
    qrcodeUrl: string = '';
}
export class NxConditionItem {
    label: string = '';
    /**
     * 项类型
     */
    editorType:
        | 'dxAutocomplete'
        | 'dxCalendar'
        | 'dxCheckBox'
        | 'dxColorBox'
        | 'dxDateBox'
        | 'dxDropDownBox'
        | 'dxHtmlEditor'
        | 'dxLookup'
        | 'dxNumberBox'
        | 'dxRadioGroup'
        | 'dxRangeSlider'
        | 'dxSelectBox'
        | 'dxSlider'
        | 'dxSwitch'
        | 'dxTagBox'
        | 'dxTextArea'
        | 'dxTextBox';
    dataField: any;
    /**
     * 初始必填项
     */
    required: Boolean = false;
    /**
     * 验证类型
     */
    requiredType?: string = 'required';
    /**
     * 验证规则
     */
    requiredPattern?: any;
    /**
     * form表单 单项配置项
     */
    editorOptions?: any;
    lableVisibale?: boolean;
    /**
     * 是否有模板
     */
    hasTemplate?: boolean = false;
    /**
     * 模板名称
     */
    selectTemplateName?: string = '';
    /**
     * 是否有提示图标
     */
    hasTooltip?: boolean = false;
    /**
     * 提示图标移入文字
     */
    tooltipTitle?: string;
    /**
     * 提示图标icon （如 'iconfont iconprompt'）
     */
    tooltipClass?: string;
    /**
     * 验证提示
     */
    validationMessage?: string;
    /**
     * 项是否显示（组件弹窗配置，可修改）
     */
    headVisible?: boolean;
    /**
     * 项可否修改
     */
    requiredDisable?: boolean;
    /**
     * 项方法配置
     */
    conditionFun: NxConditionFun;
    /**
     * 项占比
     */
    colSpan?: any = '';
    /**
     * 项是否显示（业务需求根据条件判断）
     */
    visible?: boolean = true;
    constructor(
        label?: string,
        dataField?: any,
        editorType?:
            | 'dxAutocomplete'
            | 'dxCalendar'
            | 'dxCheckBox'
            | 'dxColorBox'
            | 'dxDateBox'
            | 'dxDropDownBox'
            | 'dxHtmlEditor'
            | 'dxLookup'
            | 'dxNumberBox'
            | 'dxRadioGroup'
            | 'dxRangeSlider'
            | 'dxSelectBox'
            | 'dxSlider'
            | 'dxSwitch'
            | 'dxTagBox'
            | 'dxTextArea'
            | 'dxTextBox',
        required?: Boolean,
        requiredType?: string,
        requiredPattern?: any,
        editorOptions?: any,
        lableVisibale?: boolean,
        validationMessage?: string,
        headVisible?: boolean,
        requiredDisable?: boolean,
        hasTemplate?: boolean,
        selectTemplateName?: string,
        hasTooltip?: boolean,
        tooltipTitle?: string,
        tooltipClass?: string,
        colSpan?: any,
        visible?: boolean
    ) {
        if (label) {
            this.label = label;
        }
        if (dataField) {
            this.dataField = dataField;
        }
        if (editorType) {
            this.editorType = editorType;
        }
        if (required) {
            this.required = required;
        }
        if (requiredType) {
            this.requiredType = requiredType;
        }
        if (requiredPattern) {
            this.requiredPattern = requiredPattern;
        }
        if (editorOptions) {
            this.editorOptions = editorOptions;
        }
        if (lableVisibale) {
            this.lableVisibale = lableVisibale;
        }
        if (validationMessage) {
            this.validationMessage = validationMessage;
        }
        if (headVisible) {
            this.headVisible = headVisible;
        }
        if (requiredDisable) {
            this.requiredDisable = requiredDisable;
        }
        if (hasTemplate) {
            this.hasTemplate = hasTemplate;
        }
        if (selectTemplateName) {
            this.selectTemplateName = selectTemplateName || this.dataField;
        }
        if (hasTooltip) {
            this.hasTooltip = hasTooltip;
        }
        if (tooltipTitle) {
            this.tooltipTitle = tooltipTitle;
        }
        if (tooltipClass) {
            this.tooltipClass = tooltipClass;
        }
        if (colSpan) {
            this.colSpan = colSpan;
        }
        if (visible === false) {
            this.visible = false;
        }
    }
}
export class NxConditionFun {
    onValueChanged: Function = function(){};
    onFocusIn: Function = function(){};
    tooltipClick: Function = function(){};
    constructor(onValueChanged?: Function, onFocusIn?: Function, tooltipClick?: Function) {
        if (onValueChanged) {
            this.onValueChanged = onValueChanged;
        }
        if (onFocusIn) {
            this.onFocusIn = onFocusIn;
        }
        if (tooltipClick) {
            this.tooltipClick = tooltipClick;
        }
    }
}
