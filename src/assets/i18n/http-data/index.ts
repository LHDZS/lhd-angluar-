import { LanguageType } from 'src/app/nxin/i18n';
import { TranslateI18N } from 'src/app/providers/i18n-translate';
import en from './en'
import vi from './vi'

export default () => {
  switch (TranslateI18N.lang) {
    case LanguageType.vi:
      return vi;
    default:
      return en;
  }
}
