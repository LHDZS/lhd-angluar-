export class NxNumberBox {
    props: NxNumberBoxProps = new NxNumberBoxProps();
    events: NxNumberBoxEvents = new NxNumberBoxEvents();
}
export class NxNumberBoxProps {
    /**
     * 文本值
     */
    value: number = 0 ;
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
    placeholder: String = '';
    width: String | Number = '100%';
    /** 只读 */
    readOnly: boolean = false
}
export class NxNumberBoxEvents {
    /**
     * 值发生改变时触发的事件
     */
    onValueChanged: Function = null;
    innerOnValueChanged = null;
    onFocusIn: Function = null
    onClick: Function = null
}
