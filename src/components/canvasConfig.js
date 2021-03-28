import defaultJson from '../../userConfig/trackPresets/default';
export class Track {
  static commonConfigs = {};
  static name_ = 'Track';

  static setConfig(key, name, value, valueType, min, max, desc) {
    CanvasTrack.commonConfigs.push([key, name, value, valueType, min, max, desc]);
  }

  constructor(defaultValue = {}) {
    this.current = 0;
    this.playing = 0;
    this.list = [];
    Track.commonConfigs[this.constructor.name_].forEach(item => {
      const [key, name, value, valueType, min, max, desc] = item;
      const defaultVal = defaultValue[key];
      this.list.push({key, name, value: defaultVal !== undefined ? defaultVal : value, valueType, min, max, desc});
    });

    this.list.forEach(item => {
      Object.defineProperty(this, item.key, {
        get() {
          return item.value;
        },
      });
    });
  }

  get len() {
    return this.list.length
  }

  // 设置轨道
  setIndex(index) {
    if (index > this.len - 1) index = this.len - 1;
    if (index < 0) index = 0;
    this.current = index;
    this.play();
    return this;
  }

  // 设置轨道， 打开轨道编辑器
  play() {
    this.playing = this.current;
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
    const thisItem = this.list[this.current];
    let val = thisItem.value + 1;

    if (val > thisItem.max) {
      val = thisItem.max
    }
    if (val < thisItem.min) {
      val = thisItem.min;
    }
    thisItem.value = val;
    return this;
  }

  dec() {
    const thisItem = this.list[this.current];
    let val = thisItem.value - 1;

    if (val > thisItem.max) {
      val = thisItem.max
    }
    if (val < thisItem.min) {
      val = thisItem.min;
    }
    thisItem.value = val;
    return this;
  }
}

export class CanvasTrack extends Track {
  static name_ = 'CanvasTrack';
  constructor() {
    const [name, ...rest] = arguments;
    super(...rest);
    this.name = name || this.constructor.name_;
  }

  static setConfig(key, name, value, valueType, min, max, desc) {
    Track.commonConfigs.CanvasTrack || (Track.commonConfigs.CanvasTrack = []);
    Track.commonConfigs.CanvasTrack.push([key, name, value, valueType, min, max, desc]);
    return CanvasTrack;
  }
}


export class VideoTrack extends Track {
  static name_ = 'VideoTrack';
  constructor() {
    const [name, ...rest] = arguments;
    super(...rest);
    this.name = name || this.constructor.name_;
  }

  static setConfig(key, name, value, valueType, min, max, desc) {
    Track.commonConfigs.VideoTrack || (Track.commonConfigs.VideoTrack = []);
    Track.commonConfigs.VideoTrack.push([key, name, value, valueType, min, max, desc]);
    return VideoTrack;
  }
}


CanvasTrack.setConfig('disable', '是否启用', 0, 'int', 0, 1, '是否启用');
CanvasTrack.setConfig('renderType', '渲染方式', 2, 'int', 0, 3, '渲染方式');
CanvasTrack.setConfig('direction', '渲染方向', 0, 'int', 0, 1, '渲染方式');
CanvasTrack.setConfig('baseSizeType', '基础尺寸单位', 0, 'int', 0, 1, '0: 屏幕较小边， 1： 屏幕较大边');
CanvasTrack.setConfig('noZero', '删除无效数据', 1, 'int', 0, 1, '将频谱数据复制一份， 并逆向拼接在源数据后面');
CanvasTrack.setConfig('copyData', '复制并反向数据', 1, 'int', 0, 1, '将频谱数据复制一份， 并逆向拼接在源数据后面');
CanvasTrack.setConfig('showDataBefore', '展示均衡前的数据', 0, 'int', 0, 1, '展示均衡前的数据');

CanvasTrack.setConfig('midPositionX', 'X中心位子', 50, 'int', 0, 100, '绘制中心位于屏幕位置， 0在最左， 100在最右');
CanvasTrack.setConfig('midPositionY', 'Y中心位子', 50, 'int', 0, 100, '绘制中心位于屏幕位置， 0在最上， 100在最下');
CanvasTrack.setConfig('clearPrevView', '保留上次渲染', 70, 'int', 0, 100, '保留上次绘制（百分比）');
CanvasTrack.setConfig('mainRadius', '基线距中心点位置（Y轴）', 25, 'int', -100, 100, '圆形时为半径, 百分比基于基础尺寸单位');
CanvasTrack.setConfig('avrLevelMainRadiusModify', '频谱均值基线距离修正系数', 25, 'int', 0, 100, '基线随频谱修正系数（百分比）');

CanvasTrack.setConfig('mainRadiusOpacity', '基线透明度', 75, 'int', 0, 100, '基线透明度');
CanvasTrack.setConfig('mainRadiusLineWidth', '基线宽度', 3, 'int', 0, 100, '基线宽度， 千分比基准此村');

