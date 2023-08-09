import { LanguageType, NxTranslateI18N } from './../../nxin/i18n/index';
import { Injectable } from '@angular/core';
import zlwConsts from '../../../locale/i18n/const';

@Injectable()
export class ZlwColumnContentTranslator {
    getColumnContent(key: string): string {
        if (!zlwConsts || zlwConsts.length <= 0) {
            return null;
        }
        const result = zlwConsts.find(c => c.key === key);

        if (!result) {
            return key;
        }

        switch (NxTranslateI18N.lang) {
            case LanguageType.vi:
                return result.vi;
            case LanguageType.en:
                return result.en;
            default:
                return result.zh;
        }
    }
}
