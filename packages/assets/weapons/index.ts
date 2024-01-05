import Bow from './bow.png'
import Claymore from './claymore.png'
import Catalyst from './catalyst.webp'
import Polearm from './polearm.png'
import Sword from './sword.webp'

export enum Weapons {
  Bow = '弓',
  Claymore = '双手剑',
  Catalyst = '法器',
  Polearm = '长柄武器',
  Sword = '单手剑'
}

export const WeaponPicture = {
  Bow,
  Claymore,
  Catalyst,
  Polearm,
  Sword
} as const

export type WeaponsCode = keyof typeof Weapons
export type WeaponsChinese = `${Weapons}`
