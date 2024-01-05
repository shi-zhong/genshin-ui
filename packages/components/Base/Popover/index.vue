<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { Between } from '@/utils/math'
import type { acceptDirection } from './interface'

const props = withDefaults(
  defineProps<{
    mode?: 'hover' | 'click' | 'none'
    placement?: acceptDirection
    syncWidth?: boolean
    autoPlacement?: boolean
    priority?: acceptDirection[]
    floating?: (content: number, popover: number) => boolean
  }>(),
  {
    mode: 'hover',
    placement: 'top',
    syncWidth: false,
    autoPlacement: true,
    priority: () => ['top', 'bottom', 'left', 'right'],
    floating: () => (c: number, p: number) => c > 3 * p
  }
)

const pos = reactive({
  placement: 'top',
  left: 800,
  top: 50,
  width: 0,
  height: 0
})

const AppendSlot = (props: any) => props.default(props.props)[0]

const visible = ref(false)
const timeout = ref(setTimeout(() => {}, 100))

const limitOutClick = ref(false)

const body = ref<HTMLElement>()
const popover = ref<HTMLElement>()

const popoverVisible = async (vis: boolean, e?: MouseEvent) => {
  if (visible.value === vis) return
  visible.value = vis
  if (vis) {
    await nextTick()
    requestPopoverPosition(e?.x, e?.y)
  }
}

const fallback: any = {
  top: ['bottom'],
  bottom: ['top'],
  left: ['right'],
  right: ['left'],
  B: ['top'],
  D: ['right'],
  F: ['bottom'],
  H: ['left'],
  A: ['top', 'left'],
  C: ['top', 'right'],
  E: ['bottom', 'right'],
  G: ['bottom', 'left']
}

const FallbackList = (placement: acceptDirection) => {
  let list = [placement]

  if (['left', 'right', 'top', 'bottom', 'A', 'C', 'E', 'G'].includes(placement)) {
    list = list.concat(fallback[placement])
  } else {
    list = list.concat(fallback[placement[0]])
  }

  return list.concat(props.priority)
}

const requestPopoverPosition = async (x: number = 0, y: number = 0) => {

  const cRect =
    body.value?.getBoundingClientRect() ||
    ({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    } as DOMRect)
  let { width: pWidth, height: pHeight } = (
    popover.value as unknown as HTMLElement
  )?.getBoundingClientRect() || {
    width: 0,
    height: 0
  }

  const { innerWidth, innerHeight } = window

  const withinScreen = (left: number, top: number) =>
    left >= 0 && top >= 0 && left + pWidth <= innerWidth && top + pHeight <= innerHeight

  // 更新盒子信息
  if (props.syncWidth) {
    pWidth = cRect.width
  }

  const pageX =
    window.pageXOffset !== undefined
      ? window.pageXOffset
      : (document.compatMode || '') === 'CSS1Compat'
      ? document.documentElement.scrollLeft
      : document.body.scrollLeft
  const pageY =
    window.pageXOffset !== undefined
      ? window.pageYOffset
      : (document.compatMode || '') === 'CSS1Compat'
      ? document.documentElement.scrollTop
      : document.body.scrollTop

  pos.width = pWidth
  pos.height = pHeight

  let placement = props.placement
  const fallbackList = FallbackList(placement)
  let f = 0
  let cache = [0, 0]

  while (f < fallbackList.length) {
    const place = requestPlacement(fallbackList[f], cRect, { width: pWidth, height: pHeight }, x, y)
    if (placement === props.placement) {
      cache = [...place]
    }
    if (withinScreen(...place) || !props.autoPlacement) {
      pos.left = place[0] + pageX
      pos.top = place[1] + pageY
      return place
    }
    f++
  }

  pos.left = cache[0] + pageX
  pos.top = cache[1] + pageY
  pos.placement = props.placement;
  return cache
}

