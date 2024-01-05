import FlowerOfLife from './flower.png'
import PlumnOfDeath from './plumn.png'
import SandsOfEon from './sands.png'
import GobletOfEonothem from './goblet.png'
import CircletOfLogos from './circlet.png'

export enum ArtifactSlots {
  FlowerOfLife = '生之花',
  PlumnOfDeath = '死之羽',
  SandsOfEon = '时之沙',
  GobletOfEonothem = '空之杯',
  CircletOfLogos = '理之冠'
}

export type ArtifactSlotsCode = keyof typeof ArtifactSlots
export type ArtifactSlotsChinese = `${ArtifactSlots}`

export const ArtifactPicture = {
  FlowerOfLife,
  PlumnOfDeath,
  SandsOfEon,
  GobletOfEonothem,
  CircletOfLogos
} as const
