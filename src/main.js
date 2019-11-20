// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
export default new Vuetify({ });
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  vuetify: new Vuetify(),
  template: '<App/>',
  render: h => h(App)
}).$mount('#app');