<h1 align="center">🌍 i18n-enhancer</h1>

[英文](https://github.com/legend80s/i18ndash/blob/master/README.md) | 中文

> 🛡️ 翻译即类型，让国际化开发更安全、更高效、代码更少！
>
> Make internationalization as **type safe 🛡️** and **DX joyful 🥳** as it's meant to be!

## 特性 🌟

本工具是 `react-i18next` / `i18next` 的类型增强器，给 `useTranslate` 提供了 **精确的类型**，使得 **key** 和 **插值变量名** 能有智能提示，这些类型均来自你提供的翻译文本，你无需提供额外的类型。这就是“**翻译即类型**”。

- **翻译即类型**：无需额外类型声明，只需提供翻译文本，即可获得精确的类型。
- **不会增加运行时成本**：没有任何核心运行时修改。
- **不会增加额外包大小**：仅加了类型，因此不会额外增加包大小。

## 安装 📦

```bash
npm install react-i18next i18next --save

npm install react-i18next-enhancer --save
```

## 使用 📝

### `react-i18next` 用户

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

not in Component:

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

### 1. 初始化 `react-i18next`

[可选] 增加 `parseMissingKeyHandler` 减少冗余翻译：

```diff typescript
// src/locales/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
+ import { getLast } from 'i18n-enhancer/utils';

i18n.use(initReactI18next).init({
  ...

+  // 当翻译键不存在时，返回键最后一部分作为默认值，意味着如果你用中文做键那么你无需再添加中文翻译
+  parseMissingKeyHandler: (key, defaultValue) => {
+    return defaultValue ?? getLast(key);
+  },
});

export default i18n;
```

```typescript
// zh
{
  // 无需提供中文翻译，你可以尝试注释下面一行，因为设置了 `parseMissingKeyHandler` 会用点最后的部分当做兜底翻译。是不是很棒！
  'shopping.去支付': '去支付',

  'shopping.orderSummaryText': '请确认您的订单信息',
  'shopping.总共': '总共 {{ total }} 元',
} as const
```

### 2. 创建 `react-i18next` **enhancer**

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { enhance } from 'i18n-enhancer/react-i18next';

// 导入你不常开发的的语言翻译包。比如你的应用是面向中文用户，则导入英语即可。
// 好处：类型推导会帮助你检测出没有英文翻译的 Key，其次如果你采用中文当做key，则无需提供中文翻译，
// 因为我们已经设置好了 `parseMissingKeyHandler` 当 key 不存在将用其最后一部分当做翻译兜底。
type ITranslationsEn = typeof import('./en').default;

const { useT } = enhance<ITranslationsEn>(useTranslation);
```

### 3. 使用 `useT` 替代 `useTranslation`

> `useT` 是 `useTranslation` 的类型增强版，它使用你的**翻译键**作为入参类型，**翻译值**作为返回类型。

```typescript
const Shopping: React.FC = () => {
  const { t } = useT();

  return (<main>
    <div>{t('shopping.去支付')}</div>
    <div>{t('shopping.orderSummaryText')}</div>
    <div>{t('shopping.总共', { total: 100 })}</div>
  </main>);
};
```

**🧙‍♂️ 魔法开启**，当我们使用 `i18n-enhancer` 的 `useT`，假如我们的翻译如下：

```typescript
// en
{
  'shopping.去支付': 'Checkout',
  'shopping.orderSummaryText': 'Please review your order details below.',
  'shopping.总共': 'Total {{ total }} RMB',
} as const
```

当你输入 `t('shopping.` 你会看到所有翻译的 key 都会提示出来。
![image](https://github.com/user-attachments/assets/15fac1df-7e83-40e0-abc5-f20050c799ff)

并且如果你的光标悬浮到 `t` 函数上，你会看到如下提示：

```typescript
t('shopping.去支付'): 'Checkout'; 
t('shopping.orderSummaryText'): 'Please review your order details below.';
```

**是的，你会看到居然将翻译文本都反显出来了** 而不仅仅是普普通通的 `string`！（当然前提是翻译必须增加 `as const`）。

插值变量能否也提示？再来点小小的震撼，当输入以下代码，你会发现 `total` 这个变量名也会自动提示：

```typescript
t('shopping.总共', { total: number }): 'Total {{ total }} RMB';
```

**It is truly i18n type safe 🛡️.**

最后当然 `<Shopping />` 会按照预期渲染：

for English:

```jsx
<main>
  <div>Checkout</div>
  <div>Please review your order details below.</div>
  <div>Total 100 RMB</div>
</main>
```

在中文环境：

```jsx
<main>
  <div>去支付</div>
  <div>请确认您的订单信息</div>
  <div>总共 100 元</div>
</main>
```

## 更多 API

`enhance` 返回的 `i18n` 对原始 `i18n` 做了功能增强：

### `enhance().resolvedLanguage`

获取当前语言。

### `enhance().isEnglish: boolean`

判断当前语言是否是英文。

其他 API 仍然来自原始的 `i18n`，比如 `i18n.changeLanguage` 等仍然可以使用。

## FAQ

### 如何在非 React 组件中使用

比如 Node.js 中或普通函数中：

```typescript
import initializedI18n from '@src/locales/i18n';
import { enhanceI18n } from 'i18n-enhancer/react-i18next';

type ITranslationsEn = typeof import('./en').default;

const i18n = enhanceI18n<ITranslationsEn>(initializedI18n);

// 切换语言
i18n.changeLanguage('en');

// 判断当前语言是否是英文
i18n.isEnglish; // true

// 翻译
i18n.t('shopping.checkout'); // Checkout
```

## 限制

### 1. 不支持嵌套翻译

比如：

```typescript
{
  shopping: {
    checkout: 'Checkout',
  }
}
```

也不打算支持，因为我们认为平铺的 `key` 更容易查找，因为定义和使用一样，可读性也更好。

### 2. `t` 的第二个参数无法通过翻译内是否有插值来决定是否必选，一律可选

> TS 本身不支持

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
