<script setup lang="ts">
import { Animate, cubicBezier } from '@/utils/animation';
import { useDebounceFn, useMockScrollDrag, useThrettleFn } from '@/utils/hooks';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import Scrollbar from './Scrollbar.vue';

interface ScrollViewProps {
  direction?: 'x' | 'y' | 'both';
  scrollBehavior?: 'auto' | 'scroll' | 'hidden';

  customScrollbar?: string;
  transformBoxClass?: string;

  border?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  dataType?: string;
  slide?: boolean;
  slideOption?: {
    threshold: number;
    distance: (i: number) => number;
  };
}

interface ScrollViewEmits {
  (event: 'click', e: Event): void;
  (
    event: 'touchBorder',
    type: {
      direction: ['top' | 'bottom' | '', 'left' | 'right' | ''];
      mouseState: 'up' | 'move' | 'down';
    }
  ): void;
  (
    event: 'scroll',
    e: Event,
    scrollState: {
      mouseState: 'up' | 'move' | 'down';
      scroll: {
        x: number;
        y: number;
      };
    }
  ): void;
}

const props = withDefaults(defineProps<ScrollViewProps>(), {
  direction: 'y',
  scrollBehavior: 'auto'
});
const emits = defineEmits<ScrollViewEmits>();

const scrollRef = ref<HTMLDivElement>();

/**
 * transform 滚动位置
 * movement 滑动记录
 */
const transform = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
const movement = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
const scrolls = reactive<{ clientX: number; scrollX: number; clientY: number; scrollY: number }>({
  clientX: 0,
  scrollX: 0,
  clientY: 0,
  scrollY: 0
});
const position = reactive<['top' | 'bottom' | '', 'left' | 'right' | '']>(['', '']);
const parentScroll = ref<HTMLDivElement | null>(null);
const selfMouseDown = ref(false);
const getParentScroll = (div: HTMLElement | undefined) => {
  if (div === undefined) {
    return null;
  }
  let current: HTMLElement = div;
  let maxloop = 100;
  while (current.parentElement && maxloop) {
    if (current !== div && current.dataset.component === 'scrollView') {
      return current as HTMLDivElement;
    }
    maxloop--;
    current = current.parentElement;
  }
  return null;
};
const showScrollX = computed(
  () =>
    props.direction !== 'y' &&
    props.scrollBehavior !== 'hidden' &&
    (props.scrollBehavior === 'scroll' || scrolls.scrollX > scrolls.clientX)
);
const showScrollY = computed(
  () =>
    props.direction !== 'x' &&
    props.scrollBehavior !== 'hidden' &&
    (props.scrollBehavior === 'scroll' || scrolls.scrollY > scrolls.clientY)
);
/**
 * 计算滚动结束位置
 */
const limitPosition = (
  top: number,
  left: number,
  border: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } = {}
) => {
  // 限制滚动位置
  const retPos = {
    top: top,
    left: left
  };

  // init border
  !border?.top && (border.top = 0);
  !border?.bottom && (border.bottom = 0);
  !border?.left && (border.left = 0);
  !border?.right && (border.right = 0);

  if (!scrollRef.value) return retPos;

  /**
   *
   * ** 公式说明 **
   *
   * 顶部出现空白，有以下公式
   *
   * transform.y < 0; 得 transform.y -> 0;
   *
   * 顶部没有空白，有 transform.y > 0;
   *
   *  此时 当 **内容节点** 高度小于 **容器节点** 有
   *    scrollHeight === clientHeight
   *    transform.y -> 0;
   *
   *  当 **内容节点** 高度大于 **容器节点** 有
   *    scrollHeight === **内容节点** 高度
   *
   *    底部空白出现 有 transform.y + clientHeight > scrollHeight
   *               即 transform.y > scrollHeight - clientHeight
   *
   * 保留状态 有 0 < transform.y < scrollHeight - clientHeight
   *
   */

  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollRef.value;

  if (left <= -1 * border.left) {
    retPos.left = -1 * border.left;
    // 当内容高度小于滚动视区高度时可能会带来的问题
    // } else if (scrollWidth === clientWidth) {
    //   retPos.left = 0;
  } else if (left >= border.right + scrollWidth - clientWidth) {
    retPos.left = border.right + scrollWidth - clientWidth;
  }

  if (top <= -1 * border.top) {
    retPos.top = -1 * border.top;
    // } else if (scrollHeight === clientHeight) {
    //   retPos.top = 0;
  } else if (top >= border.bottom + scrollHeight - clientHeight) {
    retPos.top = border.bottom + scrollHeight - clientHeight;
  }

  return retPos;
};

