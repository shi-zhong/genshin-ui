<script setup lang="ts">
import RankPicture from '@/assets/icons/rank_star.png'
</script>

<template>
  <div class="line">
    <img class="line-rank" :src="RankPicture" alt="" />
  </div>
</template>

<style scoped lang="less">
.line {
  margin: 0 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  opacity: 0.3;

  &::before {
    content: '';
    display: block;
    width: 45%;
    height: 3px;
    background-color: white;
  }
  &::after {
    content: '';
    display: block;
    width: 45%;
    height: 3px;
    background-color: white;
  }

  &-rank {
    width: 30px;
  }
}
</style>
