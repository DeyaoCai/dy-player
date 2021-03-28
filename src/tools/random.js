
import {GetType} from "@/tools/GetType";
export class Random {
  exec() {
    const {max_, min_, sign_} = this;
    return Random.exec(max_, min_, sign_);
  }
  sign() {
    this.sign_ = -1;
    return this;
  }
  min(min) {
    GetType.isNumber(min) && (this.min_ = min);
    return this;
  }

  max(max) {
    GetType.isNumber(max) && (this.max_ = max);
    return this;
  }

  int(size, unique) {
    const {max_, min_, sign_,} = this;
    return Random.int(max_, min_, sign_, size, unique)
  }

  static exec(max_, min_, sign_) {
    let val = Math.random();
    GetType.isNumber(max_) && (val = val * max_);
    GetType.isNumber(min_) && (val = val + min_);
    sign_ && (val = val * -1);
    return val;
  }

  static int(max = 1, min = 0, sign){
    return (sign && Random.boolean() ? -1 : 1) * Math.round(Math.random() * max + min)
  }
  static boolean() {
    return Math.round(Math.random());
  }
  static time(){
    return Date.now().toString();
  }
  boolean(){
    return  Random.boolean(size, rate)
  }
}

export function random() {
  return new Random()
}

