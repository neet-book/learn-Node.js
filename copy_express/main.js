const express = require('./express/')
const MongoClent = require('mongodb').MongoClent
const app = express()

app.get('/login', function(req, res) {
  res.end('login')
})

// 链接数据库
let dbUser = encodeURIComponent('root')
let dbPwd = encodeURIComponent('6515732')
let suthMechanism = encodeURIComponent('DEFAULT')

let dbUrl = `mongodb://${dbUser}:${dbPwd}@localhost:27018?authMechanism=${authMechanism}`
const client = new MongoClent(dbUrl)

client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db();
})