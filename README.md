<h1 align="center">🌍 i18n-enhancer</h1>

英文 | [中文](https://github.com/legend80s/i18n-enhancer/blob/master/README-zh-CN.md)

> **Translation as type**, making i18n development **type safer 👮‍♂️**, more **efficient 🚀**, but with **less code**!
> Make your i18n DX journey as joyful 🥳 as it's meant to be!

## Features ✨

A `react-i18next` and `react-intl` enhancer which enhances `useTranslate` by providing **precise types**, thus make **keys** and **interpolation variables** hinting possible in your IDE, among other enhancements.

- **Translation as type**：No additional type declaration required; simply provide the translation text to obtain an accurate type.
- **No runtime cost**：No runtime rewrite.
- **No extra bundle size**: Nothing added in runtime, just type enhancement, thus no extra bundle size.

## Installation 📦

```bash
npm install i18n-enhancer --save
```

## Usage 📝

### react-i18next

```bash
npm install react-i18next i18next --save
```

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

<details>
<summary>Use in normal function</summary>

### Use in normal function

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

</details>

### react-intl

todo...

## Example

[react-i18next](https://github.com/legend80s/i18n-enhancer/blob/master/example-react-i18next.md) | [react-intl](https://github.com/legend80s/i18n-enhancer/blob/master/example-react-intl.md)

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

### 2. Interpolation values is always optional

The values cannot be determined as required params by inspecting translation text

because TypeScript's constraints.

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
