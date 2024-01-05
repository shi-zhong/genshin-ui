import type { App } from 'vue'
import ScrollView from './index.vue'

ScrollView.name = 'GScrollView'
ScrollView.install = (app: App) => app.component(ScrollView.name, ScrollView)

export default ScrollView
