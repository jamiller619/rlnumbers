type Sort<T> = {
  prop: keyof T
  order: 'asc' | 'desc'
}

export default Sort
