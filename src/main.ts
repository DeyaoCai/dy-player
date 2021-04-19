function IsPhone() {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
}
// @ts-ignore;
window.isPhone = IsPhone();
import './assets/style/index.less'
import App from './App.vue'
import './registerServiceWorker'


import Vue from 'vue'

new Vue({render: (h) => h(App),}).$mount('#app');


// import { createApp } from 'vue'
// createApp(App).mount('#app')
