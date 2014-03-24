console.log('App started')

var choose = document.querySelector('.choose')
var fileInput = document.querySelector('.file')
var canvas = document.querySelector('.canvas')
var download = document.querySelector('.download')
var ctx = canvas.getContext('2d')
var mouseIsDown = false

var stachePos = { x: 0, y: 0 }
var grabOffset = { x: 0, y: 0 }

var stache = document.createElement('img')
var avatar = document.createElement('img')

var isValidFileType = (file) => {
  return file.type.match(/image.*/)
}

var setupCanvas = () => {
  addClass(choose, 'is-hidden')
  removeClass(download, 'is-hidden')

  stache.src = 'img/stache-swirl-sm.png'
  stache.onload = () => {
    redrawStache()
  }
}

var readFile = (srcFile, destImg) => {
  var reader = new FileReader()
  reader.onload = (e) => {
    destImg.src = e.target.result
  }
  reader.readAsDataURL(srcFile)
}


var isHit = (x, y) => {
  var withinX = stachePos.x <= x && x <= (stachePos.x + stache.width)
  var withinY = stachePos.y <= y && y <= (stachePos.y + stache.height)

  return withinX && withinY
}

var saveGrabOffset = (x, y) => {
  grabOffset = { x: x, y: y }
}

var saveStachePos = (x, y) => {
  stachePos = { x: x, y: y }
}

var redrawStache = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(avatar, 0, 0, canvas.width, avatar.height * (canvas.height / avatar.width))
  ctx.drawImage(stache, stachePos.x, stachePos.y, stache.width, stache.height)
}

var getCoords = (canvas, e) => {1
  var rect = canvas.getBoundingClientRect()
  var x = e.clientX - rect.left
  var y = e.clientY - rect.top
  return [x, y]
}

var addClass = (el, className) => {
  if (el.classList)
    el.classList.add(className)
  else
    el.className += ' ' + className
}

var removeClass = (el, className) => {
  if (el.classList)
    el.classList.remove(className)
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
}

var grabStached = (e) => {
  var [x, y] = getCoords(canvas, e)
  if (isHit(x, y)) {
    saveGrabOffset(x - stachePos.x, y - stachePos.y)
    mouseIsDown = true
  }
}

var moveStache = (e) => {
  if (mouseIsDown) {
    var [x, y] = getCoords(canvas, e)
    saveStachePos(x - grabOffset.x, y - grabOffset.y)
    redrawStache()
  }
}

var releaseStache = (e) => {
  mouseIsDown = false
}

var downloadCanvas = (e) => {
  download.href = canvas.toDataURL('image/jpeg')
}

var clickFileInput = (e) => {
  var event = document.createEvent('HTMLEvents')
  event.initEvent('click', true, false)
  fileInput.dispatchEvent(event)
}

document.addEventListener('DOMContentLoaded', () => {
  fileInput.addEventListener('change', (evt) => {
    var file = evt.target.files[0]
    if (!isValidFileType(file)) {
      alert('Select an image file'); return
    }

    avatar.onload = setupCanvas
    readFile(file, avatar)
  })

  canvas.addEventListener('mousedown', grabStached)
  canvas.addEventListener('mousemove', moveStache)
  canvas.addEventListener('mouseup', releaseStache)
  download.addEventListener('click', downloadCanvas)
  choose.addEventListener('click', clickFileInput)
})