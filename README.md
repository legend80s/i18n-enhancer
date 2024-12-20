<h1 align="center">🌍 i18n-enhancer</h1>

> **Translation as type**, making i18n development **type safer**, more efficient, and with less code!
>
> Make your i18n DX journey as type safe 🛡️ and joyful 🥳 as it's meant to be!

A `react-i18next` and `i18next` **enhancer**.

It enhances `useTranslate` by providing **precise types**, thus make **keys** and **interpolation variables** hinting possible in your IDE, among other enhancements.

## Features ✨

- **Type-safe**: `useTranslate` returns a type-safe function.
- **Key hinting**: `useTranslate` returns a function that hints the keys.
- **Interpolation variables hinting**: `useTranslate` returns a function that hints the interpolation variables.
- **Key validation**: `useTranslate` returns a function that validates the keys.
- **Interpolation variables validation**: `useTranslate` returns a function that validates the interpolation variables.
- **Key auto-completion**: `useTranslate` returns a function that auto-completes the keys.
- Nothing added in runtime, just type enhancement, thus no extra bundle size.

## Installation 📦

```bash
npm install react-i18next i18next --save

npm install react-i18next-enhancer --save
```

## Usage 📝

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

假如我们的翻译文本如下：

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

当你输入 `t('shopping.` 你会看到所有翻译的 key 都会提示出来。

When you type `t('shopping.` all translation keys will be prompted.

![image](todo)

并且如果你的光标悬浮到 `t` 函数上，你会看到如下提示：

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

## 限制

### 1. 翻译不支持嵌套的键

比如：

```typescript
{
  shopping: {
    checkout: 'Checkout',
  }
}
```

也不打算支持，因为我们认为平铺的 `key` 更容易查找，因为定义和使用一样，可读性也更好。

### 2. 插值无法通过翻译确定是否必选

比如：

```typescript
{
  'shopping.checkout': 'Checkout {{total}}',
}
```

```typescript
// 不会提示类型错误
t('shopping.checkout')

// 只有传入不存在的参数，或参数不够才会提示类型错误
t('shopping.checkout', { notExist: 100 })
```

## Constraints

### 1. Translations do not support nested keys

For example:

```typescript
{
  shopping: {
    checkout: 'Checkout',
  }
}
```

We do not plan to support it because we believe flat `key` is easier to find because the definition and usage are the same, and the readability is also better.

### 2. Interpolation cannot determine whether the parameter is required through translation

For example:

```typescript
{
  'shopping.checkout': 'Checkout {{total}}',
}
```

```typescript
// No type error will be prompted
t('shopping.checkout')

// Only when the parameter does not exist or the parameter is not enough will the type error be prompted
t('shopping.checkout', { notExist: 100 })
```
