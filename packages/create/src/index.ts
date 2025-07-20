import { select, input, confirm } from '@inquirer/prompts'
import os from 'node:os'
import { NpmPackage } from '@starry-sky-studio/my-utils'
import path from 'node:path'
import ora, { Ora } from 'ora'
import fse, { copySync } from 'fs-extra'
import { glob } from 'glob'
import ejs from 'ejs'

// 全局中断信号处理
function setupExitHandlers() {
  // 处理 Ctrl+C 中断
  process.on('SIGINT', () => {
    console.log('\n🚫 操作已取消。感谢使用 Starry Sky Studio CLI！')
    process.exit(0)
  })

  // 处理其他退出信号
  process.on('SIGTERM', () => {
    console.log('\n🛑 进程已终止。感谢使用 Starry Sky Studio CLI！')
    process.exit(0)
  })
}

async function create() {
  // 设置退出处理程序
  setupExitHandlers()

  let spinner: Ora | null = null

  try {
    const projectTemplate = await select({
      message: '请选择项目模版',
      choices: [
        {
          name: 'react 项目',
          value: '@starry-sky-studio/template-react-ts'
        },
        {
          name: 'vue 项目',
          value: '@starry-sky-studio/template-vue-ts'
        }
      ]
    })

    let projectName = ''
    while (!projectName) {
      projectName = await input({ message: '请输入项目名' })
    }

    const targetPath = path.join(process.cwd(), projectName)

    const pkg = new NpmPackage({
      name: projectTemplate,
      targetPath: path.join(os.homedir(), '.ivy-cli-template')
    })

    if (fse.existsSync(targetPath)) {
      const empty = await confirm({ message: '该目录不为空，是否清空' })
      if (empty) {
        fse.emptyDirSync(targetPath)
      } else {
        console.log('🚫 操作已取消')
        process.exit(0)
      }
    }

    if (!(await pkg.exists())) {
      spinner = ora('下载模版中...').start()
      await pkg.install()
      spinner.succeed('模版下载完成')
    } else {
      spinner = ora('更新模版中...').start()
      await pkg.update()
      spinner.succeed('模版更新完成')
    }

    spinner = ora('创建项目中...').start()

    const templatePath = path.join(pkg.npmFilePath, 'template')
    fse.copySync(templatePath, targetPath)

    spinner.succeed('项目文件复制完成')

    const renderData: Record<string, any> = { projectName }
    const deleteFiles: string[] = []

    const questionConfigPath = path.join(pkg.npmFilePath, 'questions.json')

    if (fse.existsSync(questionConfigPath)) {
      const config = fse.readJSONSync(questionConfigPath)

      for (let key in config) {
        const res = await confirm({ message: `是否启用 ${key}?` })
        renderData[key] = res

        if (!res) {
          deleteFiles.push(...config[key].files)
        }
      }
    }

    console.log('renderData', renderData)
    console.log('deleteFiles', deleteFiles)

    spinner = ora('应用项目配置...').start()

    const files = await glob('**', {
      cwd: targetPath,
      nodir: true,
      ignore: 'node_modules/**'
    })

    console.log('files', files)

    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(targetPath, files[i])
      const renderResult = await ejs.renderFile(filePath, renderData)
      console.log(`渲染文件: ${filePath} `, renderResult)
      fse.writeFileSync(filePath, renderResult)
    }

    deleteFiles.forEach((item) => {
      fse.removeSync(path.join(targetPath, item))
    })

    spinner.succeed('项目配置完成')

    console.log(`\n🎉 项目创建成功：${targetPath}`)
    console.log('👉 下一步操作:')
    console.log(`cd ${projectName}`)
    console.log('npm install')
    console.log('npm run dev\n')
  } catch (error) {
    // 处理所有错误
    if (spinner) {
      spinner.fail('操作失败')
    }

    if (error instanceof Error) {
      console.error(`❌ 错误: ${error.message}`)
    } else {
      console.error('❌ 发生未知错误')
    }

    process.exit(1)
  }
}

create()

export default create
