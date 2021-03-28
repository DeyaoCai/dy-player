<template>
  <label :for="id" class="music-wrap" :class="{focus: isFocus}">
    <div class="search-box" :class="{focus: isFocus}">
      <input :id="id" ref="input" type="text" v-model="config.searchText" placeholder="网易云音乐" @focus="focus" @blur="blur">
    </div>
    <div class="music-lists">
      <div
        class="song-list"
        v-for="(tabItem, index) in config.tabs.list"
        :class="{
          prev: index === (tabs.current - 1 + tabs.list.length) % tabs.list.length,
          active: index === tabs.current,
          next: index === (tabs.current + 1) % tabs.list.length,
        }"
      >
        <span
          v-if="getImgUrl(tabItem.list[tabItem.current])"
          :style="{backgroundImage: `url('${getImgUrl(tabItem.list[tabItem.current])}')`}"
        ></span>
        <div>
          <ul
            :style="{transform: `translateY(-${30 * tabItem.current}px)`}">
            <li
              v-for="(song, _index) in tabItem.list"
              :class="{active: tabItem.current === _index, playing: tabItem.playing === _index}"
            >
              <span @click.stop="tabItem.setIndex(_index).play()">
                <img :src="getImgUrl(song)" v-if="getImgUrl(song)"/>
                {{ song.name }}
                <template v-if="config.type === 'modify' && index === 1">
                  &nbsp;&nbsp;
                  {{ tabItem.list[_index].value }} /
                  {{ tabItem.list[_index].min }} /
                  {{ tabItem.list[_index].max }}
                  &nbsp;&nbsp;当前/最小/最大
                </template>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="music-lists-prev" @click.stop="tabs.prev()"> prev </div>
      <div class="music-lists-next" @click.stop="tabs.next()"> next </div>
    </div>
  </label>
</template>
<script>
  import {shortCut, ShortCut} from "../tools/ShortCut";

  export default {
    name: 'ListBoxView',
    provide() {
      return {}
    },
    components: {},
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
    props: ['config'],
    computed: {
      tabs(){
        return this.config.tabs;
      },
      id(){
        return `ListBoxView_${this.config.focusKey}`;
      }
    },
    watch: {
    },
    data(){
      this.navList.push({
        name: this.config.name,
        id: this.id,
        callback: () => {
          this.$refs.input.focus()
        }
      });
      return {
        isFocus: false
      }
    },
    methods: {
      focus(){
        const time = this.isFocus_ = Date.now();
        setTimeout(() => {
          time === this.isFocus_ && (this.isFocus = true);
        }, 300)
      },
      blur(){
        const time = this.isFocus_ = Date.now();
        setTimeout(() => {
          time === this.isFocus_ && (this.isFocus = false);
        }, 300)
      },
      getImgUrl(song) {
        return song && (song.coverImgUrl || song.al && song.al.picUrl || song.album && song.album.picUrl);
      },
    },
    beforeDestory() {
    },
    mounted() {
      const {musicConfig, gameList, mv, config} = this;
      this.$shortCut = new ShortCut();

      config.type === 'modify' && this.$shortCut.init(this.$refs.input, {
        common: {
          w: () => config.tabs.up(),
          s: () => config.tabs.down(),
          q: () => config.tabs.prev(),
          e: () => config.tabs.next(),
          // enter: () => this.search(),
          107: () => config.tabs.add(),
          delete: () => config.tabs.delete(),
          c: () => config.tabs.copy(),
          4: () => config.tabs.dec(),
          6: () => config.tabs.enc(),
          left: () => config.tabs.dec(),
          right: () => config.tabs.enc(),
          a: () => config.tabs.dec(),
          d: () => config.tabs.enc(),
          8: () => config.tabs.prevItem(),
          2: () => config.tabs.nextItem(),
          up: () => config.tabs.prevItem(),
          down: () => config.tabs.nextItem(),
          esc: () => this.$refs.input.blur(),
        },
        alt: {},
        shift: {},
        ctrl: {}
      }, {
        common: {
          w: `上一项`,
          s: `下一项`,
          q: `左翻页`,
          e: `右翻页`,
          107: `添加配置`,
          delete: `删除配置`,
          c: `复制当前配置`,
          4: `参数小`,
          6: `参数大`,
          left: `参数小`,
          right: `参数大`,
          a: `参数小`,
          d: `参数大`,
          8: `上一项`,
          2: `下一项`,
          up: `上一项`,
          down: `下一项`,
          esc: `关闭配置页面`,
        },
        alt: {},
        shift: {},
        ctrl: {}
      });


      config.type === 'listBox' && this.$shortCut.init(this.$refs.input, {
        common: {
          up: () => config.tabs.list[config.tabs.current].prev(),
          down: () => config.tabs.list[config.tabs.current].next(),
          left: () => config.searchText || config.tabs.prev(),
          right: () => config.searchText || config.tabs.next(),
          enter: () => config.search && config.searchText ? config.search() : config.tabs.list[config.tabs.current].play('manual'),
          backspace: () => config.searchText || config.tabs.current && config.tabs.prev(),
          esc: () => this.$refs.input.blur(),
        },
      }, {
        common: {
          up: `上一项`,
          down: `下一项`,
          left: `上一页`,
          right: `上一页`,
          enter: `搜索|播放|确认`,
          backspace: `删除|返回上一页`,
          esc: `关闭页面`,
        },
      });

      shortCut.init(undefined, {
        alt: {
          [this.config.focusKey]: () => {
            this.$refs.input.focus()
          },
        },
      }, {
        alt: {
          [this.config.focusKey]: `打开页面`,
        },
      });

    }
  }
