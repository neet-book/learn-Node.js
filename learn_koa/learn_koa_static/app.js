// 原生
const path = require('path')

// koa
const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const views = require('koa-views')
const bodypaser = require('koa-bodyparser')

// 创建实例
const app = new Koa()
const router = new Router()

// 注册views
app.use(views(path.resolve(__dirname, 'views'), { extension: 'ejs' }))

// 注册static
app.use(serve(path.resolve(__dirname, 'static')))

// 注册bodypaser
app.use(bodypaser())

app.use(async (ctx, next) => {
  console.log(ctx.request.body)

  await next()
})

// 配置路由

// 首页
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    module: 'ejs',
    date: new Date().toLocaleDateString()
  })


})

// 登录
router.post('/login', async (ctx) => {
  console.log(ctx.request.body)
  ctx.status = 200
  ctx.set({ Accept: 'application/json' })
  ctx.cookies.set('username', ctx.request.body.userName)
  ctx.app.on('data', data => console.log(data))
  let body =JSON.stringify({ token: '0oo091jdfhe' })
  ctx.body = body
})


// 注册路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动应用
app.listen(3000, () => {
  console.log('Server is runing at http://localhost:3000')
})