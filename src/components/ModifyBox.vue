<template>
  <ListBoxView :config="config"></ListBoxView>
</template>
<script>
  import ListBoxView from "./ListBoxView";

  export default {
    name: 'ModifyBox',
    provide() {
      return {}
    },
    components: {
      ListBoxView
    },
    mixins: [],
    inject: ['modifyManager', 'navList'],
    data() {
      return {
        config: {
          type: 'modify',
          name: '参数调整',
          tabs: this.modifyManager,
          searchText: '',
          focusKey: 'w',
        },
      }
    },
    computed: {
    },
    watch: {},
    methods: {
      search() {
      },
    },
    mounted() {
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .music-wrap {
    .song-list {
      background-color: rgba(34, 34, 34, 0.8);
    }

    &::before {
      background-color: rgba(0, 0, 0, 0);
    }
  }
</style>
