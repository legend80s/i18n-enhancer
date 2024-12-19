import React from 'react';

import { useT } from '../../src/react-i18next/utils/i18n';
import { render, screen } from '@testing-library/react';

// const confirm = i18n.t('common.action.确认');

// console.log('confirm:', confirm);
// 只需要import英文即可，反而可以检测出没有翻译的 key
// 其次中文一般无需翻译，因为可以直接 key 中的中文
// 故此处只import英文
type ITranslationsEn = typeof import('./en').default;

describe('i18n', () => {
  it('should return the correct en translation', () => {
    const ShoppingCart: React.FC = () => {
      const { t, i18n } = useT<ITranslationsEn>();

      i18n.changeLanguage('en');

      expect(i18n.resolvedLanguage).toBe('en');
      expect(i18n.languages).toEqual(['en', 'zh']);
      expect(i18n.language).toBe('en');

      expect(t('common.action.确认')).toBe('Confirm');
      expect(t('common.action.取消')).toBe('Cancel');
      expect(t('common.status.加载中...')).toBe('Loading...');

      expect(t('shopping.去支付')).toBe('Checkout');
      expect(t('shopping.orderSummaryText')).toBe(
        'Please review your order details below.'
      );
      expect(t('shopping.总共', { total: 100 })).toBe('Total 100 RMB');
      return <></>;
    };

    render(<ShoppingCart />);
  });
});
