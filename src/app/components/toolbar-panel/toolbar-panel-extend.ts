import { NxButton } from '../component-model/button/model';
import { NxDropDownButton, NxDropDownButtonItem } from '../component-model/drop-down-button/model';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { stringHelper } from 'src/app/providers/common/stringHelper';
/**
 * 工具条组件
 */
export class NxToolbarPanel {
    /**
     * 表单工具条
     * @param type 设置是列表页工具条还是详情页工具条
     * @param useDefault 是否使用默认表单的配置
     * @param checkInfoVisible 是否显示多选项数量
     */
    constructor(type: 'list' | 'detail', useDefault: Boolean = true, checkInfoVisible?: Boolean) {
        this.type = type;
        switch (type) {
            case 'list':
                if (useDefault) this.useListToolbarDefault();
                break;
            case 'detail':
                if (useDefault) this.useDetailToolbarDefault();
                break;
        }
        if (checkInfoVisible) {
            this.checkInfo.visible = checkInfoVisible;
        }
    }
    type: 'list' | 'detail';
    /**
     * 左侧按钮：保存、批量删除等
     */
    mainPanel: Array<ToolbarPanelType> = [];
    /**
     * 右侧按钮：刷新、设置、过滤等
     */
    otherPanel: Array<ToolbarKeyWidget> = [];
    otherPanelKeys: Array<string> = [];
    moreButton: NxDropDownButton = new NxDropDownButton();
    /**
     * 列表信息批量删除使用修改权限
     */
    useDelbtn: boolean = false;
    /**
     * 列表信息提示
     */
    checkInfo: ToolbarCheckInfo = new ToolbarCheckInfo();
    /**
     * 列配置
     */
    settings: ColumnSetting[] = [];
    /**
     * 是否启用列配置
     */
    columnSettingDisabled: boolean = false;
    /**
     * 列配置容器位置
     */
    columnSettingOffset: ColumnSettingOffset = new ColumnSettingOffset();
    /**
     * 是否开启缓存
     */
    cacheEnable: boolean = true;
    /**
     * 缓存的键名称
     */
    storageKey: string;
    /**
     * 通过Key获取main按钮实例
     * 列表页默认key：
     *     main：create,rangeDelete
     *     other：refresh,setting,filterRow
     *     more：export
     * 详情页默认key：
     *     main：create,save,delete,cancel
     *     other：import,print
     *     more：null
     * @param key 键名称
     */
    getWidgetByKey(key: string, subKey?: string): NxButton | any {
        for (let index = 0; index < this.mainPanel.length; index++) {
            const element = this.mainPanel[index];
            if (element.key == key) {
                if (element.type == 'Button') return <NxButton>element.widget;
                if (element.type == 'DropDownButton') {
                    const dropdown = <NxDropDownButton>element.widget;
                    if (dropdown.key == subKey) {
                        return dropdown;
                    }
                }
            }
        }
    }
    /**
     * 通过key获取other按钮实例
     *
     * @param key
     */
    getOtherWidgetByKey(key: string): NxButton {
        for (let index = 0; index < this.otherPanel.length; index++) {
            const element = this.otherPanel[index];
            if (element[key]) {
                return element[key];
            }
        }
    }
    getMoreWidgetByKey(key: string): NxDropDownButtonItem {
        for (let i = 0; i < this.moreButton.props.items.length; i++) {
            const widget = this.moreButton.props.items[i];
            if (widget.type == 'key') {
                return widget;
            }
        }
    }
    /**
     * 列表页默认工具条配置
     */
    useListToolbarDefault() {
        // main
        this.mainPanel = [];
        const create_type = new ToolbarPanelType();
        create_type.key = 'create';
        create_type.widget = new NxButton(NxTranslateI18N.I18N.commandOptions.create.text, 'iconfont iconadd-select');
        const range_delete_type = new ToolbarPanelType();
        range_delete_type.key = 'rangeDelete';
        range_delete_type.widget = new NxButton(NxTranslateI18N.I18N.commandOptions.delete.text, 'iconfont iconashbin');
        range_delete_type.widget.props.disabled = true;
        const range_review_type = new ToolbarPanelType();
        range_review_type.key = 'rangeReview';
        range_review_type.widget = new NxButton(
            NxTranslateI18N.I18N.commandOptions.examine.range,
            'iconfont iconApproval'
        );
        range_review_type.widget.props.disabled = true;
        range_review_type.widget.props.visible = false;
        const review_type = new ToolbarPanelType();
        review_type.key = 'review';
        review_type.type = 'DropDownButton';
        review_type.widget = new NxDropDownButton();
        review_type.widget.props.text = NxTranslateI18N.I18N.commandOptions.examine.text;
        review_type.widget.props.disabled = true;
        review_type.widget.props.icon = 'iconfont iconApproval';
        review_type.widget.props.items.push(
            new NxDropDownButtonItem(NxTranslateI18N.I18N.commandOptions.examine.cancel, 'cancel_review', '')
        );
        this.mainPanel.push(...[create_type, range_delete_type, range_review_type, review_type]);
        // other
        this.otherPanel = [];
        const refresh_btn = { refresh: new NxButton('', 'iconfont iconshuaxin', 'text', 'normal') };
        refresh_btn.refresh.props.hint = NxTranslateI18N.I18N.commandOptions.refresh.text;

        const setting_btn = { setting: new NxButton('', 'iconfont iconset', 'text', 'normal') };
        setting_btn.setting.props.hint = NxTranslateI18N.I18N.commandOptions.setting.text;

        const filterRow_btn = { filterRow: new NxButton('', 'iconfont iconfilter', 'text', 'normal') };
        filterRow_btn.filterRow.props.focusStateEnabled = true;
        filterRow_btn.filterRow.props.hint = NxTranslateI18N.I18N.commandOptions.filterRow.text;

        this.otherPanel.push(...[refresh_btn, setting_btn, filterRow_btn]);
        this.otherPanelKeys.push(...['refresh', 'setting', 'filterRow']);
        // more
        this.moreButton.props.hint = NxTranslateI18N.I18N.commandOptions.moreOptions.text;
        this.moreButton.props.icon = 'iconfont iconellipsis';
        this.moreButton.props.showArrowIcon = false;
        this.moreButton.props.stylingMode = 'text';
        this.moreButton.props.dropDownOptions = { width: 130 };
        this.moreButton.props.items = [
            new NxDropDownButtonItem(
                NxTranslateI18N.I18N.commandOptions.exportExcel.text,
                'export',
                'iconfont iconexport'
            ),
        ];
        this.moreButton.props.displayExpr = 'text';
    }
    /**
     * 详情页默认工具条配置
     */
    useDetailToolbarDefault() {
        // 详情页工具条默认项
        this.mainPanel = [];
        const create_type = new ToolbarPanelType();
        create_type.key = 'create';
        create_type.widget = new NxButton(NxTranslateI18N.I18N.commandOptions.create.text, 'iconfont iconadd-select');
        const save_type = new ToolbarPanelType();
        save_type.key = 'save';
        save_type.type = 'Button';
        save_type.widget = new NxButton(NxTranslateI18N.I18N.commandOptions.save.text, 'iconfont iconsave');
        const delete_type = new ToolbarPanelType();
        delete_type.key = 'delete';
        delete_type.widget = new NxButton(NxTranslateI18N.I18N.commandOptions.delete.text, 'iconfont iconashbin');
        const cancel_type = new ToolbarPanelType();
        cancel_type.key = 'cancel';
        cancel_type.widget = new NxButton(NxTranslateI18N.I18N.commandOptions.cancel.text, 'iconfont iconresonserate');
        // const prev_btn = { prev: new NxButton('上一条') };
        // const next_btn = { next: new NxButton('下一条') };
        this.mainPanel.push(...[create_type, save_type, cancel_type, delete_type]);
        this.otherPanel = [];

        const import_btn = { import: new NxButton('', 'iconfont iconimport', 'text', 'normal') };
        import_btn.import.props.hint = NxTranslateI18N.I18N.commandOptions.import.text;
        import_btn.import.props.visible = false;

        const print_btn = { print: new NxButton('', 'iconfont iconprint', 'text', 'normal') };
        print_btn.print.props.hint = NxTranslateI18N.I18N.commandOptions.print.text;
        print_btn.print.props.visible = false;

        const setting_btn = { setting: new NxButton('', 'iconfont iconset', 'text', 'normal') };
        setting_btn.setting.props.hint = NxTranslateI18N.I18N.commandOptions.setting.text;
        setting_btn.setting.props.visible = false;

        const message_box_btn = {
            messageBox: new NxButton(`0`, 'iconfont iconMessagebox', 'text', 'normal'),
        };
        message_box_btn.messageBox.props.hint = NxTranslateI18N.I18N.messageBox.text;
        message_box_btn.messageBox.props.elementAttr = { class: 'message-box-icon' };
        

        const head_setting_btn = { headSetting: new NxButton('', 'iconfont iconset', 'text', 'normal') };
        head_setting_btn.headSetting.props.hint = NxTranslateI18N.I18N.commandOptions.headSetting.text;
        head_setting_btn.headSetting.props.visible = false;

        const filterRow_btn = { filterRow: new NxButton('', 'iconfont iconfilter', 'text', 'normal') };
        filterRow_btn.filterRow.props.focusStateEnabled = false;
        filterRow_btn.filterRow.props.hint = NxTranslateI18N.I18N.commandOptions.filterRow.text;
        filterRow_btn.filterRow.props.visible = false;

        this.otherPanel.push(...[message_box_btn, print_btn, head_setting_btn, setting_btn, import_btn ,filterRow_btn]);
        this.otherPanelKeys.push(...['messageBox', 'print', 'headSetting', 'setting', 'import', 'filterRow']);
    }
    onColumnSetting: Function = null;
    onColumnEditing: Function = null;
}
export class ColumnSetting {
    constructor(caption: string, dataField: string, disabled?: boolean, visibled?:boolean) {
        this.caption = caption;
        this.dataField = dataField;
        if (disabled) {
            this.disabled = disabled;
        }
        if (visibled) {
            this.visibled = visibled
        }
    }
    caption: String;
    dataField: String;
    visibled: Boolean = true;
    edit: Boolean = false;
    disabled: boolean = false;
}
export class ToolbarCheckInfo {
    type: 'info' | 'success' | 'error' = 'info';
    icon: ToolbarCheckIcon = ToolbarCheckIcon.info;
    visible: Boolean = true;
    clearClick: Function = null;
    checked: Number = 0;
    message: String = stringHelper.format(NxTranslateI18N.I18N.commandOptions.selected.text, '0'); // '已选择 0 项';
}
export enum ToolbarCheckIcon {
    info = 'iconfont icontishi',
    success = 'iconfont icontishi',
    error = 'iconfont icontishi',
}
export enum ToolbarPanelMainKeysDefault {
    create = 'create',
    rangeDelete = 'rangeDelete',
}
export enum ToolbarPanelOtherKeysDefault {
    refresh = 'refresh',
    download = 'download',
    export = 'export',
}
type ToolbarKeyWidget = {
    [key: string]: NxButton;
};
export class ToolbarPanelType {
    type: 'Button' | 'Num' | 'DropDownButton' | 'RadioGroup' = 'Button';
    key: string;
    widget: NxButton | NxDropDownButton | any;
}
export class ColumnSettingOffset {
    width: number = 180;
    height: number = 260;
    at: string = 'right top';
    my: string = 'right top';
    offset: string = '-15 120';
}
