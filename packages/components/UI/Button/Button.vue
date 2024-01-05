<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { ClassNameFactor } from '@/utils/className'
import AttentionDecoration from '../Tags/AttentionDecoration.vue'

const props = withDefaults(
  defineProps<{
    type?: 'shrink' | 'spread'
    shape?: 'round'
    balance?: boolean
    icon?:
      | 'round'
      | 'fork'
      | 'del'
      | 'loading'
      | 'menu'
      | 'sort'
      | 'filter'
      | 'back'
      | 'close'
      | undefined
      | string
    disable?: boolean
    attention?: boolean
    theme?: 'dark' | 'light'
    sleep?: number
    sound?: { replay: () => void }
  }>(),
  { type: 'shrink', theme: 'light' }
)

const { type, icon, disable, attention } = toRefs(props)

const emit = defineEmits<{
  (event: 'click'): void
}>()

const isSleeping = ref(false)

const S = ClassNameFactor('button-wrap-')

const decideExtraButtonStyle = () => {
  let button = ''

  switch (type.value) {
    case 'shrink': {
      if (props.shape && props?.shape === 'round') {
        button = S(['shrink', 'round'])
      } else {
        button = S({
          shrink: true,
          'shrink-disable': Boolean(props.disable || isSleeping.value)
        })
      }
      break
    }
    case 'spread': {
      button = S('spread')
      break
    }
  }
  return button
}

const handleClick = () => {
  if (isSleeping.value) return
  props.sound?.replay()

  emit('click')
  if (props.sleep) {
    isSleeping.value = true
    setTimeout(() => {
      isSleeping.value = false
    }, props.sleep)
  }
}
</script>
<template>
  <button
    :class="[S({ button: true, ['theme-' + theme]: type === 'shrink' }), decideExtraButtonStyle()]"
    @click="handleClick"
    :disabled="disable || isSleeping"
  >
    <img
      v-if="/\/|\./.test(icon || '')"
      style="display: block"
      :class="S('special')"
      :draggable="false"
      :src="icon"
      :alt="icon || 'button'"
    />
    <div v-else :class="`decoration-${icon} ${S('special')}`"></div>
    <AttentionDecoration v-if="attention" :class="S('attention')" />
    <span v-if="type === 'shrink' && shape !== 'round'" :class="S({ balance: balance === true })">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped lang="less">
@import './Decoration.less';
.button-wrap-theme {
  &-dark {
    &.button-wrap-button {
      &::before {
        background: var(--blank-white);
        box-shadow: var(--box-shadow);
      }

      &::after {
        // 按钮背景色
        background: var(--font-dark-gray);
        box-shadow: var(--box-shadow);
      }
    }
    &.button-wrap-shrink {
      color: var(--blank-white);
      &:active {
        &::after {
          background: var(--blank-white);
        }
        color: var(--font-dark-gray);
        opacity: 0.5;
      }

      &-disable {
        &::after {
          background: var(--blank-white);
          border: 1px solid var(--blank-white);
        }
        color: var(--font-dark-gray);
      }
    }
  }
  &-light {
    &.button-wrap-button {
      &::before {
        background: var(--blank-white);
        box-shadow: var(--box-shadow);
      }

      &::after {
        background: var(--blank-white);
        box-shadow: var(--box-shadow);
      }
    }
    &.button-wrap-shrink {
      color: var(--font-dark-gray);
      &:active {
        color: var(--blank-white);
      }
      &-disable {
        &::after {
          background-color: transparent;
          border: 1px solid var(--blank-white);
        }

        color: var(--blank-white);
      }
    }
  }
}
.button-wrap {
  &-button {
    position: relative;
    z-index: 1;

    min-width: 60px;

    // height: 100%;
    min-height: 60px;
    max-height: 200px;

    border: none;
    margin: 0;
    padding: 0;

    text-align: center;
    background: none;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;

      background: var(--blank-white);
      box-shadow: var(--box-shadow);
      transition: 0.1s;
    }

    &::after {
      position: absolute;
      z-index: 1;

      top: 0;
      left: 0;

      background: var(--blank-white);
      box-shadow: var(--box-shadow);
      transition: 0.1s;
    }
  }

  &-special {
    position: absolute;
    top: 0;
    height: 60%;
    z-index: 3;
    transform: translate(33.3%, 33.3%);
  }

  &-attention {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
    height: 30% !important;
  }

  &-image {
    position: relative;
    z-index: 3;
    height: 30px;
    margin: 15px;
    vertical-align: middle;
    transition: 0.1s;
    user-select: none;
  }
}
.button-wrap {
  &-spread {
    aspect-ratio: 1;
  }

  &-spread::after {
    content: '';
    // 64px
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;

    background: rgb(156, 151, 143);
    box-sizing: border-box;
  }

  &-spread::before {
    content: '';
    height: 80%;
    aspect-ratio: 1;
    border-radius: 50%;

    margin: 10%;
  }

  &-spread &-image {
    margin: 17px;
  }

  &-spread:active &-special {
    opacity: 0.8;
  }

  &-spread:active::before {
    height: 95%;
    margin: 2.5%;
    background-color: rgb(169, 168, 165);
    box-shadow: var(--box-shadow);
  }

  &-spread:active &-image {
    filter: brightness(5);
  }
}
.button-wrap {
  &-shrink {
    width: 100%;
    z-index: 1;
    font-size: 23px;
    min-width: 50px;
    min-height: 50px;

    &::before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
  }

  &-balance {
    padding-left: 25px;
  }

  &-shrink&-round {
    aspect-ratio: 1;
    width: auto;
  }

  &-shrink::after {
    content: '';
    z-index: -1;
    border-radius: 999px;
    width: 100%;
    height: 100%;
  }

  &-shrink &-image {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
  }

  &-shrink:active::after {
    transform: scale(0.995);
    opacity: 0.5;
    box-shadow: var(--box-shadow);
  }

  &-shrink:active &-image {
    filter: brightness(5);
  }

  &-shrink:active &-special {
    opacity: 0.7;
  }

  &-shrink-disable {
    &:active::after {
      transform: none;
      opacity: 1;
    }

    opacity: 0.5;
  }

  // 重写 active 激活样式
  &-shrink-disable:active &-special {
    opacity: 1;
  }

  &-shrink-disable:active &-special-round {
    opacity: 1;
  }

  &-shrink-disable:active &-special-fork {
    opacity: 1;
  }
}
</style>
