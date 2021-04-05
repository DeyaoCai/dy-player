<template>
  <div class="canvas-view">
    <div :style="textStyle">Happy new Year!</div>
  </div>
</template>
<script>
  import {Random, } from "../tools/random";
  import {musicConfig} from "../music/MusicConfig";

  export default {
    name: 'CanvasText',
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager',
      'navList'
    ],
    data() {
      return {
        width: 0,
        height: 0,
        count: 0,
        thisCount: 0,
        imgCtx: null,
        textStyle: ''
      }
    },
    computed: {},
    watch: {
      'musicDataFlags.dataFlag': {
        immediate: true,
        handler() {
          const {realTimeData, calculateColors} = musicData;
          const {avrLevel} = realTimeData;
          const per = avrLevel / 255;
          const rate = Math.round(avrLevel / 255 * 100) + 10;
          const opa = avrLevel / 255 + .75;
          const scale = avrLevel / 255 / 2 + .75;
          this.textStyle = `text-shadow: ${[
            `0 0 ${rate}px #fff`,
            `0 0 ${rate * 2}px #fff`,
            `0 0 ${rate * 3}px #fff`,
            `0 0 ${rate * 4}px #fff`,
            `0 0 ${rate * 5}px #ff5722`,
            `0 0 ${rate * 6}px #ff5722`,
            `0 0 ${rate * 7}px #ff5722`,
            `0 0 ${rate * 8}px #ff5722`,
          ].join(',')}; opacity: ${opa > 1 ? 1 : opa}; transform: translate3d(0,0,0) scale(${scale}, ${scale}) rotate(${Random.exec(per*3, per*-3,)}deg)`;
        }
      }
    },
    methods: {}
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
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 40vh;
    font-size: 120px;
    font-family: "微软雅黑";
    filter: brightness(110%);

  }

  .canvas-view canvas {
    position: relative;
    width: 100%;
    height: 100%;
    will-change: opacity, box-shadow, transform;
  }
</style>
