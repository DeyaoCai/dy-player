function IsPhone() {
  return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
}
// @ts-ignore;
window.isPhone = IsPhone();
import './assets/style/index.less'
import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

createApp(App).use(router).mount('#app')
