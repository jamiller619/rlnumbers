const ext = '.replay'

export default function isReplay(file: string) {
  return file.endsWith(ext)
}
