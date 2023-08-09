export class NxDataGridSelection {
    /**
     * 设置是否开启多选功能
     */
    enabled: Boolean = true;
    /**
     * 设置是否允许选择全部
     */
    allowSelectAll: Boolean = true;
    /**
     * 延时选择
     */
    deferred: Boolean = false;
    /**
     * 设置选择的模式
     */
    mode: 'multiple' | 'none' | 'single' = 'multiple';
    /**
     * 设置全选时是选择所有页还是只选择当前页
     */
    selectAllMode: 'allPages' | 'page' = 'page';
    /**
     * 选择多选框的显示模式
     */
    showCheckBoxesMode: 'always' | 'none' | 'onClick' | 'onLongTap' = 'always';
}
