import type { App } from 'vue'
import HighLight from './index.vue'

HighLight.name = 'GHighLight'
HighLight.install = (app: App) => app.component(HighLight.name, HighLight)

export default HighLight
