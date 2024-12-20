<h1 align="center">🌍 i18n-enhancer</h1>

英文 | [中文](https://github.com/legend80s/i18n-enhancer/blob/master/README-zh-CN.md)

> **Translation as type**, making i18n development **type safer**, more efficient, and with less code!
>
> Make your i18n DX journey as type safe 🛡️ and joyful 🥳 as it's meant to be!

## Features ✨

A `react-i18next` and `i18next` **enhancer** which enhances `useTranslate` by providing **precise types**, thus make **keys** and **interpolation variables** hinting possible in your IDE, among other enhancements.

- **Translation as type**：No additional type declaration required; simply provide the translation text to obtain an accurate type.
- **No runtime cost**：No runtime rewrite.
- **No extra bundle size**: Nothing added in runtime, just type enhancement, thus no extra bundle size.

## Installation 📦

```bash
npm install react-i18next i18next --save

npm install i18n-enhancer --save
```

## Usage 📝

in Component:

```diff typescript
import { useTranslation } from 'react-i18next';
+ import { enhance } from 'i18n-enhancer/react-i18next';
+ type ITranslationsEn = typeof import('./en').default;

+ const { useT } = enhance<ITranslationsEn>(useTranslation)

const Hello = () => {
- const { t } = useTranslation(...);
+ const { t } = useT(...);

  return <p>{t('hi')}</p>;
}
```

out of Component:

```diff typescript
import i18n from '@/src/locales/i18n';
+ import { enhanceI18n } from 'i18n-enhancer/react-i18next';
+ type ITranslationsEn = typeof import('./en').default;

+ const { t } = enhanceI18n<ITranslationsEn>(i18n)

function sayHello = () => {
- const { t } = i18n.t;

  return <p>{t('hi')}</p>;
}
```

## Example

### For `react-i18next`

#### 1. initialize `react-i18next`

Add `parseMissingKeyHandler` to reduce redundant translations.

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

#### 2. Create a `react-i18next` **enhancer**

```typescript
import React from 'react';
import * as reactI18N from 'react-i18next';
import { enhance } from 'i18n-enhancer/react-i18next';

import initializedI18N from '@/locales/i18n';

// Import translation packages for languages you don't frequently develop in.
// For example, if your app targets Chinese users, import English translations. 
// Benefits: Type inference will help you detect keys without English translations. 
// Additionally, if you use Chinese as keys, there's no need to provide Chinese translations because we've set up `parseMissingKeyHandler` to use the last part of the key as a fallback translation when the key is missing.
type ITranslationsEn = typeof import('./en').default;

const enhancer = enhance({
  reactI18N,
  i18n: initializedI18N,
});
```

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

## Constraints

### 1. Nested key not supported

For example:

```typescript
{
  shopping: {
    checkout: 'Checkout',
  }
}
```

We don't plan to support it, as we believe that flat `keys` are easier to find because they are defined and used in the same way, making them more readable.

### 2. Interpolation values cannot be determined as required params by inspecting translation text

> TypeScript is incapable in this case.

For example:

```typescript
{
  'shopping.checkout': 'Checkout {{ total }}',
}
```

```typescript
// no type error
t('shopping.checkout')

// only when invalid parameters are passed or insufficient parameters are provided.
t('shopping.checkout', { notExist: 100 })
```
