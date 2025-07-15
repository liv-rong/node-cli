// 导入交互式命令行工具
import { select, input } from '@inquirer/prompts'

// 导入操作系统相关功能
import os from 'node:os'

// 导入自定义的NPM包管理工具
import { NpmPackage } from '@starry-sky-studio/utils'

// 导入路径处理工具
import path from 'node:path'

// 导入加载动画工具
import ora from 'ora'

// 定义创建项目的主函数
async function create() {
  /**
   * 第一步：让用户选择项目模板
   *
   * 使用下拉选择框让用户选择要创建的项目类型
   * 这里提供了两种模板：React项目和Vue项目
   */
  const projectTemplate = await select({
    message: '请选择项目模版', // 提示信息
    choices: [
      // 选项列表
      {
        name: 'react 项目', // 选项显示名称
        value: '@starry-sky-studio/template-react' // 选项对应的实际值（npm包名）
      },
      {
        name: 'vue 项目',
        value: '@starry-sky-studio/template-vue'
      }
    ]
  })

  /**
   * 第二步：让用户输入项目名称
   *
   * 使用输入框让用户输入项目名称
   * 这里设置了一个循环，确保用户必须输入非空的项目名称
   */
  let projectName = ''
  while (!projectName) {
    // 显示提示信息，等待用户输入
    projectName = await input({ message: '请输入项目名' })

    // 如果用户没有输入任何内容，循环会继续，要求重新输入
  }

  /**
   * 第三步：处理项目模板
   *
   * 创建NpmPackage实例来管理项目模板
   * 模板将被下载到用户主目录的隐藏文件夹中
   */
  const pkg = new NpmPackage({
    name: projectTemplate, // 模板的npm包名
    // 目标路径：用户主目录下的隐藏文件夹 .guang-cli-template
    targetPath: path.join(os.homedir(), '.starry-sky-studio-template')
  })

  /**
   * 第四步：检查模板是否存在并下载/更新
   *
   * 如果模板不存在，则下载
   * 如果已存在，则更新到最新版本
   * 使用ora显示加载动画，提升用户体验
   */
  if (!(await pkg.exists())) {
    // 显示"下载模版中..."的加载动画
    const spinner = ora('下载模版中...').start()

    // 下载模板
    await pkg.install()

    // 等待1秒，让用户看到完成提示（实际项目中可能需要根据下载速度调整）
    await sleep(1000)

    // 停止加载动画
    spinner.stop()
  } else {
    // 显示"更新模版中..."的加载动画
    const spinner = ora('更新模版中...').start()

    // 更新模板到最新版本
    await pkg.update()

    // 等待1秒
    await sleep(1000)

    // 停止加载动画
    spinner.stop()
  }
}

/**
 * 辅助函数：模拟等待
 *
 * 创建一个Promise，在指定时间后resolve
 * 用于在操作完成后显示短暂的成功提示
 *
 * @param timeout 等待时间(毫秒)
 * @returns Promise对象
 */
function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

// 启动项目创建流程
create()

// 导出create函数，以便其他模块可以使用
export default create
