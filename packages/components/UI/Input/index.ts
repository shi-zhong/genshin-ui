import type { App } from 'vue'
import InputNumber from './InputNumber.vue'
import Slider from './Slider.vue'

InputNumber.name = 'GInputNumber'
InputNumber.install = (app: App) => {
  app.component(InputNumber.name, InputNumber)
}

Slider.name = 'GInputNumberSlider'
Slider.install = (app: App) => {
  app.component(Slider.name, Slider)
}

export { InputNumber, Slider }
