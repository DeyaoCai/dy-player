interface IListBoxOption {

  play?: Function;
  playing?: number;
  current?: number;
}

export class ListBox {
  play?: Function;
  playing: number = 0;
  current: number = 0;
  list: (ListBox|Object)[];
  constructor(options: IListBoxOption = {}) {
    // @ts-ignore;
    Object.keys(options).forEach(key => this[key] = options[key]);
    this.play = () => this;
    if (options.play) {
      this.play = () => {
        options.play && options.play(...arguments);
        this.playing = this.current;
      }
    }
    this.list = [];
    this.playing = 0;
    this.current = 0;
  }

  get len() {
    return this.list.length;
  }

  setList(list: (ListBox|Object)[], shallPlay?: boolean) {
    this.list = list;
    this.current = 0;
    if (shallPlay) this.play && this.play();
    return this;
  }

  setIndex(index: number) {
    if (index > this.len - 1) index = this.len - 1;
    if (index < 0) index = 0;
    this.current = index;
    return this;
  }

  prev() {
    this.current = (this.current - 1 + this.len) % this.len;
    return this;
  }

  next() {
    this.current = (this.current + 1) % this.len;
    return this;
  }
}
