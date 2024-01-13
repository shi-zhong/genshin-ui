import type { App } from 'vue'

import UI from '@@/UI'
import Base from '@@/Base'

import './assets/styles/index.less'

// 定义install方法
const install = function (app: App<Element>) {
  UI.install(app)
  Base.install(app)
}

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

export * from '@@/UI'
export * from '@@/Base'
export * from '@/assets'
export * from '@/utils/outputUtils'
export * from './version'
