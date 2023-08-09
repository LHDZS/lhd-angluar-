export class NxTextBox {
    props: NxTextBoxProps = new NxTextBoxProps();
    events: NxTextBoxEvents = new NxTextBoxEvents();
}
export class NxTextBoxProps {
    /**
     * 文本值
     */
    value: String = '';
    /**
     * 是否显示清空按钮
     */
    showClearButton: Boolean = true;
    /**
     * 是否显示
     */
    visible: Boolean = true;
    /**
     * 是否禁用
     */
    disabled: Boolean = false;
    id: string = '';
    placeholder: String = '';
    width: String | Number = '100%';
    /** 只读 */
    readOnly: boolean = false
}
export class NxTextBoxEvents {
    /**
     * 值发生改变时触发的事件
     */
    onValueChanged: Function = null;
    innerOnValueChanged = null;
    onFocusIn: Function = null
    onClick: Function = null;
    mouseleave: Function = null;
    mouseenter: Function = null;
}
