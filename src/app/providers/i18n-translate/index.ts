import { registerLocaleData } from '@angular/common/';
import * as zh from '../../../assets/i18n/zh.json';
import * as en from '../../../assets/i18n/en.json';
import * as vi from '../../../assets/i18n/vi.json';
import ngzh from '@angular/common/locales/zh';
import ngen from '@angular/common/locales/en';
import ngvi from '@angular/common/locales/vi';
import { Injectable, Pipe, PipeTransform, NgModule } from '@angular/core';
import { I18N } from './type';
import { en_US, zh_CN, vi_VN, NzI18nService } from 'ng-zorro-antd/i18n';
/** 国际化服务 */
@Injectable()
export class TranslateService {
  constructor(private i18n: NzI18nService) {
  }
  lang: string = 'zhcn';
  key: string = 'I18N_KEY';
  I18N: I18N;
  translate(lang: string) {
    this.lang = lang;
    TranslateI18N.lang = lang
    localStorage.setItem(this.key, lang);
    switch (lang) {
      case 'zhcn':
        this.I18N = zh.default;
        TranslateI18N.I18N = zh.default
        registerLocaleData(ngzh);
        this.i18n.setLocale(zh_CN);
        //this.i18n.setDateLocale(zh_CN);
        break;
      case 'en':
        this.I18N = en.default;
        TranslateI18N.I18N = en.default
        registerLocaleData(ngen);
        this.i18n.setLocale(en_US);
        //this.i18n.setDateLocale(en_US);
        break;
      case 'vi':
        this.I18N = vi.default;
        TranslateI18N.I18N = vi.default
        registerLocaleData(ngvi);
        this.i18n.setLocale(vi_VN);
        //this.i18n.setDateLocale(vi_VN);
        break;
      default:
        this.I18N = zh.default;
        TranslateI18N.I18N = zh.default
        registerLocaleData(ngzh);
        this.i18n.setLocale(zh_CN);
        //this.i18n.setDateLocale(zh_CN);
        break;
    }
  }
  initialization(lang) {
    if (!lang) {
      lang = "zhcn";
    }
    this.translate(lang);
  }
}

export class TranslateI18N {
  static I18N: I18N
  static lang: string
}

/** 国际化管道服务 */
@Pipe({
  name: 'I18nTranslate',
})
export class TranslatePipeService implements PipeTransform {
  constructor(private translator: TranslateService) {
    if (!this.translator) {
      throw new Error(
        '[TranslatePipeService] Can not find TranslateService instance, Are you register TranslateService?'
      );
    }
  }
  transform(key) {
    if (key) {
      if (typeof key === 'string') {
        const splitKeys = key.split('.');
        let value = this.translator.I18N;
        splitKeys.map((m) => {
          value = value[m];
        });
        return value;
      } else {
        throw new Error('[TranslatePipeService] Transform key must be type String.');
      }
    } else {
      throw new Error('[TranslatePipeService] Transform key is not defined.');
    }
  }
}
@NgModule({
  imports: [],
  declarations: [TranslatePipeService],
  exports: [TranslatePipeService],
})
export class TranslateModule { }
