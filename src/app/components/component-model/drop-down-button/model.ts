export class NxDropDownButton {
    key: string;
    props: NxDropDownButtonProps = new NxDropDownButtonProps();
    events: NxDropDownButtonEvents = new NxDropDownButtonEvents();
}
export class NxDropDownButtonProps {
    text: string;
    showArrowIcon: Boolean = false;
    stylingMode: 'text' | 'outlined' | 'contained' = 'outlined';
    icon: string;
    dropDownOptions: object = {};
    items: NxDropDownButtonItem[] = [];
    splitButton: Boolean = true;
    hint: string;
    visible: Boolean = true;
    displayExpr: string = 'text';
    keyExpr: string = 'type';
    disabled: Boolean = false;
    width: number | string = 110;
    height: number = 36;
}
export class NxDropDownButtonEvents {
    onButtonClick: Function = null;
    onItemClick: Function = null;
}
export class NxDropDownButtonItem {
    constructor(text?: string, type?: any, icon?: string) {
        if (text) this.text = text;
        if (type) this.type = type;
        if (icon) this.icon = icon;
    }
    badge: string;
    disabled: Boolean = false;
    html: string;
    icon: string;
    text: string;
    visible: boolean = true;
    type: string;
}
