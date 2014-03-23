console.log('App started')

var fileInput = document.querySelector('.file')
var canvas = document.querySelector('.canvas')
//var download = document.querySelector('.download')
var ctx = canvas.getContext('2d')
var mouseIsDown = false

var stachePos = { x: 0, y: 0 }
var grabOffset = { x: 0, y: 0 }

var stache = document.createElement('img')
var avatar = document.createElement('img')

document.addEventListener('DOMContentLoaded', () => {
  fileInput.addEventListener('change', (evt) => {

    var file = evt.target.files[0]

    // validate file type
    if (!file.type.match(/image.*/)) {
      alert('Select an image file'); return
    }

    // setup preview img
    avatar.file = file

    // draw img on canvas
    avatar.onload = () => {
      ctx.drawImage(avatar, 0, 0, canvas.width, avatar.height * (canvas.height / avatar.width))

      stache.src = 'img/stache-swirl-sm.png'
      stache.onload = () => {
        ctx.drawImage(stache, 0, 0, stache.width, stache.height)
      }
    }

    // read file
    var reader = new FileReader()
    reader.onload = ((aImg) => { return (e) => { aImg.src = e.target.result } })(avatar)
    reader.readAsDataURL(file)

  })

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
    ctx.drawImage(avatar, 0, 0, canvas.width, avatar.height * (canvas.height / avatar.width))
    ctx.drawImage(stache, stachePos.x, stachePos.y, stache.width, stache.height)
  }

  var getCoords = (e) => {
    var rect = canvas.getBoundingClientRect()
    var x = e.clientX - rect.left
    var y = e.clientY - rect.top
    return [x, y]
  }

  canvas.addEventListener('mousedown', (e) => {
    var [x, y] = getCoords(e)
    if (isHit(x, y)) {
      saveGrabOffset(x - stachePos.x, y - stachePos.y)
      mouseIsDown = true
    }
  })

  canvas.addEventListener('mousemove', (e) => {
    if (mouseIsDown) {
      var [x, y] = getCoords(e)
      saveStachePos(x - grabOffset.x, y - grabOffset.y)
      redrawStache()
    }
  })

  canvas.addEventListener('mouseup', (e) => {
    mouseIsDown = false
  })

//  download.addEventListener('click', (e) => {
//    this.href = canvas.toDataURL('image/jpeg')
//  })
})