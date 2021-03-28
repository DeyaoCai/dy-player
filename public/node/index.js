const path =require('path');
const {resolve} = require(path.join(process.cwd(), "./public/node/utils"));
const fs = require('fs');
const os = require('os');
const cProcess = require('child_process');;
const dir = resolve('./tools/dir');

const electron = require('electron');

let images;
try {
  images = fs.readdirSync(path.join(process.cwd(), "./public/img"));
  // images = ['23181.jpg'];
  /*一次性加载所有图片*/
  // images.forEach(item => {
  //   pictrueCanvasCtx.load(item, true);
  // });
} catch (e) {
  images = [];
  console.log(e);
  alert("请执行 npm run getPicture 来爬取背景图片！");
}
const node = {fs, process, path, os, cProcess, dir, electron, images};
window.node = node;
