<template>
  <div class="music-wrap" :class="{focus: isFocus}">
    <div class="search-box" :class="{focus: isFocus}">
      <input ref="input" type="text" v-model="searchText" placeholder="搜索引擎" @focus="focus" @blur="blur">
    </div>
    <div class="music-lists">
      <div
        class="song-list"
        v-for="(listItem, index) in lists.list"
        :class="{
          prev: index === (lists.current - 1 + lists.list.length) % lists.list.length,
          active: index === lists.current,
          next: index === (lists.current + 1) % lists.list.length,
        }">
        <span :style="{backgroundImage: `url('${getImgUrl(listItem.list[listItem.current])}')`}"></span>
        <div>
          <ul
            :style="{transform: `translateY(-${30 * listItem.current}px)`}">
            <li
              v-for="(file, index) in listItem.list"
              :class="{active: listItem.current === index, playing: listItem.playing === index}"
            >
              <span>
                <!--<img :src="getImgUrl(song)" v-if="getImgUrl(song)"></img>-->
                {{file.name}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {SearchBoxConfig} from "./SearchBoxConfig";
  import {shortCut, ShortCut} from "../tools/ShortCut";

  class Lists {
    constructor(origin) {
      this.list = [];
      this.origin = origin;
      this.playing = 0;
      this.current = 0;
    }

    get len() {
      return this.list.length;
    }

    setList(list) {
      this.list = list;
      this.current = 0;
    }

    setIndex(index) {
      if (index > this.len - 1) index = this.len - 1;
      if (index < 0) index = 0;
      this.current = index;
      this.play();
    }
    play() {
      const list = this.list[this.current].list;
      if (this.origin && list) {
        this.origin.list[this.origin.current + 1].setList(list);
        this.playing = this.current;
      }
    }

    prev() {
      this.setIndex((this.current - 1 + this.len) % this.len);
    }

    next() {
      this.setIndex((this.current + 1) % this.len);
    }
  }

  export default {
    name: 'SearchBox',
    provide() {
      return {}
    },
    components: {},
    mixins: [],
    data() {
      const lists = new Lists();
      const itemType = new Lists(lists);
      const searchEngine = new Lists(lists);
      lists.setList([
        itemType,
        searchEngine
      ]);
      itemType.setList(SearchBoxConfig);
      itemType.setIndex(0);

      return {
        searchText: '',
        itemType,
        searchEngine,
        isFocus: false,
        lists,
      }
    },
    computed: {},
    watch: {},
    methods: {
      getImgUrl(song) {
        return '';
      },
      filterList(listItem){
        return filterList(listItem);
      },
      blur() {
        this.isFocus = false;
      },
      focus() {
        this.isFocus = true;
      },
      search(){
        const [type, engine] = this.lists.list;
        const {searchText} = this;
        const {search, link} = (engine.list[engine.current] || {options : {}}).options;
        if (searchText) {
          console.log(`start ${search.replace(/__keyword__/g, searchText)}`)
          node.cProcess.exec(`explorer "${search.replace(/__keyword__/g, searchText)}"`)
        } else {
          node.cProcess.exec(`explorer "${link}"`)
        }
      },
    },
    mounted() {
      this.$shortCut = new ShortCut();
      this.$shortCut.init(this.$refs.input, {
        common: {
          up: () => this.lists.list[this.lists.current].prev(),
          down: () => this.lists.list[this.lists.current].next(),
          left: () => this.lists.prev(),
          right: () => this.lists.next(),
          enter: () => this.search(),
          backspace: () => this.lists.list[this.lists.current].searchText || this.lists.current && this.lists.prev(),
          esc: () => this.$refs.input.blur(),
        },
        alt: {},
        shift: {},
        ctrl: {}
      });
      shortCut.alt(69, () => {
        this.$refs.input.focus();
      });
    }
  }
</script>

<style lang="less" scoped>
</style>
