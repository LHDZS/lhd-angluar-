import { NxButton } from '../component-model/button/model';
import { NxSelectBox } from '../component-model/select-box/model';
import { NxTextBox } from '../component-model/text-box/mode';
import { NxDateBox } from '../component-model/date-box/model';
import { NxTagBox } from '../component-model/tagbox/model';
import { NxRadioGroup } from '../component-model/radio-group/model';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
export class NxSearchPanel {
    data: any = {};
    conditionItems: Array<NxConditionItem> = [];
    default: Boolean = true;
    searchButton: NxButton = new NxButton(NxTranslateI18N.I18N.commandOptions.search.text);
    resetButton: NxButton = new NxButton(NxTranslateI18N.I18N.commandOptions.reset.text, '', 'outlined');
    openButton: NxButton = new NxButton(NxTranslateI18N.I18N.commandOptions.down.text, '', 'contained');
    initialization: Function = null;
    visible: boolean = true;
}
export class NxConditionItem {
    label: string = '';
    type: 'Span' | 'SelectBox' | 'TextBox' | 'DateBox' | 'TagBox' | 'StartEndDateBox' | 'RadioGroup';
    dataField: string;
    /**
     * 只有在type为'Span'时有效
     */
    dataType: 'Date' | 'Number' | 'String' = 'String';
    /**
     * 日期格式化，只有在'dataType'为'Date'时有效
     */
    format: string = 'yyyy-MM-dd';
    placeHolder: any = ['开始日期','结束日期'];
    maxZoomLevel: string = '';
    displayFormat: string = '';
    required: Boolean = false;
    validationRules: NxValidationRule[] = [];
    widget: NxSelectBox | NxTextBox | NxDateBox | NxTagBox | NxRadioGroup;
    tipVisible: boolean = false;
    tips: string;
    headVisible?: boolean = true;
    requiredDisable?: boolean = false;
    constructor(
        label?: string,
        dataField?: string,
        type?: 'SelectBox' | 'TextBox' | 'DateBox',
        required?: Boolean,
        headVisible?: boolean,
        requiredDisable?: boolean
    ) {
        if (label) {
            this.label = label;
        }
        if (dataField) {
            this.dataField = dataField;
        }
        if (type) {
            this.type = type;
        }
        if (required) {
            this.required = required;
        }
        if (headVisible) {
            this.headVisible = headVisible;
        }
        if (requiredDisable) {
            this.requiredDisable = requiredDisable;
        }
    }
}

export enum NxConditionItemType {
    SelectBox = 'SelectBox',
    TextBox = 'TextBox',
    DateBox = 'DateBox',
    StartEndDateBox = 'StartEndDateBox',
}

export class NxValidationRule {
    type: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    message: String = '';
    /**
     * Require | StringLength：去掉首尾空格
     */
    trim: Boolean = true;
    /**
     * Number | StringLength：排除空值
     */
    ignoreEmptyValue: Boolean = true;
    /**
     * StringLength：最大长度
     */
    max: Number = 50;
    /**
     * StringLength：最小长度
     */
    min: Number = 0;
    reevaluate: Boolean = false;
}
