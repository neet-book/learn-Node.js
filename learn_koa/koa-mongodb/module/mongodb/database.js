const MongoClient = require('mongodb')
const config = require('./config')

const assert = require('assert')

class Database {
  constructor(coll) {
    // 操作的集合
    this.coll = coll
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

  // 关闭数据库链接
  static close() {
    setTimeout(() => {
      Database.database.close()
    }, 0)
  }

  // 查找数据
  async find(query) {
    const db = await Database.database
    // 检查是否连接成功
    if (!db) db = await this.reconnect()
    // 查询
    return await new Promise((res, rej) => {
      db.collection(this.coll).find(query).toArray((err, docs) => {
        if (err) return rej(err)
        res(docs)
      })
    })
  }
  // 添加
  async insert(docs) {
    let method = 'insertOne'
    const db = await Database.database
    // 检查是否连接成功
    if (!db) db = await this.reconnect()
    // 检查类型插入当个或多个文档
    if (Array.isArray(docs)) method = insertMany
    return new Promise((res, rej) => {
      db.collection(this.coll)[method](docs, (err, result) => {
        if (err) rej(err)
        res(result.result)
      })
    })
  }

  // 更新
  async update (query, edit, many = false, options = { upset: false }) {
    let method = 'updateOne'
    const db = await Database.database
    // 检查是否连接成功
    if (!db) db = await this.reconnect()
    if (many) method = 'updateMany'

    return new Promise((res, rej) => {
      db.collection(this.coll)[method](query, edit, options, (err, result) => {
        if(err) return rej(err)
        res({
          count: result.result.n,
          modified: result.result.nModified,
          isOk: result.result.ok === 1 ? true : false
        })
      })
    })
  }

  // 删除
  async delete(query, many) {
    let method = 'deleteOne'
    const db = await Database.database
    // 检查是否连接成功
    if (!db) db = await this.reconnect()
    if (many) method = 'deleteMany'
    return new Promise((res, rej) => {
      db.collection(this.coll)[method](query,(err, result) => {
        if(err) return rej(err)
        res(result)
      })
    })
  }
}

module.exports = Database