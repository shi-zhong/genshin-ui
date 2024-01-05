<script setup lang="ts">
import { computed } from 'vue';
import LockedImage from './assets/lock.png';
import UnLockedImage from './assets/unlock.png';

interface LockProps {
  lock?: boolean;
  size?: number;
  modelValue?: boolean;
}

const props = defineProps<LockProps>();
const emits = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();

const isLock = computed(() => props.lock || props.modelValue);
</script>

<template>
  <div
    :class="['lock-container', isLock ? 'locked' : 'unlock']"
    @click="() => emits('update:modelValue', !isLock)"
  >
    <img
      class="lock"
      :src="isLock ? LockedImage : UnLockedImage"
      :alt="isLock ? 'locked' : 'unlock'"
      :style="{ width: `${size || 15}px` }"
      :draggable="false"
    />
  </div>
</template>

<style scoped lang="less">
@unlock-white: rgb(243, 240, 233);

.lock {
  &-container {
    margin: 5px;
    border-radius: 3px;
    display: inline-block;
    box-shadow: var(--box-shadow);
    line-height: 2px;
  }
  width: 100%;
}

.locked {
  background: var(--font-dark-gray);
}

.unlock {
  background: @unlock-white;
}
</style>
