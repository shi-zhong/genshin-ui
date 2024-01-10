<script setup lang="ts">
import { computed } from 'vue'
import { ElementPng } from '@/assets/elements'
import { Between } from '@/utils/math'
import Icon from '@@/Base/Icon'

interface PP {
  progress: number
}

interface PSP {
  stage: number
  parts: number
}

const props = defineProps<PP | PSP>()

const tProgress = computed(() => {
  let notLimit = 0

  if ((props as PP).progress !== undefined) {
    notLimit = (props as PP).progress
  } else {
    notLimit = (100 / (props as PSP).stage) * (props as PSP).parts
  }

  return Between(notLimit, 0, 100)
})

const toRealPercent = (o: number) => {
  const originLen = (420 * o) / 100
  const appendLen = Math.floor((o / 100) * 7) * 20 + 10
  return Between(((originLen + appendLen) / 56) * 10, 0, 100)
}
</script>

<template>
  <div class="loading">
    <div class="unload">
      <Icon
        v-for="ele of (Object.keys(ElementPng) as (keyof typeof ElementPng)[])"
        class="element"
        type="projection"
        color="rgb(245,245,245)"
        :size="60"
        :key="ele"
        :src="ElementPng[ele]"
        :alt="ele"
      />
    </div>
    <div
      class="loaded"
      :style="{
        width: `${toRealPercent(tProgress)}%`
      }"
    >
      <Icon
        v-for="ele of (Object.keys(ElementPng) as (keyof typeof ElementPng)[])"
        class="element"
        type="projection"
        color="rgb(102,102,102)"
        :size="60"
        :key="ele"
        :src="ElementPng[ele]"
        :alt="ele"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.loading {
  display: inline-block;
  position: relative;
}

.loaded {
  display: inline-block;
  position: absolute;
  top: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: 0.3s;
}

.element {
  margin: 10px;
}
</style>