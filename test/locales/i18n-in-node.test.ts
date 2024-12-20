import initializedI18n from './i18n';
import { enhanceI18n } from '../../src/react-i18next';

type ITranslationsEn = typeof import('./en').default;

const i18n = enhanceI18n<ITranslationsEn>(initializedI18n);

describe('i18n in Node.js', () => {
  it('should return the correct zh translation', () => {
    // const { i18n } = enhancer;
    const t = i18n.t;
    // const t = i18n.t<ITranslationsEn>;

    expect(t('common.action.取消')).toBe('取消');
    // @ts-expect-error
    expect(t('common.action.取消x')).toBe('取消x');
    expect(t('shopping.总共', { total: 100 })).toBe('总共 100 元');
    // @ts-expect-error
    expect(t('shopping.总共', { num: 100 })).toBe('总共 {{ total }} 元');

    expect(i18n.t('common.action.取消')).toBe('取消');
    // @ts-expect-error
    expect(i18n.t('common.action.取消x')).toBe('取消x');
    // @ts-expect-error
    expect(i18n.t('shopping.总共', { num: 100 })).toBe('总共 {{ total }} 元');
    expect(i18n.t('shopping.总共', { total: 100 })).toBe('总共 100 元');

    expect(i18n.resolvedLanguage).toBe('zh');
    expect(i18n.languages).toEqual(['zh']);
    expect(i18n.language).toBe('zh');

    expect(i18n.t('common.action.确认')).toBe('确认');
    expect(i18n.t('common.status.加载中...')).toBe('加载中...');

    expect(i18n.t('shopping.去支付')).toBe('去支付');
    expect(i18n.t('shopping.orderSummaryText')).toBe('请确认您的订单信息');
  });

  it('should return the correct en translation', () => {
    const t = i18n.t;
    i18n.changeLanguage('en');

    expect(i18n.resolvedLanguage).toBe('zh');
    expect(i18n.languages).toEqual(['zh']);
    expect(i18n.language).toBe('zh');

    expect(t('common.action.确认')).toBe('Confirm');
    expect(t('common.action.取消')).toBe('Cancel');
    expect(t('common.status.加载中...')).toBe('Loading...');

    expect(t('shopping.去支付')).toBe('Checkout');
    expect(t('shopping.orderSummaryText')).toBe(
      'Please review your order details below.'
    );
    expect(t('shopping.总共', { total: 100 })).toBe('Total 100 RMB');
  });
});
