const http = require('http')
const router = require('./router/')
const url = require('url')

http.createServer(function(request, response) {
  router(request, response, request.url)
}).listen(8080)

console.log('Sever runing in http://localhost:8080/')