/**----------------------------预滚动------------------------------ */
/**
 * 计算边界触碰情况
 * @param from [top, left]
 * @param transform [top, left]
 * @param border
 */
const preScrollAndLimitborderPosition = (
  from: [number, number],
  transform: [number, number],
  border: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } = {}
) => {
  const premove = limitPosition(from[0] + transform[0], from[1] + transform[1], border);
  const b = ['', ''];
  // 预移动 - 起始 = 实际移动距离;
  // 边界触碰条件：预计移动距离不为0，实际移动距离为0，根据预计移动方向确定触碰边界
  if (transform[0] !== 0 && premove.top - from[0] === 0) {
    // 纵向触碰
    if (transform[0] > 0) {
      b[0] = 'top';
    } else {
      b[0] = 'bottom';
    }
  }

  if (transform[1] !== 0 && premove.left - from[1] === 0) {
    // 横向触碰
    if (transform[1] > 0) {
      b[1] = 'left';
    } else {
      b[1] = 'right';
    }
  }

  return {
    pos: premove,
    border: b as ['top' | 'bottom' | '', 'left' | 'right' | '']
  };
};

// 用于清除动画，保存动画的id
const clearAnimate = ref<number>(0);

/**
 * 调用该函数实现滚动效果，每次调用会清除上一个动画
 */
const ScrollToAnimate = (
  pos: { top: number; left: number; behavior?: 'smooth' },
  duration: number = 500
) => {
  /**
   * 没有 smooth 直接跳转
   */
  if (pos.behavior !== 'smooth') {
    transform.x = pos.left;
    transform.y = pos.top;
    return;
  }

  const thisFlag = clearAnimate.value + 1;
  clearAnimate.value = thisFlag;

  const animate = Animate({
    duration: duration,
    groups: [
      {
        start: transform.x,
        end: pos.left
      },
      {
        start: transform.y,
        end: pos.top
      }
    ],
    timeFunc: cubicBezier(0, 0.6, 0.63, 0.96)
  });

  const ScrollTo = (): void => {
    const results = animate();

    transform.x = results.groups[0];
    transform.y = results.groups[1];

    if (!results.progress.end && thisFlag === clearAnimate.value && mouseState.value === 'up') {
      requestAnimationFrame(() => ScrollTo());
    }
  };

  ScrollTo();
};

const ScrollByAnimate = (
  pos: { top: number; left: number; behavior?: 'smooth' },
  duration: number = 500
) => {
  /**
   * 没有 smooth 直接跳转
   */
  if (pos.behavior !== 'smooth') {
    transform.x += pos.left;
    transform.y += pos.top;
    return;
  }

  const thisFlag = clearAnimate.value + 1;
  clearAnimate.value = thisFlag;

  const animate = Animate({
    duration: duration,
    groups: [
      {
        start: 0,
        end: pos.left
      },
      {
        start: 0,
        end: pos.top
      }
    ],
    timeFunc: 'linear'
  });

  const ScrollBy = (): void => {
    const results = animate();

    const limit = preScrollAndLimitborderPosition(
      [transform.y, transform.x],
      [results.groups[1], results.groups[0]]
    ).pos;

    transform.x = limit.left;
    transform.y = limit.top;

    if (!results.progress.end && thisFlag === clearAnimate.value && mouseState.value === 'up') {
      requestAnimationFrame(ScrollBy);
    }
  };

  ScrollBy();
};

// 复位
const resetWhenBlankVisible = () =>
  ScrollToAnimate({
    ...limitPosition(transform.y, transform.x),
    behavior: 'smooth'
  });

// 复位防抖
const resetWhenBlankVisibleDebounce = useDebounceFn(resetWhenBlankVisible);

// 滚动条位置和滚动距离的相关系数，用于保证在使用滚轮滚动时，空白部分的比例
const blankWidthCoefficient = (coe: number = 0.5) => {
  // 保证空白部分不会被扯开太多，有系数 1 - top / coe * CH
  const coefficient = {
    x: 1,
    y: 1,
    border: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  };

  if (!scrollRef.value || coe === 0) return coefficient;

  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = scrollRef.value;

  coefficient.border.left = clientWidth * coe;
  coefficient.border.right = clientWidth * coe;
  coefficient.border.top = clientHeight * coe;
  coefficient.border.bottom = clientHeight * coe;

  // top b
  if (transform.y < 0 || scrollHeight === clientHeight) {
    coefficient.y = 1 + transform.y / (coe * clientHeight);
  } else if (transform.y > scrollHeight - clientHeight) {
    // bottom b
    coefficient.y = 1 - (transform.y + clientHeight - scrollHeight) / (coe * clientHeight);
  }

  // left b
  if (transform.x < 0 || scrollWidth === clientWidth) {
    coefficient.x = 1 - transform.x / (coe * clientWidth);
  } else if (transform.x > scrollWidth - clientWidth) {
    // right b
    coefficient.x = 1 - (transform.x + clientWidth - scrollWidth) / (coe * clientWidth);
  }

  return coefficient;
};

