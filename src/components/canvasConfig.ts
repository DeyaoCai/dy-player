import {DomUtil} from "@/tools/DomUtil";
import {GetType} from "@/tools/GetType";
import {ListEqual} from "@/tools/ListEqual";

interface ITrackListItem {
  key: string;
  name: string;
  defValue: number;
  value: number;
  valueType: string;
  min: number;
  max: number;
  desc: string;
}
class TrackItem implements ITrackListItem{

  key: string;
  name: string;
  defValue: number;
  value: number;
  valueType: string;
  min: number;
  max: number;
  desc: string;
  trackList: TrackList;

  constructor(trackList: TrackList, key: string, name: string, defValue: number, value: number, valueType: string, min: number, max: number, desc: string) {
    this.trackList = trackList;
    this.key = key;
    this.name = name;
    this.defValue = defValue;
    this.value = value;
    this.valueType = valueType;
    this.min = min;
    this.max = max;
    this.desc = desc;
  }

  public enc() {
    this.setVal(this.value + 1);
    return this;
  }

  public dec() {
    this.setVal(this.value - 1);
    return this;
  }
  public setMin(){
    this.setVal(this.min);
    return this;
  }
  public setMax(){
    this.setVal(this.max);
    return this;
  }
  public setVal (val: number){
    if (val > this.max) val = this.max;
    if (val < this.min) val = this.min;
    this.value = val;
    this.trackList.savePresets('');
    return this;
  }
  public reset(){
    this.setVal(this.defValue);
    return this;
  }
}

export class Track {
  static commonConfigs: { [index: string]: [string, string, number, string, number, number, string][] } = {};
  static name_ = 'Track';

  trackList: TrackList;
  current: number;
  playing: number;
  list: TrackItem[];
  name: string;
  constructor(name: string, trackList: TrackList, defaultValue: { [index: string]: number } = {}) {
    // @ts-ignore;
    this.name = (name || this.constructor.name_);
    this.current = 0;
    this.playing = 0;
    this.trackList = trackList;
    this.list = [];
    // @ts-ignore; // this.constructor.name_ 由于代码混淆导致 this.constructor.name 与预期不符， 故手动设置
    Track.commonConfigs[this.constructor.name_].forEach(item => {
      const [key, name, defValue, valueType, min, max, desc] = item;
      const defaultVal = defaultValue[key];
      this.list.push(new TrackItem(trackList, key, name, defValue, defaultVal !== undefined ? defaultVal : defValue, valueType, min, max, desc));
    });

    this.list.forEach(item => {
      Object.defineProperty(this, item.key, {
        get() {
          return item.value;
        },
      });
    });
  }

  rename(name: string){
    console.log(name)
    this.name = name;
    this.trackList.savePresets('');
  }
  get len() {
    return this.list.length
  }
  public getVal(configName: string){
    return ListEqual.findByKey(this.list, configName).value;
  }

  // 设置轨道
  public setIndex(index: number) {
    if (index > this.len - 1) index = this.len - 1;
    if (index < 0) index = 0;
    this.current = index;
    this.play();
    return this;
  }

  // 设置轨道， 打开轨道编辑器
  public play() {
    this.playing = this.current;
    return this;
  }

  public prev() {
    this.setIndex((this.current - 1 + this.len) % this.len);
    return this;
  }

  public next() {
    this.setIndex((this.current + 1) % this.len);
    return this;
  }

  public enc() {
    const thisItem = this.list[this.current];
    thisItem.enc();
    return this;
  }

  public dec() {
    const thisItem = this.list[this.current];
    thisItem.dec();
    return this;
  }
  setMin(){
    const thisItem = this.list[this.current];
    thisItem.setMin();
    return this;
  }
  setMax(){
    const thisItem = this.list[this.current];
    thisItem.setMax();
    return this;
  }
  public setVal (val: number){
    const thisItem = this.list[this.current];
    thisItem.setVal(val);
    return this;
  }
  public reset(){
    const thisItem = this.list[this.current];
    thisItem.reset();
    return this;
  }
}




