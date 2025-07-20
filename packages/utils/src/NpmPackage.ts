import fs from 'node:fs'
import fse from 'fs-extra'
// @ts-ignore
import npminstall from 'npminstall'
import { getLatestVersion, getNpmRegistry } from './versionUtils.js'
import path from 'node:path'

export interface NpmPackageOptions {
  name: string
  targetPath: string
}

class NpmPackage {
  name: string // 包名
  version: string = '' // 版本，初始为空
  targetPath: string // 目标路径
  storePath: string // 存储路径

  constructor(options: NpmPackageOptions) {
    this.targetPath = options.targetPath
    this.name = options.name
    // 设置存储路径为目标路径下的node_modules
    this.storePath = path.resolve(options.targetPath, 'node_modules')
  }

  //  准备工作：创建目录并获取最新版本号
  async prepare() {
    if (!fs.existsSync(this.targetPath)) {
      fse.mkdirpSync(this.targetPath) // 递归创建目录
    }
    const version = await getLatestVersion(this.name)
    this.version = version
  }

  async install() {
    await this.prepare()

    return npminstall({
      pkgs: [
        {
          name: this.name,
          version: this.version
        }
      ],
      registry: getNpmRegistry(), // 获取npm镜像地址
      root: this.targetPath // 安装到目标路径
    })
  }

  get npmFilePath() {
    // 格式：.store/@scope+package@version/node_modules/@scope/package
    // 正确格式：@scope+package@version
    if (!this.version) {
      throw new Error('版本号未初始化，请先调用prepare()')
    }
    const storeDir = `${this.name.replace('/', '+')}@${this.version}`

    return path.resolve(this.storePath, `.store/${storeDir}/node_modules/${this.name}`)
  }

  async exists() {
    await this.prepare()

    return fs.existsSync(this.npmFilePath)
  }

  async getPackageJSON() {
    if (await this.exists()) {
      return fse.readJsonSync(path.resolve(this.npmFilePath, 'package.json'))
    }
    return null
  }

  async getLatestVersion() {
    return getLatestVersion(this.name)
  }

  async update() {
    const latestVersion = await this.getLatestVersion()
    return npminstall({
      root: this.targetPath,
      registry: getNpmRegistry(),
      pkgs: [
        {
          name: this.name,
          version: latestVersion
        }
      ]
    })
  }
}

export default NpmPackage
