import { select, input, confirm } from '@inquirer/prompts'
import os from 'node:os'
import { NpmPackage } from '@starry-sky-studio/my-utils'
import path from 'node:path'
import ora from 'ora'
import fse from 'fs-extra'
import { glob } from 'glob'
import ejs from 'ejs'

async function create() {
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
    targetPath: path.join(os.homedir(), '.guang-cli-template')
  })

  if (fse.existsSync(targetPath)) {
    const empty = await confirm({ message: '该目录不为空，是否清空' })
    if (empty) {
      fse.emptyDirSync(targetPath)
    } else {
      process.exit(0)
    }
  }

  if (!(await pkg.exists())) {
    const spinner = ora('下载模版中...').start()
    await pkg.install()
    await sleep(1000)
    spinner.stop()
  } else {
    const spinner = ora('更新模版中...').start()
    await pkg.update()
    await sleep(1000)
    spinner.stop()
  }

  const spinner = ora('创建项目中...').start()
  await sleep(1000)

  const templatePath = path.join(pkg.npmFilePath, 'template')
  console.log('os.homedir()', os.homedir())

  console.log('templatePath', templatePath)
  console.log('targetPath', targetPath)
  console.log('pkg.npmFilePath...', pkg.npmFilePath)

  fse.copySync(templatePath, targetPath)

  spinner.stop()

  const files = await glob('**', {
    cwd: targetPath,
    nodir: true,
    ignore: 'node_modules/**'
  })

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(targetPath, files[i])
    const renderResult = await ejs.renderFile(filePath, {
      projectName
    })
    fse.writeFileSync(filePath, renderResult)
  }
}

function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

create()

export default create
