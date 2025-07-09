import ansiEscapes from 'ansi-escapes'
export interface Position {
  x: number
  y: number
}
export abstract class BaseUI {
  //标准输出流 引用
  protected readonly stdout: NodeJS.WriteStream = process.stdout
  protected print(text: string): void {
    process.stdout.write.bind(process.stdout)(text)
  }
  /**
   * 移动光标到指定位置
   * @param position 目标位置 {x, y}
   *
   * 示例:
   * setCursorAt({x: 5, y: 3}) 将光标移动到第4行第6列
   * (注意：终端坐标从 (0,0) 开始)
   */
  protected setCursorAt({ x, y }: Position): void {
    this.print(ansiEscapes.cursorMove(y, x))
  }
  /**
   * 在指定位置打印文本
   * @param message 要打印的消息
   * @param position 打印位置 {x, y}
   *
   * 示例:
   * printAt("Hello", {x: 10, y: 5}) 在第6行第11列打印 "Hello"
   */
  protected printAt(message: string, position: Position) {
    this.setCursorAt(position)
    this.print(message)
  }
  /**
   * 清除指定行的内容
   * @param row 要清除的行号
   *
   * 示例:
   * clearLine(3) 清除第4行的内容
   */
  protected clearLine(row: number) {
    // 移动到行首并清除整行
    this.printAt(ansiEscapes.eraseLine, { x: 0, y: row })
  }

  /**
   * 获取终端尺寸
   * @returns 包含列数和行数的对象
   */
  get terminalSize(): { columns: number; rows: number } {
    return {
      columns: this.stdout.columns,
      rows: this.stdout.rows
    }
  }
  /**
   * 抽象渲染方法 - 子类必须实现此方法
   * 用于定义如何绘制 UI
   */
  abstract render(): void
}
