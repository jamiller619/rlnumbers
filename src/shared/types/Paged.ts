export default interface Paged<T> {
  data: T[]
  count: number
  page: number
  take: number
}
