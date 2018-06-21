import Vue from 'vue';
import VueResource from 'vue-resource';
import Agenda from './Agenda.vue';

Vue.use(VueResource);

const appFactory = (el, attrs) => {
  console.log(attrs);
  // Bootstrap Vue.js.
  new Vue({
    el,
    render: h => h(Agenda, {
      props: {apiKey: attrs.apikey, calendarId: attrs.calendar}
    })
  });
};

export default appFactory;
