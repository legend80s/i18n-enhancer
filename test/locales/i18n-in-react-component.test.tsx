import React from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { render } from '@testing-library/react';

import { enhance } from '../../src/react-i18next';

type ITranslationsEn = typeof import('./en').default;

const { useT } = enhance<ITranslationsEn>(useTranslation);

describe('i18n in React component zh-CN', () => {
  it('should return the correct zh translation', () => {
    const ShoppingCart: React.FC = () => {
      const { t, i18n } = useT();

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
