export class NxDataGridColumnValidationRule {
    constructor(
        type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async'
    ) {
        if (type) {
            this.type = type;
        }
    }
    type: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    message: String = '';
    /**
     * Require | StringLength：去掉首尾空格
     */
    trim: Boolean = true;
    /**
     * Number | StringLength：排除空值
     */
    ignoreEmptyValue: Boolean = true;
    /**
     * StringLength：最大长度
     */
    max: Number = 50;
    /**
     * StringLength：最小长度
     */
    min: Number = 0;
    /**
     * 仅在值更改时校验
     */
    reevaluate: Boolean = false;
    /**
     * 正则验证
     */
    pattern: RegExp | String = null;
    // validationCallback:Function = null
}