const requestPlacement = (
  placement: acceptDirection,
  cRect: DOMRect,
  pRect: { width: number; height: number },
  x: number,
  y: number
): [number, number] => {
  const {
    width: cWidth,
    height: cHeight,
    top: cTop,
    left: cLeft,
    bottom: cBottom,
    right: cRight
  } = cRect
  const { width: pWidth, height: pHeight } = pRect

  pos.placement = placement

  const position: [number, number] = [0, 0]
  const gap = 10

  if (placement === 'top' || placement === 'bottom') {
    if (placement === 'top') {
      position[1] = cTop - pHeight - gap
    } else {
      position[1] = cBottom + gap
    }

    if (props.floating(cWidth, pWidth)) {
      position[0] = Between(Between(x - pWidth / 2, cLeft, cRight - pWidth), 0, innerWidth - pWidth)
    } else {
      position[0] = Between(
        Between(cLeft + cWidth / 2 - pWidth / 2, cLeft, cRight - pWidth),
        0,
        innerWidth - pWidth
      )
    }
    return position
  } else if (placement === 'left' || placement === 'right') {
    if (placement === 'left') {
      position[0] = cLeft - pWidth - 10
    } else {
      position[0] = cRight + 10
    }
    if (props.floating(cHeight, pHeight)) {
      position[1] = Between(
        Between(y - pHeight / 2, cTop, cBottom - pHeight),
        0,
        innerHeight - pHeight
      )
    } else {
      position[1] = Between(
        Between(cTop + cHeight / 2 - pHeight / 2, cTop, cBottom - pHeight),
        0,
        innerHeight - pHeight
      )
    }
    return position
  } else {
    let d = props.placement
    let p: [number, number] = [0, 0]
    let q: [number, number] = [0, 0]

    // 获取浮动元素的定位基点
    if (d === 'A' || d === 'BA' || d === 'HA') {
      p = [pWidth, pHeight]
    } else if (d === 'C' || d === 'BC' || d === 'DC') {
      p = [0, pHeight]
    } else if (d === 'E' || d === 'DE' || d === 'FE') {
      p = [0, 0]
    } else if (d === 'G' || d === 'HG' || d === 'FG') {
      p = [pWidth, 0]
    } else if (d === 'B') {
      p = [pWidth / 2, pHeight]
      q = [cWidth / 2, 0]
    } else if (d === 'D') {
      p = [0, pHeight / 2]
      q = [cWidth, cHeight / 2]
    } else if (d === 'F') {
      p = [pWidth / 2, 0]
      q = [cWidth / 2, cHeight]
    } else if (d === 'H') {
      p = [pWidth, pHeight / 2]
      q = [0, cHeight / 2]
    }

    // 获取定位元素的定为基点
    if (d === 'A' || d === 'HG') {
      q = [0, 0]
    } else if (d === 'C' || d === 'BA' || d === 'DE') {
      q = [cWidth, 0]
    } else if (d === 'E' || d === 'DC' || d === 'FG') {
      q = [cWidth, cHeight]
    } else if (d === 'G' || d === 'HA' || d === 'FE') {
      q = [0, cHeight]
    }

    return [cLeft + q[0] - p[0], cTop + q[1] - p[1]]
  }
}

const mouseEnter = async (e: MouseEvent) => {
  if (props.mode !== 'hover') return
  clearTimeout(timeout.value)
  if ((e.target as HTMLElement)!.dataset.role === 'popover') return
  await popoverVisible(true)
}

const mouseMove = (e: MouseEvent) => {
  if (props.mode === 'hover') requestPopoverPosition(e.x, e.y)
}

const mouseLeave = () => {
  if (props.mode !== 'hover') return
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    popoverVisible(false)
  }, 100)
}

const handleOutClick = () => {
  if (limitOutClick.value) {
    limitOutClick.value = false
    return
  }
  visible.value = false
  document.removeEventListener('click', handleOutClick)
}

const handleClick = (e: MouseEvent) => {
  if (props.mode !== 'click') return
  if (!visible.value) {
    document.addEventListener('click', handleOutClick)
  }
  popoverVisible(!visible.value, e)
}

defineExpose({
  popover,
  activeArea: body,
  popoverVisible,
  visible: () => visible.value
})
</script>

<template>
  <AppendSlot
    @mouseenter="mouseEnter"
    @mousemove="mouseMove"
    @mouseleave="mouseLeave"
    @click.stop="handleClick"
    :default="$slots.default"
    ref="body"
  />
  <Teleport to="body">
    <Transition name="fade">
      <AppendSlot
        v-show="visible"
        :default="$slots.popover"
        ref="popover"
        data-role="popover"
        @mouseleave="mouseLeave"
        @mouseenter="mouseEnter"
        @mousedown="limitOutClick = true"
        @mouseup="limitOutClick = false"
        @click.stop="() => {}"
        class="popover"
        :style="{
          left: `${pos.left}px`,
          top: `${pos.top}px`,
          width: syncWidth && pos.width !== 0 ? `${pos.width}px` : undefined
        }"
        :props="{
          ...pos,
          visible: visible
        }"
      />
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
.popover {
  position: absolute;
  z-index: 1;
}
</style>
