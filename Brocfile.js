var concat = require('broccoli-concat')
var env = require('broccoli-env').getEnv()
var jade = require('broccoli-jade')
var pickFiles = require('broccoli-static-compiler')
var stylus = require('broccoli-stylus')
var traceur = require('broccoli-traceur')
var uglify = require('broccoli-uglify-js')

module.exports = function (broccoli) {

  var jsTree = broccoli.makeTree('app/js/lib')
  jsTree = traceur(jsTree)
  jsTree = pickFiles(jsTree, {
    srcDir: '',
    destDir: 'lib'
  })
  if (env == 'production') {
    jsTree = uglify(jsTree, {
      mangle: true,
      compress: true
    })
  }
  jsTree = concat(jsTree, {
    inputFiles: [
      'lib/**/*.js'
    ],
    outputFile: '/js/dist.js'
  })

  var viewsTree = broccoli.makeTree('app/views')
  viewsTree = jade(viewsTree)

  var cssTree = broccoli.makeTree('app/css')
  cssTree = pickFiles(stylus(cssTree), {
    srcDir: '',
    destDir: 'css'
  })

  var imgTree = broccoli.makeTree('app/img')
  imgTree = pickFiles(imgTree, {
    srcDir: '',
    destDir: 'img'
  })

  return [ jsTree, viewsTree, cssTree, imgTree ]
}