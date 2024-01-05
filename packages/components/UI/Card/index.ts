import type { App } from 'vue'
import Card from './Card.vue'
import DetailCard from './DetailCard.vue'

Card.name = 'GCard'
Card.install = (app: App) => app.component(Card.name, Card)

DetailCard.name = 'GDetailCard'
DetailCard.install = (app: App) => app.component(DetailCard.name, DetailCard)


export {
  Card,
  DetailCard
}