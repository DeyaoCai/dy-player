<template>
  <div class="dom-clock-item-wrap">
    <div class="dom-clock-item">
      <div v-for="(num, index) in list" :class="{track: true}">
        <div></div>
      </div>
    </div>
    <div class="dom-clock-item">
      <div v-for="(num, index) in list" :class="{active: num}">
        <div></div>
      </div>
    </div>
  </div>

</template>
<script>
  import {musicData, musicDataFlags} from "../music/Music";
  const list = [
    [1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1],
  ];
  export default {
    name: 'DomClockItem',
    props: ['num'],
    data(){
      return {
        musicData,
        musicDataFlags
      }
    },
    computed: {
      list() {
        return list[this.num]
      },
      // wrapStyle(){
      //   const {data, avrLevel, total, cacheList, calculateColors} = this.musicData;
      //   this.musicDataFlags.dataFlag;
      //   return {
      //     '--animateTime': `${.3 - avrLevel / 255 * 0.3}s`,
      //     '--radius': `${avrLevel / 255 * 40}px`
      //   }
      // }
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

  .dom-clock-item-wrap {
    --animateTime: 0.7s;
    --radius: 40px;
    --textRadius: 2px;
    --radius_: 0;
    --time: 0.05s;
    --a: 80px;
    --b: calc(var(--a) / 10);
    --a2: calc(var(--a) * 2);
    --ha: calc(var(--a) / 2);
    --hb: calc(var(--b) / 2);
    --h: calc(var(--b) / 2);
    --offsetx: calc((var(--hb) + var(--h)) * -1);
    --offsety: calc(var(--h) * -1);
    --offset2: calc((var(--hb) + var(--h) * 2) * -1);

    margin: calc(var(--b) * 2);
    position: relative;
    height: var(--a2);
    line-height: var(--a2);
    font-size: 40px;
    width: var(--a);
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow:
      0 0 calc(var(--textRadius) * 1) #fff,
      0 0 calc(var(--textRadius) * 2) #fff,
      0 0 calc(var(--textRadius) * 3) #fff,
      0 0 calc(var(--textRadius) * 4) #fff,
      0 0 calc(var(--textRadius) * 5) #ff5722,
      0 0 calc(var(--textRadius) * 6) #ff5722,
      0 0 calc(var(--textRadius) * 7) #ff5722,
      0 0 calc(var(--textRadius) * 8) #ff5722;

    .dom-clock-item {
      position: absolute;
      height: 100%;
      width: 100%;

      > div {
        position: absolute;
        display: block;
        transform: translateZ(0);
        box-shadow:
          0 0 calc(var(--radius_) * 1) #fff,
          0 0 calc(var(--radius_) * 2) #fff,
          0 0 calc(var(--radius_) * 3) #fff,
          0 0 calc(var(--radius_) * 4) #fff,
          0 0 calc(var(--radius_) * 5) #ff5722,
          0 0 calc(var(--radius_) * 6) #ff5722,
          0 0 calc(var(--radius_) * 7) #ff5722,
          0 0 calc(var(--radius_) * 8) #ff5722;

        > div {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 1);
          clip-path: polygon(var(--hb) 0, calc(100% - var(--hb)) 0, 100% var(--hb), 100% calc(100% - var(--hb)), calc(100% - var(--hb)) 100%, var(--hb) 100%, 0 calc(100% - var(--hb)), 0 var(--hb));
        }

        &.track {
          > div {
            background-color: rgba(0, 0, 0, 1);
          }
        }

        &.active {
          box-shadow:
            0 0 calc(var(--radius) * 1) #fff,
            0 0 calc(var(--radius) * 2) #fff,
            0 0 calc(var(--radius) * 3) #fff,
            0 0 calc(var(--radius) * 4) #fff,
            0 0 calc(var(--radius) * 5) #ff5722,
            0 0 calc(var(--radius) * 6) #ff5722,
            0 0 calc(var(--radius) * 7) #ff5722,
            0 0 calc(var(--radius) * 8) #ff5722;
          transform: translateZ(40px);

          > div {
            background-color: rgba(255, 255, 255, 1);
          }
        }

        &:nth-of-type(1) {
          width: var(--a);
          height: var(--b);
          top: var(--offset2);
          left: 0;
          transition: all var(--animateTime) calc(var(--time) * 1) cubic-bezier(.6,.42,.34,1.48);
          > div {
            transition: all var(--animateTime) calc(var(--time) * 1) cubic-bezier(.6,.42,.34,1.48);
          }
        }

        &:nth-of-type(2) {
          width: var(--b);
          height: var(--a);
          top: var(--offsety);
          right: var(--offsetx);
          transition: all var(--animateTime) calc(var(--time) * 2) cubic-bezier(.6,.42,.34,1.48);

          > div {
            transition: all var(--animateTime) calc(var(--time) * 2) cubic-bezier(.6,.42,.34,1.48);
          }
        }

        &:nth-of-type(3) {
          width: var(--b);
          height: var(--a);
          bottom: var(--offsety);
          right: var(--offsetx);
          transition: all var(--animateTime) calc(var(--time) * 3) cubic-bezier(.6,.42,.34,1.48);

          > div {
            transition: all var(--animateTime) calc(var(--time) * 3) cubic-bezier(.6,.42,.34,1.48);
          }
        }

        &:nth-of-type(4) {
          width: var(--a);
          height: var(--b);
          bottom: var(--offset2);
          right: 0;
          transition: all var(--animateTime) calc(var(--time) * 4) cubic-bezier(.6,.42,.34,1.48);

          > div {
            transition: all var(--animateTime) calc(var(--time) * 4) cubic-bezier(.6,.42,.34,1.48);
          }
        }

        &:nth-of-type(5) {
          width: var(--b);
          height: var(--a);
          left: var(--offsetx);
          bottom: var(--offsety);
          transition: all var(--animateTime) calc(var(--time) * 5) cubic-bezier(.6,.42,.34,1.48);

          > div {
            transition: all var(--animateTime) calc(var(--time) * 5) cubic-bezier(.6,.42,.34,1.48);
          }
        }

        &:nth-of-type(6) {
          width: var(--b);
          height: var(--a);
          top: var(--offsety);
          left: var(--offsetx);
          transition: all var(--animateTime) calc(var(--time) * 6) cubic-bezier(.6,.42,.34,1.48);

          > div {
            transition: all var(--animateTime) calc(var(--time) * 6) cubic-bezier(.6,.42,.34,1.48);
          }
        }

        &:nth-of-type(7) {
          width: var(--a);
          height: var(--b);
          top: calc(50% - var(--hb));
          left: 0;
          transition: all var(--animateTime) calc(var(--time) * 7) cubic-bezier(.6,.42,.34,1.48);

          > div {
            transition: all var(--animateTime) calc(var(--time) * 7) cubic-bezier(.6,.42,.34,1.48);
          }
        }
      }
    }
  }

</style>
