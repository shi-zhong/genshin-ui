<script setup lang="ts">
import Star from './assets/star.png'

interface RarityBarProps {
  rarity: 1 | 2 | 3 | 4 | 5
  align?: 'left' | 'center' | 'right'
  size?: number
}

withDefaults(defineProps<RarityBarProps>(), {
  size: 20,
  rarity: 1,
  align: 'center'
})

</script>

<template>
  <div class="stars-container" :style="{ justifyContent: align }">
    <img
      v-for="(_key, index) in Array(rarity)"
      :key="'star' + index"
      :draggable="false"
      class="stars"
      :src="Star"
      :style="{ width: `${size}px` }"
    />
  </div>
</template>

<style scoped lang="less">
.stars {
  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  width: 20px;
  filter: drop-shadow(0.4px 0.4px 0.5px var(--font-dark-gray));
}
</style>
