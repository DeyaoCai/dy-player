import {GetType} from "./GetType";
import {Sound} from "./Sound";
// @ts-ignore;
import {Random} from './random';
import {DomUtil} from "@/tools/DomUtil";

const keyMap: {[index: string]: string} = {
  "0": "96", "1": "97", "2": "98", "3": "99", "4": "100", "5": "101", "6": "102", "7": "103", "8": "104", "9": "105",

  "a": "65", "b": "66", "c": "67", "d": "68", "e": "69", "f": "70", "g": "71",
  "h": "72", "i": "73", "j": "74", "k": "75", "l": "76", "m": "77", "n": "78",
  "o": "79", "p": "80", "q": "81",
  "r": "82", "s": "83", "t": "84",
  "u": "85", "v": "86", "w": "87",
  "x": "88", "y": "89", "z": "90",

  "f1": "112", "f2": "113", "f3": "114", "f4": "115",
  "f5": "116", "f6": "117", "f7": "118", "f8": "119",
  "f9": "120", "f10": "121", "f11": "122", "f12": "123",

  "+": "107", "-": "109", "*": "106", "/": "111", ".": "110",

  "backspace": "8", "tab": "9",
  "clear": "12", "enter": "13",
  "esc": "27", "spacebar": "32",
  "left arrow": "37", "up arrow": "38", "right arrow": "39", "down arrow": "40",
  "left": "37", "up": "38", "right": "39", "down": "40",

  ";:": "186", "<": "188", "=+": "187", "-_": "189", ">": "190", "/?": "191", "`~": "192",

  "page up": "33", "page down": "34",
  "end": "35", "home": "36",
  "insert": "45", "delete": "46",

  "cape lock": "20",
  "num lock": "144",

  "[{": "219", "\\|": "220",
  "]}": "221", "'\"": "222",

  "shift": "16", "control": "17", "alt": "18",

  "搜索": "170", "收藏": "171", "浏览器": "172",
  "音量减": "174", "音量加": "175", "静音": "173", "停止": "179",
  "邮件": "180",
};
type TKeyMap = keyof typeof keyMap;


const keyMap_: {[index: string]: string} = {};

Object.keys(keyMap).forEach((key: string) => {
  keyMap_[keyMap[key]] = key
});
class ShortCutAbstract {
  common(keyNum: TKeyMap|number, cb: Function) {
  }

  ctrl(keyNum: TKeyMap|number, cb: Function) {
  }

  alt(keyNum: TKeyMap|number, cb: Function) {
  }

  shift(keyNum: TKeyMap|number, cb: Function) {
  }

  ctrl_alt(keyNum: TKeyMap|number, cb: Function) {
  }

  ctrl_shift(keyNum: TKeyMap|number, cb: Function) {
  }

  alt_shift(keyNum: TKeyMap|number, cb: Function) {
  }
  ctrl_alt_shift(keyNum: TKeyMap|number, cb: Function) {
  }
}

function makeShortCutInitFn(key: string) {
  // @ts-ignore;
  ShortCut.prototype[key] = function (keyNum: TKeyMap|number, cb: Function) {
    GetType.isNumber(keyNum) || (keyNum = keyMap[keyNum] || keyNum);
    // @ts-ignore;
    this.maps[key] || (this.maps[key] = {});
    // @ts-ignore;
    this.maps[key][keyNum] = (ev: Event) => {
      Sound.play('confirm');
      const result = cb();
      if (!result) {
        ev.stopPropagation();
        ev.preventDefault();
      }
    }
  }

  // @ts-ignore;
  ShortCut.prototype[`${key}Desc`] = function (keyNum: TKeyMap|number, desc: any) {
    GetType.isNumber(keyNum) || (keyNum = keyMap[keyNum] || keyNum);
    // @ts-ignore;
    this.describeMaps[key] || (this.describeMaps[key] = {});
    // @ts-ignore;
    this.describeMaps[key][keyNum] = desc;
  }
}
const requestAnimationFrame = window.requestAnimationFrame ||
  // @ts-ignore;
  window.webkitrequestAnimationFrame ||
  // @ts-ignore;
  window.mozrequestAnimationFrame;//兼容
const wrap = DomUtil.node('div');
wrap.className = 'short-cut-view';
DomUtil.append(document.body, wrap);

const triggered: string[][] = [];
export class ShortCut extends ShortCutAbstract{
  static toast(message: string[]){

    const node = DomUtil.node('div');
    message.forEach(key => {
      DomUtil.append(node, DomUtil.node('span', key.toUpperCase()))
    });

    DomUtil.prepend(wrap, node);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        DomUtil.class(node, 'active');
        setTimeout(() => {
          DomUtil.class(node, 'hide');
          setTimeout(() => {
            requestAnimationFrame(() => DomUtil.remove(node));
          }, 2000);
        }, 1000);
      })
    });
  }
  hasInited: boolean = false;
  maps = {};

  describeMaps = {};

  static triggeredCacheLength = 20;
  static triggered : string[][] = triggered;
  static cacheTriggered(keys: string[]){
    const {triggered, triggeredCacheLength} = ShortCut;
    const prev = triggered[0];
    if (prev && keys.every(((val, index) => prev[index] === val))) return;
    triggered.unshift(keys);

    ShortCut.toast(keys)
    if (triggered.length > triggeredCacheLength) {
      triggered.pop();
    }
  }


  init(dom?: Node, fns: any = {}, describeMaps: any = {}) {
    const slef = this;
    const $body = dom || document.querySelector("body");
    // @ts-ignore;
    this.hasInited || $body.addEventListener('keydown', (ev: Event) => {
      let keys = [];

      let key = '';
      // @ts-ignore;
      if (ev.ctrlKey) {
        keys.push('ctrl');
      }
      // @ts-ignore;
      if (ev.altKey) {
        keys.push('alt');
      }
      // @ts-ignore;
      if (ev.shiftKey) {
        keys.push('shift');
      }
      key = keys.join('') || '';
      // @ts-ignore;
      keys.push(keyMap_[ev.which]);

      // @ts-ignore;
      const describeMaps_ = this.describeMaps[key || 'common'] || {};
      // @ts-ignore;
      keys.push(describeMaps_[ev.which] || '暂无描述，待补充');

      // @ts-ignore;
      const cmd = `slef.maps.${key || 'common'}[${ev.which}](ev)`;
      try {
        eval(cmd);
        ShortCut.cacheTriggered(keys);
      } catch (e) {
        // console.log(e)
      }

    });
    if (fns) {
      GetType.isObject(fns) && Object.keys(fns).forEach((key: string) => {
        // @ts-ignore;
        fns[key] && Object.keys(fns[key]).forEach(item => this[key](item, fns[key][item]));
      });
    }
    if (describeMaps) {
      GetType.isObject(describeMaps) && Object.keys(describeMaps).forEach((key: string) => {
        // @ts-ignore;
        describeMaps[key] && Object.keys(describeMaps[key]).forEach(item => this[`${key}Desc`](item, describeMaps[key][item]));
      });
    }
    this.hasInited = true;
  };
}

['common', 'ctrl', 'alt', 'shift', 'ctrl_alt', 'ctrl_shift', 'alt_shift', 'ctrl_alt_shift',].forEach(makeShortCutInitFn);




export const shortCut = new ShortCut();
shortCut.init();
