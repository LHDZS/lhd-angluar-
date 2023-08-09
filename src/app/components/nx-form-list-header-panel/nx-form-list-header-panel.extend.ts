import { NxTextBox } from '../component-model/text-box/mode';
import { NxButton } from '../component-model/button/model';
import { NxTranslateI18N } from 'src/app/nxin/i18n';

export class NxFormListHeaderPanelModel {
    constructor(useDefault: boolean = true) {
        if (useDefault) {
            // 配置按钮项
            const createBtn = { create: new NxButton('', 'plus', 'text') };
            const refreshBtn = { refresh: new NxButton('', 'refresh', 'text') };
            const exportBtn = { export: new NxButton('', 'export', 'text') };
            const moreBtn = { more: new NxButton('', 'more', 'text') };
            this.toolbarPanel.push(...[createBtn, refreshBtn, exportBtn, moreBtn]);
            this.toolbarPanelKeys.push(...['create', 'refresh', 'export', 'more']);
            //配置全文搜索
            this.fullTextSearch.props.placeholder = NxTranslateI18N.I18N.commandOptions.search.text;
        }
    }
    fullTextSearch: NxTextBox = new NxTextBox();
    toolbarPanel: ToolbarKeyWidget[] = [];
    toolbarPanelKeys: string[] = [];
    /**
     * 通过Key获取工具条按钮实例
     * @param key 键名称
     */
    getWidgetByKey(key: string): NxButton {
        for (let index = 0; index < this.toolbarPanel.length; index++) {
            const element = this.toolbarPanel[index];
            if (element[key]) {
                return element[key];
            }
        }
    }
}
type ToolbarKeyWidget = {
    [key: string]: NxButton;
};
