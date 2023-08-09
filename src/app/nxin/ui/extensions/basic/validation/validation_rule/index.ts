export interface NxBaseRule{
    /**
     * 验证不通过显示的文本
     * @default 验证未通过
     */
    message?: string
    /**
     * 指定验证规则
     * @default undefined
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async'
}
export interface NxValidationCallBackOption {
    /**
     * 要验证的值
     */
    value?: string | number;
    /**
     * 验证规则
     */
    rule?: any;
    /**
     * 启动验证的validator对象
     */
    validator?: any;
    /**
     * 当前行的数据  
     * 仅当是datagrid或treelist的时候存在
     */
    data?: any;
    /**
     * 验证所在的列  
     * 仅当是datagrid或treelist的时候存在
     */
    column?: any;
    /**
     * 正在验证的表单项
     */
    formItem?: any;
}
/**
 * 异步检查自定义验证规则
 */
export interface NxAsyncRule extends NxBaseRule {
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate?: boolean;
    /**
     * 验证触发的回调方法
     */
    validationCallback?: () => boolean;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 验证编辑器的值与指定的表达式的值对象
 */
export interface NxCompareRule extends NxBaseRule{
    /**
     * 指定其返回值与要验证的值比较
     * @returns any 要比较的值
     */
    comparisonTarget?: () => any;
    /**
     * 比较的方式
     * @default undefined
     */
    comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate?: boolean;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 自定义验证规则
 */
export interface NxCustomeRule extends NxBaseRule {
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate?: boolean;
    /**
     * 验证的时候触发的方法
     */
    validationCallback?: (options: NxValidationCallBackOption) => boolean;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 验证邮箱
 */
export interface NxEmailRule extends NxBaseRule{
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 验证数字
 */
export interface NxNumericRule extends NxBaseRule {

    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 正则验证
 */
export interface NxPatternRule extends NxBaseRule {
    /**
     * 正则表达式
     */
    pattern?: RegExp | string;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 范围验证
 */
export interface NxRangeRule extends NxBaseRule {
    /**
     * 最大值
     */
    max?:Date | number;
    /**
     * 最小值
     */
    min?:Date | number;
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate?: boolean;
    
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue?: boolean;
}
/**
 * 必填验证
 */
export interface NxRequiredRule extends NxBaseRule {
    /**
     * 是否从验证值中删除空格字符
     * @default true
     */
    trim?: boolean;
}
export interface NxStringLengthRule extends NxBaseRule {
    /**
     * 最大长度
     */
    max?: number;
    /**
     * 最小长度
     */
    min?: number;
    /**
     * 是否从验证值中删除空格字符
     * @default true
     */
    trim?: boolean;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue?: boolean;
}
export interface TestValidation {
    aaa?: string;
}
