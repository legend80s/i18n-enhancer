<h1 align="center">🌍 i18n-enhancer</h1>

> 🛡️ 翻译即类型，让国际化开发更安全、更高效、代码更少！
>
> Make internationalization as **type safe 🛡️** and **DX joyful 🥳** as it's meant to be!

本工具是 `react-i18next` 和 `i18next` 的类型增强器，它给 `useTranslate` 提供了 **精确的类型**，使得 **key** 和 **插值变量名** 能有智能提示，这些类型均来自你提供的翻译文本。这就是“**翻译即类型**”。

## 安装 📦

```bash
npm install react-i18next i18next --save

npm install react-i18next-enhancer --save
```

## 使用 📝

### `react-i18next` 用户

#### 1. 初始化 `react-i18next`

```typescript
// src/locales/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhLocale from './zh/index.ts';
import enLocale from './en/index.ts';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enLocale,
    },
    zh: {
      translation: zhLocale,
    },
  },
  lng: 'zh',
  fallbackLng: 'zh',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

增加 `parseMissingKeyHandler` 可以减少冗余翻译：

```diff typescript
+ import { getLast } from 'i18n-enhancer/utils';

i18n.use(initReactI18next).init({
  ...

+  // 当翻译键不存在时，返回键最后一部分作为默认值，意味着如果你用中文做键那么你无需再添加中文翻译
+  parseMissingKeyHandler: (key, defaultValue) => {
+    return defaultValue ?? getLast(key);
+  },
});
```

#### 2. 创建 `react-i18next` **enhancer**

```typescript
import React from 'react';
import * as reactI18N from 'react-i18next';
import { enhance } from 'i18n-enhancer/react-i18next';

import initializedI18N from '@/locales/i18n';

// 导入你不常开发的的语言翻译包。比如你的应用是面向中文用户，则导入英语即可。
// 好处：类型推导会帮助你检测出没有英文翻译的 Key，其次如果你采用中文当做key，则无需提供中文翻译，
// 因为我们已经设置好了 `parseMissingKeyHandler` 当 key 不存在将用其最后一部分当做翻译兜底。
type ITranslationsEn = typeof import('./en').default;

const enhancer = enhance({
  reactI18N,
  i18n: initializedI18N,
});
```

### 3. 使用 `useT` 替代 `useTranslation`

> `useT` 是 `useTranslation` 的类型增强版，它使用你的**翻译键**作为入参类型，**翻译值**作为返回类型。

```typescript
const { useT } = enhancer;

const Shopping: React.FC = () => {
  const { t } = useT<ITranslationsEn>();

  return (<main>
    <div>{t('shopping.去支付')}</div>
    <div>{t('shopping.orderSummaryText')}</div>
    <div>{t('shopping.总共', { total: 100 })}</div>
  </main>);
};
```

### 4. 魔法开启

当我们使用 `i18n-enhancer` 的 `useT`。

```diff
- const { t } = useTranslation();
+ const { t } = useT<ITranslationsEn>();
```

假如我们的翻译如下：

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
  // 无需提供中文翻译，你可以尝试注释下面一行，因为我们之前设置的 `parseMissingKeyHandler` 将会用点最后的部分当做兜底翻译。 是不是很棒！
  'shopping.去支付': '去支付',
  'shopping.orderSummaryText': '请确认您的订单信息',
  'shopping.总共': '总共 {{ total }} 元',
} as const
```

当你输入 `t('shopping.` 你会看到所有翻译的 key 都会提示出来。

![image](todo)

并且如果你的光标悬浮到 `t` 函数上，你会看到如下提示：

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

## 更多 API

`useT` 返回的 `i18n` 可以在非 React 组件中使用，对原始 `i18n` 做了类型和功能增强：

- 其 `i18n.t` 函数也是类型安全的，
- 以及提供了常用的 API，如 `isEnglish`。

其他 API 仍然来自原始的 `i18n`。

```typescript
// Node.js 使用
const { i18n } = useT<ITranslationsEn>();

i18n.changeLanguage('en');
i18n.isEnglish; // true
i18n.t('shopping.checkout'); // Checkout
```
