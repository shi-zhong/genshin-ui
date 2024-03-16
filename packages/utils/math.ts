export const Round = (x: number, precision: number): number => {
  return Math.floor(x * Math.pow(10, precision) + 0.5) / Math.pow(10, precision)
}

export const StepRound = (x: number, step: number) => {
  return step * (Math.floor(x / step)) + Math.round((x % step) / step) * step
}

export const Between = (x: number, min?: number, max?: number) => {
  if (min === undefined) {
    min = -Infinity
  }

  if (max === undefined) {
    max = Infinity
  }

  if (min > max) {
    ;[min, max] = [max, min]
  }
  return x < min ? min : x > max ? max : x
}

export const IsBetween = (x: number, min: number | undefined, max: number | undefined) => {
  return Between(x, min, max) === x
}

/**
 * 增幅 2.78x/(1400+x)
 * 聚变 16x/(2000+x)
 * 激化 5x / (1200+x)
 * 结晶 4.44x / (1400+x)
 */
export const ElementMastery = (master: number) => {
  return {
    amplification: Round((2.78 * master) / (1400 + master), 4),
    fusion: Round((16 * master) / (2000 + master), 4),
    intensify: Round((5 * master) / (1200 + master), 4),
    crystal: Round((4.44 * master) / (1400 + master), 4)
  }
}
