const MongoClient = require('mongodb').MongoClient

// 创建url
let dbUser = encodeURIComponent('root')
let dbPwd = encodeURIComponent('123456')
let authMechanism = 'DEFAULT'
let dbUrl = `mongodb://${dbUser}:${dbPwd}@localhost:27017/?authMechanism=${authMechanism}`

// 删除字段
function deleteField(coll, doc, field) {
  coll.updateOne(doc,{ $unset:{ [field]: '' } }, (err, res) => {
    if (err) return console.log('删除字段失败":', err)
    console.log(res)
  })
}
// handle可以是一个数组，并且只有在前一个操作完成后才进行下个操作
function handleDate(db, coll, handle) {
  let context = this
  MongoClient.connect(dbUrl, (err, client) => {
    if (err) return console.log('数据库链接失败：', err)
    // 获取集合
    const collection = client.db(db).collection(coll)

    // 执行所有操作
    if (Array.isArray(handle)) {
      let len = handle.length
      // 通过迭代来执行任务
      haldle.raduce((pre, curr, index) => {
        pre.then(() => {
          return new Promise((res,rej) => {
            curr.call(context, collection)
            // 如果是最后一项任务，关闭与数据库的链接
            if (len == index) client.close()
            res()
          })
        })
      }, Promise.resolve())
    } else {
      handle(collection)
    }
  })
}


handleDate('test', 'coll', coll => {
  deleteField(coll, { name: { $exists: true } }, 'name')
})