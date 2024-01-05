/**
 * 此文件保存和基础类型有关的类型定义和函数
 */

export type BasicVariableType =
  | number
  | string
  | symbol
  | undefined
  | null
  | Function
  | bigint
  | boolean;

export type BasicVariableTypeString =
  | 'number'
  | 'string'
  | 'symbol'
  | 'undefined'
  | 'null'
  | 'function'
  | 'bigint'
  | 'boolean';

export type BasicVariableTypeToString<T extends BasicVariableType> = T extends number
  ? 'number'
  : T extends string
  ? 'string'
  : T extends symbol
  ? 'symbol'
  : T extends undefined
  ? 'undefined'
  : T extends null
  ? 'null'
  : T extends Function
  ? 'function'
  : T extends bigint
  ? 'bigint'
  : T extends boolean
  ? 'boolean'
  : never;

export type RefVariableType = object;
export type RefVariableTypeString = 'Object' | 'Array';
export type RefVariableTypeToString<T extends object> = T extends Array<any>
  ? 'Array'
  : T extends Object
  ? 'Object'
  : never;

export type AllVariableType = BasicVariableType | RefVariableType;
export type AllVariableTypeString = BasicVariableTypeString | RefVariableTypeString;

export type ToVariableTypeString<T extends AllVariableType> = T extends BasicVariableType
  ? BasicVariableTypeToString<T>
  : T extends RefVariableType
  ? RefVariableTypeToString<T>
  : never;

export type ParameterArrayToVariableString<T extends Array<AllVariableType>> = T extends [
  infer P,
  ...infer Q
]
  ? P extends AllVariableType
    ? Q extends Array<AllVariableType>
      ? [ToVariableTypeString<P>, ...ParameterArrayToVariableString<Q>]
      : [ToVariableTypeString<P>]
    : []
  : [];

export type StringArrayToSingleString<T extends string[], R extends string = ''> = T extends [
  infer P,
  ...infer Q
]
  ? P extends string
    ? Q extends [string, ...any[]]
      ? `${P}${R}${StringArrayToSingleString<Q, R>}`
      : `${P}`
    : ''
  : '';

export type UnionToIntersection<T> = (T extends any ? (x: T) => void : never) extends (
  x: infer P
) => void
  ? P
  : never;

export type IntersectionToUnion<T> = (T extends any ? () => T : never) extends () => infer P
  ? P
  : never;

export const GetTrueType = (varible: any) => {
  const type = typeof varible;
  if (type === 'object') {
    if (varible === null) return 'null';
    return Object.prototype.toString.call(varible).slice(8, -1);
  } else {
    return type;
  }
};
