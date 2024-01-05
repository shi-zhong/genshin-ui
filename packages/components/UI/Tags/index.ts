import AttentionDecoration from './AttentionDecoration.vue'
import Enable from './Enable.vue'
import Line from './Line.vue'
import Lock from './Lock.vue'
import RankBar from './RankBar.vue'
import Rarity from './Rarity.vue'
import Refine from './Refine.vue'

import type { App } from 'vue'

export * from './functions'

AttentionDecoration.name = 'GAttentionDecoration'
AttentionDecoration.install = (app: App) =>
  app.component(AttentionDecoration.name, AttentionDecoration)

Enable.name = 'GEnable'
Enable.install = (app: App) => app.component(Enable.name, Enable)

Line.name = 'GLine'
Line.install = (app: App) => app.component(Line.name, Line)

Lock.name = 'GLock'
Lock.install = (app: App) => app.component(Lock.name, Lock)

RankBar.name = 'GRankBar'
RankBar.install = (app: App) => app.component(RankBar.name, RankBar)

Rarity.name = 'GRarity'
Rarity.install = (app: App) => app.component(Rarity.name, Rarity)

Refine.name = 'GRefine'
Refine.install = (app: App) => app.component(Refine.name, Refine)

export { AttentionDecoration, Enable, Line, Lock, RankBar, Rarity, Refine }