CanvasTrack.setConfig('floatRange', '频谱波动范围', 2, 'int', -10, 10, '频谱波动范围 相对基础尺寸 百分制');
CanvasTrack.setConfig('avrLevelFloatRangeModify', '频谱均值波动范围修正系数', 25, 'int', 0, 100, '基线随频谱修正系数（百分比）');

CanvasTrack.setConfig('stepModify', '频谱间隔修正', 10, 'int', 0, 100, ' 十分比预设');
CanvasTrack.setConfig('lineLineWidth', '频谱宽度', 3, 'int', 0, 100, ' 千分比预设');
CanvasTrack.setConfig('dataModify', '频谱修正系数', 15, 'int', 0, 100, '十分比预设');
CanvasTrack.setConfig('dataOffsetModify', '频谱偏移修正系数', 6, 'int', -100, 100, '百分比预设');
CanvasTrack.setConfig('minHeightModify', '频谱最小修正系数', -0, 'int', -300, 100, '百分比预设');
CanvasTrack.setConfig('threshold', '阈值', 7, 'int', 0, 100, '百分比预设');


export class CommonOptionsTrack extends Track {
  static name_ = 'CommonOptionsTrack';
  constructor() {
    const [name, ...rest] = arguments;
    super(...rest);
    this.name = name || this.constructor.name_;
  }

  static setConfig(key, name, value, valueType, min, max, desc) {
    Track.commonConfigs.CommonOptionsTrack || (Track.commonConfigs.CommonOptionsTrack = []);
    Track.commonConfigs.CommonOptionsTrack.push([key, name, value, valueType, min, max, desc]);
    return CommonOptionsTrack;
  }
}

