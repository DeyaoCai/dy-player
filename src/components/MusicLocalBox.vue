<template>
  <ListBoxView :config="config"></ListBoxView>
</template>
<script>
  import {shortCut, ShortCut} from "../tools/ShortCut";
  import {ListBox} from "../units/ListBox";
  import ListBoxView from "./ListBoxView";

  export default {
    name: 'MusicLocalBox',
    provide() {
      return {}
    },
    components: {
      ListBoxView
    },
    mixins: [],
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
      const tabs = new ListBox();
      const songList = new ListBox({
        play: () => {
          this.play()
        },
      });
      tabs.setList([songList]);
      songList.setList([{name: 'testSong', url: './sound/testSound.mp3'}]);

      return {
        config: {
          type: 'listBox',
          name: '测试歌曲',
          tabs,
          searchText: '',
          focusKey: 'w',
        },
        tabs,
        songList,
      }
    },
    computed: {},
    watch: {
    },
    methods: {
      play(message) {
        const {gameList, mv} = this;
        const play = () => {
          gameList.startSong();
          mv.stopType = message;
          mv.play(this.songList.list[this.songList.current].url);
          // 清除输入
          this.searchText = "";
        };
        if (mv.$audio.paused){
          play()
        } else {
          mv.$audio.pause();
          setTimeout(() => {
            play()
          }, mv.delay.delayTime.value * 1000 + gameList.buffer)
        }

      },
    },
    mounted() {
      const {musicConfig, gameList, mv} = this;
      // musicConfig.ended = () => {
      //   setTimeout(() => {
      //     gameList.endSong();
      //     setTimeout(() => {
      //       this.songList.next();
      //       this.songList.play();
      //     }, 5000);
      //   }, mv.delay.delayTime.value * 1000 + gameList.buffer + 1000)
      // };

      shortCut.init(undefined, {
        alt: {
          left: () => {
            const nextTime = mv.$audio.currentTime - 5;
            mv.$audio.currentTime = nextTime>=0 ? nextTime : 0;
          },
          right: () => {
            const nextTime = mv.$audio.currentTime + 5;
            mv.$audio.currentTime = nextTime <= mv.$audio.duration ? nextTime : mv.$audio.duration;
          },
          p: () => mv.$audio.paused ? mv.$audio.play() : mv.$audio.pause(),
        },
        ctrl: {
        }
      }, {
        alt: {
          left: `退后5s`,
          right: `前进5s`,
          p: `暂停/播放`,
        },
        ctrl: {
        }
      });

    }
  }
</script>

<style lang="less" type="text/less">
</style>
