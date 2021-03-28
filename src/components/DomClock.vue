<template>
  <div class="dom-clock">
    <div v-for="(list, index) in time" :style="d3wrapStyle">
      <div v-for="(list_, index_) in list">
        <template v-if="index_"><span>{{index ? ':' : '-'}}</span></template>
        <template v-for="(num) in list_">
          <DomClockItem :num="num"/>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  import {Time} from "../tools/Time";
  import DomClockItem from './DomClockItem.vue'

  export default {
    name: 'DomClock',
    components: {DomClockItem},
    data() {
      return {
        time: '',
      }
    },

    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager'
    ],
    computed: {
      d3wrapStyle(){
        const {musicConfig} = this;
        const {_x, _y} = musicConfig.mouseMoveConf;
        const maxDeg = 150;
        return {
          transform: `translateZ(-400px) rotateX(${-_y*maxDeg - 20}deg) rotateY(${_x*maxDeg}deg)`,
        }
      },
      dataFlag(){
        return this.musicDataFlags.dataFlag
      }
    },
    watch: {
      'musicDataFlags.shockFlag': {
        immediate: true,
        handler() {
          // 重新渲染的时候， 可能没初始化? // 其实是之前的被销毁了
          // modifyManager.commonOptions.CanvasPicMalfunction && (this.shallMalfunction = 2);
        }
      },
      'dataFlag': {
        immediate: true,
        handler() {
          const stamp = new Date();
          this.time = [
            Time.format(stamp, `yea mon dat`).split(' ').map(i => i.split('')),
            Time.format(stamp, `hou min sec`).split(' ').map(i => i.split(''))
          ];
        }
      }
    },
    methods: {
      renderCanvas() {
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .dom-clock {
    position: absolute;
    top: 20vh;
    left: 50%;
    transform: translate(-50%, -50%);
    flex: 1 1 0;
    z-index: 2900;
    perspective:1000px;

    >div{
      display: flex;
      justify-content: center;
      margin: 20px 0;
      transform-style:preserve-3d;
      >div{
        display: flex;
        align-items: flex-end;
        >span{
          opacity: 1;
          margin: 20px;
          font-size: 80px;
          transform: translateZ(20px);
        }
      }
    }
  }

</style>
