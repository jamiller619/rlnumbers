import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import readdir from 'recursive-readdir'

const cwd = process.cwd()
const src = path.resolve(cwd, process.argv[2])
const dest = path.resolve(cwd, process.argv[3])

const exists = async (path: string) => {
  try {
    await fs.access(path)

    return true
  } catch {
    return false
  }
}

const destExists = await exists(dest)

if (!destExists) {
  await fs.mkdir(dest, { recursive: true })
}

const files = await readdir(src)

console.log('\nCopied:')

for await (const file of files) {
  const name = path.basename(file)
  const destFile = path.resolve(dest, name)

  await fs.copyFile(file, destFile)

  console.log(
    ` ${chalk.dim(file)}
  ↪ ${chalk.green(destFile)}
  `
  )
}
