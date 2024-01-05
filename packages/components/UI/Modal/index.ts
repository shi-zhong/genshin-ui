import { createApp, type App } from 'vue'
import Modal from './Modal.vue'
import { type ModalButtonConfig } from './Modalview.vue'
import CommandModalVue from './CommandModal.vue'

Modal.name = 'GModal'

Modal.install = (app: App) => app.component(Modal.name, Modal)

interface ModalOptionProps {
  title?: string
  text?: string
  mask?: boolean
  theme?: 'dark' | 'light'
  ok?: ModalButtonConfig
  cancel?: ModalButtonConfig
}

interface ModalCallback {
  onOk?: () => void
  onCancel?: () => void
  onClose?: () => void
}

const ModalFunc = (option: ModalOptionProps = { text: '' }, callback: ModalCallback = {}) => {
  const doc = document.createElement('div')
  document.body.appendChild(doc)
  const app = createApp(CommandModalVue, {
    unmount: () => {
      app.unmount()
      doc.remove()
    },
    ...callback,
    ...option
  })

  app.mount(doc)
}

export default Modal
export { ModalFunc }
