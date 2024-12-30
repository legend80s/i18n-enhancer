### 1. initialize `react-i18next`

[Optional] Add `parseMissingKeyHandler` to reduce redundant translations.

```diff typescript
// src/locales/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
+ import { getLast } from 'i18n-enhancer/utils';

i18n.use(initReactI18next).init({
  ...

+  // When the translation key is missing, return the last part of the key as the default value,
+  // which means if you use Chinese as the key, you don't need to add a Chinese translation.
+  parseMissingKeyHandler: (key, defaultValue) => {
+    return defaultValue ?? getLast(key);
+  },
});

export default i18n;
```

### 2. Create a `react-i18next` **enhancer**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { enhance } from 'i18n-enhancer/react-i18next';

type ITranslationsEn = typeof import('./en').default;

const enhancer = enhance<ITranslationsEn>(useTranslation);
```

<details>
<summary>Why import English Translations only</summary>

> Import translation packages for languages you don't frequently develop in.
>
>For example, if your app targets Chinese users, import English translations thus type inference will help you detect keys without English translations.
>
>Additionally, if you use Chinese as keys, there's no need to provide Chinese translations because we've set up `parseMissingKeyHandler` to use the last part of the key as a fallback translation when the key is missing.
</details>

### 3. Use `useT` instead of `useTranslation` in your components

> `useT` is a wrapper of `useTranslation` with type enhanced.
>
> It use your translated key as the params type and translated value as return type.

```typescript
const { useT } = enhancer;

const Shopping: React.FC = () => {
  const { t, /*i18n*/ } = useT<ITranslationsEn>();

  // i18n is the raw i18next instance. You can use it to change language.
  // i18n.changeLanguage('en');

  return (<main>
    <div>{t('shopping.去支付')}</div>
    <div>{t('shopping.orderSummaryText')}</div>
    <div>{t('shopping.总共', { total: 100 })}</div>
  </main>);
};
```

### 4. Magic happens

We use `useT` from `i18n-enhancer` instead of `useTranslation` from `react-i18next` and the magic happens.

```diff
- const { t } = useTranslation();
+ const { t } = useT<ITranslationsEn>();
```

Suppose our translation text is as follows:

```typescript
// en
{
  'shopping.去支付': 'Checkout',
  'shopping.orderSummaryText': 'Please review your order details below.',
  'shopping.总共': 'Total {{ total }} RMB',
} as const
```

```typescript
// zh
{
  // 'shopping.去支付': '去支付', // we use `getLast` to extract text from key so no need to provide translation for Chinese. What a efficient way!
  'shopping.orderSummaryText': '请确认您的订单信息',
  'shopping.总共': '总共 {{ total }} 元',
} as const
```

When you type `t('shopping.` all translation keys will be prompted.

If you hover over the `t` function, you will see the following prompts:

```typescript
t('shopping.去支付'): 'Checkout'; 
t('shopping.orderSummaryText'): 'Please review your order details below.';
```

**Yes it reflects the translated text** instead of just `string`! (Of course, `as const` must applied).

How about the interpolation variables?

```typescript
t('shopping.总共', { total: number }): 'Total {{ total }} RMB';
```

Yes again the interpolation variables are hinted as well.

**It is truly i18n type safe 🛡️.**

Certainly `<Shopping />` will rendered as expected:

for English:

```jsx
<main>
  <div>Checkout</div>
  <div>Please review your order details below.</div>
  <div>Total 100 RMB</div>
</main>
```

for Chinese:

```jsx
<main>
  <div>去支付</div>
  <div>请确认您的订单信息</div>
  <div>总共 100 元</div>
</main>
```
