import type { App } from 'vue'
import Popover from './index.vue'

Popover.name = 'GPopover'
Popover.install = (app: App) => app.component(Popover.name, Popover)

export * from './interface'

export default Popover