// function createTrackClass(className: string) {
//   const string = `
// class ${className} extends Track {
//   static name_ = '${className}';
//   constructor() {
//     const [...rest] = arguments;
//     super(...rest);
//   }
//
//   static setConfig(key, name, defaultValue, valueType, min, max, desc) {
//     Track.commonConfigs.${className} || (Track.commonConfigs.${className} = []);
//     Track.commonConfigs.${className}.push([key, name, defaultValue, valueType, min, max, desc]);
//     return ${className};
//   }
// }`;
//   return eval(`(${string})`);
// }

function createTrackClass(className: string) {
  const string = `
class ${className} extends Track {
  // static name_ = '${className}';
  constructor() {
    const [...rest] = arguments;
    super(...rest);
  }

  static setConfig(key, name, defaultValue, valueType, min, max, desc) {
    Track.commonConfigs.${className} || (Track.commonConfigs.${className} = []);
    Track.commonConfigs.${className}.push([key, name, defaultValue, valueType, min, max, desc]);
    return ${className};
  }
}`;
  const aa = eval(`(${string})`);
  aa.name_ = className;
  // @ts-ignore;
  aa.setConfig = function (key, name, defaultValue, valueType, min, max, desc) {
    // @ts-ignore;
    Track.commonConfigs[className] || (Track.commonConfigs[className] = []);
    Track.commonConfigs[className].push([key, name, defaultValue, valueType, min, max, desc]);
    return Track.commonConfigs[className];
  }
  return aa;
}


const trackConfigs = [
  {
    name: 'CommonOptionsTrack', required: true, list: [
      ['CanvasView', '开启音频可视化轨道', 0, 'int', 0, 1, '是否启用'],
      ['CanvasPic', '开启背景轨道', 0, 'int', 0, 1, '是否启用'],
      ['CanvasPicMalfunction', '开启背景轨道故障特效', 0, 'int', 0, 1, '是否启用'],
      ['CanvasText', '开启歌词轨道', 0, 'int', 0, 1, '是否启用'],
      ['CanvasTextMalfunction', '开启歌词轨道故障特效', 0, 'int', 0, 1, '是否启用'],
      ['changeBG_When_LRC_Changed', '背景歌词同步切换', 1, 'int', 0, 1, '是否启用'],
      ['VideoView', '开启视频轨道1', 0, 'int', 0, 1, '是否启用'],
      ['VideoView1', '开启视频轨道2', 0, 'int', 0, 1, '是否启用'],
      ['DomClock', '显示时钟', 0, 'int', 0, 1, '是否启用'],
      ['gameUI', '显示游戏界面', 0, 'int', 0, 1, '是否启用'],
      ['gameScene', '显示游戏场景', 0, 'int', 0, 1, '是否启用'],
    ]
  },
  {
    name: 'GameTrack', required: true, list: [
      ['RhythmPointVolumeFloatRange', '节奏点浮动范围', 1, 'int', 0, 30, '值越大， 则节奏点越少'],
      ['RhythmPointTimeout', '节奏点最小间隔', 15, 'int', 0, 30, 'timeout = (num * 10) ms'],
      ['RhythmPointRemoveFloatRange', '节奏点消除范围', 20, 'int', 5, 60, 'range = (num * 10)'],
      ['RhythmPointMissTipSound', 'miss提示音', 0, 'int', 0, 1, '是否开启'],
      ['RhythmPointCenterPointOffset', '轨道偏移量', -30, 'int', -60, 60, '轨道偏移量'],
      ['trick', '开启作弊模式', 0, 'int', 0, 1, '是否开启'],
    ]
  },
  {
    multiple: true,
    required: true,
    name: 'CanvasTrack', list: [
      ['disable', '是否启用', 0, 'int', 0, 1, '是否启用'],
      ['renderType', '渲染方式', 2, 'int', 0, 3, '渲染方式'],
      ['direction', '渲染方向', 0, 'int', 0, 1, '渲染方式'],
      ['baseSizeType', '基础尺寸单位', 0, 'int', 0, 1, '0: 屏幕较小边， 1： 屏幕较大边'],
      ['noZero', '删除无效数据', 1, 'int', 0, 1, '将频谱数据复制一份， 并逆向拼接在源数据后面'],
      ['copyData', '复制并反向数据', 1, 'int', 0, 1, '将频谱数据复制一份， 并逆向拼接在源数据后面'],
      ['showDataBefore', '展示均衡前的数据', 0, 'int', 0, 1, '展示均衡前的数据'],
      ['midPositionX', 'X中心位子', 50, 'int', 0, 100, '绘制中心位于屏幕位置， 0在最左， 100在最右'],
      ['midPositionY', 'Y中心位子', 50, 'int', 0, 100, '绘制中心位于屏幕位置， 0在最上， 100在最下'],
      ['clearPrevView', '保留上次渲染', 70, 'int', 0, 100, '保留上次绘制（百分比）'],
      ['mainRadius', '基线距中心点位置（Y轴）', 25, 'int', -100, 100, '圆形时为半径, 百分比基于基础尺寸单位'],
      ['avrLevelMainRadiusModify', '频谱均值基线距离修正系数', 25, 'int', 0, 100, '基线随频谱修正系数（百分比）'],
      ['mainRadiusOpacity', '基线透明度', 75, 'int', 0, 100, '基线透明度'],
      ['mainRadiusLineWidth', '基线宽度', 3, 'int', 0, 100, '基线宽度， 千分比基准此村'],
      ['floatRange', '频谱波动范围', 2, 'int', -10, 10, '频谱波动范围 相对基础尺寸 百分制'],
      ['avrLevelFloatRangeModify', '频谱均值波动范围修正系数', 25, 'int', 0, 100, '基线随频谱修正系数（百分比）'],
      ['stepModify', '频谱间隔修正', 10, 'int', 0, 100, ' 十分比预设'],
      ['lineLineWidth', '频谱宽度', 3, 'int', 0, 100, ' 千分比预设'],
      ['dataModify', '频谱修正系数', 15, 'int', 0, 100, '十分比预设'],
      ['dataOffsetModify', '频谱偏移修正系数', 6, 'int', -100, 100, '百分比预设'],
      ['minHeightModify', '频谱最小修正系数', -0, 'int', -300, 100, '百分比预设'],
      ['threshold', '阈值', 7, 'int', 0, 100, '百分比预设']
    ]
  },
  {name: 'VideoTrack', list: []}
];


