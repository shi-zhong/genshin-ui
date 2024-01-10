<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
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

const iconType = computed(() => {
  const icon = props.icon || ''
  if (/\/|\./.test(icon)) return 'image'
  if (/^\$/.test(icon)) return 'colord-image'
  if (icon === '') return ''
  return 'black-bgi'
})

const tIcon = computed(() => {
  if (iconType.value === 'colord-image') return props.icon?.slice(1)
  return props.icon
})

const themeDark = {
  '--theme-button-background': 'var(--font-dark-gray)',
  '--theme-button-color': 'var(--blank-white)',
  '--theme-button-reverse-color': 'var(--font-dark-gray)'
}
const themeLight = {
  '--theme-button-background': 'var(--blank-white)',
  '--theme-button-color': 'var(--font-dark-gray)',
  '--theme-button-reverse-color': 'var(--blank-white)'
}
</script>
<template>
  <button
    :class="[S({ button: true, ['theme-' + theme]: type === 'shrink' }), decideExtraButtonStyle()]"
    @click="handleClick"
    :style="theme === 'dark' ? themeDark : themeLight"
    :disabled="disable || isSleeping"
  >
    <img
      v-if="iconType === 'image'"
      style="display: block"
      :class="S('special')"
      :draggable="false"
      :src="icon"
      :alt="icon || 'button'"
    />
    <div v-else :class="`decoration-${tIcon} decoration-${iconType} ${S('special')}`"></div>
    <AttentionDecoration v-if="attention" :class="S('attention')" />
    <span v-if="type === 'shrink' && shape !== 'round'" :class="S({ balance: balance === true })">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped lang="less">
@import './Decoration.less';

.button-wrap-button {
  --theme-button-background: var(--blank-white);
  --theme-button-color: white;
  --theme-button-reverse-color: black;
  --active-mixed-color: color-mix(
    in srgb,
    var(--theme-button-color),
    var(--theme-button-reverse-color)
  );
}

.button-wrap-button {
  position: relative;
  z-index: 1;

  min-width: 60px;
  min-height: 60px;
  max-height: 200px;

  border: none;
  margin: 0;
  padding: 0;
  text-align: center;
  background: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    transition: 0.1s;
    box-shadow: var(--box-shadow);
    background: var(--theme-button-background);
  }
  &:active .button-wrap-special {
    opacity: 0.7;
  }
}

// 顺序不可调换，后写的样式会覆盖前者 必要时使用important
.button-wrap {
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

  &-balance {
    padding-left: 25px;
  }
  // 使用双类名来加强权重
  &-round&-button {
    aspect-ratio: 1;
    width: auto;
  }
}

.button-wrap-shrink {
  width: 100%;
  font-size: 23px;
  min-width: 50px;
  min-height: 50px;
  color: var(--theme-button-color);

  &::after {
    z-index: -1;
    border-radius: 999px;
    width: 100%;
  }

  &:active {
    &::after {
      filter: blur(1px);
      background: var(--active-mixed-color);
      box-shadow: var(--box-shadow);
      opacity: 0.5;
    }
    color: var(--theme-button-reverse-color);
    opacity: 0.9;
  }
  // 设置禁用样式，双类名加权重
  &-disable.button-wrap-button {
    &::after {
      // 取消激活样式
      filter: none;
      opacity: 1;
      box-shadow: none;

      border: 1px solid var(--blank-white);
      background: transparent;
    }
    // cancel active style
    &:active {
      opacity: 1;
    }
    & .button-wrap-special {
      opacity: 1;
    }
    color: var(--theme-button-reverse-color);
  }
}

.button-wrap-spread {
  aspect-ratio: 1;
  &::before {
    content: '';
    height: 80%;
    aspect-ratio: 1;
    border-radius: 50%;
    margin: 10%;

    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    transition: 0.1s;
    background: var(--blank-white);
    box-shadow: var(--box-shadow);
  }

  &::after {
    aspect-ratio: 1;
    border-radius: 50%;

    background: rgb(156, 151, 143, 0.5);
    box-sizing: border-box;
  }
  &:active::before {
    height: 95%;
    margin: 2.5%;
    filter: blur(1px);
    background-color: var(--active-mixed-color);
    box-shadow: var(--box-shadow);
  }
}
</style>
