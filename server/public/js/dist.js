"use strict";
var __moduleName = (void 0);
console.log('App started');
var choose = document.querySelector('.choose');
var fileInput = document.querySelector('.file');
var canvas = document.querySelector('.canvas');
var download = document.querySelector('.download');
var ctx = canvas.getContext('2d');
var mouseIsDown = false;
var stachePos = {
  x: 0,
  y: 0
};
var grabOffset = {
  x: 0,
  y: 0
};
var stache = document.createElement('img');
var avatar = document.createElement('img');
document.addEventListener('DOMContentLoaded', (function() {
  fileInput.addEventListener('change', (function(evt) {
    var file = evt.target.files[0];
    if (!file.type.match(/image.*/)) {
      alert('Select an image file');
      return;
    }
    avatar.file = file;
    avatar.onload = (function() {
      addClass(choose, 'is-hidden');
      removeClass(download, 'is-hidden');
      ctx.drawImage(avatar, 0, 0, canvas.width, avatar.height * (canvas.height / avatar.width));
      stache.src = 'img/stache-swirl-sm.png';
      stache.onload = (function() {
        ctx.drawImage(stache, 0, 0, stache.width, stache.height);
      });
    });
    var reader = new FileReader();
    reader.onload = ((function(aImg) {
      return (function(e) {
        aImg.src = e.target.result;
      });
    }))(avatar);
    reader.readAsDataURL(file);
  }));
  var isHit = (function(x, y) {
    var withinX = stachePos.x <= x && x <= (stachePos.x + stache.width);
    var withinY = stachePos.y <= y && y <= (stachePos.y + stache.height);
    return withinX && withinY;
  });
  var saveGrabOffset = (function(x, y) {
    grabOffset = {
      x: x,
      y: y
    };
  });
  var saveStachePos = (function(x, y) {
    stachePos = {
      x: x,
      y: y
    };
  });
  var redrawStache = (function() {
    ctx.drawImage(avatar, 0, 0, canvas.width, avatar.height * (canvas.height / avatar.width));
    ctx.drawImage(stache, stachePos.x, stachePos.y, stache.width, stache.height);
  });
  var getCoords = (function(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    return [x, y];
  });
  var addClass = (function(el, className) {
    if (el.classList) el.classList.add(className); else el.className += ' ' + className;
  });
  var removeClass = (function(el, className) {
    if (el.classList) el.classList.remove(className); else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  });
  canvas.addEventListener('mousedown', (function(e) {
    var $__0 = getCoords(e),
        x = $__0[0],
        y = $__0[1];
    if (isHit(x, y)) {
      saveGrabOffset(x - stachePos.x, y - stachePos.y);
      mouseIsDown = true;
    }
  }));
  canvas.addEventListener('mousemove', (function(e) {
    if (mouseIsDown) {
      var $__0 = getCoords(e),
          x = $__0[0],
          y = $__0[1];
      saveStachePos(x - grabOffset.x, y - grabOffset.y);
      redrawStache();
    }
  }));
  canvas.addEventListener('mouseup', (function(e) {
    mouseIsDown = false;
  }));
  download.addEventListener('click', (function(e) {
    download.href = canvas.toDataURL('image/jpeg');
  }));
  choose.addEventListener('click', (function(e) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    fileInput.dispatchEvent(event);
  }));
}));
