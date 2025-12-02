type Neg<x extends number> = Sub<0, x>;

type IsNegative<N extends number> =
  `${N}` extends `-${string}`
    ? true
    : false;

type Rev<x extends string> =
  x extends `${infer head}${infer tail}`
    ? `${Rev<tail>}${head}`
    : "";

type ParseInt<x extends any> =
  x extends `${infer res extends number}`
    ? res
    : never;

type TrimZeros<x extends string> =
  x extends "0"
    ? x
    : x extends `0${infer res extends string}`
      ? TrimZeros<res>
      : x;

type StrLen<x extends string> =
  x extends `${infer _}${infer tail}`
    ? Succ<StrLen<tail>>
    : 0;

type PrecPartial<x extends string> =
  x extends `${infer head extends number}${infer tail}`
    ? head extends 0
      ? `9${PrecPartial<tail>}`
      : `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][head]}${tail}`
    : never;

type SuccPartial<x extends string> = x extends "9"
  ? "01"
  : x extends `${infer head extends number}${infer tail}`
  ? head extends 9
    ? `0${SuccPartial<tail>}`
    : `${[1, 2, 3, 4, 5, 6, 7, 8, 9][head]}${tail}`
  : never;

export type Prec<x extends number> =
  x extends 0
    ? -1
    : `${x}` extends `-${infer abs}`
      ? ParseInt<`-${Rev<SuccPartial<Rev<abs>>>}`>
      : ParseInt<TrimZeros<Rev<PrecPartial<Rev<`${x}`>>>>>;

type Succ<x extends number> =
  x extends -1
    ? 0
    : `${x}` extends `-${infer abs}`
      ? ParseInt<`-${TrimZeros<Rev<PrecPartial<Rev<abs>>>>}`>
      : ParseInt<TrimZeros<Rev<SuccPartial<Rev<`${x}`>>>>>;

type Sub<T extends number, U extends number> =
  `${U}` extends `-${infer UAbs extends number}`
    ? Add<T, UAbs>
    : U extends 0
      ? T
      : Sub<Prec<T>, Prec<U>>;

type Add<T extends number, U extends number> =
  `${U}` extends `-${infer UAbs extends number}`
    ? Sub<T, UAbs>
    : U extends 0
      ? T
      : Add<Succ<T>, Prec<U>>;

type Mul<T extends number, U extends number, Res extends number = 0> =
  U extends 0
    ? Res
    : `${U}` extends `-${infer UAbs extends number}`
      ? Mul<T, UAbs, Res> extends infer P extends number
        ? Neg<P>
        : never
      : Mul<T, Prec<U>, Add<Res, T>>;

type Div<T extends number, U extends number, Q extends number = 0> =
  U extends 0
    ? never
    : `${U}` extends `-${infer UAbs extends number}`
      ? Neg<Div<T, UAbs, Q>>
      : IsNegative<T> extends true
        ? Neg<Div<Neg<T>, U, Q>>
        : `${Sub<T, U>}` extends `-${string}`
          ? Q
          : Div<Sub<T, U>, U, Succ<Q>>;

type Mod<T extends number, U extends number> =
  U extends 0
    ? never
    : `${U}` extends `-${infer UAbs extends number}`
      ? Mod<T, UAbs>
      : IsNegative<T> extends true
        ? Mod<Add<T, U>, U>
        : `${Sub<T, U>}` extends `-${string}`
          ? T
          : Mod<Sub<T, U>, U>;

type LessThan<T extends number, U extends number> =
  `${Sub<T, U>}` extends `-${string}` ? true : false;

type Equal<T extends number, U extends number> =
  Sub<T, U> extends 0 ? true : false;

type TenTo<k extends number, p extends number = 1> =
  k extends 0
    ? p
    : TenTo<Prec<k>, Mul<p, 10>>;

type SplitBy<x extends string, c extends string> =
  x extends `${infer head}${c}${infer tail}`
    ? [head, ...SplitBy<tail, c>]
    : x extends "" ? [] : [x];

type IsTwice<x extends number> =
  StrLen<`${x}`> extends infer d extends number
    ? Mod<d, 2> extends 1
      ? false
      : TenTo<Div<d, 2>> extends infer p extends number
        ? Equal<Div<x, p>, Mod<x, p>>
        : never
    : never;

type StartToEnd<start extends number, end extends number, total extends number> =
  LessThan<end, start> extends true
    ? total
    : StartToEnd<Succ<start>, end, IsTwice<start> extends true ? Add<total, start> : total>;

type AccTotal<part extends string, total extends number> =
  SplitBy<part, '-'> extends [infer a, infer b]
    ? [ParseInt<a>, ParseInt<b>] extends [infer start extends number, infer end extends number]
      ? StartToEnd<start, end, total>
      : never
    : never;

type Solve<parts extends string[], total extends number = 0, i extends number = 0> =
  i extends parts['length']
    ? total
    : Solve<parts, AccTotal<parts[i], total>, Succ<i>>;

type Input = "11-22,95-115";
type Splitted = SplitBy<Input, ','>;

// Small subset of sample input, as otherwise you hit memory capacity very quickly
type Res = Solve<Splitted>; // type Res = 132