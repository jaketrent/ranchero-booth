var jade = require('broccoli-jade')
var pickFiles = require('broccoli-static-compiler')

module.exports = function (broccoli) {

  var viewsTree = broccoli.makeTree('app/views')

  viewsTree = jade(viewsTree)

  return viewsTree
}