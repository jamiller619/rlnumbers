#!/usr/bin/env node
import chalk from 'chalk'
import globSync from 'glob'
import process from 'node:process'
import ReplayImporter from '~/replays/ReplayImporter'

const glob = async (dir: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    globSync(`${dir}/**/*.replay`, (err, files) => {
      if (err != null) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

const getReplayFiles = async (...dirs: string[]): Promise<string[]> => {
  const results = await Promise.all(dirs.map(glob))

  return results.flat()
}

const main = async (...args: string[]) => {
  const paths = args

  if (paths != null) {
    console.log(chalk.green('Using paths'), ...paths)
  }

  const replayFiles = await getReplayFiles(...paths)
  const importer = new ReplayImporter(replayFiles)

  importer.on('progress', (pct) => {
    console.log(chalk.blue(`Importing ${pct * 100}%`))
  })

  importer.on('error', (err) => {
    console.error(err)
  })

  importer.on('complete', () => {
    console.log(chalk.green('Import complete'))

    process.exit(0)
  })
}

const args = process.argv.slice(2)

main(...args).catch(console.error)
