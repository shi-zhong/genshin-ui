<script setup lang="ts">
import { ref } from 'vue';

import { useMockScrollDrag } from '@/utils/hooks/elementEventRegister/mockScrollDrag';

interface ScrollbarProps {
  by: 'x' | 'y';
  customScrollbar: string;
  direction: { client: number; scroll: number };
  distance: number;
}

interface ScrollbarEmits {
  (e: 'syncTransform', x: number, y: number): void;
  (e: 'resetWhenBlankVisible'): void;
}

const props = defineProps<ScrollbarProps>();
const emits = defineEmits<ScrollbarEmits>();

const thumbRef = ref();

const emitsSyncTransform = (function () {
  if (props.by === 'x') return (e: any) => emits('syncTransform', e.calcMovementX, 0);
  else return (e: any) => emits('syncTransform', 0, e.calcMovementY);
})();

// 滚动事件只注册一次
useMockScrollDrag(thumbRef, {
  moveMethod(e) {
    emitsSyncTransform(e);
  },
  mouseUp() {
    emits('resetWhenBlankVisible');
  }
});
</script>

<template>
  <div :class="`${customScrollbar} scroll-track scroll-track-${by} `">
    <!-- 通过更新滚动视区的位置来间接更新滚动条 -->
    <div
      :class="`${customScrollbar} scroll-thumb scroll-thumb-${by}`"
      :style="`transform: translate${by.toUpperCase()}(${
        (distance * direction.client) / direction.scroll
      }px); ${by === 'x' ? 'width' : 'height'}:${direction.client ** 2 / direction.scroll}px;`"
      ref="thumbRef"
      @dragstart.stop.prevent="() => {}"
    ></div>
  </div>
</template>

<style scoped lang="less">
.scroll {
  @width: 5px;
  &-track {
    position: absolute;
    overflow: hidden;
    &-x {
      left: 0;
      bottom: 0;
      width: 100%;
      height: @width;
    }
    &-y {
      top: 0;
      right: 0;
      width: @width;
      height: 100%;
    }
  }
  &-thumb {
    background: rgba(217, 217, 217, 0.5);
    border-radius: 2px;
    &-x {
      height: @width;
      transition: 'width' 0.3s;
    }
    &-y {
      width: @width;
      transition: 'height' 0.3s;
    }

    &:hover {
      background: rgba(217, 217, 217, 0.8);
    }
  }
}
</style>
