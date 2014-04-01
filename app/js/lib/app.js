console.log('App started')

var canvas = document.querySelector('.canvas')
var capture = document.querySelector('.capture')
var chooseVid = document.querySelector('.chooseVid')
var choose = document.querySelector('.choose')
var download = document.querySelector('.download')
var fileInput = document.querySelector('.file')
var video = document.querySelector('.video')

var ctx = canvas.getContext('2d')
var mouseIsDown = false

var stachePos = { x: 0, y: 0 }
var grabOffset = { x: 0, y: 0 }

var stache = document.createElement('img')
var avatar = document.createElement('img')
var vidFrame = document.createElement('img')

var streaming = false

navigator.getMedia = ( navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia)

var isValidFileType = (file) => {
  return file.type.match(/image.*/)
}

var setupCanvas = () => {
  stateMgr.enter('canvasImg')

  canvas.addEventListener('mousedown', (e) => { grabStache(e, avatar) })
  canvas.addEventListener('mousemove', (e) => { moveStache(e, avatar) })
  canvas.addEventListener('mouseup', (e) => { releaseStache(e, avatar) })

  stache.src = 'img/stache-swirl-sm.png'
  stache.onload = () => {
    redrawStache(avatar)
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

var redrawStache = (img) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, img.height * (canvas.height / img.width))
  ctx.drawImage(stache, stachePos.x, stachePos.y, stache.width, stache.height)
}

var getCoords = (canvas, e) => {1
  var rect = canvas.getBoundingClientRect()
  var x = e.clientX - rect.left
  var y = e.clientY - rect.top
  return [x, y]
}

var addClass = (el, className) => {
  if (el) {
    if (el.classList)
      el.classList.add(className)
    else
      el.className += ' ' + className
  }
}

var removeClass = (el, className) => {
  if (el) {
    if (el.classList)
      el.classList.remove(className)
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  }
}

var grabStache = (e) => {
  var [x, y] = getCoords(canvas, e)
  if (isHit(x, y)) {
    saveGrabOffset(x - stachePos.x, y - stachePos.y)
    mouseIsDown = true
  }
}

var moveStache = (e, img) => {
  if (mouseIsDown) {
    var [x, y] = getCoords(canvas, e)
    saveStachePos(x - grabOffset.x, y - grabOffset.y)
    redrawStache(img)
  }
}

var releaseStache = (e) => {
  mouseIsDown = false
}

var downloadCanvas = (e) => {
  download.href = canvas.toDataURL('image/png')
}

var clickFileInput = (e) => {
  var event = document.createEvent('HTMLEvents')
  event.initEvent('click', true, false)
  fileInput.dispatchEvent(event)
}

var toArray = (nodeList) => {
  var arr = []
  for (var i = 0, ref = arr.length = nodeList.length; i < ref; i++) {
    arr[i] = nodeList[i]
  }
  return arr
}

var setupVideo = (e) => {
  stateMgr.enter('captureVid')

  canvas.addEventListener('mousedown', (e) => { grabStache(e, vidFrame) })
  canvas.addEventListener('mousemove', (e) => { moveStache(e, vidFrame) })
  canvas.addEventListener('mouseup', (e) => { releaseStache(e, vidFrame) })

  navigator.getMedia({
      video: true,
      audio: false
    }, (stream) => {
      if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream
    } else {
      var vendorURL = window.URL || window.webkitURL
      video.src = vendorURL.createObjectURL(stream)
    }
    video.play()
  }, (err) => {
    console.log('err')
    console.log(err)
  })

  video.addEventListener('canplay', (ev) => {
    if (!streaming) {
      video.setAttribute('width', canvas.width)
      video.setAttribute('height', canvas.height)
      canvas.setAttribute('width', canvas.width)
      canvas.setAttribute('height', canvas.height)
      streaming = true
    }
  }, false)
}

var captureVideoFrame = (e) => {
  stateMgr.enter('canvasVid')

  ctx.drawImage(video, 0, 0, canvas.width, video.height * (video.height / video.width))
  vidFrame.src = canvas.toDataURL('image/png')
  vidFrame.onload = () => {
    stache.src = 'img/stache-swirl-sm.png'
    stache.onload = () => {
      redrawStache(vidFrame)
    }
  }
}

var stateMgr = {
  states: {
    // TODO: complete; not done because initial state
    choose: {
      add: { 'is-hidden': '.video, .capture, .canvas, .download' },
      remove: { 'is-hidden': '.chooseVid, .choose, .prompt' }
    },
    captureVid: {
      add: { 'is-hidden': '.choose, .chooseVid, .prompt' },
      remove: { 'is-hidden': '.video, .capture' }
    },
    canvasImg: {
      add: { 'is-hidden': '.choose, .chooseVid, .prompt' },
      remove: { 'is-hidden': '.canvas, .download' }
    },
    canvasVid: {
      add: { 'is-hidden': '.video, .capture' },
      remove: { 'is-hidden': '.canvas, .download' }
    }
  },
  enter: (name) => {
    console.log('enter name: ' + name)

    var state = stateMgr.states[name]

    console.log('state')
    console.log(state)

    if (state.add) {
      Object.keys(state.add).forEach((clazz) => {
        console.log('add clazz: ' + clazz + ' -> ' + state.add[clazz])
        toArray(document.querySelectorAll(state.add[clazz])).forEach((el) => {
          console.log('el: ' + el)
          addClass(el, clazz)
        })
      })
    }

    if (state.remove) {
      Object.keys(state.remove).forEach((clazz) => {
        console.log('rm clazz: ' + clazz + ' -> ' + state.add[clazz])
        toArray(document.querySelectorAll(state.remove[clazz])).forEach((el) => {
          console.log('el: ' + el)
          removeClass(el, clazz)
        })
      })
    }
  }
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

  stateMgr.enter('choose')

  capture.addEventListener('click', captureVideoFrame)
  chooseVid.addEventListener('click', setupVideo)
  download.addEventListener('click', downloadCanvas)
  choose.addEventListener('click', clickFileInput)

})