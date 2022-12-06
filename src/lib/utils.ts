export const shuffle = <T>(list: T[]): T[] => {
  let j: number, temp: T
  for (let i = list.length; i-- > 0;) {
    temp = list[j = Math.random() * i | 0]
    list[j] = list[i]; list[i] = temp
  }
  return list
}

// export const sample = <T>(list: ArrayLike<T>): T =>
//   list[Math.random() * list.length | 0]

export const spliceFromNum = <T>(from: T[], num: number): T[] =>
  from.splice(from.length - num, num)

export const last = <T>(list: T[], offset?: number): T | undefined =>
  list[list.length - 1 - (offset || 0)]
