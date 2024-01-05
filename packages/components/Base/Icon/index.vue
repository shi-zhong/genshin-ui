<script setup lang="ts">
interface IconCommon {
  src: string;
  alt?: string;
  size?: number;
  imgStyle?: object;
}

interface IconPropsOrigin {
  type: 'origin';
}

interface IconPropsProjection {
  type: 'projection';
  color: string;
}

type IconProps = IconCommon & (IconPropsOrigin | IconPropsProjection);

const props = withDefaults(defineProps<IconProps>(), {
  type: 'origin',
  size: 20,
  color: 'white'
});
</script>

<template>
  <div class="icon">
    <img
      v-if="props.src !== ''"
      :style="{
        ...(props.imgStyle || {}),
        width: `${props.size}px`,
        filter:
          props.type === 'projection' ? `drop-shadow(${props.size}px 0 0 ${props.color})` : 'none',
        transform: props.type === 'projection' ? 'translateX(-100%)' : 'none'
      }"
      :src="props.src"
      :alt="props.alt || 'icon'"
    />
  </div>
</template>

<style scoped lang="less">
.icon {
  overflow: hidden;
  display: inline-block;
}
</style>
