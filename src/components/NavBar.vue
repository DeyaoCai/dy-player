<template>
  <div class="nav-bar" :class="{active: active}" @click="active =! active">
    <ul>
      <li v-for="(item, index) in navList.list">
        <template v-if="item.type==='fileReader'">
          <label :for="item.id">
            {{item.name}}
            <input type="file" :id="item.id" @change.stop="item.callback && item.callback($event)">
          </label>
        </template>
        <template v-else>
          <div @click.stop="item.callback && item.callback()">{{item.name}}</div>
        </template>
      </li>
      <slot></slot>
    </ul>
  </div>
</template>
<script>

  export default {
    name: 'BalanceView',
    provide() {
      return {}
    },
    components: {},
    mixins: [],
    props: [],
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager',
      'navList',
    ],
    data() {
      return {
        balanceTrack: this.modifyManager.balanceTrack,
        searchText: '',
        active: false,
      }
    },
    computed: {},
    watch: {
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .nav-bar {
    position: fixed;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    padding-right: 60px;
    overflow: hidden;
    z-index: 3010;
    transition: all .3s;
    background-color: rgba(255,255,255,.3);
    &.active{
      width: 100%;
    }
    ul{
      display: flex;
      justify-content: flex-end;
      /deep/li{
        display: flex;
        height: 60px;
        padding: 0 10px;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        background-color: rgba(255,255,255,.3);
        cursor: pointer;
      }
    }
  }
</style>
