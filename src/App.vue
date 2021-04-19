<template>
  <div id="app">
    <Index></Index>
  </div>
</template>
<script>
  import Index from './views/Index'
  export default {
    name: 'App',
    components: {
      Index,
    }
  }
</script>

<style lang="less">

  * {
    border: 0;
    padding: 0;
    margin: 0;
    outline: 0;
    box-sizing: border-box;
  }

  *::-webkit-scrollbar {
    width: 0;
  }

  ul, li {
    list-style: none;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    color: #fff;
    text-align: center;
    background-color: #000;
  }

  b {
    display: block;
    position: absolute;
    background-size: 1920px 1080px;
    border-radius: 2px;
    z-index: 2;
    color: pink;
    text-align: center;
  }

  img {
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
    opacity: 0;
  }
</style>
