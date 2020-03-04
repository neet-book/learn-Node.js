const http = require('http')
const fs = require('fs')
const template = require('art-template')

// 封装读取文件读取
const readFile = url => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

// 获取请求的资源的类型
const contentType = url => {
  switch (true) {
    // 请求js脚本
    case /\.js$/.test(url):
      console.log(/\.js$/.test(url))
      return 'application/x-javascript'
    // 请求css样式
    case /\.css$/.test(url):
      console.log(/\.css$/.test(url))
      return 'text/css'
    // 无匹配文件类型
    default:
      console.log('请求的资源类型错误：', `url: ${url}`)
      return false
  }
}

// 解析时间戳
const parseDate = function (time) {
  const date = new Date(time)
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
}

// 创建Http应用
const options = { host: 'localhost' }
http.createServer(options, function (request, response) {
  const url = request.url
  console.log('request url: ', url)

  // 请求页面
  if (url === '/') {
    readFile('./view/index.html')
      .then(tem => {
        // 成功读取到html模板文件
        
        // 获取留言列表
        readFile('./message/msg.json')
          .then(re => {
            let list = JSON.parse(re.toString())
            console.log(list)
            // 解析时间戳
            list.forEach((item, index, arr) => {
              arr[index].date = parseDate(arr[index].date)
            })

            // 渲染模板
            const page = template.render(tem.toString(), { list })
            response.writeHead(200, { 'Content-Type': 'text/html'})
            response.end(page)
          })
        
      })
      .catch(err => {
        console.log('请求页面: ', err)
      })

      return
  }

  // 请求资源
  if (/^\/public/i.test(url)) {
    let type = contentType(url);
    // 是否有请求的文件类型(暂不支持图片)
    if (!type) {
      response.writeHead(404, { 'Content-Type': 'text/plain' })
      response.end('Requested file type not found')
      return
    } 
    // 发送请求的文件
    readFile('.' + url)
      .then(re => {
        //  读取成功
        console.log('文件读取成功', url)
        response.writeHead(200, { 'Content-Type': type })
        response.end(re.toString())
      })
      .catch(err => {
        // 读取失败
        console.log('文件读取失败', url)
        response.writeHead(404, { 'Content-Type': 'text/plain' })
        response.end('Requested file not found')
      })
      
    return
  }

  // 请求留言列表
  if (/^\/msg/i.test(url)) {
    readFile('./message/msg.json')
      .then(re => {
        response.writeHead(200, { 'Content-Type': 'text/plain'})
        response.end(re.toString())
      })

    return
  }
  response.writeHead(404, { 'Content-Type': 'text/html'})
  response.end()
}).listen(8080)

console.log('Server runing at http://localhost:8080/')
