/**
 * 列菜单设置
 */
export interface NxColumnFixing{
    /**
     * 是否开启列固定
     */
    enabled?:boolean;
    /**
     * 包含用于在列标题的上下文菜单中为列固定命令指定文本的选项
     */
    texts?: NxTexts;

}

/**
 * 列的右键菜单文本配置
 */
export interface NxTexts{
    /**
     * 指定用于固定列的上下文菜单项的文本
     */
    fix?:string;
    /**
     * 
     */
    leftPosition?:string;
    /**
     * 
     * @type string
     * @default to the right
     */
    rightPosition?:string;
    /**
     * 为不固定列的上下文菜单项指定文本
     * @type string
     * @default Unfix
     */
    unfix:string;
}
