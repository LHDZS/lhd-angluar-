import { EventEmitter } from '@angular/core';
import DevExpress from 'devextreme';
import { NxRequiredRule, NxNumericRule, NxRangeRule, NxStringLengthRule, NxCustomeRule, NxCompareRule, NxPatternRule, NxEmailRule, NxAsyncRule } from './validation_rule';

export interface NxValidation{
    //#region 属性
      /**
     * 一个对象，指定验证的内容、时间以及如何应用验证结果
     */
    adapter: {
        applyValidationResults?: Function; //验证器小部件在验证指定值后调用的函数
        bypass?: Function;//该函数返回一个布尔值，该布尔值指定是否绕过验证
        focus?: Function;//当相应的ValidationSummary项目成为焦点时，将焦点设置到经过验证的编辑器的功能
        getValue?: Function; //返回要验证的值的函数
        reset?: Function;//重置验证值的功能
        validationRequestsCallbacks?: any | Array<Function>;  //在值验证时要执行的回调
    };
    /**
     * 指定要附加到小部件的根元素的属性
     */
    elementAttr: any;
    /**
     * 指定小部件的高度
     */
    height: number | Function | string;
    /**
     * 指定在验证默认消息中使用的编辑器名称
     */
    name: string;
    /**
     * 指定与编辑器相关的验证组
     */
    validationGroup: string;
    /**
     * 与nxValidator对象相关联的编辑器要检查的一组验证规则
     */
    // validationRules: Array<NxRequiredRule | NxNumericRule | NxRangeRule | NxStringLengthRule | NxCustomeRule | NxCompareRule | NxPatternRule | NxEmailRule | NxAsyncRule;
    /**
     * Specifies the widget's width.
     */
    width: number | Function | string;
    /**
     * 在处理小部件之前执行的功能
     */
    onDisposing: EventEmitter<any>;
    /**
     * JavaScript框架中用于保存小部件实例的函数
     */
    onInitialized: EventEmitter<any>;
    /**
     * 更改小部件选项后执行的功能
     */
    onOptionChanged: EventEmitter<any>;
    /**
     * 验证值后执行的功能
     */
    onValidated: EventEmitter<any>;
    /**
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
     */
    adapterChange: EventEmitter<{
        applyValidationResults?: Function;
        bypass?: Function;
        focus?: Function;
        getValue?: Function;
        reset?: Function;
        validationRequestsCallbacks?: any | Array<Function>;
    }>;
    //#endregion
}