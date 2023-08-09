import { NxButton } from '../button';
import { NxDropdownButton } from '../dropdownButton';

/**
 * 工具条组件
 */
export interface NxToolbarPanel {
    /**
     * 设置左侧功能按钮
     * @type object
     */
    left?: object;
    /**
     * 设置右侧功能按钮
     * @type object
     */
    right?: object;
    /**
     * 信息提示条
     * @type NxToolbarPanelTips
     */
    tips?: NxToolbarPanelTips;
}
/**
 * 工具条内容配置组件
 */
export interface NxToolbarPanelItem {
    /**
     * 类型
     * @type NxButton | NxDropdownButton
     * @default button
     */
    type?: 'NxButton' | 'NxDropdownButton';
    /**
     * 工具按钮
     * @type NxButton | NxDropdownButton
     */
    options?: NxButton | NxDropdownButton;
}
/**
 * 工具条信息提示条
 */
export interface NxToolbarPanelTips {
    /**
     * 设置是否显示信息提示条
     * @default false
     */
    visible?: boolean;
    /**
     * 信息图标
     * @type string
     */
    icon?: string;
    /**
     * 提示消息
     * @type string
     */
    message?: string;
    /**
     * 关闭按钮
     * @type NxToolbarPanelTipsCloseButton
     */
    closeButton?: NxToolbarPanelTipsCloseButton;
}
/**
 * 工具条信息提示条关闭按钮
 */
export interface NxToolbarPanelTipsCloseButton {
    /**
     * 设置是否显示信息条的关闭按钮
     * @type boolean
     * @default false
     */
    visible?: boolean;
    /**
     * 设置关闭按钮的图标样式
     * @type string
     */
    icon?: string;
    /**
     * 关闭按钮的onClick事件
     * @type Function
     * @param NxToolbarPanelTips 实例对象
     */
    onClick?: Function;
}
