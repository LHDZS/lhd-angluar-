import { NxToolbarPanel, NxToolbarPanelItem, NxToolbarPanelTipsCloseButton, NxToolbarPanelTips } from '.';

/**
 * 工具条组件的默认实现
 * @implements NxToolbarPanel
 */
export class NxToolbarPanelImplements implements NxToolbarPanel {}
/**
 * 工具条内容配置组件默认实现
 * @implements NxToolbarPanelItem
 */
export class NxToolbarPanelItemImplements implements NxToolbarPanelItem {
    /**
     * 设置按钮类型
     * @type NxButton | NxDropdownButton
     * @default button
     */
    type: 'NxButton' | 'NxDropdownButton' = 'NxButton';
}
/**
 * 工具条信息提示条的默认实现
 * @implements NxToolbarPanelTips
 */
export class NxToolbarPanelTipsImplements implements NxToolbarPanelTips {
    /**
     * 设置是否显示信息提示条
     * @default false
     */
    visible?: boolean = false;
}
/**
 * 工具条信息提示条关闭按钮的默认实现
 * @implements NxToolbarPanelTipsCloseButton
 */
export class NxToolbarPanelTipsCloseButtonImplements implements NxToolbarPanelTipsCloseButton {
    /**
     * 设置是否显示信息条的关闭按钮
     * @type boolean
     * @default false
     */
    visible: boolean = false;
}