</script>

<style lang="less" type="text/less">
  .music-wrap {
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    transform-origin: center center;
    transform: translate(-50%, -50%) scale(0.7, 0.7);
    opacity: 0;
    transition: all 1s;
    will-change: opacity, transform, background-color;

    &::before {
      content: '';
      display: block;
      width: 400%;
      height: 400%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.9);
    }

    .music-lists {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 50%;
      width: 40%;
      .music-lists-prev,
      .music-lists-next{
        position: absolute;
        top: 0;
        height: 40px;
        background-color: rgba(255,255,255,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        z-index: 4;
      }
      .music-lists-prev{
        right: 100%;
      }
      .music-lists-next{
        left: 100%;
      }
      .song-list {
        background-color: #222;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 20px;
        justify-content: center;
        transition: all .3s;
        border: 0;

        > span {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          opacity: 0.5;
          filter: blur(0px);
          transition: all 0.4s;
          will-change: opacity;
        }

        img {
          position: relative;
          opacity: 1;
          width: 14px;
          height: 14px;
          margin-right: 6px;
          border-radius: 4px;
          border: 0;
        }

        ul {
          position: relative;
          transform: translateX(-100%);
          top: 50%;
          transition: all 1s;
          opacity: 0;
          transform-origin: top;

          li {
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            color: #fff;
            font-size: 16px;
            line-height: 30px;
            height: 30px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            transform: translate(0, 0, 0);
            text-shadow: 0 4px 4px #000;
            will-change: transform;

            span {
              transform: translateY(0) scale(0.6, 0.6);
              transition: all 1s;
              will-change: transform;
            }

            &.active {
              opacity: 1;

              span {
                transform: translateY(0) scale(1, 1);
              }
            }

            &.playing {
              span {
                transform: translateY(0) scale(0.9, 0.9);
              }
            }
          }
        }
        &.prev {
          z-index: 1;
          border-radius: 50% 0 0 50%;
          transform: translate(-100%, -50%) scale(.8, .8);
        }



        &.next {
          z-index: 2;
          border-radius: 0 50% 50% 0;
          transform: translate(0, -50%) scale(.8, .8);
        }
        &:only-child,
        &.active {
          z-index: 3;
          border-radius: 10%;
          transform: translate(-50%, -50%);
          > span {
            opacity: .8;
          }
        }
      }
    }

    &.focus {
      z-index: 3009 !important;
      opacity: 1;
      transform: translate(-50%, -50%) scale(1, 1);

      .song-list {

        ul {
          opacity: 0.5;
        }

        &.active {
          opacity: 1;

          ul {
            opacity: 1;
            transform: translateX(0);
          }
        }

        > div {
          height: 100%;
          overflow: hidden;
        }
      }
    }
  }

  .search-box {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 10%;
    overflow: hidden;

    input {
      text-align: right;
      border: 0;
      padding: 0 20px;
      outline: 0;
      color: #fff;
      font-size: 52px;
      text-shadow: 0 0 8px #ffa800;
      background-color: transparent;

      &::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>
