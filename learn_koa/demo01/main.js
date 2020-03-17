// 原生模块
const path = require('path')

// 引入koa
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')

// 引入模板引擎
const ejs = require('ejs')

// 创建应用
const app = new Koa()
// 创建路由
const router = new Router()

// 注册模板引擎
app.use(views(path.resolve(__dirname, 'views/'), {
  // 配置views
  // 设置模板文件使用的哪种渲染的模板引擎，如果设置了此项，模板文件扩展名应该是html而不是ejs
  map: { html: 'ejs' },
  // 设置模板文件的扩展名，如设置了此项则渲染模板时不需要指定模板文件的扩展名
  extension: 'ejs',
}))

// 配置模板公共数据
app.use(async (ctx, next) => {
  // 在ctx.state中定义多个路由其模板所需要使用的公共变量
  ctx.state.date = new Date().toLocaleDateString()
  await next()
})

// 配置路由
router.get('/', async  (ctx) => {
  // 渲染模板
  // 如果注册views时没有设置autoRender,那么不需要手动将结果返回
  await ctx.render('index', { module: 'ejs' })
})

router.get('/test', ctx => {
  if(ctx.cookies.get('userName') === undefined) {
    // 将中文装换二进制数据，然后装换为base64字符串
    let cookies = (Buffer.form('中文')).toString('base64')
    console.log(cookies)
    ctx.cookies.set('userName', cookies)
  } else {
    let cookies = ctx.cookies.get('userName')
    // 将其还原
    console.log(cookies)
    let userName = Buffer.from(cookies, 'base64').toString()
    console.log(userName)
  }
})

// 注册路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动应用
app.listen(3000, () => {
  console.log('Server runing at http://localhost:3000')
})

