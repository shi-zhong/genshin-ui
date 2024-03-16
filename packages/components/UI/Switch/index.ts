import type { App } from 'vue'
import Switch from './index.vue'

Switch.name = 'GSwitch'
Switch.install = (app: App) => {
  app.component(Switch.name, Switch)
}

export default Switch
