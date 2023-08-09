import { NxCustomeRule, NxEmailRule, NxNumericRule, NxPatternRule, NxRangeRule, NxRequiredRule, NxStringLengthRule, NxValidationCallBackOption, NxAsyncRule } from '.';

/**
 * 异步检查自定义验证规则默认实现
 */
export class NxAsyncRuleImplements implements NxAsyncRule{
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate: boolean = true;
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue: boolean = false;
}
/**
 * 验证编辑器的值与指定的表达式的值 默认实现
 */
export class NxCompareRuleImplements{
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate: boolean = true;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue: boolean = false;
}
/**
 * 自定义验证规则默认实现
 */
export class NxCustomeRuleImplements implements NxCustomeRule {
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate: boolean = true;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue: boolean = false;
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
}
/**
 * 验证邮箱 默认实现
 */
export class NxEmailRuleImplements implements NxEmailRule{
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue: boolean = true;
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
}
/**
 * 验证数字 默认实现s
 */
export class NxNumericRuleImplements implements NxNumericRule {

    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue: boolean = true;
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
}
/**
 * 正则验证默认实现
 */
export class NxPatternRuleImplements implements NxPatternRule {
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue: boolean = true;
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
}
/**
 * 范围验证默认实现
 */
export class NxRangeRuleImplements implements NxRangeRule {
    /**
     * 指示是否应始终为目标值检查规则，或仅当值更改时才检查规则
     * @default true
     */
    reevaluate: boolean = true;
    
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default true
     */
    ignoreEmptyValue: boolean = true;
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
}
/**
 * 必填验证默认实现
 */
export class NxRequiredRuleImplements implements NxRequiredRule {
    /**
     * 是否从验证值中删除空格字符
     * @default true
     */
    trim: boolean;
}
/**
 * 字符串验证默认实现
 */
export class NxStringLengthRuleImplements implements NxStringLengthRule {
    /**
     * 最大长度
     */
    max: number = 99;
    /**
     * 最小长度
     */
    min: number = 1;
    /**
     * 是否从验证值中删除空格字符
     * @default true
     */
    trim: boolean = true;
    /**
     * 是否对null、undefined、false和空字符串执行validationCallback
     * @default false
     */
    ignoreEmptyValue: boolean = false;
    
    /**
     * 验证未通过提示消息
     */
    message:string = '验证未通过';
}