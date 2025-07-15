import axios from 'axios'
import urlJoin from 'url-join'

// 获取 npm 注册表地址
export function getNpmRegistry() {
  return 'https://registry.npmmirror.com'
}

// 获取 npm 包信息
export async function getNpmInfo(packageName: string) {
  const register = getNpmRegistry()

  // 修复：对作用域包名进行编码
  const encodedName = packageName.startsWith('@')
    ? `@${encodeURIComponent(packageName.substring(1))}`
    : packageName

  const url = urlJoin(register, encodedName)
  console.log('Fetching package info from:', url)

  try {
    const response = await axios.get(url)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error(`Unexpected status code: ${response.status}`)
    }
  } catch (error: any) {
    // 更详细的错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      throw new Error(`Request failed with status ${error.response.status}: ${error.response.data}`)
    } else if (error.request) {
      // 请求已发送但无响应
      throw new Error('No response received from npm registry')
    } else {
      // 请求设置错误
      throw new Error(`Request setup error: ${error.message}`)
    }
  }
}

// 获取最新版本号
export async function getLatestVersion(packageName: string) {
  const data = await getNpmInfo(packageName)
  return data['dist-tags']?.latest
}

// 获取所有版本号
export async function getVersions(packageName: string) {
  const data = await getNpmInfo(packageName)
  return Object.keys(data.versions || {})
}

// 测试函数
async function test() {
  try {
    console.log('Testing npm package info...')

    // 测试有效的包名
    const viteInfo = await getNpmInfo('create-vite')
    console.log('Vite info:', {
      name: viteInfo.name,
      description: viteInfo.description,
      versions: Object.keys(viteInfo.versions).length
    })

    // 测试获取最新版本
    const latestVersion = await getLatestVersion('create-vite')
    console.log('Latest version of create-vite:', latestVersion)

    // 测试获取所有版本
    const versions = await getVersions('create-vite')
    console.log(`Total versions of create-vite: ${versions.length}`)
    console.log('First 5 versions:', versions.slice(0, 5))
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// 执行测试
test()
