const soundMap = {
  change: "./sound/change.mp3",
  confirm: "./sound/confirm.mp3",
  done: "./sound/done.mp3",
  warning: "./sound/warning.mp3",
};
class CacheList {
  list: Element[];
  constructor(){
    this.list = [];
  }
  getAudio(){
    let dom = this.list.shift();
    const playEnd = () => {
      dom && this.list.push(dom);
    };
    if (!dom) {
      dom = document.createElement('audio');
      // @ts-ignore;
      dom.volume = .2;
      // @ts-ignore;
      dom.autoplay = 'autoplay';
      const body = document.querySelector("body");
      body && body.appendChild(dom);

      dom.addEventListener('ended', playEnd);
      dom.addEventListener('error', playEnd);
    }

    return dom;
  }
}

const cacheList = new CacheList();
type TSoundType = keyof typeof soundMap;
export class Sound {
  static play(url: TSoundType){
    const dom = cacheList.getAudio();
    const volumeMap = {
      change: 0.01,
      confirm: 0.01,
      done: 0.2,
      warning: 0.01,
    }
    // @ts-ignore;
    dom.volume = volumeMap[url] || 0.1;
    // @ts-ignore;
    dom.src = soundMap[url] || url;
  }
}
