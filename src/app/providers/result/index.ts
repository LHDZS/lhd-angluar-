import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { i18n_response_error_handler } from 'src/locale/locale';
import { ResponseCodeEnumMap } from '../enums/map';
import { TranslateI18N } from '../i18n-translate';
import { ResponseCodes, SystemResponseCodes, PoultryCommonResponseCodes, InnerCodes } from '../response-codes';
/**
 * 定义返回数据实体模型
 */
export class ResponseResult {
    code: number;
    msg: string;
    data: any;
    value: any;
    errors: SpecificError[];
}
/**
 * 返回数据实体模型
 */
export class Result extends ResponseResult {}
/** 响应结果 */
export class ResponseData {
    status: boolean;
    data: any;
    message: string | string[];
}
/**
 * 验证返回数据实体成功的处理
 */
export class ResponseSuccess {

    static handle(
        result: Result,
        columns?: { dataField: string; caption: string }[],
        takeOne: boolean = false
    ): {
        status: boolean;
        data: any;
        message: any;
        msg: any
    } {
        if(columns && columns instanceof Array){
            columns.push({
                caption: NxTranslateI18N.I18N.dataGridOptions.remarks.text,
                dataField: 'Remarks'
            })
        }
        switch (result.code) {
            case 0:
                return { status: true, data: result.data, message: '成功',msg: '成功' };
            default:
                let suffixCode = result.code.toString().substring(3, 6);
                var suffixNumInnerCode = new Number(suffixCode);
                //20-32是禽企网内部错误码
                let prefixCode= result.code.toString().substring(0, 2);
                // var preNumFixCode = new Number(prefixCode);
                if (prefixCode == '22' || prefixCode == '23'){
                // if(preNumFixCode != NaN && preNumFixCode >= 20 && preNumFixCode <= 32){
                    // 1. 判断是否返回多条错误
                    if (result.errors && result.errors.length > 0 && suffixCode == '007') {
                        // 2. 初始化多条错误消息容器
                        let message: string[] = [];
                        let msg: string = '';
                        // 3. 遍历错误源
                        result.errors.map((e) => {
                            // 4. 遍历每行每列的错误信息
                            e.columns.map((m) => {
                                // 5. 初始化消息
                                let info = '';
                                // 6. 提示错误行索引
                                if (e.index > 0) {
                                    info += `${TranslateI18N.I18N.commandOptions.line.prefix}${e.index}${TranslateI18N.I18N.commandOptions.line.suffix}：`;
                                }
                                let codeFormat: string = '';
                                // 7.判断错误码是不是系统/公共码, 获取错误码对应的错误消息模板
                                let innerCode = m.code.toString().substring(3, 6);
                                var numInnerCode = new Number(innerCode);
                                // if (numInnerCode != NaN && InnerCodes.BeginIndex <= numInnerCode && InnerCodes.EndIndex >= numInnerCode){
                                if (InnerCodes.indexOf(innerCode) > -1) {
                                    codeFormat = SystemResponseCodes[TranslateI18N.lang][innerCode]
                                        ? SystemResponseCodes[TranslateI18N.lang][innerCode]
                                        : PoultryCommonResponseCodes[TranslateI18N.lang][innerCode];
                                } else {
                                    codeFormat = ResponseCodes[TranslateI18N.lang][m.code];
                                }
                                // 消息模板中没有格式化占位符时，不走格式化逻辑
                                if (!codeFormat.match(/\$[a-zA-Z]+/g)) {
                                    message.push(info + codeFormat);
                                    msg = info + codeFormat;
                                } else {
                                    /*  增加错误码兼容，
                                        如果 m.format 中没有数据，并且 codeFormat 包含 '$ENTITY'，
                                        则取 m.name 作为默认数据加入 m.format 数组
                                    zb 2021年1月28日15:55:10
                                */
                                    if (
                                        m.name != '' &&
                                        m.format &&
                                        m.format.length == 0 &&
                                        codeFormat.search('\\$ENTITY') >= 0
                                    ) {
                                        m.format.push({ key: '$ENTITY.' + m.name, value: '', op_type: '', extra: null });
                                    }
                                    // 8. 验证是否需要FROMAT输出
                                    if (m.format) {
                                        // 9. 遍历format
                                        m.format.map((f) => {
                                            // 10. 判断FORMAT KEY类型
                                            const types = f.key.split('.');
                                            const $key = `\\${f.key}(?![A-Za-z])`;
                                            switch (types[0]) {
                                                // 实体
                                                case '$ENTITY':
                                                    // 示例1：$ENTITY.EarNumber
                                                    // 示例2：$ENTITY.EarNumber.VALUE
                                                    // FORMAT KEY 有VALUE 将 KEY 替换为 VALUE
                                                    // FORMAT KEY 无VALUE 将 KEY 替换为 Column 列名
                                                    if (types[2] === 'VALUE') {
                                                        codeFormat = codeFormat.replace(
                                                            /\$ENTITY/gm,
                                                            takeOne
                                                                ? f.value
                                                                : `<span style='color:#F8787D'>${f.value}</span>`
                                                        );
                                                    } else if (types[1]) {
                                                        // 修改前的源代码，不做删除，方式修改出现问题，及时回滚
                                                        // codeFormat = codeFormat.replace(
                                                        //     /\$ENTITY/gm,
                                                        //     takeOne
                                                        //         ? columns.find(m => {
                                                        //               return m.dataField == types[1];
                                                        //           }).caption
                                                        //         : `<span style='color:#F8787D'>${
                                                        //               columns.find(m => {
                                                        //                   return m.dataField == types[1];
                                                        //               }).caption
                                                        //           }</span>`
                                                        // );
                                                        codeFormat = codeFormat.replace(
                                                            /\$ENTITY/gm,
                                                            takeOne
                                                                ? columns.find((m) => {
                                                                    return m.dataField == types[1];
                                                                }).caption
                                                                : //主要修改部分
                                                                //用数据 format 的 key 与 $ENTITY 后跟随字段匹配
                                                                columns.some((x) => x.dataField == types[1])
                                                                ? //如果数据 format 的 key 等于 $ENTITY 后跟随字段，则直接替换
                                                                `<span style='color:#F8787D'>${
                                                                    columns.find((m) => {
                                                                        return m.dataField == types[1];
                                                                    }).caption
                                                                }</span>`
                                                                : //如果数据 format 的 key 不等于 $ENTITY 后跟随字段，
                                                                //则用数据 format 的 key 的全小写 与 $ENTITY 后跟随字段的全小写匹配
                                                                columns.some(
                                                                    (x) =>
                                                                        x.dataField.toLocaleLowerCase() ==
                                                                        types[1].toLocaleLowerCase()
                                                                )
                                                                ? //匹配到则替换赋值
                                                                `<span style='color:#F8787D'>${
                                                                    columns.find((m) => {
                                                                        return (
                                                                            m.dataField.toLocaleLowerCase() ==
                                                                            types[1].toLocaleLowerCase()
                                                                        );
                                                                    }).caption
                                                                }</span>`
                                                                : //匹配不到则赋值空串，页面友好交互，不会展示出 $ENTITY 字样
                                                                ''
                                                        );
                                                    } else {
                                                        codeFormat = codeFormat.replace(
                                                            /\$ENTITY/gm,
                                                            takeOne
                                                                ? columns.find((m) => {
                                                                    return m.dataField == types[1];
                                                                }).caption
                                                                : `<span style='color:#F8787D'>${
                                                                    columns.find((m) => {
                                                                        return m.dataField == types[1];
                                                                    }).caption
                                                                }</span>`
                                                        );
                                                    }
                                                    break;
                                                // 枚举
                                                case '$ENUM':
                                                    // 示例1：$ENUM.PigType.Sow 直接取值
                                                    // 示例2：$ENUM.PigType 从VALUE中获取实际值
                                                    let enumValue = '';
                                                    if (types[2]) {
                                                        enumValue = ResponseCodeEnumMap[`${types[1]}`][`${types[2]}Text`];
                                                    } else {
                                                        enumValue = ResponseCodeEnumMap[`${types[1]}`][`${f.value}Text`];
                                                    }
                                                    codeFormat = codeFormat.replace(
                                                        new RegExp($key, 'gm'),
                                                        takeOne
                                                            ? enumValue
                                                            : `<span style='color:#F8787D'>${enumValue}</span>`
                                                    );
                                                    break;
                                                // 自定义
                                                case '$CUST':
                                                case '$Henhouse':
                                                case '$PRODUCT_ZL':
                                                    codeFormat = codeFormat.replace(
                                                        new RegExp($key, 'gm'),
                                                        takeOne ? f.value : `${f.value}`
                                                    );
                                                    break;
                                                default:
                                                    codeFormat = codeFormat.replace(
                                                        new RegExp($key, 'gm'),
                                                        takeOne ? f.value : `<span style='color:#F8787D'>${f.value}</span>`
                                                    );
                                                    break;
                                            }
                                        });
                                    }
                                    info += codeFormat;
                                    message.push(info);
                                }
                            });
                        });
                        return {
                            status: false,
                            data: null,
                            message: takeOne ? message[0] : message,
                            msg: msg,
                        };
                    // } else if (suffixNumInnerCode != NaN && InnerCodes.BeginIndex <= suffixNumInnerCode && InnerCodes.EndIndex >= suffixNumInnerCode) {
                    } else if (InnerCodes.indexOf(suffixCode) > -1) {
                        // 如果不是返回多条错误，读取备份错误码做消息兼容
                        return {
                            status: false,
                            data: null,
                            message: [
                                SystemResponseCodes[TranslateI18N.lang][suffixCode]
                                    ? SystemResponseCodes[TranslateI18N.lang][suffixCode]
                                    : PoultryCommonResponseCodes[TranslateI18N.lang][suffixCode],
                            ],
                            msg: ''
                        };
                    } else {
                        return {
                            status: false,
                            data: null,
                            message: [ResponseCodes[TranslateI18N.lang][result.code]],
                            msg: ''
                        };
                    }
                }else{
                    return {
                        status: false,
                        data: null,
                        message: [ResponseCodes[TranslateI18N.lang][result.code]],
                        msg: ''
                    };
                }
        }
    }
}
/**
 * 请求异常时的处理
 */
export class ResponseError {
    static handler(e) {
        switch (e.status) {
            case 0:
            default:
                return i18n_response_error_handler.unknow;
        }
    }
}
export class SpecificError {
    /** 错误行索引 */
    index: number;
    /** 具体错误 */
    columns: SpecificErrorFormatter[];
}
export class SpecificErrorFormatter {
    /** */
    index: number;
    /** 字段名称 */
    name: string;
    /** 错误值 */
    value: string;
    /** 错误信息枚举 */
    format?: Array<{ key: string; value: string; op_type: string; extra: any }> = [];
    /** 错误码 */
    code: number;
    msg?: string;
    data?: any;
}
