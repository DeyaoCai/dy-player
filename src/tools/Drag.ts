interface IPosition {
  x: number;
  y: number;
}
interface IOption {
  direction?: '' | 'x' | 'y' | 'xy';
  doNotStopWhenMatch?: boolean;
  position?: IPosition;
  resetPositionWhenTouch?: boolean;
}
class Drag {
  rect?: {w: number, h: number};
  position: IPosition;
  $el?: EventTarget | null;
  direction: '' | 'x' | 'y' | 'xy';
  _direction: '' | 'x' | 'y' | 'xy';
  oriPoint: IPosition;
  ori: IPosition;
  pre: IPosition;
  now: IPosition;
  doNotStopWhenMatch?: boolean;
  isTouching: boolean;
  touched: boolean;
  cachePosition: IPosition[];
  moved: boolean = false;
  DOMRect?: DOMRect;
  resetPositionWhenTouch: boolean;
  constructor(option: IOption = {}) {
    this.direction = option.direction || 'xy';
    this.oriPoint = {y: 0, x: 0};
    this.ori = {y: 0, x: 0};
    this.pre = {y: 0, x: 0};
    this.now = {y: 0, x: 0};
    this.doNotStopWhenMatch = option.doNotStopWhenMatch;
    this.resetPositionWhenTouch = option.resetPositionWhenTouch || false;

    this.position = option.position || {x: 0, y: 0};
    this.isTouching = false;
    this._direction = '';
    this.touched = false;
    // 存储用于计算平均速度
    this.cachePosition =[];
  }
  setEl($el: EventTarget | null){
    this.$el = $el;
    // @ts-ignore;
    const DOMRect = this.DOMRect = $el.getBoundingClientRect();
    this.rect = {h: DOMRect.bottom - DOMRect.top, w: DOMRect.right - DOMRect.left}
  }

  touchEv(ev: Event) {
    this.setEl(ev.target);
    if (this.resetPositionWhenTouch) {
      const {position, DOMRect} = this;
      if (DOMRect) {
        // @ts-ignore;
        position.x = ev.screenX - DOMRect.left;
        // @ts-ignore;
        position.y = ev.screenY - DOMRect.top;
      }

    }
      // 假设不触发开始事件， 则move事件也不应该触发
    this.touched = true;
    // @ts-ignore;
    let {clientY, clientX} = ev.touches ? ev.touches[0] : ev;
    this.oriPoint = {y: clientY, x: clientX};
    if (!this.direction.includes('x')) {clientX = 0;}
    if (!this.direction.includes('y')) {clientY = 0;}
    this.ori = {y: clientY, x: clientX};
    this.pre = {y: clientY, x: clientX};
    this.now = {y: clientY, x: clientX};
    this.isTouching = true;
    this.moved = false;
    this.cachePosition = [];
    this._direction = '';
  }

  moveEv(ev: Event) {
    if (!this.touched) return;
    // @ts-ignore;
    const {clientY, clientX} = ev.touches ? ev.touches[0] : ev;
    const now = {y: 0, x: 0};
    this._direction || (this._direction = Math.abs(clientX - this.oriPoint.x) < Math.abs(clientY - this.oriPoint.y) ? 'y' : 'x');
    if (this.direction.includes('x')) {now.x = clientX;}
    if (this.direction.includes('y')) {now.y = clientY;}

    this.cachePosition.push(now);

    if (this.direction.includes(this._direction)) {
      this.pre = this.now;
      this.now = now;
      if (!this.doNotStopWhenMatch) {
        ev.cancelBubble = true;
        ev.stopPropagation();
        ev.preventDefault();
      }
    }
  }

  endEv() {
    this.touched = false;
    this.isTouching = false;
    const offset = this.getOffset();
    const oriPosition = this.position;
    const rect = this.rect;
    const position = {
      x: oriPosition.x + offset.x,
      y: oriPosition.y + offset.y,
    };
    if (rect) {
      position.x < 0 && (position.x = 0);
      position.y < 0 && (position.y = 0);
      position.x > rect.w && (position.x = rect.w);
      position.y > rect.h && (position.y = rect.h);
    }
    this.position = position;
  }

  getPercent(){
    const {rect, position,isTouching} = this;
    const offset = this.getOffset();
    if (rect) {
      return {
        x: (position.x + (isTouching ? offset.x : 0)) / rect.w,
        y: (position.y + (isTouching ? offset.y : 0)) / rect.h,
      }
    }
  }
  setPercent(per: IPosition){
    const {rect, position} = this;
    const {x, y} = per;
    if (rect) {
      position.x = x * rect.w;
      position.y = y * rect.h;
    }
  }
  getOffset() {
    return {
      y: this.now.y - this.ori.y,
      x: this.now.x - this.ori.x,
    }
  }

  getSpeed() {
    return {
      y: this.now.y - this.pre.y,
      x: this.now.x - this.pre.x,
    }
  }
}

export default Drag;
