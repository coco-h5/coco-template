import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';

function AutoResponse(width = 375) {
  const target = document.documentElement;
  if (target.clientWidth >= 600) {
    target.style.fontSize = '80px';
  } else {
    target.style.fontSize = target.clientWidth / width * 100 + 'px';
  }
  document.body.style.fontSize = '16px';
}
AutoResponse();
window.addEventListener('resize', () => AutoResponse());

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
