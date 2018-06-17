import Vue from 'vue';
import Autocomplete from 'v-autocomplete';
import VueResource from 'vue-resource';
import SiteSearch from './SiteSearch.vue';

Vue.use(Autocomplete);
Vue.use(VueResource);

const appFactory = (el, attrs) => {
  // Bootstrap Vue.js.
  new Vue({el, render: h => h(SiteSearch, {attrs})});
};

export default appFactory;
