<template>
  <div class="canvas-view">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>
<script>


  export default {
    name: 'CanvasView',
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv'
    ],
    data() {
      return {
        width: 0, height: 0,
      }
    },
    computed: {
    },
    props: ['config'],
    watch: {
      'musicDataFlags.dataFlag': {
        immediate: true,
        deep: true,
        handler() {
          // 重新渲染的时候， 可能没初始化? // 其实是之前的被销毁了
          // this.$canvas && this.ctx && this.renderCanvas()
        }
      }
    },
    methods: {
      renderCanvas() {
        const canvasConfig = this.config;
        this.$canvasHidded.width = this.width = this.$el.offsetWidth;
        this.$canvasHidded.height = this.height = this.$el.offsetHeight;
        mv.size = canvasConfig.dataSize * 8;

        const {height, width, ctx, viewCtx} = this;

        const {originData, realTimeData, calculateColors} = musicData;

        const {avrLevel, data} = realTimeData;
        const dataBefore = originData.data;

        // 拷贝并反向数据
        const data1 = [...(canvasConfig.copyData ? data : [])];
        data1.reverse();

        let dataBefore_= [];
        if (canvasConfig.showDataBefore) {
          const data2 = [...(canvasConfig.copyData ? dataBefore : [])];
          data2.reverse();
          dataBefore_ = [...dataBefore, ...data2];
          dataBefore_.reverse();
        }

        const renderData = [...data, ...data1, ...dataBefore_].filter(i=> canvasConfig.noZero ? i : true);
        const {currentImgAviColor,  mouseMoveConf} = musicConfig;

        const baseSize = [Math.min(height, width), Math.max(height, width)][canvasConfig.baseSizeType];

        const midPosition = {
          x: width * canvasConfig.midPositionX / 100,
          y: height * canvasConfig.midPositionY / 100,
        };

        const mainRadius = baseSize * canvasConfig.mainRadius / 100 * (
          100 - canvasConfig.avrLevelMainRadiusModify +
          canvasConfig.avrLevelMainRadiusModify * avrLevel / 256
        ) / 100;

        const floatRange = baseSize * canvasConfig.floatRange / 100 * (
          100 - canvasConfig.avrLevelFloatRangeModify +
          canvasConfig.avrLevelFloatRangeModify * avrLevel / 256
        ) / 100;

        // 绘制背景色 // 半透明 是想保留一部分之前的绘制；
        ctx.fillStyle = `rgba(0, 0, 0, ${canvasConfig.disable ? 1 : (1 - canvasConfig.clearPrevView / 100)})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.clearRect(0, 0, width, height);
        viewCtx.clearRect(0, 0, width, height);

        if (canvasConfig.disable) {
          viewCtx.drawImage(this.$canvasHidded, 0, 0);
          return;
        }


        // 中心区域园
        ctx.fillStyle = ctx.strokeStyle = `rgba(${calculateColors[0].join(', ')}, ${canvasConfig.mainRadiusOpacity / 100})`;
        ctx.lineWidth = baseSize * canvasConfig.mainRadiusLineWidth / 1000;
        ctx.beginPath();
        if (canvasConfig.direction === 0) {
          ctx.arc(midPosition.x, midPosition.y, mainRadius, 0, 2 * Math.PI);
        } else {

        }
        ctx.closePath();
        ctx.stroke();


        const len = renderData.length || 1; // 防 除以0 报错；
        const perDeg = Math.PI * 2 / (len || 1) * canvasConfig.stepModify / 10;

        const halfPerDeg = perDeg / 2;
        const rotate = Math.PI * 0;

        ctx.lineWidth = baseSize * canvasConfig.lineLineWidth / 1000;
        const rate = canvasConfig.dataModify / 10;
        const offset = 1 + canvasConfig.dataOffsetModify / 100;
        ctx.closePath();
        const length  = renderData.length;
        const minHeight =  canvasConfig.minHeightModify / 100;
        renderData.forEach((val, index) => {

          val = val / 256 + minHeight;
          const  nextVal = renderData[(index + 1) % length] / 256 + minHeight;
          const deg = perDeg * index + rotate;

          function lin1() {
            const _x = (index - len/2) * canvasConfig.stepModify;
            // x, y;
            const point1 = [
              [
                Math.sin(deg) * (val * rate  + offset * mainRadius) + midPosition.x,
                Math.cos(deg) * (val * rate  + offset * mainRadius)+ midPosition.y
              ], [
                midPosition.x + _x,
                -(val * rate  + offset * mainRadius)+ midPosition.y,
              ]
            ][canvasConfig.direction];
            const point2 = [
              [
                Math.sin(deg) * (val * rate * floatRange * 3 + offset*mainRadius) + midPosition.x,
                Math.cos(deg) * (val * rate * floatRange * 3 + offset*mainRadius)+ midPosition.y
              ],[
                midPosition.x + _x,
                -(val * rate * floatRange * 3 + offset*mainRadius)+ midPosition.y,
              ]
            ][canvasConfig.direction];
            const lr = ctx.createLinearGradient(
              point1[0],
              point1[1],
              point2[0],
              point2[1],
            );
            lr.addColorStop(1, `rgba(${calculateColors[0].join(', ')}, 1)`);
            lr.addColorStop(.75, `rgba(${calculateColors[1].join(', ')}, 1)`);
            lr.addColorStop(0, `rgba(${calculateColors[1].join(', ')}, 1)`);
            ctx.strokeStyle = lr;
            ctx.beginPath();
            ctx.moveTo(point1[0], point1[1]);
            ctx.lineTo(point2[0], point2[1]);
            ctx.closePath();
            ctx.stroke();
          }

          const edge = val * rate * floatRange * 3+ mainRadius;
          function line(){
            ctx.strokeStyle = `rgba(${calculateColors[1].join(', ')}, ${avrLevel * 2/255 + 0.25})`;
            const nextEdge = nextVal * rate * floatRange * 3 + mainRadius;
            ctx.beginPath();
            ctx.moveTo(
              Math.sin(deg) *edge + midPosition.x,
              Math.cos(deg) * edge+ midPosition.y
            );
            ctx.bezierCurveTo(
              Math.sin(deg+perDeg/3) * edge + midPosition.x,
              Math.cos(deg+perDeg/3) * edge+ midPosition.y,
              Math.sin(deg+perDeg/3*2) * nextEdge + midPosition.x,
              Math.cos(deg+perDeg/3*2) * nextEdge+ midPosition.y,
              Math.sin(deg+perDeg) * nextEdge + midPosition.x,
              Math.cos(deg+perDeg) * nextEdge+ midPosition.y,
            );

            ctx.closePath();
            ctx.stroke();
          }
          // lin1();
          // line();
          // dot();

          ;[
            lin1,
            line,
            rect,
            dot
          ][canvasConfig.renderType]()

          function dot() {
            ctx.fillStyle = `rgba(${calculateColors[1].join(', ')}, 1)`;
            ctx.beginPath();

            const _x = (index - len/2) * canvasConfig.stepModify + midPosition.x;
            const position =[
              [
                Math.sin(deg) * edge + midPosition.x,
                Math.cos(deg) * edge+ midPosition.y,
              ],[
                _x,
                -(val * rate * floatRange * 3 + offset*mainRadius)+ midPosition.y
              ]
            ][canvasConfig.direction] || [];
            const x = position[0];
            const y = position[1];
            ctx.arc(
              x, y,
              baseSize * canvasConfig.lineLineWidth / 1000,
              0, 2 * Math.PI
            );
            ctx.closePath();
            ctx.fill();
          }
          function rect() {
            ctx.strokeStyle = `rgba(${calculateColors[1].join(', ')}, 1)`;
            ctx.beginPath();
            let renderVal = (val * rate  - canvasConfig.threshold / 10) * floatRange;
            renderVal < 0 &&(renderVal = 0);
            const dots = [
              [ // 左
                Math.sin(deg-halfPerDeg) * (mainRadius) + midPosition.x,
                Math.cos(deg-halfPerDeg) * (mainRadius)+ midPosition.y
              ],
              [ // 右
                Math.sin(deg+halfPerDeg) * (mainRadius) + midPosition.x,
                Math.cos(deg+halfPerDeg) * (mainRadius)+ midPosition.y
              ],
              [ // 上
                Math.sin(deg) * (-renderVal+ mainRadius) + midPosition.x,
                Math.cos(deg) * (-renderVal+ mainRadius)+ midPosition.y
              ],
              [ // 下
                Math.sin(deg) * (renderVal+ mainRadius) + midPosition.x,
                Math.cos(deg) * (renderVal+ mainRadius)+ midPosition.y
              ],
            ];
            ;[0,2,1,3,0,2].forEach(item => {
              ctx.lineTo.apply(ctx, dots[item]);
            })
            ctx.closePath();
            ctx.stroke();
          }
        });
        ctx.closePath();
        viewCtx.drawImage(this.$canvasHidded, 0, 0);
      }
    },
    mounted() {
      this.$canvas = this.$refs.canvas;
      this.viewCtx = this.$canvas.getContext("2d");
      this.$canvasHidded = window.OffscreenCanvas ?
        new OffscreenCanvas(this.$canvas.width, this.$canvas.height) :
        document.createElement('canvas');

      this.ctx = this.$canvasHidded.getContext("2d");
    }
  }
</script>

<style lang="less" scoped>
  .canvas-view {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
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
