var http = require('http')
var fs = require('fs')
var path = require('path')

var port = process.env.PORT || 3000

var assetDir = 'public'

const getMime = function (extName) {
  const mimes = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
  }
  return mimes[extName] || 'text/html'
}

const routeToFilePath = function (url) {
  if (url === '/')
    return path.join(__dirname, assetDir, 'index.html')
  else
    return path.join(__dirname, assetDir, url)
}

const serveFile = function (res, filePath) {
  fs.readFile(filePath, function(err, buffer) {
    if (err) {
      console.log(err)
      res.writeHead(500)
      res.end()
    } else {
      res.writeHead(200, { 'Content-Type': getMime(path.extname(filePath)) })
      res.end(buffer, 'utf-8')
    }
  })
}

http.createServer(function (req, res) {
  serveFile(res, routeToFilePath(req.url))
}).listen(port)

console.log("Listening on " + port)