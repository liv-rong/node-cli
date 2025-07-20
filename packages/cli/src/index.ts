#!/usr/bin/env node
import create from '@starry-sky-studio/my-create'
import { Command } from 'commander'
import fse from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 获取当前模块的路径
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgJson = fse.readJSONSync(path.join(__dirname, '../package.json'))

// 检测是否通过 pnpm create 调用
const isCreateCommand =
  process.argv[1] &&
  (process.argv[1].includes('create-starry-sky-studio') ||
    process.argv[1].includes('create-starry-sky-studio'))

const program = new Command()

// 设置退出处理函数
function setupExitHandlers() {
  // 处理 Ctrl+C 中断
  process.on('SIGINT', () => {
    console.log('\n🚫 操作已取消。感谢使用 starry-sky-studio CLI！')
    process.exit(0)
  })

  // 处理其他退出信号
  process.on('SIGTERM', () => {
    console.log('\n🛑 进程已终止。感谢使用 starry-sky-studio CLI！')
    process.exit(0)
  })
}

program
  .name('starry-sky-studio-my-cil')
  .description('Starry Sky Studio 脚手架工具')
  .version(pkgJson.version)
  .configureOutput({
    // 重写输出格式，添加更多信息
    outputError: (str, write) => write(`❌ 错误: ${str}`)
  })

// 设置退出处理程序
setupExitHandlers()

// 处理 pnpm create 调用
if (isCreateCommand) {
  create().catch((err) => {
    console.error('项目创建失败:', err.message)
    process.exit(1)
  })
} else {
  // 正常命令模式
  program
    .command('create')
    .description('创建一个新项目')
    .action(async () => {
      try {
        await create()
      } catch (err: any) {
        console.error('❌ 项目创建失败:', err.message)
        process.exit(1)
      }
    })

  // 添加帮助命令
  program
    .command('help')
    .description('显示帮助信息')
    .action(() => program.help())

  // 添加退出处理
  program.hook('preAction', () => {
    setupExitHandlers()
  })

  // 解析命令行参数
  program.parse(process.argv)
}
