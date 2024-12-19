import React from 'react';
import * as reactI18N from 'react-i18next';
import { render } from '@testing-library/react';
import { enhance } from '../../src/react-i18next';
import i18n from './i18n';

const { useT } = enhance({
  i18n,
  reactI18N,
});

type ITranslationsEn = typeof import('./en').default;

describe('i18n', () => {
  it('should return the correct zh translation', () => {
    const ShoppingCart: React.FC = () => {
      const { t, i18n } = useT<ITranslationsEn>();

      expect(i18n.resolvedLanguage).toBe('zh');
      expect(i18n.languages).toEqual(['zh']);
      expect(i18n.language).toBe('zh');

      expect(t('common.action.确认')).toBe('确认');
      expect(t('common.action.取消')).toBe('取消');
      expect(t('common.status.加载中...')).toBe('加载中...');

      expect(t('shopping.去支付')).toBe('去支付');
      expect(t('shopping.orderSummaryText')).toBe('请确认您的订单信息');
      expect(t('shopping.总共', { total: 100 })).toBe('总共 100 元');

      return <></>;
    };

    render(<ShoppingCart />);
  });
});
