import AnemoPng from './png/anemo.png'
import ElectroPng from './png/electro.png'
import HydroPng from './png/hydro.png'
import PyroPng from './png/pyro.png'
import CryoPng from './png/cryo.png'
import DendroPng from './png/dendro.png'
import GeoPng from './png/geo.png'

import AnemoWebp from './webp/anemo.webp'
import ElectroWebp from './webp/electro.webp'
import HydroWebp from './webp/hydro.webp'
import PyroWebp from './webp/pyro.webp'
import CryoWebp from './webp/cryo.webp'
import DendroWebp from './webp/dendro.webp'
import GeoWebp from './webp/geo.webp'

export enum Elements {
  Pyro = '火',
  Hydro = '水',
  Anemo = '风',
  Electro = '雷',
  Dendro = '草',
  Cryo = '冰',
  Geo = '岩'
}

export enum ElementsCTE {
  火 = 'Pyro',
  水 = 'Hydro',
  风 = 'Anemo',
  雷 = 'Electro',
  草 = 'Dendro',
  冰 = 'Cryo',
  岩 = 'Geo'
}

export type ElementsCode = keyof typeof Elements
export type ElementsChinese = `${Elements}`

export const ElementPng = {
  // 火
  Pyro: PyroPng,
  // 水
  Hydro: HydroPng,
  // 风
  Anemo: AnemoPng,
  // 雷
  Electro: ElectroPng,
  // 草
  Dendro: DendroPng,
  // 冰
  Cryo: CryoPng,
  // 岩
  Geo: GeoPng
} as const

export const ElementWebp = {
  // 火
  Pyro: PyroWebp,
  // 水
  Hydro: HydroWebp,
  // 风
  Anemo: AnemoWebp,
  // 雷
  Electro: ElectroWebp,
  // 草
  Dendro: DendroWebp,
  // 冰
  Cryo: CryoWebp,
  // 岩
  Geo: GeoWebp
} as const


