<template>
  <ListBoxView :config="config"></ListBoxView>
</template>
<script>

  import {ajax} from "../../proxy/http";
  import {shortCut, ShortCut} from "../tools/ShortCut";
  import {ListBox} from "../units/ListBox";
  import ListBoxView from "./ListBoxView";

  export default {
    name: 'MusicSearchBox',
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
      'modifyManager'
    ],
    data() {
      const tabs = new ListBox();
      const lrcs = new ListBox();
      const sheet = new ListBox({
        play: (message) => this.play(message),
      });
      const sheetList = new ListBox({
        play: () => {
          ajax.playlistDetail({id: this.sheetList.list[this.sheetList.current].id})(res => {
            this.sheet.setList(res.playlist.tracks, true);
          });
        },
      });
      tabs.setList([sheetList, sheet, lrcs]);

      return {
        config: {
          type: 'listBox',
          name: '网易云音乐',
          tabs,
          searchText: '',
          focusKey: 'q',
          search: () => this.search()
        },
        currentTime: 0,
        timer: null,
        tabs,
        lrcs,
        sheet,
        sheetList,
        account: null,
      }
    },
    computed: {},
    watch: {
      "lrcs.current"() {
        const {list, current} = this.lrcs;
        this.modifyManager.commonOptions.changeBG_When_LRC_Changed && this.musicConfig.changePic();
        this.musicConfig.setLrc(list[current] && list[current].name || '');
      },
      currentTime: {
        immediate: true,
        handler() {
          const currentTime = this.mv.$audio.currentTime;
          this.gameList.currentTime = currentTime * 1000;
          const index = parseInt(currentTime * 10);
          let curIndex = 0;
          this.lrcs.list.some((item, _index) => {
            if (item.time <= index) {
              curIndex = _index
            }
            return item.time > index;
          });
          this.lrcs.setIndex(curIndex);
        }
      },
      account: {
        immediate: true,
        handler() {
          if (this.account) {
            this.getUserSongList();
          }
        },
      }
    },
    methods: {
      getLrc() {
        const song = this.sheet.list[this.sheet.current];
        if (song) {
          ajax.lyric({id: song.id || song.songId})(res => {
            const lrcList = res.lrc.lyric.split(/\n/).map(item => {
              const info = item.match(/(?:\[)(\d+)(?::)([^\]]+)(?:\])([^\[\]]*)/);
              // 转成百毫秒数
              return {name: info ? info[3] : "", time: info ? parseInt((+info[1] * 60 + +info[2]) * 10) : 0,}
            });
            this.lrcs.setList(lrcList);
          });
          this.lrcs.setList([]);
        }

      },
      login() {
        const user = {phone: localStorage.getItem('userPhone'), password: localStorage.getItem('password'),};
        if (!user.password || !user.password) {
          ShortCut.toast(['正式环境位开放远程歌曲']);
          setTimeout(() => {
            ShortCut.toast(['请使用测试歌曲']);
          }, 600);
          return;
        }
        ajax.loginCellphone(user)(res => {
          this.account = res.account;
          this.getMySheets();
        });
      },
      getImgUrl(song) {
        return song && (song.coverImgUrl || song.al && song.al.picUrl || song.album && song.album.picUrl);
      },
      getSongUrl() {
        const {mv} = this;
        const song = this.sheet.list[this.sheet.current];
        if (song) {
          this.gameList.durationTime = mv.duration = mv.duration = song.duration || song.dt;
          ajax.songUrl({id: song.id})(res => {
            mv.play(res.data[0].url);
          });
        }

      },
      play(message) {
        const {gameList, mv} = this;
        const play = () => {
          gameList.startSong();
          mv.stopType = message;
          this.getSongUrl();
          this.getLrc();
          this.tabs.setIndex(1);
          // 清除输入
          this.config.searchText = "";
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
      getUserSongList() {
        ajax.userPlaylist({uid: this.account.id})(res => {
          this.sheetList.setList(res.playlist, true);
        });
      },
      getMySheets() {
        ajax.recommendSongs()(res => {
          this.sheet.setList(res.recommend || []);
        });
      },
      like(){
        const song = this.sheet.list[this.sheet.current];
        const sheet = this.sheetList.list[0];

        sheet && song && ajax.playlistTracks({
          op: 'add',
          pid: sheet.id,
          tracks: song.id
        })(res => {
          console.log('like');
        });
      },
      // 搜索
      search() {
        this.config.searchText && ajax.search({keywords: this.config.searchText})(res => {
          this.sheet.setList(res.result.songs, true);
          this.config.searchText = '';
        })
      },
    },
    beforeDestory() {
      clearInterval(this.timer);
    },
    mounted() {
      const {musicConfig, gameList, mv} = this;
      musicConfig.ended = () => {
        setTimeout(() => {
          gameList.endSong();
          setTimeout(() => {
            this.sheet.next();
            this.sheet.play();
          }, 5000);
        }, mv.delay.delayTime.value * 1000 + gameList.buffer + 1000)
      };
      this.timer = setInterval(() => (this.currentTime = Date.now()), 50);
      this.login();
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
          left: () => musicConfig.changePic(true),
          right: () => musicConfig.changePic(),
        }
      }, {
        alt: {
          left: `退后5s`,
          right: `前进5s`,
          p: `暂停/播放`,
        },
        ctrl: {
          left: `上一张图片`,
          right: `下一张图片`,
        }
      });

    }
  }
</script>

<style lang="less" type="text/less">


</style>
