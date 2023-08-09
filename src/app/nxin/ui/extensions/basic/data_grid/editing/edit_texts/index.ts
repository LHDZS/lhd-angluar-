export interface NxEditingTexts{
    /**
     * 当鼠标停留在添加按钮的时候显示的文本
     * @default 添加一行
     */
    addRow?: string;
    /**
     * 鼠标停留在取消按钮的时候显示的文本
     * @default 取消更改
     */
    cancelAllChanges?:string;
    /**
     * 删除数据的时候显示的信息
     * @default 你确定要删除该数据吗?
     */
    confirmDeleteMessage?:string;
    /**
     * 指定删除数据的时候显示的标题
     * @default ''
     */
    confirmDeleteTitle?:string;
    /**
     * 删除行的 按钮文本
     * @default 删除
     */
    deleteRow?:string;
    /**
     * 编辑行的 按钮文本
     * @default 编辑
     */
    editRow?:string;
    /**
     * 鼠标停留在保存按钮的时候显示的文本
     * @default 保存更改
     */
    saveAllChanges?:string;
    /**
     * 保存按钮显示的文本
     * @default 保存更改
     */
    saveRowChanges?:string;
    /**
     * 给撤销删除按钮指定文本
     * @default 撤销
     */
    undeleteRow?:string;
    /**
     * 鼠标停留在取消更改按钮显示的文本
     * @default 取消更改
     */
    validationCancelChanges:string;
}