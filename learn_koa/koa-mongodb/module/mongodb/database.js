const MongoClient = require('mongodb')
const config = require('./config')

const assert = require('assert')

class Database {
  constructor() {
    // 连接数据库
    if (!Database.database) {
      Database.database = Database.connect()
    }
  }

  // 链接数据库
  static async connect() {
    return await new Promise((res, rej) => {
      MongoClient.connect(config.url, (err, client) => {
        if (err) return rej(err)
        console.log('链接数据库成功')
        res(client.db(config.dbname))
      })
    })
    .catch(err => {
      console.log('数据库连接失败：', err.message)
      return false
    })
  }

  // 重连数据库
  async reconnect(count = 0) {
    if(config.reconnect < count) return console.log('Error: 连接数据库失败超出限制')
    return Database.connect().then(db => {
      // 1秒后再次重连
      if (!db) {
        return setTimeout(()=> {
          this.reconnect(++count)
        }, 2000)
      }
      Database.database = db
      return db
    })
  }

  // 查找数据
  async find(colle, query, ) {
    const db = await Database.database
    // 检查是否连接成功
    if (!db) db = await this.reconnect()
    // 查询
    return await new Promise((res, rej) => {
      db.collection(colle).find(query).toArray((err, docs) => {
        if (err) return rej(err)
        res(docs)
      })
    })
  }

  async insert(colle, docs) {
    const db = await Database.database
    // 检查是否连接成功
    if (!db) db = await this.reconnect()
    // 检查类型插入当个或多个文档
    let method = 'insertOne'
    if (Array.isArray(docs)) method = insertMany
    return new Promise((res, rej) => {
      db.collection(colle)[method](docs, (err, result) => {
        if (err) rej(err)
        res(result)
      })
    })
  }
}

module.exports = Database
console.log(config.url)
const db1 = new Database

db1.find('module', {}).then(re => {
  console.log(re)
})


db1.insert('module', {
  name: 'router',
  module: 'koa-router'
}).then(re => {
  console.log(re.raw.toString())
})