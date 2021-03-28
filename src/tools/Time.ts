export class Time {
  static format(stamp?: Date, format = `yea-mon-dat`){
    const time  = stamp || new Date();
    return  format.replace(/yea/g, time.getFullYear().toString())
      .replace(/mon/g, Time.to00(time.getMonth() + 1))
      .replace(/dat/g, Time.to00(time.getDate()))
      .replace(/hou/g, Time.to00(time.getHours()))
      .replace(/min/g, Time.to00(time.getMinutes()))
      .replace(/sec/g, Time.to00(time.getSeconds()))
      .replace(/mis/g, Time.to000(time.getMilliseconds()))
  }
  static to00(num: number){ return num>9 ? `${num}` : `0${num}`}
  static to000(num: number){ return num>99 ? `${num}` : `0${Time.to00(num)}`}
}
