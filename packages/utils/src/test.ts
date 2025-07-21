import NpmPackage from './NpmPackage.js'
import { getLatestVersion, getNpmInfo, getNpmRegistry, getVersions } from './versionUtils.js'
import path from 'node:path'

async function main() {
  const pkg = new NpmPackage({
    targetPath: path.join(import.meta.dirname, '../aaa'),
    name: 'create-vite'
  })

  console.log('pkg', pkg)

  if (await pkg.exists()) {
    pkg.update()
  } else {
    pkg.install()
  }

  const latestVersion = await getLatestVersion('create-vite')

  console.log('latestVersion', latestVersion)

  console.log(await pkg.getPackageJSON())
}

main()
