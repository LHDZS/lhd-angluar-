import { Form } from '@angular/forms';
import { NxTexts } from '../columns/cloumn_fix';
import { NxEditingTexts } from './edit_texts';

export interface NxEditing{
    /**
     * 是否允许添加
     * @default false
     */
    allowAdding?:boolean;
    /**
     * 是否允许删除
     * @default false
     * @param e
     * @returns boolean
     */
    allowDeleting?: boolean | Function;
    /**
     * 是否允许更新
     * @default false
     * @param e
     * @returns boolean
     */
    allowUpdating?: boolean | Function;
    /**
     * 删除的时候是否需要确认框
     * @default true
     */
    confirmDelete?: boolean;
    /**
     * 配置表单  
     * 仅当 mode 是 form 或者 popup的时候有效
     */
    form?: Form;
    /**
     * 编辑数据的类型
     * @default row
     */
    mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
    /**
     * 配置弹窗
     */
    // popup:Popuop
    /**
     * 保存更改后执行的操作
     * @default full
     */
    refreshMode?: 'full' | 'reshape' | 'repaint';
    /**
     * 开始编辑的时候是否选择单元格
     * @default false
     */
    selectTextOnEditStart:boolean;
    /**
     * 怎么切换到编辑状态
     * @default click
     */
    startEditAction?:'click' | 'dblClick';
    /**
     * 包含用于指定与编辑相关的ui元素的文本选项
     */
    texts?:NxEditingTexts;
    /**
     * 编辑列是否使用图标代替链接
     * @default false
     */
    useIcons?:boolean;
}