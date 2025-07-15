import NpmPackage from './NpmPackage.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 修复: 正确获取 __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const pkg = new NpmPackage({
    targetPath: path.join(__dirname, '../aaa'),
    name: 'create-vite'
  })

  try {
    if (await pkg.exists()) {
      console.log('Updating package...')
      await pkg.update()
    } else {
      console.log('Installing package...')
      await pkg.install()
    }

    const packageJson = await pkg.getPackageJSON()
    console.log('Package info:', {
      name: packageJson.name,
      version: packageJson.version,
      bin: packageJson.bin
    })
  } catch (error) {
    console.error('Operation failed:', error)
  }
}

main()
