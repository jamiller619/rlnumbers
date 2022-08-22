import readdir from 'readdirp'
import isReplay from './isReplay'

export default async function getReplayFiles(dir?: string | null) {
  if (dir != null) {
    const entries = await readdir.promise(dir, {
      alwaysStat: false,
      fileFilter: (entry) => isReplay(entry.path),
    })

    return entries.map((e) => e.fullPath)
  }
}
