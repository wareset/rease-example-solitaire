const OFFSETS_X = [8.34, 99.25, 91.67, 84.095, 76.52, 68.945, 61.365, 53.785, 46.21, 38.635, 31.05, 23.475, 15.9] as const
const OFFSETS_Y: any = [[2.9, 70.34], [29.58, 97.1]]

export type TypeCard = {
  id: string
  // key: number
  view: boolean
  final: boolean,
  cards: TypeCard[]
  readonly color: number
  readonly suit: number
  readonly value: number
  readonly ox: number
  readonly oy: number
}

export const CARDS = ((): TypeCard[] => {
  const res: any[] = []
  for (let c = 2; c-- > 0;) {
    for (let s = 2; s-- > 0;) {
      for (let oy = OFFSETS_Y[c][s], t = OFFSETS_X.length; t-- > 0;) {
        res.push({ color: c, suit: s, value: t, ox: OFFSETS_X[t], oy })
      }
    }
  }
  return res
})()
