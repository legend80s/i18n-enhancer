import type { FieldsDoubleBraces } from '../utils';

type I18n = typeof import('i18next').default;
type IReactI18N = typeof import('react-i18next');

type IParams = {
  reactI18N: IReactI18N;
  i18n: I18n;
};

export function enhance<T>(useTranslation: IReactI18N['useTranslation']) {
  return {
    /**
     * type enhanced `useTranslation` hook.
     */
    useT: (...args: IUseTranslationParams) => useT<T>(useTranslation, ...args),
  };
}

// eslint-disable-next-line no-unused-vars
// @ts-ignore
function _enhanceAll<TT>({ reactI18N, i18n: initializedI18n }: IParams) {
  // type ISecondParamOfT = Parameters<typeof initializedI18n.t>[1];
  // type IValues<T extends string> = FieldsDoubleBraces<T> & ISecondParamOfT;

  type IPowerfulT = ReturnType<typeof useT<TT>>['t'];

  // @ts-expect-error
  const t: IPowerfulT = (...args) => {
    // @ts-expect-error
    return initializedI18n.t(...args);
  };

  return {
    /**
     * type enhanced `useTranslation` hook.
     */
    useT: (...args: IUseTranslationParams) =>
      useT<TT>(reactI18N.useTranslation, ...args),

    /**
     * type enhanced `i18n` instance and with `resolvedLanguage` exposed and `isEnglish` added
     */
    i18n: {
      ...initializedI18n,

      /**
       * type enhanced `t` function.
       */
      t,

      /**
       * Is set to the current resolved language. It can be used as primary used language, for example in a language switcher.
       */
      resolvedLanguage: initializedI18n.resolvedLanguage,

      /**
       * Return true if the resolved language is English.
       */
      isEnglish: isEnglish(initializedI18n.resolvedLanguage),
    },
  };
}

type IUseTranslationFunction = typeof import('react-i18next')['useTranslation'];
type IUseTranslationParams = Parameters<IUseTranslationFunction>;

/**
 * A wrapper for `useTranslation` from react-i18next, adding **precise type** to both **input and return params** so to prompt all keys and prevent key misspelling.
 *
 * 基于 react-i18next `useTranslation` 的封装，功能没有变化，做了强类型提示：能自动提示 id，避免 id 写错。
 */
function useT<ITranslations>(
  useTranslation: IUseTranslationFunction,
  ...args: IUseTranslationParams
) {
  type ITranslationKeys = keyof ITranslations;

  const { t, i18n, ...rest } = useTranslation(...args);
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
    /**
     * type enhanced `t` function.
     */
    t: powerfulT,

    /**
     * Is set to the current resolved language. It can be used as primary used language, for example in a language switcher.
     */
    resolvedLanguage: i18n.resolvedLanguage,

    /**
     * Return true if the resolved language is English.
     */
    isEnglish: isEnglish(i18n.resolvedLanguage),

    /** raw `i18n` returned by `useTranslation` not type enhanced, just return it for use-case unforeseen */
    i18n,
    ...rest,
  };
}

// type IPowerfulTFunction<T> = ReturnType<typeof useT<T>>['t'];
// type IPowerfulTParameters<T> = Parameters<IPowerfulTFunction<T>>;
// type IPowerfulTReturnType<T> = ReturnType<IPowerfulTFunction<T>>;

/**
 * 类型加强后的 i18n 实例
 */
export const enhanceI18n = <T>(initializedI18n: I18n) => {
  type IPowerfulT = ReturnType<typeof useT<T>>['t'];

  // @ts-expect-error
  const t: IPowerfulT = (...args) => {
    // @ts-expect-error
    return initializedI18n.t(...args);
  };

  return {
    ...initializedI18n,

    /**
     * type enhanced `t` function.
     */
    t,

    /**
     * Is set to the current resolved language. It can be used as primary used language, for example in a language switcher.
     */
    resolvedLanguage: initializedI18n.resolvedLanguage,

    /**
     * Return true if the resolved language is English.
     */
    isEnglish: isEnglish(initializedI18n.resolvedLanguage),
  };
};

function isEnglish(lang = ''): boolean {
  return /^en\-?/.test(lang);
}
