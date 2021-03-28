const appendStyle = require("../tools/appendStyle.js");
const execTimeout = require("../tools/execTimeout.js");
const fs = require("fs");
const path = require("path");
const words = `ABCDEFGHIJKLNMOPQRSTUVWXYZ`;
appendStyle(``);
let canvas;
let video = document.createElement("video");
video.autoplay = true;
video.volume = 1;
video.src = "./src/sound/popstar.mp4";
function Picture() {
  this.canvas = canvas = canvas || document.createElement("canvas");
  this.ctx = canvas.getContext('2d');
  this.cacheList = [];
  this.cacheImg = {};
  this.load();
}
function sumOfArr (arr) {
  let sum = 0;
  arr.forEach(num => sum += num);
  return sum;
}
function aviOfArr(arr) {
  return Math.round(sumOfArr (arr) / arr.length);
}
Picture.prototype.makeEl = function () {
  return img;
};

function drawNoColor(getImageData){
  const arr = [];
  const len = getImageData.data.length / 4;
  const data = getImageData.data;
  for (let i = 0; i < len; i++) {
    const index = i * 4;
    const avi = Math.round((data[index] + data[index + 1] + data[index + 2])/3);
    data[index] = avi;
    data[index + 1] = avi;
    data[index + 2] = avi;
  }
  for (let j = 13; j < 48; j++) {
    for (let k = 0; k < 80; k++) {
      arr.push(data[j * 4 * 320 * 4  + k * 4 * 4])
    }
  }
  return arr;
}

Picture.prototype.load = function () {
  const {ctx} = this;
  const height = 240;
  const width = 320;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const getImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  const cacheImgMinDark = drawNoColor(getImageData);
  document.querySelector(".fill-color").innerHTML = cacheImgMinDark.map(item => {
    const word = words[Math.round(item/10)];
    return `<span style="background-color: rgba(${0}, ${0}, ${0}, 1); color: rgba(${item}, ${item}, ${item}, ${item ? 1 : 0});">${word}</span>`
  }).join("")

};
module.exports = new Picture();
