import type { App } from 'vue'

import Icon from './Icon'
import ScrollView from './ScrollView'
import Popover from './Popover'


const components = [ScrollView, Icon, Popover]

// 定义install方法
const install = function (app: App<Element>) {

  // 遍历注册所有的组件
  components.forEach((component) => {
    app.component(component.name!, component)
  })
}

/**
 * 在index.ts中引入vue组件，进行命名和install注册
 */

// 判断是否直接引入文件，如果是，就不用调用Vue.use()
// @ts-ignore
if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  install(window.Vue)
}

// 导出install方法
export default {
  install
}

export { ScrollView, Icon, Popover }
