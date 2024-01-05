<script setup lang="ts">
import EnableImage from './assets/enable.png';
import DisableImage from './assets/disable.png';

interface EnableProps {
  enable?: boolean;
  size?: number;
}

const props = defineProps<EnableProps>();
</script>

<template>
  <div class="enable-container">
    <img
      class="lock"
      :src="props.enable ? EnableImage : DisableImage"
      :alt="props.enable ? 'enable' : 'disable'"
      :style="{ width: `${props.size || 15}px` }"
      :draggable="false"
    />
  </div>
</template>

<style scoped lang="less">
.enable {
  &-container {
    margin: 5px;
    border-radius: 3px;
    display: inline-block;
    line-height: 2px;
  }
  width: 100%;
}
</style>
