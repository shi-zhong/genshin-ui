<script setup lang="ts">
import { ref, watch } from 'vue'

/**
 * 1. 该组件能够在没有外部值时，自主控制。
 * 2. 能够作为受控组件
 * 3. onchange事件在值变化时触发，无论是否是受控组件
 * 4. onclick事件在点击后(未禁用时)触发，返回true后值变化更新
 */

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    onText?: string
    offText?: string
    textSide?: 'left' | 'right'
    disable?: boolean
    size?: number
    defaultValue?: boolean
    onClick?: (n: boolean, switchValue: (n?: boolean) => void) => boolean | void
  }>(),
  {
    textSide: 'left',
    size: 20,
    disable: false,
    defaultValue: false
  }
)

const emits = defineEmits<{
  (e: 'update:modelValue', n: boolean): void
  (e: 'change', n: boolean): void
  (e: 'click', n: boolean, switchValue: (n?: boolean) => void): boolean | void
}>()

const enable = ref(true)
const innerValue = ref(props.defaultValue)
const timeout = ref(setTimeout(() => {}, 0))

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== undefined && props.modelValue !== innerValue.value) {
      emits('change', props.modelValue)
      innerValue.value = props.modelValue
    }
  }
)

const handleSwitch = (u: boolean, forceUpdate?: boolean) => {
  if (forceUpdate || (enable.value && !props.disable)) {
    if (u !== innerValue.value) emits('change', u)
    emits('update:modelValue', u)
    innerValue.value = u
    enable.value = false
    clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
      enable.value = true
    }, 500)
  }
}

const handleClick = () => {
  if (enable.value && !props.disable) {
    if (props.onClick) {
      return emits('click', !innerValue.value, (n) => handleSwitch(n ?? !innerValue.value, true))
    }
    handleSwitch(!innerValue.value)
  }
}
</script>

<template>
  <div
    :class="{
      switch: true,
      'switch-off': !innerValue,
      'switch-on': innerValue
    }"
    :style="{ '--base-height': `${size}px` }"
    @click="handleClick"
  >
    <div class="switch-btn"></div>
    <div class="switch-text" :style="textSide === 'left' ? 'right: 110%;' : 'left: 110%;'">
      {{ innerValue ? onText : offText }}
    </div>
  </div>
</template>

<style scoped lang="less">
.switch {
  &-off {
    --outline-color: var(--font-dark-gray);
    --switch-bgc: var(--font-light-gray);
    --btn-strike: color-mix(in srgb, var(--highlight-spe) 90%, black);
  }

  &-on {
    --outline-color: color-mix(in srgb, var(--highlight-spe) 80%, black);
    --switch-bgc: color-mix(in srgb, var(--highlight-spe) 90%, black);
    --btn-strike: var(--font-light-gray);
  }

  border: calc(0.08 * var(--base-height)) solid var(--outline-color);
  border-radius: 1000px;
  width: calc(2.5 * var(--base-height));
  height: var(--base-height, 30px);
  background: var(--switch-bgc);
  position: relative;
  transition: all 0.5s;

  &-text {
    font-size: calc(var(--base-height) / 1.5);
    position: absolute;
    color: var(--font-dark-gray);
    text-wrap: nowrap;
  }

  &-btn {
    height: 90%;
    margin: 2%;
    aspect-ratio: 1;
    background: var(--blank-white);
    border-radius: 50%;
    transition: all 0.5s;
    position: absolute;
    box-shadow: 0 0 10px var(--blank-white);

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 999px;
      width: 10%;
      transition: all 0.5s;
      background: var(--btn-strike);
    }
  }

  &-off > &-btn {
    left: 0;

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &::before,
    &::after {
      top: 50%;
      left: 50%;
      height: 60%;
    }
  }

  &-on > &-btn {
    left: 60%;

    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
      top: 51%;
      left: 58%;
      height: 62%;
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
      top: 60%;
      left: 30%;
      height: 30%;
    }
  }
}
</style>
