/**
 * 校验两个变量是否相等
 * @param a
 * @param b
 * @returns
 */
export const ToEqual = (a: any, b: any): boolean => {
  if (typeof a !== typeof b) return false;
  if (['string', 'number', 'boolean'].includes(typeof a)) {
    return a === b;
  }
  if (a instanceof Array && b instanceof Array) {
    if (a.length === b.length) {
      return a.every((item: any, index: number) => ToEqual(item, b[index]));
    }
    return false;
  } else if (a instanceof Object && b instanceof Object) {
    const keyA = Object.keys(a);
    const keyB = Object.keys(b);
    // 先检查keys
    if (keyA.length !== keyB.length || keyA.some((k) => !keyB.includes(k))) {
      return false;
    }
    return keyA.every((k) => ToEqual(a[k], b[k]));
  }
  return false;
};
