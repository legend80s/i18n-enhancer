import {
  formatMessage as format,
  /* type */ MessageDescriptor,
  /* type */ MessageValue,
} from 'umi-plugin-react/locale';
import { useTranslation } from 'react-i18next';
import rawI18n from '@/locales/i18n';
import type { Fields } from '/src/utils';

/**
 * @deprecated 请使用 useT
 * 请从该文件导入 `formatMessage`，而不是从 `umi-plugin-react/locale`。
 *
 * 因为改方法对其做了改良（功能没有变化，做了强类型提示）：
 * - 能智能提示 id，完全避免 id 写错的可能性
 * - 最全面的 id，有些 key 可能只有英文或中文有，对其做并集。多出来 159 个 key（2024-5-23）
 */
export function formatMessage(
  messageDescriptor: IdTypedMessageDescriptor,
  values?: Record<string, MessageValue>
): string {
  return format(messageDescriptor, values);
}

// 只需要import英文即可，反而可以检测出没有翻译的 key
type ITranslationsEn = typeof import('@/locales/en-US').default;
// type ITranslationsZh = typeof import('@/locales/zh-CN').default;
type ITranslations = ITranslationsEn;

type ITranslationKeys = keyof ITranslations;

type IdTypedMessageDescriptor = Omit<MessageDescriptor, 'id'> & {
  id: ITranslationKeys;
};

/**
 * 基于 react-i18next `useTranslation` 的封装，功能没有变化，做了强类型提示）：能自动提示 id，避免 id 写错。
 *
 * `t('common.action.title')` 因为嵌套暂不支持
 * @returns
 */
export function useT() {
  const { t, i18n, ...rest } = useTranslation();
  type ISecondParamOfT = Parameters<typeof t>[1];
  type IValues<T extends string> = Fields<T> & ISecondParamOfT;

  const powerfulT = <K extends ITranslationKeys>(
    id: K,
    /* 插值内容，对象形式 */
    // @ts-expect-error 因为 key 存在对象（不推荐的写法应当平铺），此处 ignore 也没有关系还是能正确推导
    values?: IValues<ITranslations[K]>
  ): ITranslations[K] => t(id, values) as ITranslations[K];

  return {
    t: powerfulT,

    resolvedLanguage: i18n.resolvedLanguage,

    isEnglish: i18n.resolvedLanguage?.includes('en'),

    i18n,

    ...rest,
  };
}

type IPowerfulT = ReturnType<typeof useT>['t'];

// @ts-expect-error
const t: IPowerfulT = (...args) => {
  return rawI18n.t(...args);
};

/**
 * 类型加强后的 i18n 实例
 */
export const i18n = {
  ...rawI18n,
  t,
  isEnglish: rawI18n.resolvedLanguage?.includes('en'),
};
