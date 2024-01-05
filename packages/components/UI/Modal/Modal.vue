<script setup lang="ts">
import { mount, unmount } from './zIndex'
import { ref, computed, watch } from 'vue'

import ModalView, { type ModalButtonConfig } from './Modalview.vue'

// 需要消费的属性
export interface ModalProps {
  visible: boolean
  theme?: 'dark' | 'light'

  title?: string
  position?: { [key in 'top' | 'left' | 'right' | 'bottom']: number }

  okText?: string
  okIcon?: string
  okDisable?: boolean

  cancelText?: string
  cancelIcon?: string
  cancelDisable?: boolean

  // 总配置 单个配置优先
  ok?: ModalButtonConfig
  cancel?: ModalButtonConfig
  mask?: boolean

  zIndex?: number
}

const props = withDefaults(defineProps<ModalProps>(), {
  mask: true
})

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'cancel'): void
  (e: 'ok'): void
}>()

const instance = Symbol('modal')

const index = ref(0)

const okButtonProps = computed(() => ({
  text: props.okText,
  icon: props.okIcon,
  disable: props.okDisable,
  ...props.ok
}))

const okNotEmpty = computed(
  () => props.okText !== undefined || props.okIcon !== undefined || props.ok !== undefined
)

const cancelButtonProps = computed(() => ({
  text: props.cancelText,
  icon: props.cancelIcon,
  disable: props.cancelDisable,
  ...props.cancel
}))

const cancelNotEmpty = computed(
  () =>
    props.cancelText !== undefined || props.cancelIcon !== undefined || props.cancel !== undefined
)

watch(
  () => props.visible,
  () => {
    if (props.visible) {
      index.value = 1000 + mount(instance)
    } else {
      unmount(instance)
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <Teleport to="body">
    <div :style="{ zIndex: zIndex || index, position: 'fixed', top: 0, left: 0 }">
      <div
        class="modal-mask"
        :style="{ display: !visible ? 'none' : 'block' }"
        @click="() => mask && emits('close')"
      >
        <!-- 使用单独图层来分离自身样式对弹窗的影响 -->
      </div>
      <Transition name="modal-transition-animate">
        <ModalView
          v-if="visible"
          :theme="theme"
          :title="title"
          :position="position"
          :ok="okNotEmpty ? okButtonProps : undefined"
          :cancel="cancelNotEmpty ? cancelButtonProps : undefined"
          @close="() => emits('close')"
          @ok="() => emits('ok')"
          @cancel="() => emits('cancel')"
        >
          <slot></slot>
        </ModalView>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped lang="less">
.modal-mask {
  position: absolute;
  top: 0;
  left: 0;

  background: rgba(0, 0, 0, 0.2);

  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: all;
}
</style>
