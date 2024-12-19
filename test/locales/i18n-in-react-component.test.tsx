import React from 'react';

import { useT } from '../../src/react-i18next/helper/i18n';
import { render } from '@testing-library/react';

// const confirm = i18n.t('common.action.确认');

// console.log('confirm:', confirm);
// 只需要import英文即可，反而可以检测出没有翻译的 key
// 其次中文一般无需翻译，因为可以直接 key 中的中文
// 故此处只import英文
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
      expect(t('shopping.总共')).toBe('总共');

      return <></>;
    };

    render(<ShoppingCart />);
  });
});
