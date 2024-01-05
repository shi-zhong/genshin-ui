<script setup lang="ts">
withDefaults(
  defineProps<{
    refine: number;
    refineEnd: boolean;
    text?: boolean;
    size?: number;
  }>(),
  {
    refine: 1,
    text: false,
    size: 20
  }
);
</script>

<template>
  <div :style="{ '--size': `${size}px` }">
    <div :class="['refine-container', refineEnd ? 'refine-end' : 'refine']">
      {{ refine }}
    </div>
    <span
      v-if="text"
      class="refine-text"
      >精炼{{ refine }}阶</span
    >
  </div>
</template>

<style scoped lang="less">
.refine {
  @defaultSize: 20px;
  &-container {
    width: var(--size, @defaultSize);
    height: var(--size, @defaultSize);
    text-align: center;
    line-height: var(--size, @defaultSize);
    font-size: calc(0.7 * var(--size, @defaultSize));
    border-radius: 3px;
    display: inline-block;
    margin-right: 10px;
  }
  &-text {
    color: rgb(203, 178, 124);
    font-size: calc(0.7 * var(--size, @defaultSize));
  }
  &-end {
    background: var(--rank-golden-bar);
    color: var(--starcolor);
  }
  background: var(--font-dark-gray);
  color: var(--blank-white);
}
</style>
