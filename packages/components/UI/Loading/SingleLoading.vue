<script setup lang="ts">
import { ElementWebp } from '@/assets/elements'
import { ref } from 'vue'

withDefaults(
  defineProps<{
    loop?: number
    size?: number
  }>(),
  {
    loop: 2000,
    size: 60
  }
)

const current = ref(0)

const keys = Object.keys(ElementWebp) as (keyof typeof ElementWebp)[]
</script>
<template>
  <img
    class="single-loading"
    @animationiteration="() => (current = (current + 1) % 7)"
    :src="ElementWebp[keys[current]]"
    alt=""
    :style="{ '--single-transition-during': `${loop / 1000}s`, width: `${size}px` }"
  />
</template>

<style scoped lang="less">
.single-loading {
  animation: move-in-out var(--single-transition-during, 1s) infinite;
  @keyframes move-in-out {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
