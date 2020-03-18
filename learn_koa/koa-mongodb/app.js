// 原生
const path = require('path')

// koa
const Koa = require('koa')
const serve = require('koa-static')
const views = require('koa-views')
const bodyPaser = require('koa-bodyparser')
const session = require('koa-session')

// 路由
const router = require('./router/index')

// 创建实例
const app = new Koa()

// 注册views
app.use(views(path.resolve(__dirname, 'views'), { extension: 'ejs' }))

// 注册static
app.use(serve(path.resolve(__dirname, 'static')))

// 注册bodypaser
app.use(bodyPaser())

// 注册session
app.keys = ['some secret hurr']
const config = {
  key: 'koa:sess',
  maxAge: 2000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
}
app.use(session(config, app))

// 注册路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动应用
app.listen(3000, () => {
  console.log('Server is runing at http://localhost:3000')
})