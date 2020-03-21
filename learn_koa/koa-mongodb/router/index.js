const Router = require('koa-router')
const router = new Router()
// 数据库
// 数据库
const Database = require('../module/mongodb/database')
const user = new Database('user')
// 配置路由
// 首页
router.get('/', async (ctx) => {
  let list = await user.find({})
  await ctx.render('index', {
    module: 'ejs',
    date: new Date().toLocaleDateString(),
    list: list
  })
})

router.post('/add', async ctx => {
  console.time('add')
  const reuslt =   await user.insert(ctx.request.body)
  if (require.n === 0 && reuslt.ok !== 1) {
    ctx.state = 501
    return
  }
  ctx.state = 200
  let docs = await user.find(ctx.request.body)
  ctx.body = docs
  console.timeEnd('add')
})

// session
router.get('/session', async (ctx) => {
  console.log(ctx.session.count)
  let n = ctx.session.count || 0
  ctx.session.count = ++n
  ctx.body = 'count: ' + n
})

module.exports = router