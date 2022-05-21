import globSync from 'glob'

export default function glob(globbed: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    globSync(globbed, (err, files) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}
