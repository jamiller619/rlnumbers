export const isValidDate = (date?: unknown): date is Date => {
  return date != null && date instanceof Date && !isNaN(date.valueOf())
}
