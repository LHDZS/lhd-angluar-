import { NxTranslateI18N } from 'src/app/nxin/i18n';

export class NxDateBox {
    props: NxDateBoxProps = new NxDateBoxProps();
    events: NxDateBoxEvents = new NxDateBoxEvents();
}
export class NxDateBoxProps {
    /**
     * 绑定的日期值
     */
    value: Date = null;
    /**
     * 可以选择的最小日期
     */
    min: Date = null;
    /**
     * 可以选择的最大日期
     */
    max: Date = null;
    /**
     * 文本框占位文字
     */
    placeholder: String = NxTranslateI18N.I18N.dataGridWidgets.dateBox.placeholder;
    /**
     * 是否显示清空按钮
     */
    showClearButton: Boolean = false;
    /**
     * 是否显示
     */
    visible: Boolean = true;
    /**
     * 是否禁用
     */
    disabled: Boolean = false;
    /**
     * 日期格式化，仅在没有赋值时有效
     */
    dateSerializationFormat: String = 'yyyy-MM-dd';
    /**
     * 点击文本弹出日期选择
     */
    openOnFieldClick: Boolean = true;
    /**
     * 设置是否允许用户输入值
     */
    acceptCustomValue: Boolean = false;
    /**
     * 日期格式化
     */
    displayFormat: String = 'yyyy-MM-dd';

    maxZoomLevel:string = '';
    /**
     * 根据 displayFormat 限制用户输入
     */
    useMaskBehavior: Boolean = true;
    type: 'date' | 'datetime' | 'time' = 'date';
    /** 日期操作 */
    calendarOptions: any = {};
    /** 只读 */
    readOnly: boolean = false
}
export class NxDateBoxEvents {
    innerOnValueChanged: Function = null;
    onValueChanged: Function = null;
}
