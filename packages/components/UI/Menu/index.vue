<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ClassNameFactor, EventDispatch } from '@/utils'
import AttentionDecoration from '../Tags/AttentionDecoration.vue'

// 用于应用按下但未松开时样式展示
const press = ref(-1)

const active = ref('')

const S = ClassNameFactor('options-')

const props = defineProps<{
  modelValue?: string
  options: {
    txt: string
    url: string
    n?: number
  }[]
}>()

const emits = defineEmits<{
  (e: 'change', pve: string, aft: string, stop: () => void): void
  (e: 'update:modelValue', value: string): void
}>()

const handleClick = (e: Event) => {
  EventDispatch<{ url: string }>(e, {
    item: (dataset) => {
      if (dataset.url !== active.value) {
        let stop = false
        emits('change', active.value, dataset.url, () => (stop = true))
        if (!stop) {
          active.value = dataset.url
          emits('update:modelValue', dataset.url)
        }
      }
    }
  })
  press.value = -1
}

onMounted(() => {
  if (props.options.findIndex((o) => o.url === active.value) === -1) {
    let stop = false
    emits('change', active.value, props.options[0].url, () => (stop = true))
    if (!stop) {
      active.value = props.options[0].url
      emits('update:modelValue', props.options[0].url)
    }
  }
})
</script>

<template>
  <div :class="S('list')" data-type="list" @click="handleClick">
    <div
      v-for="(option, index) in options"
      :class="
        S({
          item: true,
          'item-not-active': option.url !== active && index !== press,
          'item-active': option.url === active
        })
      "
      :key="option.url"
      data-type="item"
      :data-url="option.url"
    >
      {{ option.txt }} <AttentionDecoration v-if="option.n !== undefined" style="vertical-align: baseline" :size="20" :n="option.n" />
    </div>
  </div>
</template>

<style scoped lang="less">
.options {
  &-list {
    margin: 30px;
    color: var(--blank-white);
    font-size: 25px;
    user-select: none;
  }

  @block-left: 25px;

  &-item {
    position: relative;

    height: 50px;
    padding-left: 50px;
    margin: 30px 10px;

    border: 2px solid transparent;
    border-right: none;

    line-height: 50px;

    box-sizing: content-box;
    transition: 0.2s;
    opacity: 0.8;

    &:hover {
      border-radius: 25px 0 0 25px;
      border: 2px solid rgba(109, 109, 109, 0.3);
      border-right: none;
    }

    &::before {
      content: '';
      transition: 0.3s;
    }

    &-active {
      padding-left: 60px;
      font-size: 30px;
      opacity: 1;

      &::before {
        content: '';

        position: absolute;
        top: 50%;
        left: @block-left;

        width: 18px;
        height: 18px;
        border: 2px solid rgb(208, 208, 208);

        display: block;

        transform: translate(-50%, -50%) rotate(45deg);
        opacity: 0.5;
      }

      &::after {
        content: '';

        position: absolute;
        top: 50%;
        left: @block-left;

        display: inline-block;

        border: 5px solid var(--blank-white);
        border-left-color: transparent;
        border-bottom-color: transparent;
        border-radius: 1px;

        animation: movement 1s infinite ease;
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }

    &-not-active:active {
      &::before {
        content: '';

        position: absolute;
        top: 50%;
        left: @block-left;

        width: 18px;
        height: 18px;
        border: 2px solid rgb(208, 208, 208);

        display: block;

        transform: translate(-50%, -50%) rotate(45deg);
        opacity: 0.5;
      }

      &::after {
        content: '';

        position: absolute;
        top: 50%;
        left: @block-left;

        display: inline-block;

        border: 5px solid var(--blank-white);
        border-radius: 1px;

        transform: translate(-50%, -50%) rotate(45deg);
      }
    }

    &-not-active {
      &::before {
        content: '';

        position: absolute;
        top: 50%;
        left: @block-left;

        width: 28px;
        height: 28px;

        display: block;

        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::after {
        content: '';

        position: absolute;
        top: 50%;
        left: @block-left;

        transform: translate(-50%, -50%) rotate(45deg);

        display: inline-block;

        border: 5px solid var(--blank-white);
        border-radius: 1px;
      }
    }
  }
}

@keyframes movement {
  0% {
    margin-bottom: 0px;
    margin-left: 0px;
  }

  50% {
    margin-bottom: 4px;
    margin-left: 4px;
  }

  100% {
    margin-bottom: 0px;
    margin-left: 0px;
  }
}
</style>
