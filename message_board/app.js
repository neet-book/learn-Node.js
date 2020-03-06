const http = require('http')
const fs = require('fs')
const path = require('path')
const template = require('art-template')

// 封装读取文件读取
const readFile = async url => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })
}

// 获取请求的资源的类型
const contentType = url => {
  let ext = path.extname(url)
  switch (true) {
    // 请求js脚本
    case ext === '.js':
      return 'application/x-javascript'
    // 请求css样式
    case ext === '.css':
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
  console.log(request.method)
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
    if(request.method === 'GET') {
      readFile('./message/msg.json')
      .then(re => {
        response.writeHead(200, { 'Content-Type': 'text/plain'})
        response.end(re.toString())
      })
      
      return
    }
  }

  // 提交留言
  if (/^\/submit/i.test(url)) {
    // 返回提交留言页面
    if (request.method === 'GET') {
      readFile('./view/submit.html')
        .then (re => {
          response.writeHead(200, { "Content-Type": 'text/html' })
          response.end(re.toString())
        })
      
      return
    }
    // 提交留言
    if (request.method === 'POST') {
      let postData = ''
      request.on('data', chunk => {
        postData += chunk
      })
      // 留言接受完毕
      request.on('end', () => {
        let newMsg = JSON.parse(postData)
  
        // 获取所有保存的留言
        readFile('./message/msg.json')
        .then(re => {
          const msgs = JSON.parse(re)
          // 将留言添加至前面
          msgs.unshift(newMsg)
          let msgsStr = JSON.stringify(msgs)
          // 保存
          fs.writeFile('./message/msg.json', msgsStr, function (e) {
            // 返回结果
            if (e) {
              console.log('写入失败', e)
              response.writeHead(500)
              resopnse.end()
            } else {
              response.writeHead(301, { 'Location': '/'})
              response.end('ok')
            }
          })
        })
      })

      return
    }
  }
  response.writeHead(404, { 'Content-Type': 'text/html'})
  response.end()
}).listen(8080)

console.log('Server runing at http://localhost:8080/')