const doSlide = () => {
  /**
   * 一般movement普通滑动不超过10
   * 快速滑动会高达30
   */
  const defaultSlide = 23;
  let slideFlag = false;

  // 自定义滑动阈值
  let x = transform.x,
    y = transform.y;

  if (Math.abs(movement.x) > ((props.slideOption && props.slideOption.threshold) || defaultSlide)) {
    slideFlag = true;
    x -= props.slideOption ? props.slideOption.distance(movement.x) : 30 * movement.x;

    ScrollToAnimate({
      ...limitPosition(y, x),
      behavior: 'smooth'
    });
  }

  if (Math.abs(movement.y) > ((props.slideOption && props.slideOption.threshold) || defaultSlide)) {
    slideFlag = true;
    y -= props.slideOption ? props.slideOption.distance(movement.y) : 30 * movement.y;

    ScrollToAnimate({
      ...limitPosition(y, x),
      behavior: 'smooth'
    });
  }

  movement.x = 0;
  movement.y = 0;
  return slideFlag;
};

// 默认支持Y轴滚动
const handleWheel = (e: WheelEvent) => {
  const coefficient = blankWidthCoefficient(0);

  const limitedBorderPosition = preScrollAndLimitborderPosition(
    [transform.y, transform.x],
    [e.deltaY * coefficient.y, e.deltaY * coefficient.x],
    coefficient.border
  );

  // 处理滚动上，使用transform
  if (
    (props.direction === 'y' || props.direction === 'both') &&
    limitedBorderPosition.border[0] === ''
  ) {
    e.stopPropagation();
    ScrollByAnimate({ top: e.deltaY * coefficient.y, left: 0, behavior: 'smooth' }, 100);
  }

  if (props.direction === 'x' && limitedBorderPosition.border[1] === '') {
    e.stopPropagation();
    ScrollByAnimate({ top: 0, left: e.deltaY * coefficient.x, behavior: 'smooth' }, 100);
  }

  emits('scroll', e, {
    mouseState: mouseState.value,
    scroll: transform
  });

  // 事件来自于鼠标滚轮
  if (mouseState.value === 'up') {
    resetWhenBlankVisibleDebounce();
  }
};

const cancelMove = ref(false);

// 阻止移动的点击事件
const onClickCapture = (e: Event) => {
  if (cancelMove.value) {
    e.stopImmediatePropagation();
    e.stopPropagation();
  }

  cancelMove.value = false;
};

/**
 * @todo
 */
const syncTransform = (x: number, y: number) => {
  transform.x = limitPosition(0, transform.x + (x * scrolls.scrollX) / scrolls.clientX).left;
  transform.y = limitPosition(transform.y + (y * scrolls.scrollY) / scrolls.clientY, 0).top;
};

