import Vue from 'vue';
import ScrollTop from './ScrollTop.vue';

const appFactory = (el, attrs) => {
  // Bootstrap Vue.js.
  new Vue({el, render: h => h(ScrollTop, {attrs})});
};

export default appFactory;
