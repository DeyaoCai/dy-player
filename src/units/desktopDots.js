const {range} = require("../tools/CreateRender.js");
// document.body.onmousemove = (ev) => {
//   rangeCenterX = range(ev.clientX,sRangeWidth);
//   rangeCenterY = range(ev.clientY,sRangeWidth);
//   timeout(function () {
//     dot.show();
//   },100,2)();
// }
// document.body.onclick = (ev) => {
//   rangeCenterX = range(ev.clientX,sRangeWidth);
//   rangeCenterY = range(ev.clientY,sRangeWidth);
//   timeout(function () {
//     dot.show();
//   },20,20)();
// }
const sRangeWidth = 300;
const eRangeWidth = 1080;


let rangeCenterX = range(960,sRangeWidth);
let rangeCenterY = range(400,sRangeWidth);
const rangeTopRightX = range(1600,eRangeWidth);
const rangeTopRightY = range(400,eRangeWidth);
const rangeParticle = range(15,40);
const rangeTime = range(30,80);
const rangeText = range(1, 3);

function startBMove(el, state) {
  setTimeout(function () {
    el.style = state.style.replace(/(left|top): [^;]+;/g,"") + `
        left: ${rangeTopRightX()}px;
        top: ${rangeTopRightY()}px;
        transform: rotate(${(Math.random() > .5 ? 1 : -1) * rangeTime()}deg) translate(${rangeParticle()*.3}, ${rangeTime()*.3});
        opacity: 0;
      `;
  },20)
}
const text = "LOVE";
function setBOriStyle(el, state) {
  const x = rangeCenterX();
  const y = rangeCenterY();
  const w = rangeParticle();
  const t = rangeTime();
  el.innerHTML = w < 60 ? w < 24 ? "" : text[Math.abs(Math.round(rangeText()))] : "LOVE";
  el.style = state.style = `
    background-position: -${x}px -${y}px;
    background-image: url("./img/${currentImgSrc}");
    left: ${x}px;
    top: ${y}px;
    width: ${w}px;
    height: ${w}px;
    font-size: ${w/3}px;
    line-height: ${w}px;
    border-radius: ${w > 80 && Math.random() > .5 ? 4 : w/2}px;
    transition: all ${t/10}s;
    transform: rotate(0deg) translate(0, 0);
    opacity: 1;
  `
}


let dotBox = document.body;
function Dot() {
  dotBox = dotBox || document.body;
  this.cacheList = [];
  this.wrap = dotBox;
}

Dot.prototype.makeEl = function () {
  let el = document.createElement("b");
  const {cacheList} = this;
  el.addEventListener("webkitTransitionEnd",function () {
    el.parentNode && el.parentNode.removeChild(el);
    cacheList.push(el);
  });
  return el;
}
Dot.prototype.show = function () {
  const el = this.cacheList.shift() || this.makeEl();
  const state = {};
  setBOriStyle(el, state);
  this.wrap.appendChild(el);
  startBMove(el, state);
};
const dot = new Dot()
module.exports = dot;