export const biquadFilterFrequency = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000, 20000, 24000];
const balanceTrackConfigs = {
  name: 'BalanceTrack',
  required: true,
  list: biquadFilterFrequency.map((item, index) => [`balance${index}`, `${item}`, 0, 'int', -12, 12, 'db'])
};
trackConfigs.push(balanceTrackConfigs);



export class ModifyManager {
  updateCommonOptions?: Function;
  list: [TrackList, ...Track[]] | [];
  playing: number;
  current: number;

  constructor(updateCommonOptions?: Function) {
    this.list = [];
    this.playing = 0;
    this.current = 0;
    this.setList([new TrackList(this)]);
    this.setIndex(0);
    updateCommonOptions && (this.updateCommonOptions = updateCommonOptions);
    this.init();
  }
  getTrackByName(name: TTrackClass){
    // @ts-ignore;
    return this.list[0].list.find(item => item.constructor.name_ === name);
  }


  init() {
    // @ts-ignore;
    this.updateCommonOptions && this.updateCommonOptions();
    return this;
  }

  get len() {
    return this.list.length;
  }
  savePresets() {
    this.list[0]?.savePresets('');
    return this;
  }

  exportPresets(){
    this.list[0]?.exportPresets();
    return this;
  }
  importPresets(presets: any){
    this.list[0]?.importPresets(presets);
    return this;
  }
  setList(list: [TrackList, ...Track[]]) {
    this.list = list;
    this.current = 0;
    return this;
  }

  replace(index: number, replacer: Track) {
    this.list.splice(index, 1, replacer);
    return this;
  }

