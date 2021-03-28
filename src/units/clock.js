const {timeout} = require(path.join(__dirname, "../tools/CreateRender.js"));
const parser = require("../tools/parser");
const appendStyle = require("../tools/appendStyle");
const wrap = document.createElement('div');
wrap.className = 'clock-wrap';
const c_for = require('../tools/c_for.js');
document.body.appendChild(wrap);

function renderClock(){

  const time = new Date();
  const yea = time.getFullYear();
  const mon = time.getMonth();
  const dat = time.getDate();
  const hou = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  const mS = time.getMilliseconds();
  const datLen = new Date(yea, mon+1, 0).getDate();
  const secDeg = (mS/1000 + sec) / 60;
  const minDeg = (secDeg + min) / 60;
  const houDeg = (minDeg + hou) / 24;
  const datDeg = (houDeg + dat) / datLen;
  const monDeg = (datDeg + mon + 1) / 12;
  const yeaDeg = (monDeg + (yea%100)) / 100;
  const  cent = Math.floor(Math.floor(yea / 100) * 100);

  wrap.innerHTML = eval(parser(`
div
  div.point
  ul ((style='transform: translateY(340px) rotateY(20deg) rotateZ({{-yeaDeg * 360}}deg) scale(2,2);'))
    c-for=100:item, index
      li ((style='transform: rotate({{(index+1)*360/100}}deg);'))
        span((style="transform: scale(.35,.35)"))  {{cent + item + 1}}
  ul ((style='transform: translateY(340px) rotateY(20deg) rotateZ({{-monDeg * 360}}deg) scale(1.9,1.9);'))
    c-for=12:item, index
      li ((style='transform: rotate({{(index+1)*360/12}}deg);')) {{item + 1}}
  ul ((style='transform: translateY(340px) rotateY(20deg) rotateZ({{-datDeg * 360}}deg) scale(1.8,1.8);'))
    c-for=datLen:item, index
      li ((style='transform: rotate({{(index+1)*360/datLen}}deg);')) {{item + 1}}
  ul ((style='transform: rotateY(-30deg) rotateZ({{-houDeg * 360}}deg) scale(.85,.85);'))
    c-for=24:item, index
      li ((style='transform: rotate({{(index+1)*15}}deg);')) {{item+1}}
  ul ((style='transform: rotateY(-30deg) rotateZ({{-minDeg * 360}}deg) scale(.8,.8);'))
    c-for=60*2:item, index
      li ((style='transform: rotate({{(index+1)*3}}deg);'))
        span  {{item%2 ? (item+1)/2 : ''}}
  ul ((style='transform: rotateY(-30deg) rotateZ({{-secDeg * 360}}deg) scale(.75,.75);'))
    c-for=60*2:item, index
      li ((style='transform: rotate({{(index+1)*3}}deg);'))
        span  {{item%2 ? (item+1)/2 : ''}}
  div.clock-point-wrap
`));
  const clockPointWrap = wrap.querySelector('.clock-point-wrap');
  clockPointWrap.innerHTML = eval(parser(`
div.hou ((style='transform: rotate({{-(((mS/1000 + sec)/60 + min)/60+ hou) / 2.4 * 360}}deg)'))
div.min ((style='transform: rotate({{-((mS/1000 + sec)/60 + min) / 3 * 360}}deg)'))
div.sec ((style='transform: rotate({{-(mS/1000 + sec) / 6 *360}}deg)'))
`));
}
function renderTime (){
  const clockPointWrap = wrap.querySelector('.clock-point-wrap');
  const time = new Date();
  const hou = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  const mS = time.getMilliseconds();
  clockPointWrap.innerHTML = eval(parser(`
div.hou ((style='transform: rotate({{(((mS/1000 + sec)/60 + min)/60+ hou) / 24 * 360}}deg)'))
div.min ((style='transform: rotate({{ ((mS/1000 + sec)/60 + min) / 60 * 360}}deg)'))
div.sec ((style='transform: rotate({{ (mS/1000 + sec) / 60 *360}}deg)'))
`));
}
timeout(() => renderClock(),50)();

appendStyle('clock', `<style>
.clock-wrap{
position: absolute;
top: 80%;
left: 50%;
z-index: 9;
opacity: .5;
perspective: 300px;
transform-style: preserve-3d;
}
.clock-wrap div.point{
width: 1px;
height: 460px;
background-color: #fff;
position: absolute;
bottom: 0;
opacity: .2;
}
.clock-wrap ul li{
position: absolute;
bottom: -400px;
width: 2px;
height: 800px;
margin-left: -2px;
/*border-top: 6px solid rgba(255,255,255,.3);*/
display: flex;
flex-direction: column;
align-items: center;
}
.clock-wrap ul li span{
display: flex;
width: 2px;
margin: 1px 0;
border-color: inherit;
border-top-style: solid;
color: #fff;
flex-direction: column;
align-items: center;
}
.clock-point-wrap>div{
position: absolute;
bottom: 0px;
background: linear-gradient(red, transparent, transparent);
transform-origin: bottom center;
}
.clock-point-wrap>div::after{
box-sizing: border-box;
content: '';
display: block;
border-radius: 500px;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%) rotate(-45deg);
border-top: 4px solid red;
border-right: 50px solid transparent;
opacity: .3;
}
.clock-point-wrap>div.hou::after{
border-top: 20px solid orange;
width: 400px;
height: 400px;
}
.clock-point-wrap>div.min::after{
border-top: 10px solid yellow;
width: 380px;
height: 380px;
}
.clock-point-wrap>div.sec::after{
border-top: 5px solid green;
width: 370px;
height: 370px;
}

</style>`);
