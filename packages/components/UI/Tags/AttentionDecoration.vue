<script setup lang="ts">
defineProps<{ size?: number; n?: number }>()
</script>

<template>
  <div
    :class="{ 'decoration-attention': true, 'decoration-i': n === undefined || n === 0 }"
    :style="size ? { '--height': `${size}px` } : undefined"
  >
    {{ n !== undefined && n !== 0 ? n : '' }}
  </div>
</template>

<style scoped lang="less">
.decoration {
  &-attention {
    display: inline-block;
    overflow: hidden;

    height: var(--height, 100%);
    line-height: var(--height, 100%);
    aspect-ratio: 1;

    border-radius: 50%;
    text-align: center;
    font-weight: bolder;
    font-size: var(--height, 10px);
    color: rgb(235, 203, 196);
    background-color: rgb(255, 40, 40);
  }

  &-i {
    &::before {
      content: '';
      display: block;
      width: 26%;
      height: 52%;
      margin: 5% 37%;
      border-radius: 50%;
      background-color: rgb(235, 203, 196);
    }

    &::after {
      content: '';
      display: block;
      width: 25%;
      height: 25%;
      margin: 10% 37.5%;
      border-radius: 50%;
      background-color: rgb(235, 203, 196);
    }
  }
}
</style>
