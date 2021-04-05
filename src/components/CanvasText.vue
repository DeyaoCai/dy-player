<template>
  <div class="canvas-view">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>
<script>
  import {Random} from "../tools/random";
  import {PS} from "../tools/PS";
  import {Picture} from "../picture/Picture";

  export default {
    name: 'CanvasText',
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager'
    ],
    data() {
      return {
        width: 0,
        height: 0,
        count: 0,
        thisCount: 0,
        imgCtx: null,
        shallMalfunction: false,
        size: 0,
      }
    },
    watch: {
      'musicDataFlags.dataFlag': {
        immediate: true,
        handler() {
          this.$canvas && this.ctx && this.renderCanvas();
        }
      },
      'musicDataFlags.shockFlag': {
        immediate: true,
        handler() {
          this.modifyManager.getTrackByName('CommonOptionsTrack').getVal('CanvasTextMalfunction') && (this.shallMalfunction = true);
          this.size = 0;
        }
      }
    },
    methods: {
      renderCanvas() {
        const {height, width, ctx, imgCtx, musicConfig, viewCtx, musicData} = this;
        const {realTimeData, calculateColors} = musicData;
        const {avrLevel} = realTimeData;

        const w = width;
        const h = 100;
        const x = width / 2;
        const y = height * .66;
        let size =
          this.size =
            this.size ||
            160 + Random.int(10 * avrLevel / 255, 0, true) - (musicConfig.lrc || '').length * 1.5;

        // 清除原先的画布
        ctx.clearRect(0, 0, width, height);
        viewCtx.clearRect(0, 0, width, height);

        if (musicConfig.lrc) {
          ctx.fillStyle = `rgba(0,0,0,.5)`;
          ctx.fillRect(0, height / 7 * 3.9, width, height / 7 * 1.3);
        }

        // 庞门正道标题体
        ctx.font = `${size}px pmzdbtt`;


        const measureText = ctx.measureText(musicConfig.lrc);
        if (measureText.width > (width - 100)) {
          size =
            this.size =
              Math.floor(this.size /measureText.width * (width - 100));
          ctx.font = `${size}px pmzdbtt`;
        }
        // 字体居中
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 1;

        const percent = avrLevel / 255;
        const offset = percent * size / 4 + 4;
        ctx.strokeStyle = `rgba(${calculateColors[1].map(i => 255).join(', ')}, ${percent})`;
        ctx.strokeText(musicConfig.lrc, x + offset, y - offset);


        const pattern = ctx.createPattern(Picture.pciCanvas,"repeat");
        ctx.fillStyle = pattern;
        ctx.fillText(musicConfig.lrc, x + offset, y - offset);

        ctx.strokeStyle = `rgba(${calculateColors[1].map(i => 255).join(', ')}, ${percent * 0.8})`;
        ctx.strokeText(musicConfig.lrc, x + offset / 2, y - offset / 2);


        ctx.fillStyle = `rgba(255,255,255,.3)`;
        ctx.fillText(musicConfig.lrc, x + offset / 2, y - offset / 2);


        ctx.strokeStyle = `rgba(${calculateColors[1].map(i => 255 - i).join(', ')}, 1)`;
        ctx.strokeText(musicConfig.lrc, x, y);


        ctx.fillStyle = `rgba(${calculateColors[1].join(', ')}, 0.3)`;
        ctx.fillText(musicConfig.lrc, x, y);




        const des = (index_ = 0) => {
          const W = ctx.measureText(musicConfig.lrc).width || 1;
          if (!W) return;

          const _w = W;
          const _h = size * index_ / 4;
          const __x = 0;
          const __y = size;

          const _x = (width - _w) / 2;
          const _y = y - __y / 2 + Random.int(size - _h, 0);

          if (_h < 0) return;
          const imageData = ctx.getImageData(_x, _y, _w, _h);

          const ps = new PS(imageData);
          const max = (h - size) / 4;

          if (this.shallMalfunction) {
            const fnMap = [
              () => ps.aisleOffset('r', Random.int(max, max / 2, true), Random.int(max, max / 2, true)),
              () => ps.aisleOffset('g', Random.int(max, max / 3, true), Random.int(max, max / 3, true)),
              () => ps.aisleOffset('b', Random.int(max, max / 4, true), Random.int(max, max / 4, true)),
            ];
            const len = fnMap.length;
            let index = Random.int(2, 0);
            fnMap[index]();
            Random.boolean() && fnMap[++index % len]();
            Random.boolean() && fnMap[++index % len]();
          }

          ctx.putImageData(ps.imageData, _x, _y);

          viewCtx.drawImage(this.$canvasHidded, 0, 0);
        };
        if (musicConfig.picDom) {
          des(1);
          des(2);
          des(3);
        }
        this.shallMalfunction = false;
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

<style lang="less" scoped>
  .canvas-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex: 1 1 0;
    overflow: hidden;
    opacity: 0.8;
    z-index: 2900;
  }

  .canvas-view canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
