import { useTranslation } from 'react-i18next';
import rawI18n from '../../../test/locales/i18n';
import type { FieldsDoubleBraces } from '../../utils';

/**
 * 基于 react-i18next `useTranslation` 的封装，功能没有变化，做了强类型提示）：能自动提示 id，避免 id 写错。
 *
 * `t('common.action.title')` 因为嵌套暂不支持
 * @returns
 */
export function useT<ITranslations>() {
  // 只需要import英文即可，反而可以检测出没有翻译的 key
  // type ITranslationsEn = typeof import('@/locales/en-US').default;
  // type ITranslationsZh = typeof import('@/locales/zh-CN').default;
  // type ITranslations = ITranslationsEn;
  type ITranslationKeys = keyof ITranslations;

  const { t, i18n, ...rest } = useTranslation();
  type ISecondParamOfT = Parameters<typeof t>[1];
  type IValues<T extends string> = FieldsDoubleBraces<T> & ISecondParamOfT;

  const powerfulT = <K extends ITranslationKeys>(
    id: K,
    /* 插值内容，对象形式 */
    // @ts-expect-error 因为 key 存在对象（不推荐的写法应当平铺），此处 ignore 也没有关系还是能正确推导
    values?: IValues<ITranslations[K]>
  ): ITranslations[K] =>
    // @ts-expect-error
    t(id, values) as ITranslations[K];

  return {
    t: powerfulT,

    resolvedLanguage: i18n.resolvedLanguage,

    isEnglish: i18n.resolvedLanguage?.includes('en'),

    i18n,

    ...rest,
  };
}

type IPowerfulTFunction<T> = ReturnType<typeof useT<T>>['t'];

type IPowerfulTParameters<T> = Parameters<IPowerfulTFunction<T>>;
type IPowerfulTReturnType<T> = ReturnType<IPowerfulTFunction<T>>;

// xx@ts-expect-error
// const t: IPowerfulT<T> = <T>(...args) => {
//   // @ts-expect-error
//   return rawI18n.t(...args);
// };

/**
 * 类型加强后的 i18n 实例
 */
export const i18n = {
  ...rawI18n,
  t: <T>(...args: IPowerfulTParameters<T>): IPowerfulTReturnType<T> => {
    // @ts-expect-error
    return rawI18n.t(...args);
  },
  isEnglish: rawI18n.resolvedLanguage?.includes('en'),
};
