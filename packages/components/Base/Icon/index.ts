import type { App } from 'vue'
import Icon from './index.vue'

Icon.name = 'GIcon'
Icon.install = (app: App) => app.component(Icon.name, Icon)

export default Icon
