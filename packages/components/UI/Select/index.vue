<script setup lang="ts">
import { ClassNameFactor, EventDispatch, merge } from '@/utils'
import { RemoveRepeat } from '@/utils/array'
import { useMockScrollDrag } from '@/utils/hooks'
import Popover, { type acceptDirection } from '@@/Base/Popover'
import { computed, onMounted, reactive, ref, toRaw, toRefs, watch } from 'vue'

interface SelectProps {
  /**
   * options 列表参数
   */
  options: SelectOptionProps[]
  /**
   * 将控制权移交外部
   */
  modelValue?: string | SelectOptionProps
  maxHeight?: number
  default?: string
  placement?: acceptDirection

  class?: string
  style?: any
}

interface SelectOptionProps {
  text: string
  value: string
}

const S = ClassNameFactor('select')

const props = withDefaults(defineProps<SelectProps>(), {
  placement: 'top'
})

const emits = defineEmits<{
  (event: 'update:modelValue', aft: string): void
  (
    event: 'change',
    value: {
      prv: SelectOptionProps
      aft: SelectOptionProps
      stop: () => void
    }
  ): void
}>()

const { options } = toRefs(props)

const popover = ref()

const select = reactive({ text: '', value: '' })
const move = ref(false) // 用于防止拖拽滚动触发onclick事件

const handleUpdate = (aft: SelectOptionProps) => {
  const prv = toRaw(select)

  if (prv.value === aft.value) return

  let stop = false
  emits('change', { prv, aft, stop: () => (stop = true) })
  // 除了显示返回 false 都不阻止
  if (!stop) {
    if (props.modelValue !== undefined) {
      emits('update:modelValue', aft.value)
    }
    merge(select, aft)
  }
}

// 处理点击选项事件
const handleOptionClick = (e: Event) => {
  if (move.value) return (move.value = false)

  EventDispatch(e, {
    'select-option-item': (dataset) => {
      const aft = options.value.find((i) => i.value === dataset.value) || _default.value
      handleUpdate(aft)

      popover.value.popoverVisible(false)
    }
  })
}

const _default = computed(
  () => options.value.find((i) => i.value === props.default) || options.value[0]
)

/**
 * 初始化选项
 * 1. 外部传值且未赋值，或初始值不在列表内
 *    有默认值则赋值默认值
 *    无默认值则赋值列表第一项
 * 2. 外部未传值
 *    有默认值则赋值默认值
 *    无默认值则赋值列表第一项
 */
onMounted(() => {
  if (options.value.length === 0) return

  useMockScrollDrag(popover.value.popover, {
    mouseMove(e, state) {
      if (state !== 'up') move.value = true
    },
    mouseDown() {
      move.value = false // 取消移除的
    }
  })

  let _select

  const o = props.options.map((o) => o.value)
  const ro = RemoveRepeat(o)

  if (o.length !== ro.length) {
    console.warn('Your Options Has At Least One Value Repeated. Please Check It.')
  }

  // 决定_select更新值
  if (props.modelValue !== undefined) {
    _select =
      options.value.find((i) => i.value === (props.modelValue || props.default)) || _default.value
  } else if (props.default !== undefined) {
    _select = options.value.find((i) => i.value === props.default) || options.value[0]
  } else {
    _select = options.value[0]
  }

  handleUpdate(_select)
})

watch(
  () => props.modelValue,
  () => {
    // 外部状态存在且发生变化， 更新内部状态
    if (props.modelValue && props.modelValue !== select.value) {
      const _select = props.options.find((i) => i.value === props.modelValue) || _default.value
      handleUpdate(_select)
    }
  }
)
</script>

<template>
  <Popover mode="click" syncWidth ref="popover" :placement="placement">
    <div
      :class="S('-show') + ' ' + (props.class ? props.class : '')"
      :style="style"
      :draggable="false"
    >
      <div>{{ select.text }}</div>
    </div>
    <template #popover>
      <ul
        :class="S('-option-list')"
        :style="{
          maxHeight: props.maxHeight ? `${$props.maxHeight}px` : undefined
        }"
        data-type="option-list"
        @click.stop="handleOptionClick"
      >
        <li
          v-for="(i, index) in props.options"
          :class="
            S({
              '-option-item': true,
              '-option-item-select': select.value === i.value
            })
          "
          data-type="select-option-item"
          :data-value="i.value"
          :key="index"
          :draggable="false"
        >
          {{ i.text }}
        </li>
      </ul>
    </template>
  </Popover>
</template>

<style scoped lang="less">
.select {
  &-show {
    position: relative;
    z-index: 0;
    height: 50px;
    line-height: 50px;
    padding: 0 25px;

    font-size: 18px;
    color: var(--font-dark-gray);
    user-select: none;
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: 25px;
      background: var(--blank-white);
    }

    &::after {
      content: '';
      position: absolute;
      right: 25px;
      top: 50%;

      transform: translate(50%, -50%);

      border: 8px solid transparent;
      border-top: 10px solid var(--font-dark-gray);
      border-bottom: 0px;
    }

    &:active {
      color: var(--blank-white);

      &::before {
        background: rgb(156, 151, 143);
        height: 90%;
      }

      &::after {
        border-top-color: var(--blank-white);
      }
    }
  }

  &-option {
    &-list {
      position: absolute;
      margin: 0;
      padding: 0px;
      z-index: 1;

      border-radius: 25px;

      overflow-y: scroll;
      background-color: var(--font-dark-gray);
      // transition: 0.3s opacity;
      &::-webkit-scrollbar {
        display: none;
      }

      &-hidden {
        opacity: 0;
        pointer-events: none;
      }
    }
    &-item {
      position: relative;
      // width: 100%;
      border-radius: 25px;
      height: 50px;
      margin: 5px;
      line-height: 50px;
      padding: 0 25px;
      font-size: 18px;
      color: var(--blank-white);
      user-select: none;
      text-decoration: none;
      list-style: none;

      &:hover {
        background: rgba(255, 255, 255, 0.101);
      }

      &:active {
        color: var(--font-dark-gray);
        background: var(--blank-white);
      }

      &-select {
        background: rgba(255, 255, 255, 0.101);
        &::after {
          content: '';
          position: absolute;
          top: 40%;
          right: 30px;

          display: block;
          width: 10px;
          height: 20px;
          border-bottom-right-radius: 4px;

          transform: rotate(50deg) translate(0, -70%);

          border: 4px solid var(--blank-white);
          border-top: none;
          border-left: none;
        }

        &:active::after {
          border: 4px solid var(--font-dark-gray);
          border-top: none;
          border-left: none;
        }
      }
    }
  }
}
</style>
