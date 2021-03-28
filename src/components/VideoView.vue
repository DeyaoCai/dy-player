<template>
  <div class="canvas-view">
    <video :src="src" autoplay="autoplay" muted @ended="handelEnded"></video>
  </div>
</template>
<script>


  export default {
    name: 'VideoView',
    provide() {
      return {}
    },
    components: {},
    mixins: [],
    props: ['index'],
    inject: [
      'musicDataFlags',
      'musicData',
      'musicConfig',
      'gameList',
      'mv',
      'modifyManager'
    ],
    data() {
      return {
        ended: true,
        shallChange: false,
        current: this.index,
        src: '',
        srcs: [
          './videos/1.mp4',
          './videos/2.mp4',
          './videos/3.mp4',
          './videos/4.mp4',
        ],
        width: 0, height: 0,
        play: () => {
          // this.$refs.video && this.$refs.video.play();
        }
      }
    },
    computed: {
      changeVideo(){
        return this.musicData.soundTrackArr.find(item => item.isChangeDot)
      },
    },
    methods: {
      handelEnded(){
        this.ended = true;
      },
    },
    watch: {
      'musicDataFlags.shockFlag'(){
        if (this.ended) {
          this.current ++;
          this.src = this.srcs[this.current%this.srcs.length];
          this.ended = false;
        }
      },
    },
    beforeDestroy(){
      document.removeEventListener('click', this.play);
    },
    mounted() {
      document.addEventListener('click', this.play);
      this.play();
      this.width = this.$el.offsetWidth;
      this.height = this.$el.offsetHeight;
    }
  }
</script>

<style lang="less" scoped>
  .canvas-view {
    position: absolute;
    opacity: 1;
    width: 100%;
    height: 100%;
    flex: 1 1 0;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 2950;
    background-blend-mode: lighten;
    mix-blend-mode: lighten;
  }

  .canvas-view video {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>
