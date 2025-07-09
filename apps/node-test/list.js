import blessed from 'blessed'

const screen = blessed.screen({
  fullUnicode: true
})

// const data = [
//   '红楼梦',
//   '西游记',
//   '水浒传',
//   '三国演义',
//   '儒林外史',
//   '金瓶梅',
//   '聊斋志异',
//   '白鹿原',
//   '平凡的世界',
//   '围城',
//   '活着',
//   '百年孤独',
//   '围城',
//   '红高粱家族',
//   '梦里花落知多少',
//   '倾城之恋',
//   '悲惨世界',
//   '哈利波特',
//   '霍乱时期的爱情',
//   '白夜行',
//   '解忧杂货店',
//   '挪威的森林',
//   '追风筝的人',
//   '小王子',
//   '飘',
//   '麦田里的守望者',
//   '时间简史',
//   '人类简史',
//   '活着为了讲述',
//   '白夜行',
//   '百鬼夜行'
// ]

// const list = blessed.list({
//   width: '50%',
//   height: '50%',
//   border: 'line',
//   label: '书籍列表',
//   align: 'left',
//   right: 0,
//   bottom: 0,
//   keys: true,
//   style: {
//     fg: 'white',
//     bg: 'default',
//     selected: {
//       bg: 'blue'
//     }
//   },
//   items: data
// })

// screen.append(list)

// list.select(0)

// list.on('select', function (item) {
//   screen.destroy()

//   console.log(item.getText())
// })

// screen.key('C-c', function () {
//   screen.destroy()
// })

// list.focus()

// screen.render()

const prompt = blessed.prompt({
  parent: screen,
  border: 'line',
  height: 'shrink',
  width: 'half',
  top: 'center',
  left: 'center',
  label: ' {blue-fg}登录{/blue-fg} ',
  tags: true
})

const msg = blessed.message({
  parent: screen,
  border: 'line',
  width: 'half',
  height: 'shrink',
  top: 'center',
  left: 'center',
  label: ' {blue-fg}提示{/blue-fg} ',
  tags: true,
  hidden: true
})

prompt.input('你的用户名?', '', function (err, username) {
  prompt.input('你的密码?', '', function (err, password) {
    if (username === 'guang' && password === 'aaa123') {
      msg.display('登录成功!', 1)
    } else {
      msg.display('用户名或密码错误!', 1)
    }

    setTimeout(function () {
      screen.destroy()

      console.log(username, password)
    }, 1000)
  })
})
screen.key('C-c', function () {
  screen.destroy()
})

screen.render()
