import { reactive } from 'vue';

export const useQueue = <T>() => {
  const queue = reactive<T[]>([]);

  const enQueue = (n: T) => {
    queue.push(n as any);
  };

  const deQueue = () => {
    return queue.shift();
  };

  const clear = () => {
    queue.length = 0;
  };

  return {
    clear,
    queue,
    enQueue,
    deQueue
  };
};
