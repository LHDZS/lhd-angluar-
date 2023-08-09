// devextreme 国际化
import zhMessages from 'devextreme/localization/messages/zh.json';
import enMessages from 'devextreme/localization/messages/en.json';
import viMessages from 'devextreme/localization/messages/vi.json';
import { locale, loadMessages,formatDate } from 'devextreme/localization';
// ant design 国际化
import { en_US, zh_CN, vi_VN } from 'ng-zorro-antd/i18n';
// 组件国际化
import { NxComponentI18N } from './type';
import * as zh from './lang/zh.json';
import * as en from './lang/en.json';
import * as vi from './lang/vi.json';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
/** 支持的国际化语言类型 */
export enum LanguageType {
    zh = 'zh',
    zh_cn = 'zhcn',
    en = 'en',
    vi = 'vi',
}

/**
 * 组件国际化
 */
export class NxTranslateI18N {
    /** 国际化源数据 */
    static I18N: NxComponentI18N;
    /** 语言 */
    static lang: LanguageType;
    /** 默认语言 */
    static default: LanguageType = LanguageType.zh_cn;
    /** 初始化语言 */
    static initialization(lang?: LanguageType) {
        if (lang) {
            this.switch(lang);
        } else {
            this.switch(this.default);
        }
    }
    /** 语言切换 */
    static switch(lang: LanguageType) {
        switch (lang) {
            case LanguageType.zh:
                this.set(zh.default, lang);
                loadMessages(zhMessages);
                break;
            case LanguageType.zh_cn:
                this.set(zh.default, LanguageType.zh);
                loadMessages(zhMessages);
                break;
            case LanguageType.en:
                this.set(en.default, lang);
                loadMessages(enMessages);
                break;
            case LanguageType.vi:
                this.set(vi.default, lang);
                loadMessages(viMessages);
                break;
            default:
                throw new Error(`Can not support this language type: ${lang}`);
        }
        locale(this.lang);
    }
    /** 赋值 */
    private static set(i18nSource: any, lang: LanguageType) {
        this.I18N = i18nSource;
        this.lang = lang;
    }
    /** 通过key获取国际化翻译内容 */
    static get(key: string) {
        try {
            const splitKeys = key.split('.');
            let value = this.I18N;
            splitKeys.map((m) => {
                value = value[m];
            });
            return value;
        } catch (error) {
            throw new Error(error);
        }
    }
    /** 支持 Ant design */
    static get supportAntDesign() {
        switch (this.lang) {
            case LanguageType.zh:
            case LanguageType.zh_cn:
                return zh_CN;
            case LanguageType.en:
                return en_US;
            case LanguageType.vi:
                return vi_VN;
            default:
                throw new Error(`Can not support this language type: ${this.lang}`);
        }
    }
}

/**
 * 国际化翻译管道
 */
@Pipe({
    name: 'NxI18nTranslate',
})
export class NxTranslatePipeService implements PipeTransform {
    constructor() {}
    transform(key) {
        if (key) {
            if (typeof key === 'string') {
                return NxTranslateI18N.get(key);
            } else {
                throw new Error('[NxTranslatePipeService] Transform key must be type String.');
            }
        } else {
            throw new Error('[NxTranslatePipeService] Transform key is not defined.');
        }
    }
}
@NgModule({
    imports: [],
    declarations: [NxTranslatePipeService],
    exports: [NxTranslatePipeService],
})
export class NxTranslateModule {}
