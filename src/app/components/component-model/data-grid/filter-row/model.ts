import { NxTranslateI18N } from 'src/app/nxin/i18n';
export class NxDataGridFilterRow {
    /**
     * 设置是否显示行过滤器
     */
    visible: Boolean = false;
    applyFilter: String = 'auto';
    showAllText: String = NxTranslateI18N.I18N.commandOptions.all.text;
    resetOperationText: String = NxTranslateI18N.I18N.commandOptions.cleanAll.text;
    showOperationChooser: Boolean = true;
}
