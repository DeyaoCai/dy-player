class CacheList {
  constructor(){
    // @ts-ignore;
    this.list = [];
    // @ts-ignore;
    this.allItems = [];
  }
  getImage(){
    // @ts-ignore;
    let dom = this.list.shift();
    // @ts-ignore;
    const playEnd = (dom) => {
      dom || (dom = this);
      if (dom.classList.contains('expired')) {
        dom.classList.remove('expired');
        // @ts-ignore;
        this.list.includes(dom) || this.list.push(dom);
      }
    };
    if (!dom) {
      dom = document.createElement('div');
      dom.className = 'desktopImage';
      const body = document.querySelector("body");
      body && body.appendChild(dom);
      // @ts-ignore;
      dom.addEventListener('animationend', function (){playEnd(this)});
    }
    // @ts-ignore;
    this.allItems.forEach(playEnd)
    // @ts-ignore;
    this.allItems.includes(dom) || this.allItems.push(dom);
    return dom;
  }
}

const cacheList = new CacheList();

export class DesktopImage {
  // @ts-ignore;
  static play(url){
    const dom = cacheList.getImage();
    dom.style  = `background-image: url('./img/${url}');`;
    requestAnimationFrame(() => {
      // @ts-ignore;
      cacheList.allItems.forEach(item => {
        item.classList.contains('active') && item.classList.add('expired');
        item.classList.remove('active');
      });
      dom.classList.add('active');
    })
  }
}


