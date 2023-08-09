import { NxTranslateI18N } from 'src/app/nxin/i18n';

export class NxDataGridHeaderFilter {
    allowSearch: Boolean = false;
    height: Number;
    searchTimeout: Number = 500;
    texts: NxDataGridHeaderFilterTexts = new NxDataGridHeaderFilterTexts();
    visible: Boolean = true;
    width: Number;
}
export class NxDataGridHeaderFilterTexts {
    cancel: String = NxTranslateI18N.I18N.commandOptions.cancel.text;
    emptyValue: String = NxTranslateI18N.I18N.commandOptions.empty.text; // '空白';
    ok: String = NxTranslateI18N.I18N.commandOptions.ok.text;
}
