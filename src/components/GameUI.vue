<template>
  <div class="game-ui" :class="{active: gameList.ended}">
    <div class="progress">
      <span :style="progressStyle"></span>
    </div>
    <ul>
      <li v-for="(formConfig, index) in formConfigs">
        <div>{{formConfig.label}}</div>
        <div>{{gameList[formConfig.key]}}</div>
      </li>

      <!--<li>-->
        <!--<div>平均每击扣分</div>-->
        <!--<div v-if="gameList.total">{{gameList.totalScore / (gameList.total - gameList.missCount)}}</div>-->
        <!--<div v-if="!gameList.total">&#45;&#45;</div>-->
      <!--</li>-->
      <li>
        <div>realTimeData</div>
        <div>{{musicData.realTimeData.shockNum}}</div>
      </li>
      <li>
        <div>originData</div>
        <div>{{musicData.originData.shockNum}}</div>
      </li>
    </ul>
  </div>
</template>
<script>


  export default {
    name: 'GameUI',
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv'
    ],
    data() {
      return {
        formConfigs: [
          {
            key: 'total',
            label: '节点数',
          },
          {
            key: 'totalScore',
            label: '扣除分数',
          },
          {
            key: 'maxCombo',
            label: '最大连击数',
          },
          {
            key: 'missCount',
            label: 'miss',
          },
          {
            key: 'uselessCount',
            label: '无效按键',
          },

        ]
      }
    },
    computed: {
      progressStyle() {
        const {currentTime, durationTime} = this.gameList;
        return {
          transform: `scale(${durationTime ? currentTime / durationTime : 0}, 1)`
        }
      }
    },
    watch: {},
    methods: {},
    mounted() {
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .game-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex: 1 1 0;
    overflow: hidden;
    z-index: 2999;

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 6px;
      width: 100%;
      text-align: left;

      span {
        display: block;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, hsla(0, 50%, 50%, 1), hsla(-30, 50%, 50%, 1), hsla(0, 50%, 50%, 1));
      }
    }

    ul {
      overflow: hidden;
      border-radius: 10%;
      opacity: 0.4;
      position: absolute;
      width: 90%;
      top: 50%;
      left: 50%;
      padding: 5vh 0 10vh 0;
      transform: translate(-50%, -50%);
      transition: all 0.6s ease-in-out;
      border: 2px solid hsla(15, 50%, 50%, 0);
      white-space: nowrap;

      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(hsla(0, 50%, 50%, 0.6), hsla(10, 50%, 50%, 0.2) 10%, hsla(20, 50%, 50%, 0.2) 90%, hsla(30, 50%, 50%, 0.6));
        opacity: 0;
        transition: all 0.6s ease-in-out;
      }

      li {
        position: relative;
        padding: 1vh 0;
        display: flex;
        align-items: center;

        div {
          padding: 0 1vw;

          &:first-of-type {
            flex: 1 1 0;
            text-align: right;
          }

          &:last-of-type {
            font-size: 32px;
            color: #fff;
            font-weight: bold;
            flex: 5 5 0;
            text-align: left;
            transition: all 0.6s ease-in-out;
          }
        }
      }
    }

    &.active {
      ul {
        padding: 5vh 5vw 10vh 5vw;
        opacity: 1;
        width: 60%;
        border: 2px solid hsla(15, 50%, 50%, 1);

        &::before {
          opacity: 1;
        }

        li {
          div {
            &:last-of-type {
              flex: 1 1 0;
            }
          }
        }
      }
    }
  }
</style>
