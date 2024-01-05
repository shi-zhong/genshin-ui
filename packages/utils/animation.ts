/*
 * 动画曲线，即时间和动画进度的映射函数
 *
 * 通过输入动画的执行时间来决定动画的执行进程
 * 原始输入值 x 满足 0 < x < 1;
 * 原始输出值 y 满足 0 < y < 1;
 */

type AnimateTimeingFucntion = (x: number) => number;

export const linear: AnimateTimeingFucntion = (x: number) => x;

// 贝塞尔曲线
export const cubicBezier = (p1x: number, p1y: number, p2x: number, p2y: number) => {
  const ZERO_LIMIT = 1e-6;
  const ax = 3 * p1x - 3 * p2x + 1;
  const bx = 3 * p2x - 6 * p1x;
  const cx = 3 * p1x;
  const ay = 3 * p1y - 3 * p2y + 1;
  const by = 3 * p2y - 6 * p1y;
  const cy = 3 * p1y;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;

  function solveCurveX(x: number) {
    let t2 = x;
    let derivative;
    let x2;
    for (let i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < ZERO_LIMIT) {
        return t2;
      }
      derivative = sampleCurveDerivativeX(t2);
      if (Math.abs(derivative) < ZERO_LIMIT) {
        break;
      }
      t2 -= x2 / derivative;
    }
    let t0 = 0,
      t1 = 1;
    t2 = x;
    while (t1 > t0) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < ZERO_LIMIT) {
        return t2;
      }
      if (x2 > 0) {
        t1 = t2;
      } else {
        t0 = t2;
      }
      t2 = (t1 + t0) / 2;
    }

    return t2;
  }
  return (x: number) => sampleCurveY(solveCurveX(x));
};

export const ease = cubicBezier(0.25, 0.1, 0.25, 1);

export const easeIn = cubicBezier(0.42, 0, 1, 1);

export const easeOut = cubicBezier(0, 0, 0.58, 1);

export const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

const innerTimeFuncs = {
  linear,
  ease,
  easeIn,
  easeInOut,
  easeOut
};

type timeFunc = keyof typeof innerTimeFuncs;
/**
 * 创建一个持续一段时间的动画，每次调用闭包会返回一个当前动画进度用于调整动画
 * @param options 
 * @returns 
 */
export const Animate = (options: {
  duration: number;
  timeFunc: timeFunc | AnimateTimeingFucntion;
  groups: {
    start: number;
    end: number;
  }[];
}) => {
  const timestart = Date.now();

  const timeFunc =
    typeof options.timeFunc === 'function' ? options.timeFunc : innerTimeFuncs[options.timeFunc];

  return () => {
    const timeProgress = (Date.now() - timestart) / options.duration;
    const animateProgress = timeFunc(timeProgress);
    return {
      progress: {
        time: timeProgress,
        animate: animateProgress,
        end: timeProgress > 1
      },
      groups: options.groups.map(
        (group) => group.start + (group.end - group.start) * (animateProgress > 1 ? 1 : animateProgress)
      )
    };
  };
};
