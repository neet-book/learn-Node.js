// 原生
const path = require('path')

// koa
const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const views = require('koa-views')

// 创建实例
const app = new Koa()
const router = new Router()

// 注册views
app.use(views(path.resolve(__dirname, 'views'), { extension: 'ejs' }))

// 注册static
app.use(serve(path.resolve(__dirname, 'static')))

// 配置路由
router.get('/', async (ctx) => {
  await ctx.render('index', {
    module: 'ejs',
    date: new Date().toLocaleDateString()
  })
})

// 注册路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动应用
app.listen(3000, () => {
  console.log('Server is runing at http://localhost:3000')
})