import type { App } from 'vue'
import Select from './index.vue'

Select.name = 'GSelect'
Select.install = (app: App) => app.component(Select.name, Select)

export default Select
