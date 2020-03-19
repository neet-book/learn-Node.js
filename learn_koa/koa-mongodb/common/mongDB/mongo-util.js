const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

class MongoUtil {
  constructor(url, dbName) {
    
  }
  static async connect(config) {
    console.log('ex')
    // 检验域名
    if (config.host === undefined) {
      throw Error('host is undefined')
    }

    // 创建url
    let url = ''
    if (config.user !== undefined) {
      if (config.pwd || config === 0) {
        let user = config.user
        let pwd = config.pwd
        url = `mongodb://${user}:${pwd}@${config.host}:${config.port ? config.port : 27017}/?authMechanism=DEFAULT`
      } else {
        throw new Error('密码不合法') 
      }
    } else {
      url = `mongodb://{config.host}:${config.port ? config.port : 27017}`
    }
    console.log(url)
      // 创建url
      let user = encodeURIComponent('test')
      let pwd = encodeURIComponent('12345')
      // let user = encodeURIComponent('root')
      // let pwd = encodeURIComponent('12345')
      let databasename = encodeURIComponent('test')
      let url = `mongodb://${user}:${pwd}@localhost:27017/${databasename}?authMechanism=DEFAULT`

    // 链接数据库
    try {
      const db =  await new Promise((res, rej) => {
        MongoClient.connect(url, (err, db) => {
          if (err) return rej(err)
          console.log("Connected correctly to server")
          res(db)
        })
      })
    } catch (err) {
      assert.equal(null, err);
    }
  }
}

module.exports = MongoUtil