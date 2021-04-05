<template>
  <div class="progress-bar-wrap">
    <div class="progress-bar">
      <span>{{config.name}}</span>
      <span>{{config.min}}</span>
      <div
        @mousedown="touchEv($event)"
        @mousemove="moveEv($event)"
        @mouseup="endEv()"
        @mouseleave="endEv()"
        ref="drag"
      >
        <span :style="barStyle"></span>
      </div>
      <span>{{config.max}}</span>
      <span @click="config.setMin()">min</span>
      <span @click="config.dec()">dec</span>
      <span>{{config.value}}</span>
      <span @click="config.enc()">enc</span>
      <span @click="config.setMax()">max</span>
      <span @click="config.reset()">reset</span>
    </div>
  </div>
</template>
<script>
  import Drag from "../tools/Drag";

  export default {
    name: 'ProgressBar',
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager',
      'commonOptions_'
    ],
    props: ['config'],
    data() {
      return {
        drag: new Drag({
          doNotStopWhenMatch: true,
          resetPositionWhenTouch: true
        }),
      }
    },
    methods: {
      touchEv(ev){
        this.drag.touchEv(ev);
      },
      moveEv(ev){
        this.drag.moveEv(ev);
      },
      endEv(ev){
        this.drag.endEv(ev);
        this.setPer()
      },
      setPer(){
        if (!this.$el || this.drag.isTouching) return;
        const {config, drag} = this;
        drag.setPercent({x: (this.currentVal - config.min) / (config.max - config.min), y: 0});
      },
    },
    computed: {
      percent(){
        const {drag} = this;
        const {isTouching, position} = drag;
        const per = drag.getPercent();
        return per ? per.x : 0;
      },
      barStyle(){
        const {isTouching} = this.drag;
        return {
          width: `${this.percent * 100}%`,
          transition: `all ${isTouching ? 0 : .3}s`
        }
      },
      currentVal(){
        const {config} = this;
        if (!config) return 0;
        return config.value;
      }
    },
    watch: {
      currentVal: {
        immediate: true,
        handler(){
          this.setPer();
        }
      },
      config: {
        immediate: true,
        handler(){
          this.setPer();
        }
      },
      percent(){
        const {config} = this;
        config.setVal(Math.round(this.percent * (config.max - config.min)) + config.min);
      },
    },
    mounted() {
      const {config, drag} = this;
      config.current = 8;
      drag.setEl(this.$refs.drag);
      this.setPer();
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .progress-bar-wrap{
    padding: 0 10px;
    width: 100%;
    height: 100%;
  }
  .progress-bar {
    position: relative;

    width: 100%;
    height: 100%;

    overflow: hidden;
    z-index: 5000;
    user-select: none;
    display: flex;
    >span{
      padding: 0 4px;
      cursor: pointer;
      min-width: 40px;
      font-size: 16px;
    }
    >div{
      position: relative;
      flex: 1 1 0;
      cursor: pointer;

      &::before{
        position: absolute;
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: rgba(255,255,255,.8);
        top: 50%;
        left: 0;
        transform: translateY(-50%) scale(1, 0.5);
        border-radius: 10px;
      }
      >span{
        position: relative;
        display: block;
        height: 100%;
        &::after{
          display: block;
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: rgba(255,255,255,1);
          right: 0;
          top: 50%;
          transform: translate(50%, -50%);
          border-radius: 4px;
        }

      }
      &::after{
        position: absolute;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

</style>
