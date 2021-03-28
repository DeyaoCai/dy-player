import {appendStyle} from "@/units/appendStyle";

appendStyle(``, ``);

let canvas = document.createElement('canvas');

const pciCanvas = document.createElement('canvas');


export class Picture {
  static pciCanvas = pciCanvas;
  static pciCtx = pciCanvas.getContext("2d");
  compressRate: number;
  canvas: Element;
  ctx: any;
  musicConfig: any;
  cacheList: Element[];
  cacheImg: {[index: string]: number[]};
  constructor(musicConfig: any) {
    this.compressRate = 0.1;
    this.musicConfig = musicConfig;
    this.canvas = canvas = canvas || document.createElement("canvas");
    this.ctx = canvas.getContext('2d');
    this.cacheList = [];
    this.cacheImg = {};
  }

  static setImage(img: any) {
    const {offsetWidth, offsetHeight} = document.body;
    Picture.pciCanvas.width = offsetWidth;
    Picture.pciCanvas.height = offsetHeight;
    Picture && Picture.pciCtx && Picture.pciCtx.drawImage(img, (offsetWidth - img.width) / 2, (offsetHeight - img.height) / 2, img.width, img.height);
  }

  static getImageData(x: number, y: number, w: number, h: number):ImageData {
    // @ts-ignore;
    return Picture.pciCtx && Picture.pciCtx.getImageData(x, y, w, h);
  }

  makeEl() {
    const img = document.createElement("img");
    const {cacheList, cacheImg, ctx, compressRate} = this;
    img.onload = () => {
      Picture.setImage(img);
      if (!cacheImg[img.src]) {
        const {width, height} = img;
        canvas.width = width * compressRate;
        canvas.height = height * compressRate;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result:number[][] = [[], [], [], []];
        imageData.data.forEach((color: number, index: number) => {
          result[index % 4].push(color);
        });
        cacheImg[img.src] = [
          aviOfArr(result[0]), aviOfArr(result[1]), aviOfArr(result[2]), aviOfArr(result[3])
        ];
      }
      // @ts-ignore;
      img.noNeedChangeCurrentImgAviColor || (this.musicConfig.currentImgAviColor = cacheImg[img.src]);
      cacheList.push(img);
    };
    return img;
  }

  load(url: string, noNeedChangeCurrentImgAviColor?: boolean) {
    if (!url) return;
    const img = this.cacheList.shift() || this.makeEl();
    // @ts-ignore;
    img.noNeedChangeCurrentImgAviColor = noNeedChangeCurrentImgAviColor;
    // @ts-ignore;
    img.src = /:\/\//.test(url) ? url : `./img/${url}`;
    return img;
  }
}


function sumOfArr(arr: number[]) {
  return arr.reduce((sum, num) => sum += num, 0);
}

function aviOfArr(arr: number[]) {
  return Math.round(sumOfArr(arr) / arr.length);
}

