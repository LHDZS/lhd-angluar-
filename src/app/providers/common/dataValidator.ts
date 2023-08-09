import { DataStatus } from 'src/app/components/editor-grid';
import { Notify, NotifyType } from '../notify';

export class DataValidator {
    /**
     * - true : 验证失败就直接退出
     * - false: 所有验证结束后, 返回错误信息集合
     * - 默认值: false
     * ### Example
     * ```
     * const validator = new DataValidator(true)
     * ```
     */
    broken: boolean = false;
    /**
     * 最终的验证结果
     * - true 通过
     * - false 失败
     */
    validation: boolean = true;
    /**
     * 错误信息
     * - `broken`为`true`时只返回一条错误信息
     * - `broken`为`false`时返回错误信息集合
     */
     failureInfo: string | string[];
     constructor(broken: boolean = false) {
         this.broken = broken;
     }
     /**
     * 只进行对象中的普通属性校验,不包含嵌套属性校验
     * @param obj 校验对象
     * @param props 校验属性
     */
    requireNew(data: object, props: Array<Array<string>>, nullMessage?: string): DataValidator {
        if (this.broken && !this.validation) return this;
        if (data == null || data == undefined) {
            this.validation = false;
            console.error(nullMessage || '[Validation] Validating object is null or undefined.');
            if (this.broken) {
                this.failureInfo = nullMessage || '源数据不能为空';
            }
            return this;
        }
        for (let i = 0; i < props.length; i++) {
            if (data[props[i][0]] == null || data[props[i][0]] == undefined || data[props[i][0]] == '') {
                const message = props[i][1];
                this.validation = false;
                Notify.toast(message, NotifyType.Error);
                return this;
            }
        }
        return this;
    }
    /**
     * 只进行对象中的普通属性校验,不包含嵌套属性校验
     * @param obj 校验对象
     * @param props 校验属性
     */
    require(obj: object, props: Array<Array<string>>): DataValidator {
        if (obj == null || obj == undefined) {
            this.validation = false;
            console.error('[Validation] Validating object is null or undefined.');
        }
        //验证对象是否包含属性
        if (obj.hasOwnProperty) {
            //遍历需要进行验证的属性
            for (let i = 0; i < props.length; i++) {
                if (obj[props[i][0]] === null || obj[props[i][0]] === undefined || obj[props[i][0]] === '') {
                    const message = props[i][1];
                    this.validation = false;
                    Notify.toast(message, NotifyType.Error);
                    return this;
                }
            }
        } else {
            this.validation = false;
            console.error('[Validation] Validating object is not has own property.');
        }
        return this;
    }
    /**
     * 验证数组对象中的属性,数组中的对象类型必须一致
     * @param arr
     * @param props
     */
     forRequire(arr: Array<object>, props: Array<Array<string>>): DataValidator {
        if (this.broken && !this.validation) return this;
        if (arr.length <= 0) {
            this.validation = false;
            console.error('[Validation] Validating array is empty.');
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                for (let j = 0; j < props.length; j++) {
                    const message = props[j][1].replace('$INDEX', `${i + 1}`);
                    try {
                        let validationData = arr[i][props[j][0]].toString();
                        if (validationData === null || validationData === undefined || validationData === '') {
                            this.validation = false;
                            Notify.toast(message, NotifyType.Error);
                            return this;
                        }
                    } catch (error) {
                        this.validation = false;
                        Notify.toast(message, NotifyType.Error);
                        return this;
                    }
                }
            } else {
                this.validation = false;
                return this;
            }
        }
        return this;
    }
    /**
     * 验证数组对象中的属性,数组中的对象类型必须一致
     * @param arr
     * @param props
     */
    forObjRequire(arr: Array<object>, props: Array<Array<string>>): DataValidator {
        if (arr.length <= 0) {
            this.validation = false;
            console.error('[Validation] Validating array is empty.');
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) { 
                for (let j = 0; j < props.length; j++) {
                    try {
                        let validationData;
                        if (props[j][0].indexOf('.') > -1) {
                            const deepProp = props[j][0].split('.');
                            let tempObj = arr[i];
                            deepProp.map((m) => {
                                tempObj = tempObj[m];
                            });
                            validationData = tempObj;
                        } else {
                            let key = arr[i][props[j][0]];
                            if (key === 0) {
                                validationData = 0;
                            } else {
                                validationData = arr[i][props[j][0]].toString();
                            }
                        }
                        if (validationData === null || validationData === undefined || validationData === '' || validationData === '0') {
                            const message = props[j][1];
                            this.validation = false;
                            Notify.toast(message, NotifyType.Error);
                            return this;
                        }
                    } catch (error) {
                        const message = props[j][1];
                        this.validation = false;
                        Notify.toast(message, NotifyType.Error);
                        return this;
                    }
                }
            } else {
                this.validation = false;
                return this;
            }
        }
        return this;
    }
    /**
     * @deprecated 请使用 `forRequire` 方法
     */
     forObjRequireNew(arr: Array<object>, props: Array<Array<string>>): DataValidator {
        if (this.broken && !this.validation) return this;
        if (arr.length <= 0) {
            this.validation = false;
            console.error('[Validation] Validating array is empty.');
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                for (let j = 0; j < props.length; j++) {
                    try {
                        let validationData = arr[i][props[j][0]].toString();
                        if (validationData === null || validationData === undefined || validationData === '') {
                            const message = props[j][1];
                            this.validation = false;
                            Notify.toast(message, NotifyType.Error);
                            return this;
                        }
                    } catch (error) {
                        const message = props[j][1];
                        this.validation = false;
                        Notify.toast(message, NotifyType.Error);
                        return this;
                    }
                }
            } else {
                this.validation = false;
                return this;
            }
        }
        return this;
    }
    /**
     *
     */
    each(
        data: any[],
        rules: Array<Array<string | ValidationType | ((data: any, current: any) => boolean)>>,
        nullMessage?: string
    ) {
        if (this.broken && !this.validation) return this;
        if (data == null || data == undefined || data.length == 0) {
            if (this.broken) {
                this.failureInfo = nullMessage || '源数据不能为空';
                Notify.error(this.failureInfo);
                this.validation = false;
            }
            return this;
        }

        var data2=[];
        for (let x = 0; x < data.length; x++) {
            const _data = data[x];
            if(!_data.target||_data.target!=DataStatus.Delete){
                data2.push(_data);
            }
        }
        if ( data2.length == 0) {
            if (this.broken) {
                this.failureInfo = nullMessage || '源数据不能为空';
                Notify.error(this.failureInfo);
                this.validation = false;
            }
            return this;
        }
        
        if (rules && rules.length > 0) {
            for (let x = 0; x < data2.length; x++) {
                const _data = data2[x];
                for (let i = 0; i < rules.length; i++) {
                    const _rule = rules[i];
                    const _field = _rule[0] as string;
                    const _type = _rule[1];
                    const _info = (_rule[2] as string).replace('$INDEX', `${x + 1}`);
                    if (_field && _type && _info) {
                        let _value;
                        if (_field.indexOf('.') > -1) {
                            // deep
                            _value = _data;
                            let _split = _field.split('.');
                            _split.forEach(s => {
                                _value = _value[s];
                            });
                        } else {
                            _value = _data[_field];
                        }
                        if (_type == ValidationType.nonnull) {
                            if (_value == null || _value == undefined) {
                                if (this.broken) {
                                    this.failureInfo = _info;
                                    this.validation = false;
                                    Notify.error(_info);
                                    return;
                                } else {
                                    (this.failureInfo as any[]).push(_info);
                                    this.validation = false;
                                }
                            }
                        } else if (_type instanceof Function) {
                            if (!_type(_data, _value)) {
                                if (this.broken) {
                                    this.failureInfo = _info;
                                    this.validation = false;
                                    Notify.error(_info);
                                    return;
                                } else {
                                    (this.failureInfo as any[]).push(_info);
                                    this.validation = false;
                                }
                            }
                        }
                    }
                }
            }
            return this;
        }
    }
}

export enum ValidationType {
    /** 非空 */
    nonnull = 'nonenull',
}

