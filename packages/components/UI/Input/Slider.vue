<script setup lang="ts">
import { Between, StepRound, LongPress } from '@/utils'
import Button from '../Button'
import { ref, watch } from 'vue'
import { useMockScrollDrag } from '@/utils/hooks/elementEventRegister/mockScrollDrag'

const props = withDefaults(
  defineProps<{
    modelValue: number
    theme?: 'dark' | 'light'
    step?: number
    size?: number
    longStep?: number
    min: number
    max: number
    validate?: (n: number) => number | boolean
  }>(),
  {
    theme: 'light',
    step: 1,
    longStep: 1,
    min: 0,
    max: 100,
    size: 20
  }
)

const emits = defineEmits<{
  (event: 'update:modelValue', c: number): void
}>()

const modelValueToProgress = (modelValue: number) => {
  return (modelValue - props.min) / (props.max - props.min)
}

const progressToModelValue = (progress: number) => {
  return progress * (props.max - props.min) + props.min
}

const { vLong, clickCancel } = LongPress()

const updateValueWithValidate = (v: number) => {
  let n = v
  if (props.validate) {
    const validReturn = props.validate(v)
    if (typeof validReturn === 'number') {
      n = validReturn
    } else if (typeof validReturn === 'boolean' && !validReturn) {
      return
    }
  }

  // modelValue需要被step整除
  emits('update:modelValue', Between(StepRound(n, props.step), props.min, props.max))
}

const handleTrackClick = (e: MouseEvent) => {
  const rect = (e.currentTarget! as HTMLDivElement).getBoundingClientRect()
  if (mouseState.value === 'up')
    updateValueWithValidate(progressToModelValue(e.offsetX / rect.width))
}

const trackBtn = ref<HTMLDivElement>()
const trackLine = ref<HTMLDivElement>()

const { mouseState } = useMockScrollDrag(trackBtn, {
  moveMethod(_, aftpos) {
    const trackBound = trackLine.value!.getBoundingClientRect()

    updateValueWithValidate(
      progressToModelValue((aftpos.clientX - trackBound.left) / trackBound.width)
    )
  }
})

watch([() => props.min, () => props.max, () => props.validate, () => props.modelValue], () => {
  updateValueWithValidate(props.modelValue)
})
</script>

<template>
  <div
    :class="['track-container', theme]"
    :style="{ '--size': `${size}px`}"
  >
    <Button
      v-long:500.repeat.100="() => updateValueWithValidate(modelValue - longStep)"
      :theme="theme"
      type="shrink"
      icon="$reduce"
      shape="round"
      :disable="modelValue <= min"
      @click="clickCancel(() => updateValueWithValidate(modelValue - step))"
      class="number-input-button"
    ></Button>

    <div class="slide-count">{{ min }}</div>
    <div
      class="track-line"
      :style="{ '--track-btn-pos': `${modelValueToProgress(modelValue) * 100}%` }"
      @click="handleTrackClick"
      ref="trackLine"
    >
      <div class="track-btn" ref="trackBtn" @click.stop="() => {}"></div>
    </div>
    <span class="slide-count">{{ max }}</span>
    <Button
      v-long:500.repeat.100="() => updateValueWithValidate(modelValue + longStep)"
      :theme="theme"
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
.track-container {
  &.dark {
    --theme-color: var(--font-dark-gray);
    --theme-color-reserve: var(--blank-white);
  }

  &.light {
    --theme-color: var(--blank-white);
    --theme-color-reserve: var(--font-dark-gray);
  }
}

.track {
  &-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-line {
    width: 200px;
    height: calc(var(--size) / 4);
    margin: 0 10px;
    border-radius: 1000px;
    background-color: color-mix(in srgb, var(--theme-color-reserve) 30%, transparent 50%);

    position: relative;
    flex: 1 1 auto;

    &::before {
      content: '';
      display: block;
      width: var(--track-btn-pos, 0);
      height: 100%;
      border-radius: 1000px;
      background-color: var(--theme-color);
    }
  }

  &-btn {
    --track-btn-size: calc(var(--size) / 2);
    --pad-size: calc(var(--size) / 10);
    width: var(--track-btn-size);
    aspect-ratio: 1;
    background: var(--theme-color) content-box;
    padding: var(--pad-size);
    border: var(--pad-size) solid var(--theme-color);
    border-radius: var(--pad-size);

    position: absolute;
    top: 50%;
    left: var(--track-btn-pos, 0);
    transform: translate(-50%, -50%) rotate(45deg);

    box-shadow: 0px 0px 4px var(--theme-color-reserve);
  }
}

.slide-count {
  color: var(--theme-color);
  font-weight: bold;
  min-width: calc(var(--size) * 2);
  font-size: var(--size);
  text-align: center;
  margin: 5px;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
}

.number-input-button {
  min-width: auto;
  min-height: auto;
  flex: 0 0 20px;
  height: var(--size, 20px);
  aspect-ratio: 1;
}
</style>
