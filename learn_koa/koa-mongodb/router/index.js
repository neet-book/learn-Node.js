const Router = require('koa-router')
const router = new Router()

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
  ctx.cookies.set('userName', ctx.request.body.userName)
  let body =JSON.stringify({ contet: '成功' })
  ctx.body = body
})

// session
router.get('/session', async (ctx) => {
  console.log(ctx.session.count)
  let n = ctx.session.count || 0
  ctx.session.count = ++n
  ctx.body = 'count: ' + n
})

module.exports = router