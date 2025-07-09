// console.log('123\u001B[1K456')
// import readline from 'node:readline'
// const repeatCount = process.stdout.rows - 2
// const blank = repeatCount > 0 ? '.repeat(repeatCount)' : ''
// console.log(blank)
// readline.cursorTo(process.stdout, 0, 0)
// readline.clearScreenDown(process.stdout)

// import ansiEscapes from 'ansi-escapes'

// const log = process.stdout.write.bind(process.stdout)

// log(ansiEscapes.cursorTo(10, 1) + '111')
// log(ansiEscapes.cursorTo(7, 2) + '222')
// log(ansiEscapes.cursorTo(5, 3) + '333')

// setTimeout(() => {
//   log(ansiEscapes.cursorTo(0, 2) + ansiEscapes.eraseEndLine)
//   log(ansiEscapes.cursorTo(5, 3) + '444')
// }, 1000)

import chalk from 'chalk'

const log = console.log

log(chalk.blue('Hello') + ' World' + chalk.red('!'))
log(chalk.blue.bgRed.bold('Hello world!'))
log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'))
log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'))
log(
  chalk.green(
    'I am a green line ' +
      chalk.blue.underline.bold('with a blue substring') +
      ' that becomes green again!'
  )
)

log(`
    CPU: ${chalk.red('90%')}
    RAM: ${chalk.green('40%')}
    DISK: ${chalk.yellow('70%')}
`)

log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'))
log(chalk.hex('#DEADED').bold('Bold gray!'))
