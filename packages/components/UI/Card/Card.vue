<script setup lang="ts">
import { Rarity, RarityToColor } from '../Tags'
import { ClassNameFactor } from '@/utils/className'

const S = ClassNameFactor('card-')

export interface CardProps {
  showStar?: boolean
  star: 1 | 2 | 3 | 4 | 5
  imgUrl: string
  desc?: string
  foucsing?: boolean
}

defineProps<CardProps>()
</script>

<template>
  <div
    :class="
      S({
        outer: true,
        foucsing: foucsing ?? false
      })
    "
  >
    <div :class="S(['photo-container', `photo-container-${RarityToColor(star || 1)}`])">
      <img :src="imgUrl" draggable="false" width="120" />
    </div>
    <div :class="S('desc')">{{ desc }}</div>

    <div :class="S('mask')">
      <div :class="S('star-offset')"><slot></slot></div>
      <Rarity v-if="showStar" :rarity="star || 1" />
    </div>
  </div>
</template>

<style scoped lang="less">
.card-box {
  width: 120px;
  height: 150px;
}

.card {
  &-outer {
    .card-box();
    display: inline-block;
    margin: 5px 10px;
    background: var(--blank-white);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--box-shadow);

    user-select: none;
  }

  &-foucsing {
    @keyframes shining {
      0% {
        box-shadow: white;
      }

      100% {
        box-shadow: 0 0 9px 3px white;
      }
    }

    animation: shining 2s linear infinite alternate;
  }

  &-mask {
    .card-box();
    position: absolute;
    top: 0;
  }

  &-photo-container {
    width: 100%;
    height: 80%;
    border-bottom-right-radius: 25%;
    overflow: hidden;
    &-golden {
      background: var(--rank-golden-gradient);
    }
    &-purple {
      background: var(--rank-purple-gradient);
    }
    &-blue {
      background: var(--rank-blue-gradient);
    }
    &-green {
      background: var(--rank-green-gradient);
    }
    &-gray {
      background: var(--rank-gray-gradient);
    }
  }
  &-desc {
    text-align: center;
    font-size: 19px;
    height: 30px;
    line-height: 30px;

    color: var(--font-dark-gray);
  }
  &-star-offset {
    height: 70%;
    overflow: hidden;
  }
}
</style>
@/components/UI/Tags
