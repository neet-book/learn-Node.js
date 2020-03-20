// 配置对象
const config = {
  dbname: 'koa',
  user: 'koa',
  pwd: '123456',
  host: 'localhost',
  port: '27017',
  reconnect: 3
}

module.exports = initConfig(config)

// 校验初始化配置
function initConfig(config) {
  if (!config.host) throw new Error('初始化配置错误: 必须传入host')
  if (!config.port) config.port = 27017
  if (!config.reconnect) config.reconnect = 3
  // 创建url
  if (config.user && config.pwd && config.dbname) {
    config.url = 'mongodb://' +
              encodeURIComponent(config.user) +
              ':' +
              encodeURIComponent(config.pwd) +
              '@' +
              config.host +
              ':' +
              config.port +
              '/' +
              encodeURIComponent(config.dbname) +
              '?authMechanism=DEFAULT'
  } else {
    config.url = `mongodb://${config.host}:${config.host}/${encodeURIComponent(config.dbname)}`
  }

  return config
}