CommonOptionsTrack.setConfig('CanvasView', '开启音频可视化轨道', 1, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('CanvasPic', '开启背景轨道', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('CanvasPicMalfunction', '开启背景轨道故障特效', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('CanvasText', '开启歌词轨道', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('CanvasTextMalfunction', '开启歌词轨道故障特效', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('changeBG_When_LRC_Changed', '背景歌词同步切换', 1, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('VideoView', '开启视频轨道1', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('VideoView1', '开启视频轨道2', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('DomClock', '显示时钟', 0, 'int', 0, 1, '是否启用');
CommonOptionsTrack.setConfig('BalanceTrack', '显示均衡器', 0, 'int', 0, 1, '是否启用');



export class GameTrack extends Track {
  static name_ = 'GameTrack';
  constructor() {
    const [name, ...rest] = arguments;
    super(...rest);
    this.name = name || this.constructor.name_;
  }

  static setConfig(key, name, value, valueType, min, max, desc) {
    Track.commonConfigs.GameTrack || (Track.commonConfigs.GameTrack = []);
    Track.commonConfigs.GameTrack.push([key, name, value, valueType, min, max, desc]);
    return GameTrack;
  }
}


GameTrack.setConfig('RhythmPointVolumeFloatRange', '节奏点浮动范围', 1, 'int', 0, 30, '值越大， 则节奏点越少');
GameTrack.setConfig('RhythmPointTimeout', '节奏点最小间隔', 15, 'int', 0, 30, 'timeout = (num * 10) ms');
GameTrack.setConfig('RhythmPointRemoveFloatRange', '节奏点消除范围', 20, 'int', 5, 60, 'range = (num * 10)');
GameTrack.setConfig('RhythmPointMissTipSound', 'miss提示音', 0, 'int', 0, 1, '是否开启');
GameTrack.setConfig('RhythmPointCenterPointOffset', '轨道偏移量', -30, 'int', -60, 60, '轨道偏移量');
GameTrack.setConfig('trick', '开启作弊模式', 0, 'int', 0, 1, '是否开启');


export class BalanceTrack extends Track {
  static name_ = 'BalanceTrack';
  constructor() {
    const [name, ...rest] = arguments;
    super(...rest);
    this.name = name || this.constructor.name_;
  }

  static setConfig(key, name, value, valueType, min, max, desc) {
    Track.commonConfigs.BalanceTrack || (Track.commonConfigs.BalanceTrack = []);
    Track.commonConfigs.BalanceTrack.push([key, name, value, valueType, min, max, desc]);
    return BalanceTrack;
  }
}

export const biquadFilterFrequency = [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000, 20000, 24000];
biquadFilterFrequency.forEach((item, index) => {
  BalanceTrack.setConfig(`balance${index}`, `${item}`, 0, 'int', -12, 12, 'db');
});

export class ModifyManager {
  constructor(updateCommonOptions) {
    this.list = [];
    this.playing = 0;
    this.current = 0;
    this.setList([new TrackList(this)]);
    this.setIndex(0);
    this.updateCommonOptions = updateCommonOptions;
    this.init();
  }




  init(){
    this.trackList = this.list.find(i => i.constructor.name_ === 'TrackList');
    this.commonOptions = this.list.find(i => i.constructor.name_ === 'TrackList').list.find(i => i.constructor.name_ === 'CommonOptionsTrack');
    this.gameTrack = this.list.find(i => i.constructor.name_ === 'TrackList').list.find(i => i.constructor.name_ === 'GameTrack');
    this.balanceTrack = this.list.find(i => i.constructor.name_ === 'TrackList').list.find(i => i.constructor.name_ === 'BalanceTrack');
    this.updateCommonOptions && this.updateCommonOptions();
    return this;
  }

  get len() {
    return this.list.length;
  }
  savePresets(){
    this.trackList.savePresets();
    return this;
  }

  setList(list) {
    this.list = list;
    this.current = 0;
    return this;
  }

  replace(index, replacer) {
    this.list.splice(index, 1, replacer);
    return this;
  }

  // 设置轨道
  setIndex(index) {
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
    this.list[this.current] && this.list[this.current].enc();
    this.trackList.savePresets();
    return this;
  }

  dec() {
    this.list[this.current] && this.list[this.current].dec();
    this.trackList.savePresets();
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
    this.list[0].prev();
    return this;
  }

  down() {
    this.list[0].next();
    return this;
  }

  add() {
    this.list[0].add.call(this.list[0], ...arguments);
    this.list[0].savePresets();
    return this;
  }

  delete() {
    this.list[0].delete.call(this.list[0], ...arguments);
    this.list[0].savePresets();
    return this;
  }

  copy() {
    this.list[0].copy.call(this.list[0], ...arguments);
    this.list[0].savePresets();
    return this;
  }
}

const constructorList = [GameTrack, BalanceTrack, CommonOptionsTrack];

// 轨道列表管理器
// 可以是 canvas 轨道 和视频轨道 // 左侧第一栏
class TrackList {
  static name_ = 'TrackList';
  static CanvasTrack = CanvasTrack;
  static VideoTrack = VideoTrack;
  static CommonOptionsTrack = CommonOptionsTrack;
  static BalanceTrack = BalanceTrack;
  static GameTrack = GameTrack;



  savePresets(name) {
    const result = this.list.map(item => {
      const data = {};
      item.list.forEach(key => {
        data[key.key] = item[key.key];
      });
      return {name: item.name, data, type: item.constructor.name_}
    });
    this.parent.updateCommonOptions();
    localStorage.setItem('configPresets', JSON.stringify(result));
    return this;

    // const {fs, path, process} = window.node;
    // const outputPath = path.join(process.cwd(), './userConfig/trackPresets/default.json');
    // fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  }

  loadPresets() {
    try {
      const presets = JSON.parse(localStorage.getItem('configPresets') || '[]');

      // eval(`(${fs.readFileSync(outputPath, {encoding: 'utf-8'})})`);
      presets.length || presets.push({});

      constructorList.forEach(constructor => {
        const constructorName = constructor.name_;
        const hasDot = presets.some(i => i.type === constructorName);
        if (!hasDot) {
          this.add({type: constructorName, name: constructorName})
        }
      });

      presets.forEach(item => {
        this.add(item);
      });
    } catch (e) {
      console.log(e);
      console.log('load presets fail.');
    }
    return this;
  }

  constructor(parent) {
    this.list = [];
    this.parent = parent;
    this.playing = 0;
    this.current = 0;
    this.loadPresets();

    constructorList.forEach(constructor => {
      const constructorName = constructor.name_;
      const hasDto = this.list.some(i => i.constructor.name_ === constructorName);
      if (!hasDto) {
        this.add({type: constructorName, name: constructorName})
      }
    })


  }

  get len() {
    return this.list.length;
  }

  add(options = {}, len = 1) {
    const {type = 'CanvasTrack', name, data} = options;
    for (let i = 0; i < len; i++) {
      console.log(TrackList[type], type);
      TrackList[type] && this.list.push(new TrackList[type](name, data));
    }
    this.setIndex(this.len - 1);
    return this;
  }

  delete() {
    const item = this.list[this.current];
    if (item) {
      this.list.splice(this.current, 1);
      this.setIndex(0);
    }
    return this;
  }

  copy() {
    const item = this.list[this.current];
    if (item && !['CommonOptionsTrack', 'BalanceTrack'].includes(item.constructor.name_)) {
      this.list.splice(this.current, 0, new item.constructor(item.name + 'Copy', item));
      this.setIndex(this.current + 1);
    }
    return this;
  }

  setList(list) {
    this.list = list;
    this.current = 0;
    return this;
  }

  // 设置轨道
  setIndex(index) {
    if (index > this.len - 1) index = this.len - 1;
    if (index < 0) index = 0;
    this.current = index;
    this.play();
    return this;
  }

  // 设置轨道， 打开轨道编辑器
  play() {
    this.playing = this.current;
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
}


