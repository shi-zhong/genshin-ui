import type { App } from 'vue'
import Loading from './index.vue'
import SingleLoading from './SingleLoading.vue'

Loading.name = 'GLoading'
Loading.install = (app: App) => app.component(Loading.name, Loading)

SingleLoading.name = 'GSingleLoading'
SingleLoading.install = (app: App) => app.component(SingleLoading.name, SingleLoading)

export { Loading, SingleLoading }
