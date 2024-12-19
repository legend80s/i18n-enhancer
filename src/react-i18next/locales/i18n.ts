import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhLocale from './zh-CN';
import enLocale from './en-US';
import { getLast } from '/src/utils';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLocale,
    },
    zh: {
      translation: zhLocale,
    },
  },
  lng: localStorage.getItem('lang') || 'zh', // if you're using a language detector, do not define the lng option
  fallbackLng: 'zh',

  interpolation: {
    escapeValue: false,
  },

  // saveMissing: true,
  // missingKeyHandler: (lngs, ns, key) => {
  //   console.info(`Missing translation: ${lngs}/${ns}/${key}`);
  // },

  // 当翻译键不存在时，返回键最后一部分作为默认值，意味着如果你用中文做键那么你无需再添加中文翻译
  parseMissingKeyHandler: (key, defaultValue) => {
    return defaultValue ?? getLast(key);
  },
});

/**
 * @deprecated 请使用类型加强后的 src/utils/i18n 示例
 */
export default i18n;
