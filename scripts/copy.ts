import fs from 'node:fs/promises'
import path from 'node:path'

const configSrc = path.resolve('./src/shared/config/config.json')
const configDest = path.resolve('./dist/config.json')

const intlSrc = path.resolve('./src/main/intl/locales')
const intlDest = path.resolve('./dist/locales')

const overwrite = process.argv.includes('--overwrite')

const exists = async (path: string) => {
  try {
    await fs.access(path)

    return true
  } catch {
    return false
  }
}

const intlDestExists = await exists(intlDest)

if (!intlDestExists) {
  await fs.mkdir(intlDest)
}

const copyIntlFiles = async (overwrite: boolean) => {
  const files = await fs.readdir(intlSrc)

  for await (const file of files) {
    const src = path.resolve(intlSrc, file)
    const dest = path.resolve(intlDest, file)

    const fileExists = await exists(dest)

    if (!fileExists || overwrite) {
      await fs.copyFile(src, dest)
    }
  }
}

const copyConfigFile = async (overwrite: boolean) => {
  const fileExists = await exists(configSrc)

  if (!fileExists || overwrite) {
    await fs.copyFile(configSrc, configDest)
  }
}

await copyConfigFile(overwrite)
await copyIntlFiles(overwrite)
