var fs = require('fs')
var path = require('path')

var sourceFilePath = path.join(__dirname, 'error.html')
var destFilePath = path.join(__dirname, '../node_modules/nuxt/dist/views/error.html')

var readStream = fs.createReadStream(sourceFilePath)
var writeStream = fs.createWriteStream(destFilePath)
readStream.pipe(writeStream)
console.log('set error page success')
