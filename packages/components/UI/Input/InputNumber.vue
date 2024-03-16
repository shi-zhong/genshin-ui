<script setup lang="ts">
import { Between, LongPress } from '@/utils'
import Button from '../Button'
import { ref, watch, watchEffect } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    step?: number
    size?: number
    min?: number
    max?: number
    validate?: (n: number) => number | boolean
    longStep?: number
  }>(),
  {
    step: 1,
    min: -Infinity,
    max: Infinity,
    longStep: 10,
    size: 20
  }
)

const { vLong, clickCancel } = LongPress()
// 用于更新input自身
const inputModel = ref(props.modelValue)

const emits = defineEmits<{
  (event: 'update:modelValue', c: number): void
}>()

const updateValueWithValidate = (v: number) => {
  let n = v
  if (props.validate) {
    const validReturn = props.validate(v)
    if (typeof validReturn === 'number') {
      n = validReturn
    } else if (typeof validReturn === 'boolean' && !validReturn) {
      n = props.modelValue
    }
  }

  n = Between(n, props.min, props.max)

  inputModel.value = n
  emits('update:modelValue', n)
}

watch(
  [() => props.min, () => props.max, () => props.validate],
  () => {
    // @problem 如果多个组件控制同一个数据，根据组件在页面中的顺序，会导致先触发的组件的值被后触发的组件覆盖
    updateValueWithValidate(props.modelValue)
  },
  { immediate: true }
)

watchEffect(() => {
  inputModel.value = props.modelValue
})

watch(
  () => inputModel.value,
  () => {
    if (props.modelValue !== inputModel.value) updateValueWithValidate(inputModel.value)
  }
)
</script>

<template>
  <div class="number-input-container">
    <Button
      :style="{ '--size': `${size}px` }"
      v-long:500.repeat="() => updateValueWithValidate(modelValue - longStep)"
      type="shrink"
      icon="$reduce"
      shape="round"
      :disable="modelValue <= min"
      @click="clickCancel(() => updateValueWithValidate(modelValue - step))"
      class="number-input-button"
    ></Button>
    <input
      class="number-input"
      type="number"
      v-model.number.lazy="inputModel"
      @keydown.enter="(e) => (e.target as HTMLInputElement).blur()"
    />
    <Button
      :style="{ '--size': `${size}px` }"
      v-long:500.repeat="() => updateValueWithValidate(modelValue + longStep)"
      type="shrink"
      icon="$add"
      shape="round"
      :disable="modelValue >= max"
      @click="clickCancel(() => updateValueWithValidate(modelValue + step))"
      class="number-input-button"
    ></Button>
  </div>
</template>

<style scoped lang="less">
.number-input {
  &-container {
    background-color: color-mix(in srgb, var(--font-light-gray) 30%, transparent 50%);
    border-radius: 1000px;

    padding: 5px;
    border: 2px solid var(--blank-white);

    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
  }

  &-container &-button {
    min-width: auto;
    min-height: auto;
    flex: 0 0 20px;
    height: var(--size, 20px);
    aspect-ratio: 1;
  }

  outline: none;
  background: none;
  border: none;
  color: var(--blank-white);
  text-align: center;
  font-weight: bold;
  flex: 1 1 auto;
  width: 100%;

  //在style里面添加此段代码即可
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
}
</style>
