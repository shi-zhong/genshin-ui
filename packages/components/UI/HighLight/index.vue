<script setup lang="tsx">
import { computed } from 'vue'

const props = defineProps<{ text: string }>()

const prefix = 'highlight-'

const staticDecodeMapper: { [key: string]: string } = {
  '0': prefix + 'spe',
  '1': prefix + 'fire',
  '2': prefix + 'water',
  '3': prefix + 'elec',
  '4': prefix + 'ice',
  '5': prefix + 'grass',
  '6': prefix + 'wind',
  '7': prefix + 'stone',
  '8': prefix + 'italic'
}

// 默认所有字符只有单个样式，采用最简单的编码方式
const Decode = computed(() =>
  props.text
    .trim()
    .split('$')
    .filter((i) => i)
    .map((str) => ({
      style: staticDecodeMapper[str[0]],
      text: staticDecodeMapper[str[0]] ? str.slice(1) : str
    }))
)
</script>

<template>
  <div class="highlight">
    <span v-for="(node, index) in Decode" :key="index" :class="node.style ?? ''">
      {{ node.text }}
    </span>
  </div>
</template>

<style scoped lang="less">

.highlight {
  white-space: pre-line;

  &-spe {
    color: var(--highlight-spe);
  }

  &-fire {
    color: var(--highlight-fire);
  }

  &-water {
    color: var(--highlight-water);
  }

  &-elec {
    color: var(--highlight-elec);
  }

  &-ice {
    color: var(--highlight-ice);
  }

  &-grass {
    color: var(--highlight-grass);
  }

  &-wind {
    color: var(--highlight-wind);
  }

  &-stone {
    color: var(--highlight-stone);
  }

  &-italic {
    font-style: italic;
  }
}
</style>
