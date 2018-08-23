import L from 'leaflet';

import Vue from 'vue';
import VueResource from 'vue-resource';

import IntentionMap from './IntentionMap.vue';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.use(VueResource);

const appFactory = (el, attrs) => {
  // Bootstrap Vue.js.
  new Vue({
    el,
    render: h => h(IntentionMap,  {
      props: {
        accessToken: attrs.accesstoken,
        datasetUrl: attrs.dataset,
        ideaFormUrl: attrs.ideaform,
      }
    })
  });
};

export default appFactory;
