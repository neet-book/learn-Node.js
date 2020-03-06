const fs = require('fs')

module.exports = {
  async getMessage() {
    const content =  await new Promise((resolve, reject) => {
      fs.readFile('./public/data.json', (err, data) => {
        if (err) {
          console.log(err)
          reject(undefined)
        }
        resolve(data)
      })
    })

    return content
  }
}