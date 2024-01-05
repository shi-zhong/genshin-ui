import type { App, Component } from 'vue'

import Button from './Button'
import { Card, DetailCard } from './Card'
import HighLight from './HighLight'
import Loading from './Loading'
import Menu from './Menu'
import { Message } from './Message'
import Modal, { ModalFunc } from './Modal'
import Select from './Select'
import { TabPane, Tabs } from './Tabs'
import { AttentionDecoration, Enable, Line, Lock, RankBar, Rarity, Refine } from './Tags'

const Tags = [AttentionDecoration, Enable, Line, Lock, RankBar, Rarity, Refine]

const components: Component[] = [
  Button,
  Card,
  DetailCard,
  HighLight,
  Loading,
  Menu,
  Message,
  Modal,
  Select,
  TabPane,
  Tabs,
  ...Tags
]

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

export {
  Button,
  Card,
  DetailCard,
  HighLight,
  Loading,
  Menu,
  Message,
  Modal,
  ModalFunc,
  Select,
  TabPane,
  Tabs
}

export { AttentionDecoration, Enable, Line, Lock, RankBar, Rarity, Refine }
