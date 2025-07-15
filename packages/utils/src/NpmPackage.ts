import fs from 'node:fs/promises' // 使用 Promise-based API
import fse from 'fs-extra'

//@ts-ignore
import npminstall from 'npminstall'
import { getLatestVersion, getNpmRegistry } from './versionUtils.js'
import path from 'node:path'

export interface NpmPackageOptions {
  name: string
  targetPath: string
}

class NpmPackage {
  name: string
  version: string = ''
  targetPath: string
  storePath: string

  constructor(options: NpmPackageOptions) {
    this.targetPath = options.targetPath
    this.name = options.name
    // 修复1: 使用正确的模块路径
    this.storePath = path.resolve(options.targetPath, 'node_modules')
  }

  async prepare() {
    if (!(await fse.pathExists(this.targetPath))) {
      await fse.mkdirp(this.targetPath)
    }
    const version = await getLatestVersion(this.name)
    this.version = version
  }

  async install() {
    await this.prepare()

    // 修复2: 添加详细的日志
    console.log(`Installing ${this.name}@${this.version} to ${this.targetPath}`)

    return npminstall({
      pkgs: [
        {
          name: this.name,
          version: this.version
        }
      ],
      registry: getNpmRegistry(),
      root: this.targetPath,
      // 修复3: 显式设置存储目录
      storeDir: path.resolve(this.targetPath, '.store')
    })
  }

  // 修复4: 使用正确的包路径
  get npmFilePath() {
    return path.resolve(this.storePath, this.name)
  }

  async exists() {
    return fse.pathExists(this.npmFilePath)
  }

  // 修复5: 使用异步读取
  async getPackageJSON() {
    if (await this.exists()) {
      const pkgPath = path.resolve(this.npmFilePath, 'package.json')
      return fse.readJson(pkgPath)
    }
    return null
  }

  async getLatestVersion() {
    return getLatestVersion(this.name)
  }

  async update() {
    const latestVersion = await this.getLatestVersion()
    this.version = latestVersion

    // 修复6: 安装前清理旧版本
    if (await this.exists()) {
      await fse.remove(this.npmFilePath)
    }

    return this.install()
  }
}

export default NpmPackage
