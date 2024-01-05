<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Modal, { type ModalProps } from './Modal.vue'
import { type ModalButtonConfig } from './Modalview.vue'

const props = defineProps<{
  title?: string
  text?: string
  ok?: ModalButtonConfig
  cancel?: ModalButtonConfig
  theme?: ModalProps['theme']
  mask?: boolean

  onOk?: Function
  onCancel?: Function
  onClose?: Function
  unmount: Function
}>()

const visible = ref(false)

onMounted(() => (visible.value = true))

watch(
  () => visible.value,
  () => {
    if (!visible.value) {
      setTimeout(() => {
        props.unmount()
      }, 1000)
    }
  }
)
</script>

<template>
  <Modal
    :visible="visible"
    :title="title"
    :mask="mask"
    :theme="theme"
    :ok="ok"
    :cancel="cancel"
    @ok="
      () => {
        onOk && onOk()
        visible = false
      }
    "
    @cancel="
      () => {
        onCancel && onCancel()
        visible = false
      }
    "
    @close="
      () => {
        onClose && onClose()
        visible = false
      }
    "
    ><div :class="['text-center', `theme-${theme || 'dark'}`]">{{ text }}</div></Modal
  >
</template>
<style lang="less" scoped>
.text-center {
  height: 100%;
  width: 100%;
  font-size: 25px;
  min-height: 350px;
  
  display: flex;
  justify-content: center;
  align-items: center;
}

.theme-dark.text-center{
  color: var(--blank-white);
}

.theme-light.text-center{
  color: var(--font-dark-gray);
}
</style>
