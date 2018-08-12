import Vue from 'vue';
import CustomLayerMap from './CustomLayerMap.vue';
import VueGoogleMaps from 'vue-googlemaps'

const appFactory = (el, attrs) => {
  Vue.use(VueGoogleMaps, {
    load: {
      // Google API key
      apiKey: attrs.apikey,
      libraries: ['places'],
      useBetaRenderer: true,
    },
  });

  // Bootstrap Vue.js.
  new Vue({
    el,
    render: h => h(CustomLayerMap, {
      props: {
        layerId: attrs.layer,
        layerCacheVersion: attrs.version || '1',
      }
    })
  });
};

export default appFactory;