  // 设置轨道
  setIndex(index: number) {
    if (index > this.len - 1) index = this.len - 1;
    if (index < 0) index = 0;
    this.current = index;
    this.play();
    return this;
  }

  // 设置轨道， 打开轨道编辑器
  play() {
    this.playing = this.current;
    if (this.current === 0) {
      // @ts-ignore;
      this.replace(1, this.list[this.current])
    }
    this.list[this.current].play();
    return this;
  }

  prev() {
    this.setIndex((this.current - 1 + this.len) % this.len);
    return this;
  }

  next() {
    this.setIndex((this.current + 1) % this.len);
    return this;
  }

  enc() {
    // @ts-ignore;
    this.list[this.current] && this.list[this.current].enc();
    this.list[0]?.savePresets('');
    return this;
  }

  dec() {
    // @ts-ignore;
    this.list[this.current] && this.list[this.current].dec();
    this.list[0]?.savePresets('');
    return this;
  }

  prevItem() {
    this.list[this.current] && this.list[this.current].prev();
    return this;
  }

  nextItem() {
    this.list[this.current] && this.list[this.current].next();
    return this;
  }

  up() {

    // @ts-ignore;
    this.list[0].prev();
    return this;
  }

  down() {
    // @ts-ignore;
    this.list[0].next();
    return this;
  }

  add() {
    // @ts-ignore;
    this.list[0]?.add.call(this.list[0], ...arguments);
    // @ts-ignore;
    this.list[0]?.savePresets('');
    return this;
  }

  delete() {
    // @ts-ignore;
    this.list[0].delete.call(this.list[0], ...arguments);
    // @ts-ignore;
    this.list[0]?.savePresets();
    return this;
  }

  copy() {
    // @ts-ignore;
    this.list[0].copy.call(this.list[0], ...arguments);
    // @ts-ignore;
    this.list[0].savePresets();
    return this;
  }
}


