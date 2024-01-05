/**
 * 创建防抖函数, 这个函数可以在最终阶段执行不同的函数
 * @param callback 回调函数
 * @param wait 防抖触发阈值
 * @returns 防抖函数
 */
export const useDebounce = (wait?: number) => {
  let timeout = setTimeout(() => {}, 0);

  return <T extends (...argu: any[]) => void>(callback: T, ...rest: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...rest);
    }, wait || 250);
  };
};

/**
 * 创建防抖函数, 这个函数只能在最终阶段执行一个函数
 * @param callback 回调函数
 * @param wait 防抖触发阈值
 * @returns 防抖函数
 */
export const useDebounceFn = <T extends (...args: any[]) => void>(
  callback: T,
  wait: number = 25
) => {
  const debounce = useDebounce(wait);
  return (...rest: Parameters<T>) => debounce(callback, ...rest);
};

/**
 * 创建节流函数, 每次可以执行不同的函数
 * @param callback 回调函数
 * @param gap 节流间隔
 * @returns 节流函数
 */
export const useThrettle = (gap: number) => {
  let waiting = false;
  let fn = setTimeout(() => {}, 0);

  return <T extends (...args: any[]) => void>(callback: T, ...rest: Parameters<T>) => {
    if (waiting) {
      clearTimeout(fn);
      fn = setTimeout(() => {
        callback(...rest);
      }, gap || 100);
    } else {
      callback(...rest);
      waiting = true;
      clearTimeout(fn);
      setTimeout(() => {
        waiting = false;
      }, gap || 100);
    }
  };
};

/**
 * 创建节流函数， 只能使用同一个函数
 * @param callback 回调函数
 * @param gap 节流间隔
 * @returns 节流函数
 */
export const useThrettleFn = <T extends (...args: any[]) => void>(
  callback: T,
  gap: number = 100
) => {
  const threttle = useThrettle(gap);
  return (...rest: Parameters<T>) => threttle(callback, ...rest);
};
