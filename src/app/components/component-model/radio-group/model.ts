export class NxRadioGroup {
    props: NxRadioGroupProps = new NxRadioGroupProps();
    events: NxRadioGroupEvents = new NxRadioGroupEvents();
}
export class NxRadioGroupProps {
    displayExpr: string
    valueExpr: string
    items: Array<any>
    layout: 'horizontal' | 'vertical' = 'horizontal'
    disabled: boolean = false
    value: any
    visible: boolean = true
    text: string;
    readOnly: boolean = false;
}
export class NxRadioGroupEvents {
    onValueChanged: Function
    innerOnValueChanged: Function
}
