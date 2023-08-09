import { NxColumnFixing, NxTexts } from '.';

export class NxColumnFixingImplement implements NxColumnFixing{
    /**
     * 是否开启列固定
     */
    enabled:boolean = false;
    /**
     * 包含用于在列标题的上下文菜单中为列固定命令指定文本的选项
     */
    // texts: NxTexts;

}

/**
 * 列的右键菜单文本默认配置
 */
export class NxTextsImplements implements NxTexts{
    
    /**
     * 指定用于列的右键菜单项的文本
     */
    fix:string = '移动该列';
    /**
     * 列的右键菜单显示的文本  
     * 
     */
    leftPosition:string = '移动到最左边';
    /**
     * 列的右键菜单显示的文本
     */
    rightPosition:string = '移动到最右边';

    /**
     * 移动当前列到下一列
     */
    unfix:string = '移动';
}