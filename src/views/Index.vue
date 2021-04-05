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
      <GameUI v-if="commonOptions.gameUI"></GameUI>
      <CanvasPic v-if="commonOptions.CanvasPic"></CanvasPic>
      <CanvasText v-if="commonOptions.CanvasText"></CanvasText>
      <template v-for="(item, index) in modifyManager.list[0].list">
        <CanvasView
          :config="item"
          v-if="commonOptions.CanvasView && item && item.constructor.name_ === 'CanvasTrack'"
        ></CanvasView>
      </template>

    </div>
    <VideoView :index="0" v-if="commonOptions.VideoView"></VideoView>
    <VideoView :index="1" v-if="commonOptions.VideoView1"></VideoView>
    <DomClock v-if="commonOptions.DomClock"></DomClock>
  </div>
</template>

<script>
  import {onMounted} from 'vue';
  import {ShortCut, shortCut} from "../tools/ShortCut";
  import {Color, GameList, GameScene, MusicData, MusicDataFlags, UniqueList} from "../music/Music";
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

    const commonOptions_ = modifyManager.getTrackByName('CommonOptionsTrack');

    const balanceOptions = modifyManager.getTrackByName('BalanceTrack');
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


    const gameTrack = modifyManager.getTrackByName('GameTrack');
    const createGameNode = function (ev) {
      const gameUI = commonOptions_.getVal('gameUI');
      // @ts-ignore;
      gameUI && gameList.createGameNode(ev.rhythmPoint, gameTrack.getVal('trick'));
    };

    musicData.originData.event.addEventListener('shock', createGameNode);
    musicData.originData.event.addEventListener('update', () => {
      const gameScene = commonOptions_.getVal('gameScene');

      if (!gameScene) return;
      window.isPhone || new GameScene(musicData.originData, musicData, gameInner, modifyManager);
      const {_x, _y} = musicConfig.mouseMoveConf;
      const maxDeg = 180;
      //@ts-ignore;d
      gameInner.style = `transform: rotateY(${-_x * maxDeg}deg) rotateX(${_y * maxDeg}deg) translateZ(100px);`;
    });


    const navList = new UniqueList();
    navList.enter({
      name: '导出预设',
      id: 'export_presets',
      callback: () => {
        modifyManager.exportPresets()
      }
    });

    navList.enter({
      type: 'fileReader',
      name: '读取预设',
      id: 'import_presets',
      callback: (ev) => {
        const files = ev.target.files;
        console.log(files);
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const res = JSON.parse(reader.result);
            modifyManager.importPresets(res)
          } catch (e) {
            ShortCut.toast(['解析配置失败'])
          }

        };
        files[0] && reader.readAsText(files[0]);
      }
    });

    return {
      balanceOptions,
      navList,
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
        const list = this.commonOptions_.list;
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
      document.addEventListener(window.isPhone ? "touchmove" : "mousemove", function (ev) {
        musicConfig.handelMouseMove(ev)
      });
    },
    data() {
      return globalData;
    },
    watch: {
      balanceOptions: {
        immediate: true,
        deep: true,
        handler(){
          const {balanceOptions, mv} = this;
          mv.biquadFilters && mv.biquadFilters.forEach((i, index) => {
            i.gain.value = balanceOptions.getVal(`balance${index}`);
            i.gain.Q = 1;
          });
        }
      }
    },
    methods: {

      draw({realTimeData, originData}) {
        const {modifyManager, musicDataFlags, musicData, musicConfig, gameList,} = this;
        gameList.setBuffer(modifyManager.getTrackByName('GameTrack').getVal('RhythmPointRemoveFloatRange') * 10);
        musicData.realTimeData.update(realTimeData);
        musicData.originData.update(originData);

        const [r, g, b, a] = musicConfig.currentImgAviColor;
        const [[r1, g1, b1], [r2, g2, b2]] = musicData.calculateColors = Color.getPure(r, g, b);

        const {soundTrackArr} = musicData.realTimeData;


        // @ts-ignore;
        this.commonOptions.gameUI && (document.querySelector('.sound-track').innerHTML = soundTrackArr.map(
          // @ts-ignore;
          (item) => `<li style="${[
            `transform: translateY(-${item.vol}px);`,
            `opacity: ${item.isRhythmPoint ? 1 : item.vol / 256 / 2 + .25};`,
            `background-color: ${item.isRhythmPoint ? `rgba(${255 - r2},${255 - g2},${255 - b2}, 1)` : '#fff'};`
          ].join('')}"></li>`
        ).join(''));

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
