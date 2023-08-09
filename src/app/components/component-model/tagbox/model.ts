import DataSource from 'devextreme/data/data_source';

export class NxTagBox {
    props: NxTagBoxProps = new NxTagBoxProps();
    events: NxTagBoxEvents = new NxTagBoxEvents();
}
export class NxTagBoxProps {
    dataSource: Array<any> | DataSource | any;
    items: Array<any>;
    displayExpr: String;
    valueExpr: String;
    selectedItems: Array<String | Number | Object> = [];
    placeholder: string;
    disabled: boolean = false;
    visible: boolean = true;
    searchEnabled: boolean = false;
    showSelectionControls: boolean = false;
    elementAttr:any = {}
    /** 只读 */
    readOnly: boolean = false
}
export class NxTagBoxEvents {
    innerOnValueChanged: Function = null;
    onValueChanged: Function = null;
    onSelectionChanged: Function = null;
}
