import { NxEditingTexts } from '.';

export class NxEditingTextsImplement implements NxEditingTexts{
    /**
     * 当鼠标停留在添加按钮的时候显示的文本
     * @default 添加一行
     */
    addRow: string = '添加一行';
    /**
     * 鼠标停留在取消按钮的时候显示的文本
     * @default 取消更改
     */
    cancelAllChanges:string = '取消更改';
    /**
     * 删除数据的时候显示的信息
     * @default 你确定要删除该数据吗
     */
    confirmDeleteMessage:string = '你确定要删除该数据吗';
    /**
     * 指定删除数据的时候显示的标题
     * @default ''
     */
    confirmDeleteTitle:string = '';
    /**
     * 删除行的 按钮文本
     * @default 删除
     */
    deleteRow:string = '删除';
    /**
     * 编辑行的 按钮文本
     * @default 编辑
     */
    editRow:string = '编辑';
    /**
     * 鼠标停留在保存按钮的时候显示的文本
     * @default 保存更改
     */
    saveAllChanges:string = '保存更改';
    /**
     * 保存按钮显示的文本
     * @default 保存
     */
    saveRowChanges:string = '保存更改';
    /**
     * 给撤销删除按钮指定文本
     * @default 撤销
     */
    undeleteRow:string = '撤销';
    /**
     * 鼠标停留在取消更改按钮显示的文本
     * @default 取消更改
     */
    validationCancelChanges:string = '取消更改';
}