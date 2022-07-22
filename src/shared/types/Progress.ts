export default interface Progress {
  progress: number | null
  total: number | null
  message: string | null
  status: 'success' | 'error' | null
}
