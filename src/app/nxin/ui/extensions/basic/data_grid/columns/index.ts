import DevExpress from 'devextreme';
import { NxRequiredRule, NxNumericRule, NxRangeRule, NxStringLengthRule, NxCustomeRule, NxCompareRule, NxPatternRule, NxEmailRule, NxAsyncRule } from '../../validation/validation_rule';
import { NxDataGridColumnLookup } from './lookup';
export interface NxDataGridColumn {
    /**
     * 设置对齐方式
     * @type left | center | right
     * @default center
     */
    alignment?: 'left' | 'center' | 'right';
    /**
     * 指定用户是否可以编辑列中的值
     * @default true
     */
    allowEditing?: boolean;
    /**
     * 指定是否应导出此列中的数据
     * 仅在[visible]=true时有效
     * @default true
     */
    allowExporting?: boolean;
    /**
     * 指定是否可以通过此列过滤数据  
     * 仅当filterRow.visible为true时适用
     * @default true
     */
    allowFiltering?: boolean;
    /**
     * 指定用户是否可以在运行时修复列  
     * 仅当columnFixing.enabled为true时适用
     * @default true
     */
    allowFixing?: boolean;
    /**
     * 指定用户是否可以按此列的值对数据进行分组  
     * 仅在启用分组时适用
     * @default true
     */
    allowGrouping?: boolean;
    /**
     * 指定是否可以通过此列使用标题过滤器来过滤数据 
     * 默认情况下，继承allowFiltering选项的值
     * @default true
     */
    allowHeaderFiltering?: boolean;
    /**
     * 指定用户是否可以在运行时使用列选择器隐藏列  
     * 仅当columnChooser.enabled为true时适用
     * @default true
     */
    allowHiding?: boolean;
    /**
     * 指定是否可以在列重新排序中使用此列
     * 仅当allowColumnReordering为true时适用
     * @default true
     */
    allowReordering?: boolean;
    /**
     * 指定用户是否可以调整列的大小  
     * 仅当allowColumnResizing为true时适用
     * @default true
     */
    allowResizing?: boolean;
    /**
     * 指定是否可以搜索此列  
     * 仅当searchPanel.visible为true时适用 默认情况下，继承allowFiltering选项的值
     * @default true
     */
    allowSearch?: boolean;
    /**
     * 指定用户是否可以按此列对行进行排序  
     * 仅当sorting.mode与“ none”不同时适用
     * @default true
     */
    allowSorting?: boolean;
    /**
     * 指定当按特定列对记录进行分组时，组是否显示为展开状态
     * @default true
     */
    autoExpandGroup?: boolean;
    // buttons: Array<string | DevExpress.ui.dxDataGridColumnButton | DevExpress.ui.dxTreeListColumnButton>;
    /**
     * 计算自定义单元格值 使用此功能可以创建未绑定的数据列
     * @param rowData
     * @returns 自定义值  any
     */
    calculateCellValue?: Function;
    /**
     * 计算列单元格的自定义显示值  
     * 需要指定dataField或calculateCellValue选项
     * @param rowData
     * @returns 自定义的值
     */
    calculateDisplayValue?: Function | string;
    /**
     * 指定列的自定义过滤规则
     * @param filtervalue:any 用户输入的值
     * @param selectedFilterOperation：string  "=", "<>", ">", ">=", "<", "<=", "between", "startswith", "endswith", "contains", "notcontains"
     * @param target:string 可能的值：“ filterRow”，“ headerFilter”，“ filterBuilder”和*“ search”
     * @returns filterExpression 过滤器表达式
     */
    calculateFilterExpression?: Function;
    /**
     * 指定一个字段名称或一个函数，该函数将返回用于对列单元格进行分组的字段名称或值
     * 如果是方法 参数为RowData  返回值为 用于分组的计算值
     * 说明：默认情况下，使用分组列中包含的确切值进行分组，但是，在某些情况下，例如，当用户尝试按包含日期的列对记录进行分组时，这种方法可能会产生较差的结果
     * 在这种情况下，最好在分组中使用计算值。为此，请将一个函数分配给calculateGroupValue选项。此函数必须返回计算出的值以进行分组
     */
    calculateGroupValue?: Function | string;
    /**
     * 计算要在排序中使用的自定义值
     * 如果是方法 参数为 rowData 返回值为 用于排序的值   此选项接受数据源字段的名称，该字段提供要在排序中使用的值
     * 此关键字引用列的配置 当DataGrid按列分组时，此选项将被忽略。替代地或另外使用calculateGroupValue选项
     */
    calculateSortValue?: Function | string;
    /**
     * 指定数据单元的自定义模板
     */
    cellTemplate?: any;
    /**
     * 列数组
     */
    columns?: Array<DevExpress.ui.dxDataGridColumn | string | DevExpress.ui.dxTreeListColumn>;
    /**
     * 标题
     */
    caption?: string;
    /**
     * 指定要应用于列的css类
     */
    cssClass?: string;
    /**
     * 自定义列单元格中显示的文本
     * 参数为cellinfo
     * 返回值为单元格应显示的文本
     */
    customizeText?: Function;
    /**
     * 字段名称
     */
    dataField?: string;
    /**
     * 数据类型
     */
    dataType?: string;
    /**
     * 为处于编辑状态的数据单元指定自定义模板
     */
    editCellTemplate?: any;
    /**
     * 在过滤器行中配置用于编辑和过滤的默认窗口小部件
     */
    editorOptions?: any;
    /**
     * 指定HTML标记是显示为纯文本还是应用于列的值
     * 设置为true时，HTML标记显示为纯文本 如果为false，则将它们应用于列的值 将DataGrid导出到Excel时，HTML标记始终导出为纯文本
     */
    encodeHtml?: boolean;
    /**
     * 列的值为bool值的时候 指定false的时候显示的值
     */
    falseText?: string;
    /**
     * 指定一组可用的过滤器操作 仅当filterRow.visible和allowFiltering为true时适
     * 接收的值为'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof'
     */
    filterOperations?: string | Array<string>;
    /**
     * 指定用户是通过包含（选择）值还是排除（清除选择的值）来更改当前过滤器  
     * 仅当headerFilter.visible和allowHeaderFiltering为true时适用
     * @default include
     */
    filterType?: 'exclude' | 'include';
    /**
     * 指定显示在过滤器行中的列的过滤器值
     * @default undefined
     */
    filterValue?: any;
    /**
     * 指定在列的标题过滤器中选择的值
     * @default undefined
     */
    filterValues?: Array<any>;
    /**
     * 固定列 默认值：false
     */
    fixed?: boolean;
    /**
     * 指定列固定到的窗口小部件的位置  
     * 仅当column [] fixed为true时有效
     */
    fixedPosition?: 'left' | 'right';
    /**
     * 在将值显示到cell的时候对其进行格式化
     */
    format?: DevExpress.ui.format | string;
    /**
     * 配置列在编辑状态下生成的表单项 仅当edit.mode为“ form”或“ popup”时适用
     */
    formItem?: DevExpress.ui.dxFormSimpleItem;
    /**
     * 为组单元格（组行）指定自定义模板
     */
    groupCellTemplate?: any;
    /**
     * 当网格记录按该列的值分组时，指定该列的索引
     */
    groupIndex?: number;
    /**
     * 指定列标题的自定义模板
     */
    headerCellTemplate?: any;
    /**
     * 指定标题过滤器的数据设置
     */
    headerFilter?: {
    };
    /**
     * 指定当窗口小部件适应屏幕或容器大小时隐藏列的顺序  
     * 如果allowColumnResizing为true，columnResizingMode为“ widget”，则将被忽略
     * @default undefined
     */
    hidingPriority?: number;
    /**
     * 指定列是否组合其他列
     * @default undefined
     */
    isBand?: boolean;
    /**
     * 指定查找列的选项
     */
    lookup?: NxDataGridColumnLookup;
    /**
     * 指定列的最小宽度
     * @default undefined
     */
    minWidth?: number;
    /**
     * 指定列的标识符
     * @default undefined
     */
    name?: string;
    /**
     * 指定拥有当前列的band列 接受column数组中band列的索引
     */
    ownerBand?: number;
    /**
     * 指定是否在其他列和元素之后呈现该列
     * @default false
     */
    renderAsync?: boolean;
    /**
     * 指定显示在过滤器行中的列的过滤操作
     * @default 如果是string 则是contains 如果是number则是=如果是date则是=
     */
    selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
    /**
     * 指定在用户编辑单元格值之后但将其保存到数据源之前要调用的函数
     * @param newData
     * @param value
     * @param currentRowData
     */
    setCellValue?: Function;
    /**
     * 指定该列是否使用编辑器显示其值
     * @default false
     */
    showEditorAlways?: boolean;
    /**
     * 指定列选择器是否可以包含列标题
     * @default true
     */
    showInColumnChooser?: boolean;
    /**
     * 指定在将网格记录分组时是否显示该列
     * @default false
     */
    showWhenGrouped?: boolean;
    /**
     * 根据参与排序的列指定索引
     * @default undefined
     */
    sortIndex?: number;
    /**
     * 自定义排序
     * @param value1
     * @param value2
     * @returns number 指示 value1与value2的排序未知 <0 值1在值2前 =0不变 >0值1在值2后
     */
    sortingMethod?: Function;
    /**
     * 设置列的排序方式
     * @default desc
     */
    sortOrder?: 'desc' | 'asc';
    /**
     * 指定此对象自定义的命令列
     */
    /**
     * 设置单元格值为true时显示的文本内容
     * @default 是
     */
    trueText?: string;
    /**
     * 指定命令列的类型
     * @default undefined
     */
    type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
    /**
     * 设置单元格内容验证
     */
    validationRules?: Array<NxRequiredRule | NxNumericRule | NxRangeRule | NxStringLengthRule | NxCustomeRule | NxCompareRule | NxPatternRule | NxEmailRule | NxAsyncRule>;
    /**
     * 指定该列是否可见
     * @default true
     */
    visible?: boolean;
    /**
     * 设置列的索引
     * 引发的事件：optionChanged
     * @default undefined
     */
    visibleIndex?: number;
    /**
     * 列宽
     * @default undefined
     */
    width?: number;
}


export class NxDataGridColumnImplements implements NxDataGridColumn{

}
