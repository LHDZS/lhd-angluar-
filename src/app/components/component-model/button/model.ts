export class NxButton {
    constructor(
        text?: String,
        icon?: String,
        stylingMode?: 'text' | 'outlined' | 'contained',
        type?: 'back' | 'danger' | 'default' | 'normal' | 'success'
    ) {
        if (text) {
            this.props.text = text;
        }
        if (icon) {
            this.props.icon = icon;
        }
        if (stylingMode) {
            this.props.stylingMode = stylingMode;
        }
        if (type) {
            this.props.type = type;
        }
    }
    props: NxButtonProps = new NxButtonProps();
    events: NxButtonEvents = new NxButtonEvents();
}
export class NxButtonProps {
    /**
     * 是否禁用按钮
     * @type Boolean
     * @default false
     */
    disabled: Boolean = false;
    /**
     * 按钮内的文字
     * @type String
     * @default '''
     */
    text: String = '';
    /**
     * 按钮类型
     * @type 'back' | 'danger' | 'default' | 'normal' | 'success'
     * @default 'default'
     */
    type: 'back' | 'danger' | 'default' | 'normal' | 'success' = 'default';
    /**
     * 按钮样式选项
     * @type 'text' | 'outlined' | 'contained'
     * @default 'contained'
     */
    stylingMode: 'text' | 'outlined' | 'contained' = 'contained';
    /**
     * 按钮小图标
     * @type String
     * @default ''
     */
    icon: String = '';
    /**
     * 鼠标滑过显示的文字
     * @type String
     * @default ''
     */
    hint: String = '';
    /**
     * 设置是否显示
     */
    visible: Boolean = true;
    focusStateEnabled: Boolean = false;
    elementAttr: object = null;
}
export class NxButtonEvents {
    onClick: Function = null;
}
