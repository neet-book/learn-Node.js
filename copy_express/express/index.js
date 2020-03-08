const http = require('http')
const RUL = require('url')

const Express = function() {
  return (function() {
    // 保存注册的方法
    const methods = {
      get: {},
      post: {}
    }
    // app负责执行注册的方法
    const app = function (req, res) {
      let pathname = new URL(req.url, 'http://localhost:8080').pathname
      if (!pathname.endsWith('/')) pathname = pathname + '/'
      let method = req.method.toLowerCase()
      // 执行方法
      if (methods[method][pathname]) {
        if (method === 'get') {
          methods[method][pathname](req, res)
        }

        if (method === 'post') {
          let body = ''
          req.on('data', data => {
            body += data
          })
          req.on('end', () => {
            req.body = body
            methods[method][pathname](req, res)
          })
        }
      } 
    }
    // 定义一个get方法
    app.get = function(name, callback) {
      if(!name.startsWith('/')) name = '/' + name
      if(!name.endsWith('/')) name = name + '/'
      // 注册将回调函数注册为与请求相对应的方法
      methods.get[name] = callback
    }
    // 定义一个posts方法
    app.post = function() {
      if(!name.startsWith('/')) {
        name = '/' + name
      }
      methods.post[name] = callback
    }
  // 创建一个Web服务
    const server = http.createServer(app).listen(8080)
  
    app.listen = function (port) {
      server.listen(port)
    }
  
    return app
  }) ()
}

module.exports = Express

