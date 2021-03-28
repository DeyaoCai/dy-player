<template>
  <div class="canvas-view">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>
<script>
  import {Random, random} from "../tools/random";
  import {PS} from "../tools/PS";


  export default {
    name: 'CanvasPic',
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager',
      'commonOptions_'
    ],
    data() {
      return {
        width: 0,
        height: 0,
        count: 0,
        thisCount: 0,
        imgCtx: null,
        shallMalfunction: 0,
      }
    },
    watch: {
      'musicDataFlags.shockFlag': {
        immediate: true,
        handler() {
          // 重新渲染的时候， 可能没初始化? // 其实是之前的被销毁了
          this.commonOptions_.CanvasPicMalfunction && (this.shallMalfunction = 2);
        }
      },

      'musicDataFlags.dataFlag': {
        immediate: true,
        handler() {
          // 重新渲染的时候， 可能没初始化? // 其实是之前的被销毁了
          this.$canvas && this.ctx && this.renderCanvas();
        }
      }
    },
    methods: {
      renderCanvas() {

        const {height, width, ctx, imgCtx, musicConfig, musicData} = this;
        const {realTimeData} = musicData;
        const {avrLevel} = realTimeData;
        ctx.putImageData(musicConfig.getImageData(0, 0, width, height), 0, 0);

        if (this.shallMalfunction) {
          const list = [0, 1, 2, 3, 4, 5];

          function blur(id, x, y) {
            return `<filter id="${id}"><feGaussianBlur in="SourceGraphic" stdDeviation="${x},${y}"></feGaussianBlur></filter>`;
          }
          document.querySelector('#svg-all').innerHTML = `<defs>${
            list.map(item => blur(`blur${item * 2}`, 0, item ? avrLevel / 255 / item * 20 : 0)).join('')
          }${
            list.map(item => blur(`blur${item * 2}-v`, item ? avrLevel / 255 / item * 20 : 0, 0)).join('')
          }${
            list.map(item => blur(`blur${item * 2}--45`, item ? avrLevel / 255 / item * 20 : 0, 0)).join('')
          }</defs>`;
        }
        const des = (index_ = 0) => {

          const w = index_ ? Random.int(width, width / (index_ + index_ * .2)) : width;
          const h = index_ ? Random.int(height, height / (index_ * 5)) : height / 10;
          const x = (width - w) / 2;
          const y = (height - h) / 2 + Random.int(h / 2, 0, true);

          const imageData = musicConfig.getImageData(x, y, w, h);
          if (!imageData) return;

          const ps = new PS(imageData);
          const dirR = Random.boolean();
          const max = avrLevel / 4;

          if (this.shallMalfunction) {
            const fnMap = [
              (off) => ps.aisleOffset('r', dirR ? off : 0, dirR ? 0 : off, undefined, Random.int(3, 0)),
              (off) => ps.aisleOffset('g', dirR ? off : 0, dirR ? 0 : off, undefined, Random.int(3, 0)),
              (off) => ps.aisleOffset('b', dirR ? off : 0, dirR ? 0 : off, undefined, Random.int(3, 0)),
            ];

            const index = Random.int(2, 0);
            fnMap[index](Random.int(max, max / 2, true));
            Random.boolean() && fnMap[(index + 1) % fnMap.length](Random.int(max, max / 3, true));
            Random.boolean() && fnMap[(index + 2) % fnMap.length](Random.int(max, max / 4, true));
            ctx.putImageData(ps.imageData, x + Random.int(20 * index_, 0, true), y + Random.int(10 * index_, 0, true));
          }
          ctx.putImageData(imageData, x, y);


        }
        if (musicConfig.picDom && this.shallMalfunction === 2) {
          des(0);
          // des(1);
          // des(2);
        }

        this.viewCtx.drawImage(this.$canvasHidded, 0, 0);
        this.shallMalfunction && (this.shallMalfunction --);
      }
    },
    mounted() {
      this.$canvas = this.$refs.canvas;
      this.viewCtx = this.$canvas.getContext("2d");
      this.$canvasHidded = window.OffscreenCanvas ?
        new OffscreenCanvas(this.$canvas.width, this.$canvas.height) :
        document.createElement('canvas');

      this.$canvasImage = window.OffscreenCanvas ?
        new OffscreenCanvas(this.$canvas.width, this.$canvas.height) :
        document.createElement('canvas');

      this.$canvasImage.width = this.$canvasHidded.width = this.width = this.$el.offsetWidth;
      this.$canvasImage.height = this.$canvasHidded.height = this.height = this.$el.offsetHeight;

      this.ctx = this.$canvasHidded.getContext("2d");
      this.imgCtx = this.$canvasImage.getContext("2d");
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .canvas-view {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.4;
    width: 100%;
    height: 100%;
    flex: 1 1 0;
    overflow: hidden;
    z-index: 2900;
  }

  .canvas-view canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
