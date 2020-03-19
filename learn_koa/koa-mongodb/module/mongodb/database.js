const MongoClient = require('mongodb')
const config = require('./config')

class Database {
  constructor() {
    // this.connect()
  }

  // 链接数据库
  connect() {
    return new Promise((res, rej) => {
      MongoClient.connect(config.url, (err, client) => {
        if (err) return rej(err)
        console.log('链接数据库成功')
        res(client.db(config.dbname))
      })
    })
  }
  // 查找数据
  async find(colle, query) {
    const db = await this.connect().catch(err => {
      console.log('数据库链接失败：', err)
    })

    return await new Promise((res, rej) => {
      db.collection(colle).find(query).toArray((err, docs) => {
        // db.close()
        if (err) return rej(err)
        res(docs)
      })
    })
  }
}
console.log(config.url)
const db = new Database
console.log(db.find('test', {}))