function createALink (data: any, fileName: string, parentNode?: Element): Element{
  const blob = new Blob([data], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const link: Element = DomUtil.node('a', fileName);
  // @ts-ignore;
  link.href = url;
  // @ts-ignore;
  link.download = fileName;
  DomUtil.append(parentNode || document.body, link);
  return link;
}


// 轨道列表管理器
// 可以是 canvas 轨道 和视频轨道 // 左侧第一栏
class TrackList {
  static name_ = 'TrackList';

  playing: number;
  current: number;
  parent: ModifyManager;
  list: (ModifyManager|Track)[];

  constructor(parent: ModifyManager) {
    this.list = [];
    this.parent = parent;
    this.playing = 0;
    this.current = 0;
    this.loadPresets();

    constructorList.forEach((constructor) => {
      // @ts-ignore;
      const constructorName = constructor.name_;
      // @ts-ignore;
      const hasDto = this.list.some(i => i.constructor.name_ === constructorName);
      if (!hasDto) {
        // @ts-ignore;
        this.add({type: constructorName, name: constructorName})
      }
    })


  }

  get len() {
    return this.list.length;
  }

  add(options: {
    type?: 'CanvasTrack' | 'VideoTrack' | 'CommonOptionsTrack' | 'BalanceTrack' | 'GameTrack';
    name?: string;
    data?: {[index: string]: number}
  } = {}, len = 1) {
    const {type = 'CanvasTrack', name, data} = options;
    for (let i = 0; i < len; i++) {
      // @ts-ignore;
      TrackClass[type] && this.list.push(new TrackClass[type](name, this, data));
    }
    this.setIndex(this.len - 1);
    return this;
  }

  delete() {
    const item = this.list[this.current];
    // @ts-ignore;
    const className = item.constructor.name_;
    const config = trackConfigs.find(config => config.name === className);
    // 不是多项的不让删， 最后一条不让删
    // @ts-ignore;
    if (!config.multiple || this.list.filter(item => item.constructor.name_ === className).length<=1) {
      return;
    }
    if (item) {
      this.list.splice(this.current, 1);
      this.setIndex(0);
    }
    return this;
  }

  copy() {
    const item = this.list[this.current];
    // @ts-ignore;
    const className = item.constructor.name_;
    const config = trackConfigs.find(config => config.name === className);
    // 不是多项的不让复制
    // @ts-ignore;
    if (!config.multiple) return;
    // @ts-ignore;
    if (item && !['CommonOptionsTrack', 'BalanceTrack'].includes(item.constructor.name_)) {
      // @ts-ignore;
      this.list.splice(this.current, 0, new item.constructor(item.name + 'Copy', this, item));
      this.setIndex(this.current + 1);
    }
    return this;
  }

  setList(list: (Track|ModifyManager)[]) {
    this.list = list;
    this.current = 0;
    return this;
  }

  // 设置轨道
  setIndex(index: number) {
    if (index > this.len - 1) index = this.len - 1;
    if (index < 0) index = 0;
    this.current = index;
    this.play();
    return this;
  }

  // 设置轨道， 打开轨道编辑器
  play() {
    this.playing = this.current;
    // @ts-ignore;
    this.parent.replace(1, this.list[this.current]);
    return this;
  }

  prev() {
    this.setIndex((this.current - 1 + this.len) % this.len);
    return this;
  }

  next() {
    this.setIndex((this.current + 1) % this.len);
    return this;
  }

  importPresets(presets: any){
    presets.forEach((item: any, index: number) => {
      // @ts-ignore;
      const prev = this.list.find(item_ => item_.constructor.name_ === item.type);
      // @ts-ignore;
      if (prev && !['CanvasTrack'].includes(item.type)) {
        prev.list.forEach((val: any) => {
          const curVal = item.data[val.key];
          GetType.isEmpty(curVal) || (val.value = curVal)
        })
      } else {
        this.add(item);
      }
    });
    this.savePresets('');
    // @ts-ignore;
    location.reload();
    return this;
  }
  exportPresets(){
    const result = this.list.map(item => {
      const data:{[idnex: string]: number} = {};
      // @ts-ignore;
      item.list.forEach((key: ITrackListItem) => {
        // @ts-ignore;
        data[key.key] = item[key.key];
      });
      // @ts-ignore;
      return {name: item.name, data, type: item.constructor.name_}
    });

    const $a = createALink(JSON.stringify(result), `dy_player.preset`);
    // @ts-ignore;
    $a.click();
    DomUtil.remove($a);
  }
  savePresets(name: string) {
    const result = this.list.map(item => {
      const data:{[idnex: string]: number} = {};
      // @ts-ignore;
      item.list.forEach((key: ITrackListItem) => {
        // @ts-ignore;
        data[key.key] = item[key.key];
      });
      // @ts-ignore;
      return {name: item.name, data, type: item.constructor.name_}
    });

    this.parent?.updateCommonOptions && this.parent?.updateCommonOptions();
    localStorage.setItem('configPresets', JSON.stringify(result));
    return this;
  }

  loadPresets() {
    try {
      const presets = JSON.parse(localStorage.getItem('configPresets') || '[]');

      presets.length || presets.push({});

      constructorList.forEach(constructor => {
        // @ts-ignore;
        const constructorName = constructor.name_;
        // @ts-ignore;
        const hasDot = presets.some(i => i.type === constructorName);
        if (!hasDot) {
          // @ts-ignore;
          this.add({type: constructorName, name: constructorName})
        }
      });

      // @ts-ignore;
      presets.forEach(item => {
        this.add(item);
      });
    } catch (e) {
      console.log(e);
      console.log('load presets fail.');
    }
    return this;
  }
}


const TrackClass: {[index: string]: Track} = {
};
type TTrackClass = keyof typeof TrackClass;
trackConfigs.forEach(config => {
  // @ts-ignore;
  const track = TrackClass[config.name] = createTrackClass(config.name);
  config.list.forEach(conf => {
    // @ts-ignore;
    track.setConfig(...conf)
  });

});
const constructorList: Track[] = trackConfigs.filter(config => config.required).map(config =>  TrackClass[config.name]);
