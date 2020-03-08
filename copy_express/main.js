const express = require('./express/')

const app = express()

app.get('/login', function(req, res) {
  res.end('login')
})