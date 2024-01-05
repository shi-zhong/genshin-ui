import type { App } from 'vue'
import Menu from './index.vue'

Menu.name = 'GMenu'
Menu.install = (app: App) => app.component(Menu.name, Menu)

export default Menu
