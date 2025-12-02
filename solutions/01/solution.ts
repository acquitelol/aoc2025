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

type Sub<T extends number, U extends number, acc extends number[] = []> = `${U}` extends `-${infer UAbs extends number}`
  ? Add<T, UAbs>
  : acc['length'] extends U
    ? T
    : Sub<Prec<T>, U, [...acc, 0]>;

type Add<T extends number, U extends number, acc extends any[] = []> = `${U}` extends `-${infer UAbs extends number}`
  ? Sub<T, UAbs>
  : acc['length'] extends U
    ? T
    : Add<Succ<T>, U, [any, ...acc]>;

type Mul<T extends number, U extends number, Res extends number = 0, acc extends any[] = []> = acc['length'] extends U
  ? Res
  : Mul<T, U, `${T}` extends `-${infer TAbs extends number}`
    ? Sub<Res, TAbs>
    : Add<Res, T>, [any, ...acc]>;

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

type NextPos<pos extends number, lines extends string[], acc extends any[]> =
  lines[acc['length']] extends `${infer head extends string}${infer tail extends number}`
    ? Mod<Add<pos, Mul<head extends 'L' ? -1 : 1, tail>>, 100>
    : never;

type Solve<lines extends string[], pos extends number = 50, hits extends number = 0, acc extends number[] = []> =
    acc['length'] extends lines['length']
        ? hits
        : Solve<lines, NextPos<pos, lines, acc>, NextPos<pos, lines, acc> extends 0 ? Succ<hits> : hits, [0, ...acc]>

// I probably don't have enough memory to use the real input
type Out = Solve<[
    "L68",
    "L30",
    "R48",
    "L5",
    "R60",
    "L55",
    "L1",
    "L99",
    "R14",
    "L82",
]>