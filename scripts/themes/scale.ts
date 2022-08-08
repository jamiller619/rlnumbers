type Step3 = 'small' | 'medium' | 'large'
type Step5 = 'smaller' | Step3 | 'larger'
type Step7 = 'smallest' | Step5 | 'largest'

type Value = number | string | string[] | null

type Scale<T extends string> = {
  [key in T]: Value
} & {
  [key: number]: Value
}

const arrayToMap = <T>(array: T[]) => {
  return array.reduce((map, item, i) => {
    map[i] = item

    return map
  }, {} as Record<number, T>)
}

export const create = (data: Value[]) => {
  const scale = arrayToMap(data)

  if (data.length === 5) {
    return {
      ...scale,
      smaller: scale[0],
      small: scale[1],
      medium: scale[2],
      large: scale[3],
      larger: scale[4],
    } as Scale<Step5>
  } else if (data.length === 7) {
    return {
      ...scale,
      smallest: scale[0],
      smaller: scale[1],
      small: scale[2],
      medium: scale[3],
      large: scale[4],
      larger: scale[5],
      largest: scale[6],
    } as Scale<Step7>
  }

  return {
    ...scale,
    small: scale[0],
    medium: scale[1],
    large: scale[2],
  } as Scale<Step3>
}
