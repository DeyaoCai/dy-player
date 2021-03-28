const aisleMap = {
  r: 0, g: 1, b: 2, a: 3
};
type TAisleType = keyof typeof aisleMap;
// @ts-ignore;
import {Random, random} from "@/tools/random";
export class PS {
  aisleMap = aisleMap;
  imageData: ImageData;

  static cutFnMap: {[index: number]: () => number} = {
    1: () => 255,
    2: () => 0,
    3: () => Random.int(255,0)
  };
  constructor(imageData: ImageData) {
    this.imageData = imageData;
  }

  getAisle(aisleType: TAisleType, cutType: number = 0) {
    const offset = this.aisleMap[aisleType];
    if (offset === undefined) return [];
    const {data, width, height} = this.imageData;

    const ret: number[][] = [];
    for (let y = 0; y < height; y++) {
      const line: number[] = [];
      ret.push(line);
      const cur = width * y;
      for (let x = 0; x < width; x++) {
        line.push(data[(cur + x) * 4 + offset]);
        cutType && (data[(cur + x) * 4 + offset] = PS.cutFnMap[cutType] &&  PS.cutFnMap[cutType]() || 255);
      }
    }
    return ret;
  }

  aisleOffset(aisleType: TAisleType, xOffset = 0, yOffset = 0, zoom: number = 1, cutType: number = 0) {
    const offset = this.aisleMap[aisleType];
    if (offset === undefined) return;
    const aisleData = this.getAisle(aisleType, cutType);
    const {data, width, height} = this.imageData;
    for (let y = 0; y < height; y++) {
      const line = aisleData[y + yOffset] || {};
      const cur = width * (y + yOffset) + xOffset;
      for (let x = 0; x < width; x++) {
        data[(cur + x) * 4 + offset] = (line[x] || 0) * zoom;
      }
    }
  }
}
