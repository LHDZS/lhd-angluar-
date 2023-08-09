import DataSource from 'devextreme/data/data_source';

export class NxSelectBox {
    props: NxSelectBoxProps = new NxSelectBoxProps();
    events: NxSelectBoxEvents = new NxSelectBoxEvents();
}
export class NxSelectBoxProps {
    /***
     * 是否开启自定义输入
     */
    acceptCustomValue: boolean = false;
    /**
     * 数据源
     */
    dataSource: any;
    /**
     * 显示的字段名称
     */
    displayExpr: String = undefined;
    /**
     * 绑定值的字段名称
     */
    valueExpr: String = undefined;
    /**
     * 当前值
     */
    value: any = undefined;
    /**
     * 框内文字
     */
    placeholder: String = '';
    /**
     * 是否可以搜索
     */
    searchEnabled: Boolean = true;
    /**
     * 搜索值
     */
    searchExpr: String | Array<any> = null;
    /**
     * 是否显示清空查询条件按钮
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
    /** 是否包装超出宽度的内容 */
    wrapItemText: boolean = true;
     /** 只读 */
     readOnly: boolean = false;
     elementAttr: any = {}
}
export class NxSelectBoxEvents {
    /**
     * 数据发生改变后触发的事件
     */
    onValueChanged: Function = null;
    onOpened:Function = null;
    onClosed:Function = null;
    innerOnValueChanged: Function = null;
    onCustomItemCreating: Function = null;
}
