import { merge } from '@/utils'
import { onMounted, onUnmounted, reactive, ref, type Ref, isRef, computed } from 'vue'

export interface MockScrollDragOptions {
  mouseDown?: (e: MouseEvent & { payload?: Record<string, any> }) => void
  /**
   * 鼠标移动事件
   * @param e
   * @param mouseState 鼠标状态
   * @returns
   */
  mouseMove?: (
    e: MouseEvent & { payload?: Record<string, any> },
    mouseState: 'up' | 'move' | 'down'
  ) => void
  mouseUp?: (e: MouseEvent & { payload?: Record<string, any> }) => void
  moveMethod?: (
    crtPos: MousePositionInfo,
    pvePos: MousePositionInfo,
    e: MouseEvent & { payload?: Record<string, any> }
  ) => void | boolean
  stopPropagation?: (e: MouseEvent & { payload?: Record<string, any> }) => boolean
  // 用于测试实例是否挂上
  debug?: boolean
}

interface MousePositionInfo {
  clientX: number
  clientY: number
  // layerX:number;
  // layerY: number;
  movementX: number
  movementY: number
  offsetX: number
  offsetY: number
  pageX: number
  pageY: number
  // screenX: number;
  // screenY: number;
  calcMovementX: number
  calcMovementY: number
  timeStamp: number
}

/**
 * 实现模拟滚动的钩子函数, 需要在生命周期外调用
 * @param divRef 目标div节点的 ref 对象, 内部进行判断
 * @param options 事件配置选项
 * @returns
 */
export const useMockScrollDrag = (
  divRef: Ref<HTMLElement | undefined> | HTMLElement,
  options: MockScrollDragOptions
) => {
  const { mouseDown, mouseMove, mouseUp, moveMethod, stopPropagation, debug } = options

  const mouseState = ref<'up' | 'move' | 'down'>('up')

  const mousePosition = reactive<MousePositionInfo>({
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
    offsetX: 0,
    offsetY: 0,
    pageX: 0,
    pageY: 0,
    // screenX: 0,
    // screenY: 0,
    calcMovementX: 0,
    calcMovementY: 0,
    timeStamp: 0
  })

  const element = computed(() => {
    if (isRef(divRef) && divRef.value) {
      return divRef.value
    } else if (!isRef(divRef)) {
      return divRef
    }
    return undefined
  })

  /**
   * 处理模拟滚动开始事件
   * @param e
   */
  const handleMouseDown = (e: MouseEvent) => {
    if (!stopPropagation || stopPropagation(e)) {
      e.stopPropagation()
    }
    if (e.button !== 0) return handleMouseUp(e)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    mouseState.value = 'down'
    merge(mousePosition, getMousePostion(e))
    mouseDown && mouseDown(e)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (mouseState.value === 'down') {
      const _mousePosition = getMousePostion(e)
      // 同一时间戳，事件会执行两次
      if (_mousePosition.timeStamp !== mousePosition.timeStamp) {
        if (moveMethod) {
          // 默认阻止, 返回true继续传播
          if (moveMethod(_mousePosition, mousePosition, e) !== true) true
          e.stopPropagation()
        } else {
          // 默认阻止
          e.stopPropagation()
          element.value!.scrollTop -= _mousePosition.calcMovementY
        }
        merge(mousePosition, _mousePosition)
      }
    }
    mouseMove && mouseMove(e, mouseState.value)
  }

  const getMousePostion = (e: MouseEvent) => {
    const { clientX, clientY, movementX, movementY, offsetX, offsetY, pageX, pageY, timeStamp } = e

    return {
      clientX,
      clientY,
      movementX,
      movementY,
      offsetX,
      offsetY,
      pageX,
      pageY,

      calcMovementX: clientX - mousePosition.clientX,
      calcMovementY: clientY - mousePosition.clientY,
      timeStamp
    }
  }

  /**
   * 处理模拟滚动结束事件
   * @param e
   */
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    mouseState.value = 'up'
    mouseUp && mouseUp(e)
  }

  const registerEvents = () => {
    element.value!.removeEventListener('mousedown', handleMouseDown)
    if (element.value === undefined) {
      console.error('Error: Current ref has a undefined value.Unable to add event listener.')
      return
    }
    debug && console.log('MockScroll Rigisted.')
    element.value.addEventListener('mousedown', handleMouseDown)
  }

  if (isRef(divRef)) {
    onMounted(registerEvents)
  } else {
    registerEvents()
  }
  
  onUnmounted(() => {
    if (element.value === undefined) return
    element.value.removeEventListener('mousedown', handleMouseDown)
  })

  debug && console.log('MockScrollDrag runned. Ref value is', isRef(divRef) ? divRef.value : divRef)

  return {
    mouseState
  }
}
