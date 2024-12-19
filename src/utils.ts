/**
 * @example
 * getLast('foo.placeholder.bar') // => 'bar'
 *
 * getLast('JSONInput.foo'); // => 'foo'
 * getLast('JSONInput.foo.bar'); // => 'bar'
 * getLast('bar'); // => 'bar'
 * getLast('bar..'); // => 'bar..'
 * getLast('bar...'); // => 'bar...'
 * getLast('foo.bar...'); // => 'bar...'
 * getLast('a.foo..bar...'); // => 'foo..bar...'
 */
export function getLast(input: string): string {
  // 匹配单独的 '.'，多个连续则不匹配
  // 通过前瞻断言(?<=xx)target & 后仰断言 target(?=xx) 可以让 split 只包含 target
  // 这样是为了处理翻译文本存在多个 '.' 的情况
  const aStandaloneDot = /(?<=[^.])\.(?=[^.])/;
  const match = input.split(aStandaloneDot);

  return match.pop()!;
}

/**
 * @example
 * type Bar = TrimStart<'    field'>
 */
type TrimStart<T extends string> = T extends ` ${infer R}` ? TrimStart<R> : T;
/**
 * @example
 * type Foo = TrimEnd<'field  '>
 */
type TrimEnd<T extends string> = T extends `${infer R} ` ? TrimEnd<R> : T;
/**
 * @example
 * type Baz = Trim<'    field  '>
 */
type Trim<T extends string> = TrimStart<TrimEnd<T>>;

/**
 * @example
 * type foo = Fields<'hello {{foo}} {{bar}}'>
 * // foo is `interface { hello: string; bar: string }`
 */
export type FieldsDoubleBraces<T extends string> = ArrToInterface<
  ExtractKeysDoubleBraces<T>
>;

export type FieldsSingleBrace<T extends string> = ArrToInterface<
  ExtractKeysSingleBrace<T>
>;

/**
 * @example
 * type foo = ExtractKeys<'hello {{foo}} {{bar}}'>
 * // foo is `["foo", "bar"]`
 */
type ExtractKeysDoubleBraces<
  T extends string,
  Keys extends any[] = []
> = T extends `${string}{{${infer K}}}${infer Rest}`
  ? ExtractKeysDoubleBraces<Rest, [...Keys, Trim<K>]>
  : Keys;

/**
 * @example
 * type foo = ExtractKeys<'hello {{foo}} {{bar}}'>
 * // foo is `["foo", "bar"]`
 */
type ExtractKeysSingleBrace<
  T extends string,
  Keys extends any[] = []
> = T extends `${string}{${infer K}}${infer Rest}`
  ? ExtractKeysSingleBrace<Rest, [...Keys, Trim<K>]>
  : Keys;

/**
 * @example
 * type foo = ArrToInterface<["foo", "bar"]>
 * // foo is `{"foo": string, "bar": string}`
 */
type ArrToInterface<A extends string[]> = { [P in A[number]]: number | string };
