import { ToEqual } from './variable';

export const RemoveRepeat = (arr: any[]) => {
  const newarr: any[] = [];

  arr.forEach((item) => {
    if (newarr.findIndex((newitem) => ToEqual(item, newitem)) === -1) {
      newarr.push(item);
    }
  });
  return newarr;
};

export const FindCommon = <T = any>(arrA: T[], arrB: T[]): T[] => {
  const newarr: T[] = [];

  if (arrA.length > arrB.length) {
    [arrA, arrB] = [arrB, arrA];
  }

  arrA.forEach((item) => {
    if (arrB.findIndex((newitem) => ToEqual(item, newitem)) !== -1) {
      newarr.push(item);
    }
  });

  return newarr;
};
