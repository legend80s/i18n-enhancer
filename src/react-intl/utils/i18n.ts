// 虽然未安装但是引入的是类型，运行时被擦除故可以安全使用
import { LocaleContext } from '@/ConfigProvider';
import { useContext } from 'react';

import { EN_US } from '@/locales/en-US';
import { ZH_CN } from '@/locales/zh-CN';
import * as reactIntlCore from 'react-intl';
import {
  type IntlCache,
  type IntlShape,
  type MessageDescriptor,
} from 'react-intl';
import type { ISupportedLocale } from '../ConfigProvider';
import { getLast, type FieldsSingleBrace } from '/src/utils';

const DEFAULT_LOCALE = 'zh-CN';
const label = '@neural/ui';
type ReactIntl = typeof import('react-intl');

let reactIntl: ReactIntl | undefined = undefined;

/**
 * 本组件库依赖 react-intl >= 6.6.8（createIntl / createIntlCache）。
 * 如果项目的 react-intl 版本太低，需要通过该函数注入高版本的 react-intl
 */
export function initReactIntl(intl: ReactIntl) {
  if (validateReactIntl(intl)) {
    reactIntl = intl;
  } else {
    console.error(`[${label}] initReactIntl 参数 intl 为空:`, intl);
  }
}

/**
 * 如果想要使用 <FormattedMessage />
 * const { IntlProvider } = getReactIntl()
 *
 * <IntlProvider messages={getTranslations('en')} locale="en" defaultLocale="en">
 *   <FormattedMessage id="myMessage" />
 * </IntlProvider>
 * @returns
 */
export function getReactIntl() {
  if (!reactIntl) {
    // console.info(`[${label}] reactIntl not exits import from "react-intl"`)

    reactIntl = reactIntlCore;
  }

  return reactIntl;
}

function validateReactIntl(intl: undefined | ReactIntl): intl is ReactIntl {
  if (!intl) {
    console.error(
      `[${label}] 使用组件前必须先全局 init **一次**: import { initReactIntl } from "@neural/ui"`
    );
    return false;
  }

  const { createIntl, createIntlCache } = intl;

  if (!createIntl || !createIntlCache) {
    console.error(
      `[${label}] createIntl, createIntlCache 不存在，组件库依赖 react-intl>=6.6.8，请确保在 initReactIntl 传入的 "react-intl" 版本号符合要求`
    );
    return false;
  }

  return true;
}

export function getTranslations(locale: ISupportedLocale) {
  if (locale === 'en' || locale === 'en-US') {
    return EN_US;
  }

  return ZH_CN;
}

let cache: undefined | IntlCache = undefined;

function generateIntl(lng: ISupportedLocale): IntlShape | undefined {
  if (!reactIntl) {
    // console.info(`[${label}] reactIntl not exits import from "react-intl"`)

    reactIntl = reactIntlCore;
  }

  if (!validateReactIntl(reactIntl)) {
    return;
  }

  const { createIntl, createIntlCache } = reactIntl;

  if (!cache) {
    // This is optional but highly recommended
    // since it prevents memory leak
    cache = createIntlCache();
  }

  return createIntl(
    {
      locale: lng,
      messages: getTranslations(lng),

      onError: () => {
        // do nothing
        // 已经通过 parseMissingKeyHandler 方法处理过，这里不需要再处理
        // console.log(`[${label}] i18n error:`, err)
      },
    },
    cache
  );
}

/**
 * 不推荐使用 react-i18n 或 react-intl 对应方法，请使用本文件导出的方法。
 *
 * 因为入参有提示（不仅能提示 key 而且能提示插值字段名） & 返回值也能精确显示对应的翻译文案。
 *
 * @param locale
 * @returns
 *
 * @example
 * const t = useTranslator('en-US')
 * const title = t('foo.bar') // 提示 foo.bar，鼠标 hover title 将显示对应的中文翻译
 *
 * // 如果 foo.bar 内部有插值，如 `你好，字段{{name}}缺少{{value}}"`
 * const title = t('foo.bar', { name: '密码'， value: '特殊字符' })
 * // 将提示 name 和 value
 */
export function useTranslator(locale?: ISupportedLocale) {
  const ctx = useContext(LocaleContext);

  const lng: string = locale ?? ctx.locale ?? DEFAULT_LOCALE;

  return createTranslator(lng);
}

/**
 * Imperative API 非组件内使用。组件内请使用 useTranslator。
 * @param locale
 * @returns
 *
 * @example
 * const t = createTranslator('en-US')
 * const title = t('foo.bar')
 */
export function createTranslator(locale: ISupportedLocale = 'zh-CN') {
  const intl = generateIntl(locale);

  type IValues<T extends string> = FieldsSingleBrace<T> &
    Parameters<IntlShape['formatMessage']>[1];

  return function translate<ID extends IKeys>(
    id: ID,
    values?: IValues<ITranslatedText<ID>>,
    descriptor?: Omit<MessageDescriptor, 'id'>
  ): ITranslatedText<ID> {
    if (!intl) {
      // @ts-expect-error
      return id;
    }

    const translated = intl.formatMessage(
      { id, ...descriptor },
      values
    ) as ITranslatedText<ID>;

    // @ts-expect-error
    if (translated !== id) {
      return translated;
    }

    // @ts-expect-error
    return parseMissingKeyHandler(id);
  };
}

function parseMissingKeyHandler(id: string): string {
  return getLast(id);
}

// 只有 en 而非 en + zh 好处是能保障一定有英文翻译（因为默认我们会测试中文但是会忽略英文）
type ITranslations = typeof EN_US;
type ITranslatedText<ID extends IKeys> = ITranslations[ID];

type IKeys = keyof ITranslations;
