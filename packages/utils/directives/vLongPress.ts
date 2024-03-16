import { type Directive } from 'vue'

/**
 * 长按指令
 * 1. 接受一个纯数字arg作为长按前置阈值
 * 2. 接受一个 mouseDown 函数，返回一个函数在长按结束后运行
 * 3. 接受.repeat修饰符和一个纯数字修饰符作为长按间隔
 *
 * clickCancel 用于在长按触发后取消 onclick事件
 */
export const LongPress = (): { vLong: Directive<HTMLElement, Function>; clickCancel: Function } => {
  let longPressFlag = false
  return {
    vLong: {
      mounted(el, binding) {
        const mouseDown = () => {
          let mouseupCancelCallback: any

          const repeatTime = Number(
            Object.keys(binding.modifiers).find((m) => !Number.isNaN(Number(m))) ?? 500
          )

          let timeout = setTimeout(
            () => {
              longPressFlag = true
              longPressFunc()
            },
            Number(binding.arg) || 1000
          )

          const longPressFunc = () => {
            mouseupCancelCallback = binding.value(window, document)
            if (binding.modifiers.repeat) {
              timeout = setTimeout(longPressFunc, repeatTime)
            }
          }

          const cancel = () => {
            clearTimeout(timeout)
            mouseupCancelCallback && mouseupCancelCallback()
            document.removeEventListener('mousemove', cancel)
            document.removeEventListener('mouseup', cancel)
          }

          document.addEventListener('mouseup', cancel)
          document.addEventListener('mousemove', cancel)
        }

        el.addEventListener('mousedown', mouseDown)
      }
    },
    /**
     * 使用该函数进行包装，当进行长按时会阻止点击时间
     * @param fn c
     * @returns
     */
    clickCancel: (fn: Function) => {
      if (longPressFlag) {
        longPressFlag = false
        return
      }
      fn()
    }
  }
}
