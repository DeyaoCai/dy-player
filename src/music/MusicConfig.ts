// @ts-ignore;
import {MakeThrottle} from "@/utils";
import {Picture} from "@/picture/Picture";


// 图片
interface IMusicConfigOptions {
  images: string[];
}

export class MusicConfig {
  lrc: string = '';
  ended?:Function;
  pictureCanvasCtx?: Picture;
  picDom?: Node = undefined;
  imageGroup: string[][] = [];

  mouseMoveConf = {x: 0, y: 0, w: 1, h: 1, _x: .5, _y: .5}; // 鼠标位置
  // 当前图片计算出来的色调
  currentImgAviColor: [number, number, number, number] =  [255, 255, 255, 1];
  // 当前主音量
  volume: { _main: number; main: number; } = {
    _main: 1,
    main: .01,
  };
  // 当前图片的链接
  currentImgSrc:string = '';

  constructor(options: IMusicConfigOptions){
    const {images} = options;
    this.imageGroup = [options.images];


    const pictureCanvasCtx = new Picture(this);
    this.setPictureCanvasCtx(pictureCanvasCtx);

    this.currentImgSrc = images[0];

    if (this.currentImgSrc) {
      this.changePic(undefined, true);
    }
  }
  handelMouseMove(ev: Event){
    if (ev.target !== document.body) return;
    const {mouseMoveConf} = this;
    // @ts-ignore;
    const enent = ev.touches ? ev.touches[0] : ev;
    // @ts-ignore;
    const [x, y, w, h] = [enent.clientX, enent.clientY, enent.target.offsetWidth, enent.target.offsetHeight];
    const conf = {
      x, y, w, h,
      _x: (x - w / 2) / w,
      _y: (y - h / 2) / h
    };
    Object.keys(mouseMoveConf).forEach(key => {
      // @ts-ignore;
      mouseMoveConf[key] = conf[key]
    })
  }
  @MakeThrottle(1)
  shock() {
    // DesktopImage.play(musicConfig.currentImgSrc);
  };
  setLrc(lrc: string){
    this.lrc = lrc;
  }
  getImageData(x: number, y: number, w: number, h: number): ImageData{
    return Picture.getImageData(x, y, w, h);
  };


  changePicGroup(reverse: boolean) {
    const {imageGroup} = this;
    if (imageGroup.length) {
      // @ts-ignore;
      reverse ? imageGroup.unshift(imageGroup.pop()) : imageGroup.push(imageGroup.shift());
    }
    this.changePic();
  }
  // 切换图片 // 传参 isReverse // false 时 下一张 true 时 上一张
  changePic(reverse?: boolean, shockAtOnce?: boolean) {
    const images = this.imageGroup[0];
    if (images.length) {
      // @ts-ignore;
      reverse ? images.unshift(images.pop()) : images.push(images.shift());
      this.currentImgSrc = images[0];
      if (this.pictureCanvasCtx) {
        this.picDom =  this.pictureCanvasCtx.load(this.currentImgSrc);
      }

      shockAtOnce && this.shock();
    }

  }
  // 增加音量
  encVolume() {
    let {main} = this.volume;
    main = main + 0.05;
    if (main < 0) main = 0;
    if (main > 1) main = 1;
    this.volume.main = main;
  }
  // 减小音量
  decVolumn() {
    let {main} = this.volume;
    main = main - 0.05;
    if (main < 0) main = 0;
    if (main > 1) main = 1;
    this.volume.main = main;
  }
  setPictureCanvasCtx (pictureCanvasCtx: Picture){
    this.pictureCanvasCtx = pictureCanvasCtx;
  }
}



