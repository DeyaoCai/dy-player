import {MusicConfig} from "./MusicConfig";
import {MusicVisualizer} from "./MusicVisualizer";

// @ts-ignore;
import {ModifyManager} from "./canvasConfig.js";
import {DomUtil} from "@/tools/DomUtil";
import {Sound} from "@/tools/Sound"
// @ts-ignore;


class EventTarget_ {
  listeners: {[index: string]: any} = {};
  public addEventListener(type: string, callback: Function) {
    if(!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
  public removeEventListener(type: string, callback: Function): any {
    if(!(type in this.listeners)) {
      return;
    }
    const stack = this.listeners[type];
    for(let i = 0, l = stack.length; i < l; i++) {
      if(stack[i] === callback){
        stack.splice(i, 1);
        return this.removeEventListener(type, callback);
      }
    }
  }
  public dispatchEvent(event: Event) {
    if(!(event.type in this.listeners)) {
      return;
    }
    const stack = this.listeners[event.type];
    // @ts-ignore;
    event.target = this;
    for(let i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
  }
}

export class MusicDataFlags {
  dataFlag: number = 0;
  shockFlag: number = 0;
}

class RhythmPoint{
  isRhythmPoint: boolean;
  vol: number;
  constructor(vol: number, isRhythmPoint: boolean){
    this.vol = vol;
    this.isRhythmPoint = isRhythmPoint;
  }
}

type IColor = [number, number, number, number] | [number, number, number];

class EventTar {
  fnMap:{[index: string]: Function[]} = {};
  addEventListener(type: string, callback: Function){
    this.fnMap[type] || (this.fnMap[type] = []);
    this.fnMap[type].push(callback)
  }
  dispatchEvent(ev: Event){
    const fns = this.fnMap[ev.type];
    fns && fns.forEach(i => i(ev));
  }
}
class MVData{
  event: EventTar = new EventTar();
  prevAddSpeed: number = 0;
  prevAvrLevel: number = 0;
  data?: Uint8Array;
  avrLevel: number = 0;
  total: number = 0;
  addSpeed: number = 0;
  soundTrackArr: RhythmPoint[] = [];
  soundTrackArrMaxLen: number = 100;
  shockNum: number = 0;
  modifyManager: ModifyManager;
  constructor(modifyManager: ModifyManager){
    this.modifyManager = modifyManager;
  }
  update(data: Uint8Array){
    const {soundTrackArr, prevAvrLevel, prevAddSpeed} = this;
    this.data = data;
    this.total = data.reduce((a = 0, b = 0) => (a + b));
    const avrLevel = this.avrLevel = this.total / data.length;
    const addSpeed = this.addSpeed = avrLevel - prevAvrLevel;

    const {RhythmPointVolumeFloatRange = 0} = this.modifyManager.gameTrack;
    /**
     * 转折点， 声音开始变大的第一帧。 乐器的吹奏、敲击（或者人发声）的瞬间， 大概率会使音量提高。
     * 所以就是 音量从减小， 突变到开始升高表示是个节奏点；
     */
    const isRhythmPoint = prevAddSpeed <= 0 && addSpeed > RhythmPointVolumeFloatRange / 10;

    const rhythmPoint = new RhythmPoint(avrLevel, isRhythmPoint);
    soundTrackArr.push(rhythmPoint);
    if (isRhythmPoint) {
      this.shockNum ++;
      const ev = new Event('shock');
      // @ts-ignore;
      ev.rhythmPoint = rhythmPoint;
      this.event.dispatchEvent(ev);
    }

    if (soundTrackArr.length > this.soundTrackArrMaxLen) {
      soundTrackArr.shift();
    }

    this.prevAddSpeed = addSpeed;
    this.prevAvrLevel = avrLevel;

    this.event.dispatchEvent(new Event('update'));
  }
}

export class MusicData {
  realTimeData: MVData;
  originData: MVData;
  currentImgAviColor: IColor = [0,0,0,0];
  calculateColors: [IColor, IColor] = [[255, 255, 255], [255, 255, 255]];
  modifyManager: ModifyManager;
  constructor(
    modifyManager: ModifyManager
  ){
    this.modifyManager = modifyManager;
    this.realTimeData = new MVData(modifyManager);
    this.originData = new MVData(modifyManager);
  }
}





class GameScore{
  static prevNode?: Node;
  constructor(score: number | string){
    const gameScore = DomUtil.node('div');
    gameScore.classList.add('game-score');
    gameScore.innerHTML = score.toString();
    DomUtil.append(document.body, gameScore);
    GameScore.prevNode && DomUtil.remove(GameScore.prevNode);
    GameScore.prevNode = gameScore;
  }
}


class GameCombo{
  static prevNode?: Node;
  constructor(combo: number){
    GameCombo.prevNode && DomUtil.remove(GameCombo.prevNode);
    GameCombo.prevNode = undefined;
    if (combo > 5) {
      const gameScore = DomUtil.node('div');
      gameScore.classList.add('game-combo');
      gameScore.innerHTML = `${combo || 0} x combo`;
      DomUtil.append(document.body, gameScore);
      GameCombo.prevNode = gameScore;
    }

  }
}

class GameNode {
  gameList: GameList;
  dom: Node;
  score?: number;
  time: number;
  isDebug?: boolean = false;
  modifyManager: ModifyManager;
  constructor(
    gameList: GameList,
    rhythmPoint: RhythmPoint,
    isDebug: boolean = false,
    gameInner: Element,
    modifyManager: ModifyManager,
  ){
    this.gameList = gameList;
    this.time = Date.now();
    this.modifyManager = modifyManager;
    const dom = this.dom = DomUtil.node('div');
    dom.className = 'game-item';


    if (isDebug) {
      this.isDebug = isDebug;
      // @ts-ignore;
      dom.style = `animation: gamingDebug linear 0.945s;`;
    }

    const hueRange = 120;
    const deg = rhythmPoint.vol * this.modifyManager.gameTrack.RhythmPointCenterPointOffset;

    const innerDom = DomUtil.node('div');
    DomUtil.append(dom, innerDom);
    // @ts-ignore;
      innerDom.style = `
      transform: rotate(${deg}deg) translate(0, calc(${150 + rhythmPoint.vol/3}px));
      background-color: hsl(${90 - hueRange * rhythmPoint.vol / 255}, 50%, 50%);
    `;
    DomUtil.append(gameInner, dom);

    dom.addEventListener("webkitAnimationEnd", this.endFunction);
    dom.addEventListener("animationend", this.endFunction);
  }
  calculateScore(currentTime: number){
    const {gameList, time} = this;
    this.score = Math.abs(currentTime - time - gameList.delay);
  }
  remove(){
    const {dom} = this;
    this.gameList.setCurrentScore(this.score);

    if (this.score !== undefined) {
      Sound.play("done");
    }else {
      this.modifyManager.gameTrack.RhythmPointMissTipSound && Sound.play('warning');
    }

    dom.removeEventListener('webkitAnimationEnd', this.endFunction);
    dom.removeEventListener('animationend', this.endFunction);
    dom && DomUtil.remove(dom);
  }
  endFunction = (ev?: Event) => {
    if (this.isDebug) {
      this.calculateScore(Date.now())
    }
    this.remove();
    this.gameList.remove(this);
  }
}


export class GameList {
  currentTime: number = 0;
  durationTime: number = 0;
  ended: boolean = false;
  combo: number = 0;
  maxCombo: number = 0;
  currentScore: number = 0;
  totalScore: number = 0;
  total: number = 0;
  missCount: number = 0;
  uselessCount: number = 0;
  mv: MusicVisualizer;
  gameInner: Element;
  modifyManager: ModifyManager;
  public endSong(){
    this.ended = true;
  }
  public startSong(){
    this.ended = false;
    this.currentScore = 0;
    this.totalScore = 0;
    this.total = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.missCount = 0;
    this.uselessCount = 0;
  }

  constructor(
    mv: MusicVisualizer,
    gameInner: Element,
    modifyManager: ModifyManager
  ){

    this.modifyManager = modifyManager;
    this.mv = mv;
    this.delay = this.mv.delay.delayTime.value * 1000
    this.gameInner = gameInner;
  }
  setCombo(isStop: boolean){
    isStop ? (this.combo = 0) : (this.combo ++);
    this.combo > this.maxCombo && (this.maxCombo = this.combo);
    new GameCombo(this.combo);
  }

  setCurrentScore(score: number | undefined){
    this.currentScore = score || 0;
    this.totalScore += (score || 0);
    const isMiss = score === undefined;

    isMiss && (this.missCount ++);
    this.setCombo(isMiss);
    new GameScore(isMiss ? 'miss' : `score - ${score}`);
  }
  eventTarget: EventTarget_ = new EventTarget_();
  delay: number;
  buffer: number = 150;
  duration: number = 2000;
  list: GameNode[] = [];

  find(time: number): GameNode | undefined {
    const {buffer, delay} = this;
    // return this.list[0];
    return this.list.find((item) => Math.abs(time - item.time - delay) < buffer);
  }
  indexOf(gameNode: GameNode){
    return this.list.indexOf(gameNode);
  }
  remove(gameNode: GameNode){
    const index = this.indexOf(gameNode);
    index !== -1 && this.list.splice(index,1);
  }
  createGameNode(rhythmPoint: RhythmPoint, isDebug: boolean = false){
    const gameNode = new GameNode(this, rhythmPoint, isDebug, this.gameInner, this.modifyManager);
    this.list.push(gameNode);
    this.total ++;
    return gameNode;
  }
  setBuffer(buffer: number){
    this.buffer = buffer;
    this.eventTarget.dispatchEvent(new Event('bufferChange'));
  }
  shootGameNode(){
    // 得分 目前时间 - 开始生成时间 - delay
    const time = Date.now();
    const gameNode = this.find(time);
    if (gameNode) {
      gameNode.calculateScore(time);

      gameNode.endFunction();
    } else {
      this.uselessCount ++;
      new GameScore('userLess press');
    }
  }
}



export class GameScene {
  dom: Node;
  time: number;
  modifyManager: ModifyManager;
  constructor(gameData: MVData, musicData: MusicData, gameInner: Element, modifyManager: ModifyManager){
    this.modifyManager = modifyManager;
    this.time = Date.now();
    const dom = this.dom = DomUtil.node('div');
    dom.className = 'game-scene';

    // @ts-ignore;
    let list = [...gameData.data].filter(i => i).filter((x, i) => !(i % 16));
    // list.length || (list = [0]);
    const per = 360 / list.length;
    const deg = musicData.originData.avrLevel * modifyManager.gameTrack.RhythmPointCenterPointOffset;
    // @ts-ignore;
    dom.innerHTML = list.map((item: number, index: number) => {
      return `<div style="transform: rotateZ(${-(index) * per + 180 +deg}deg) translate(0, calc(400px + ${item * 10}px));"></div>`;
    }).join('');

    DomUtil.append(gameInner, dom);

    dom.addEventListener("webkitAnimationEnd", this.destroy);
    dom.addEventListener("animationend", this.destroy);
  }
  remove(){
    const {dom} = this;
    dom.removeEventListener('webkitAnimationEnd', this.destroy);
    dom.removeEventListener('animationend', this.destroy);
    dom && DomUtil.remove(dom);
  }
  destroy = () => {
    this.remove();
  }
}




export class Color {
  static compose(i: number) {
    i = i / 255;
    return Math.round((i + (i - .5) * (1 - i)) * 255);
  }
  static dCompose(i: number, time = 0) {
    i = i / 255;
    let rate = (1 - i);
    while (time + 3) {
      rate *= (1 - i);
      time --;
    }
    return Math.round((1- rate) * 255);
  }
  static getPure(r: number, g: number, b: number, time = 2): [IColor, IColor]{
    // 同时减去最小值
    const min = Math.min(r, g, b);
    const per = min / 256;
    const {dCompose, reduce} = Color
    return [
      [
        dCompose(r, time),
        dCompose(r, time),
        dCompose(r, time)
      ], [
        dCompose(reduce(r, per), time + 2),
        dCompose(reduce(g, per), time + 2),
        dCompose(reduce(b, per), time + 2)
      ]
    ];
  }
  static reduce(r: number, per: number){
    return Math.round((r - 255 * per) / (1  -  per));
  }
}


