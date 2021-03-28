<style lang="less" scoped>
</style>
<template>
  <div class="container">
    <NavBar></NavBar>
    <div class="box-wrap">
      <MusicSearchBox></MusicSearchBox>
      <MusicLocalBox></MusicLocalBox>
      <ModifyBox></ModifyBox>
    </div>
    <div class="canvas-view-wrap">
      <GameUI></GameUI>
      <CanvasPic v-if="commonOptions.CanvasPic"></CanvasPic>
      <CanvasText v-if="commonOptions.CanvasText"></CanvasText>
      <CanvasView
        v-for="(item, index) in modifyManager.list[0].list"
        :config="item"
        v-if="commonOptions.CanvasView && item && item.constructor.name_ === 'CanvasTrack'"
      ></CanvasView>
    </div>
    <VideoView :index="0" v-if="commonOptions.VideoView"></VideoView>
    <VideoView :index="1" v-if="commonOptions.VideoView1"></VideoView>
    <DomClock v-if="commonOptions.DomClock"></DomClock>
  </div>
</template>

<script>
  import {onMounted} from 'vue';
  import {shortCut} from "../tools/ShortCut";
  import {Color, GameList, GameScene, MusicData, MusicDataFlags} from "../music/Music";
  import {MusicConfig} from "../music/MusicConfig";
  import {MusicVisualizer} from "../music/MusicVisualizer";
  import {DomUtil} from "../tools/DomUtil";
  import {ModifyManager} from "../components/canvasConfig";

  import NavBar from '../components/NavBar';
  import MusicSearchBox from '../components/MusicSearchBox';
  import MusicLocalBox from '../components/MusicLocalBox';
  import ModifyBox from '../components/ModifyBox';
  import CanvasView from '../components/CanvasView';
  import CanvasPic from '../components/CanvasPic';
  import CanvasTitle from '../components/CanvasTitle';
  import CanvasText from '../components/CanvasText';
  import VideoView from '../components/VideoView';
  import DomClock from '../components/DomClock';
  import GameUI from '../components/GameUI';


  const globalData = (function () {

    const modifyManager = new ModifyManager();

    const commonOptions_ = modifyManager.list.find(i => i.constructor.name_ === 'TrackList')
      .list.find(i => i.constructor.name_ === 'CommonOptionsTrack').list;

    const gameWrap = DomUtil.node('div');
    DomUtil.class(gameWrap, 'game-wrap');
    DomUtil.append(document.body, gameWrap);

    const gameInner = DomUtil.node('div');
    DomUtil.class(gameInner, 'game-inner');
    DomUtil.append(gameWrap, gameInner);

    const musicDataFlags = new MusicDataFlags;

    const musicData = new MusicData(modifyManager);

    // @ts-ignore;
    const images = ['22824.jpg', '22891.jpg'];
    const musicConfig = new MusicConfig({
      images,
    });


    const mv = new MusicVisualizer({
      //定义的音频数组长度
      size: Math.pow(2, 6),
      // draw: draw,
      musicConfig,
      volume: 0.3
    });

    const gameList = new GameList(mv, gameInner, modifyManager);


    const createGameNode = function (ev) {
      // @ts-ignore;
      gameList.createGameNode(ev.rhythmPoint, modifyManager.gameTrack.trick);
    };

    musicData.originData.event.addEventListener('shock', createGameNode);
    musicData.originData.event.addEventListener('update', () => {
      window.isPhone || new GameScene(musicData.originData, musicData, gameInner, modifyManager);
      const {_x, _y} = musicConfig.mouseMoveConf;
      const maxDeg = 180;
      //@ts-ignore;d
      gameInner.style = `transform: rotateY(${-_x * maxDeg}deg) rotateX(${_y * maxDeg}deg) translateZ(100px);`;
    });

    return {
      navList: [],
      commonOptions_,
      modifyManager,
      musicDataFlags,
      musicData,
      musicConfig,
      gameList,
      mv
    }
  })();


  export default {
    name: "DashBoard",
    components: {
      NavBar,
      MusicSearchBox,
      MusicLocalBox,
      ModifyBox,
      GameUI,
      CanvasView,
      VideoView,
      CanvasPic,
      CanvasText,
      CanvasTitle,
      DomClock,
    },
    provide() {
      const {
        navList,
        commonOptions_,
        modifyManager,
        musicDataFlags,
        musicData,
        musicConfig,
        gameList,
        mv
      } = this;
      return {
        navList,
        commonOptions_,
        modifyManager,
        musicDataFlags,
        musicData,
        musicConfig,
        gameList,
        mv
      }
    },
    computed: {
      commonOptions() {
        const commonOptions = {};
        const list = this.commonOptions_;
        list.forEach(item => {
          commonOptions[item.key] = item.value;
        });
        return commonOptions;
      }
    },
    mounted() {
      const {musicData, musicDataFlags, musicConfig, mv} = this;

      musicData.realTimeData.event.addEventListener('shock', () => {
        musicDataFlags && musicDataFlags.shockFlag++;
        musicConfig && musicConfig.shock();
      });

      shortCut.init(undefined, {
        common: {
          spacebar: () => this.gameList.shootGameNode(),
          enter: () => this.gameList.shootGameNode(),
        }
      }, {common: {spacebar: '消除节奏点', enter: '消除节奏点'}});
      mv.draw = (data) => {this.draw(data)};

      // @ts-ignore;
      window.isPhone ? document.addEventListener("touchmove", function (ev) {
        musicConfig.handelMouseMove(ev)
      }) : document.addEventListener("mousemove", function (ev) {
        musicConfig.handelMouseMove(ev)
      });
    },
    data() {
      return globalData;
    },
    methods: {

      draw({realTimeData, originData}) {
        const {modifyManager, musicDataFlags, musicData, musicConfig, gameList,} = this;
        gameList.setBuffer(modifyManager.gameTrack.RhythmPointRemoveFloatRange * 10);
        musicData.realTimeData.update(realTimeData);
        musicData.originData.update(originData);

        const [r, g, b, a] = musicConfig.currentImgAviColor;
        const [[r1, g1, b1], [r2, g2, b2]] = musicData.calculateColors = Color.getPure(r, g, b);

        const {soundTrackArr} = musicData.realTimeData;

        // @ts-ignore;
        document.querySelector('.sound-track').innerHTML = soundTrackArr.map(
          // @ts-ignore;
          (item) => `<li style="${[
            `transform: translateY(-${item.vol}px);`,
            `opacity: ${item.isRhythmPoint ? 1 : item.vol / 256 / 2 + .25};`,
            `background-color: ${item.isRhythmPoint ? `rgba(${255 - r2},${255 - g2},${255 - b2}, 1)` : '#fff'};`
          ].join('')}"></li>`
        ).join('');

        musicDataFlags.dataFlag++;
      }
    }
  }
</script>
<style lang="less" type="text/less" scoped>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .canvas-view-wrap {
    display: flex;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
  }
</style>