const { mouseState } = useMockScrollDrag(scrollRef, {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moveMethod(pos, _t, e) {
    // 在一次移动事件中可以通过e传递信息，不同事件中使用同一个e
    if (!e.payload) {
      e.payload = {};
    }
    // 首先检查是否是自身事件, 如果不是查看是否被冒泡
    if (!selfMouseDown.value && (!e.payload?.border || e.payload!.border?.join('') === ''))
      return false;

    // 移动过
    cancelMove.value = true;

    // 预滚动
    let coefficient = blankWidthCoefficient();

    if (scrollRef.value && parentScroll.value) {
      coefficient = blankWidthCoefficient(0);
    }

    const limitedBorderPosition = preScrollAndLimitborderPosition(
      [transform.y, transform.x],
      [-pos.calcMovementY * coefficient.y, -pos.calcMovementX * coefficient.x],
      props.border || coefficient.border
    );

    /**
     * 对于自身事件，直接处理，然后抛出溢出部分
     * 对于非自身事件，处理溢出部分
     */
    if (
      (selfMouseDown.value || e.payload!.border[1] !== '') &&
      (props.direction === 'x' || props.direction === 'both')
    ) {
      transform.x = limitedBorderPosition.pos.left;
    }
    if (
      (selfMouseDown.value || e.payload!.border[0] !== '') &&
      (props.direction === 'y' || props.direction === 'both')
    ) {
      transform.y = limitedBorderPosition.pos.top;
    }

    // 只有手动才处理边界函数
    if (props.border) {
      const copy: ['top' | 'bottom' | '', 'left' | 'right' | ''] = [...position];
      if (limitedBorderPosition.border[0] === copy[0]) {
        copy[0] = '';
      }
      if (limitedBorderPosition.border[1] === copy[1]) {
        copy[1] = '';
      }
      position[0] = limitedBorderPosition.border[0];
      position[1] = limitedBorderPosition.border[1];
      if (copy[0] !== '' || copy[1] !== '') {
        emits('touchBorder', { direction: copy, mouseState: mouseState.value });
      }
    }
    movement.x = pos.calcMovementX;
    movement.y = pos.calcMovementY;

    e.payload!.border = limitedBorderPosition.border;
  },
  mouseUp() {
    // 滚动scrollTo函数会取消其他上一个动画，当滑动触发时，不重置空白，滑动本身保证不出现空白
    if (!props.slide || !doSlide()) {
      resetWhenBlankVisible();
    }
    selfMouseDown.value = false;
  },
  mouseMove() {},
  stopPropagation() {
    return false;
  },
  mouseDown(e) {
    cancelMove.value = false;
    parentScroll.value = getParentScroll(scrollRef.value);
    // 判断点击源是否是本身
    const first = e.target ? getParentScroll(e.target as HTMLElement) : null;
    if (first === null || first === scrollRef.value) {
      selfMouseDown.value = true;
    } else {
      selfMouseDown.value = false;
    }
  }
});

// 计算滚动条高度
const calcSrollBarHeight = useThrettleFn(() => {
  if (!scrollRef.value) return;
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = scrollRef.value;
  // X
  if (transform.x < 0) {
    scrolls.scrollX = scrollWidth + transform.x;
  } else {
    scrolls.scrollX = scrollWidth;
  }
  scrolls.clientX = clientWidth;
  // Y
  if (transform.y < 0) {
    scrolls.scrollY = scrollHeight + transform.y;
  } else {
    scrolls.scrollY = scrollHeight;
  }
  scrolls.clientY = clientHeight;
});

defineExpose({
  scrollTo: ScrollToAnimate,
  scrollBy: ScrollByAnimate,
  getScroll: () => ({ x: transform.x, y: transform.y })
});

onMounted(() => {
  // 初始化滚动条长度
  calcSrollBarHeight();

  window.removeEventListener('resize', calcSrollBarHeight);

  if (props.scrollBehavior && props.scrollBehavior !== 'hidden') {
    window.addEventListener('resize', calcSrollBarHeight);
  }
});

// 无条件尝试清除监听器
onUnmounted(() => {
  window.removeEventListener('resize', calcSrollBarHeight);
});
</script>
<template>
  <div
    class="scroll-container"
    ref="scrollRef"
    data-component="scrollView"
    :data-type="dataType"
    @click="(e:Event) => emits('click',e)"
    @click.capture="onClickCapture"
    @wheel="handleWheel"
  >
    <div
      :class="{
        'horizontal-flow': direction === 'x',
        [transformBoxClass || '']: transformBoxClass
      }"
      :style="{
        transform: `translate(${-1 * transform.x}px, ${-1 * transform.y}px)`
      }"
    >
      <slot></slot>
    </div>
    <!-- extra slot 用于处理不限制不受滚动影响，但受父元素影响的元素 -->
    <slot name="extra"></slot>
    <!-- 滚动条位置依赖于外部 -->
    <Scrollbar
      v-show="showScrollX"
      by="x"
      :direction="{ client: scrolls.clientX, scroll: scrolls.scrollX }"
      :distance="transform.x"
      :customScrollbar="customScrollbar || ''"
      @sync-transform="syncTransform"
      @reset-when-blank-visible="resetWhenBlankVisible"
    />
    <Scrollbar
      v-show="showScrollY"
      by="y"
      :direction="{ client: scrolls.clientY, scroll: scrolls.scrollY }"
      :distance="transform.y"
      :customScrollbar="customScrollbar || ''"
      @sync-transform="syncTransform"
      @reset-when-blank-visible="resetWhenBlankVisible"
    />
  </div>
</template>

<style scoped lang="less">
.scroll-container {
  position: relative;
  margin-right: 5px;
  overflow: hidden;
}
.horizontal-flow {
  display: inline-block;
  height: 100%;
  white-space: nowrap;
}
</style>
