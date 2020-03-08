const fs = require('fs')
const EventEmitter = require('events')

module.exports = function (request, response) {
  const readEvent = new EventEmitter()

  if(request.method === 'GET') {
    // 读取文件
    fs.readFile('./views/home/index.html', (err, page) => {
      if (err) return readEvent.emit('error', err)
      readEvent.emit('success', page)
    })

    // 读取失败
    readEvent.on('error', err => console.log('文件读取失败： ', err))
    // 读取成功
    readEvent.on('success', page => {
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end(page.toString())
    })
  }  
}