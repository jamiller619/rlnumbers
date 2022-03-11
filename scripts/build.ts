import chalk from 'chalk'
import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import pkgJSON from '../package.json'

// This file is output to .scripts/scripts/build.js by tsc.
// The additional level of nesting is a result of also
// having the main package.json within the
// tsconfig.scripts.json project.
//* Only use "root" with "new URL()" */
const root = (p: string) => `'../..'/${p}`

const copyPackageJSON = async () => {
  // Remove the scripts and devDependencies sections from
  // dist version of the package.json
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { scripts, devDependencies, ...json } = pkgJSON

  await fs.writeFile('dist/package.json', JSON.stringify(json, null, 2))
}

const build = {
  cli: async () => {
    try {
      await esbuild.build({
        entryPoints: ['src/cli/index.ts'],
        outfile: 'dist/cli.js',
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node16',
        external: Object.keys(pkgJSON.dependencies),
      })

      await copyPackageJSON()

      const result = new URL(root('dist/cli.js'), import.meta.url)

      console.log(chalk.green(`cli build complete: ${result.href}`))
    } catch (err) {
      console.error(err)
    }
  },
}

build.cli().catch(console.error)
