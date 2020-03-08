const page = require('../modules/page')

// 配置路由关系
const routers = [
  {
    url: '/',
    module: page
  }
]

module.exports = function (request, response, url) {
  const context = this;
  let len = routers.length
  
  for(let i = 0; i < len; i++) {
    if (routers[i].url === url) {
      console.log('ex')
      routers[i].module.apply(context, [request, response, url])
      break
    }
  }


}