<template>
  <div class="c-intention-map-layer">
    <l-map ref="map" class="c-intention-map-layer__map" :zoom="zoom">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>

    <div class="c-intention-map-layer__cta">
      <a
        :href="ideaFormUrl"
        target="_blank"
        rel="noopener"
        class="intention-cta"
        title="Pošlete nám váš nápad" >
        <i class="fa fa-lightbulb-o"></i>
        Mám nápad
      </a>

      <a
        :href="shareUrl"
        class="intention-cta"
        onclick="window.open(this.href, 'pop-up', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0'); return false;"
        title="Sdílet na Facebooku" >
        <i class="fa fa-facebook-official"></i>
        Sdílet na Facebooku
      </a>
    </div>

    <div class="c-intention-map-layer__iteminfo" v-if="currentItem">
      <div class="item-info">
        <a class="item-info__close" @click="closeItemInfo"><i class="fa fa-times"></i></a>
        <div class="item-info__body">
          <img v-if="currentItem.image" :src="currentItem.image" :alt="currentItem.name">
          <h4>{{ currentItem.name }}</h4>
          <p>{{ currentItem.description }}</p>
        </div>
      </div>
    </div>

    <div class="c-intention-map-layer__legend" :class="{'c-intention-map-layer__legend--expanded': categoryListExpanded}">
      <div class="legend-item" :class="{'legend-item--expanded': category.expanded}" v-for="category in categories" :key="category.name">
        <div class="legend-item__header">
          <div class="legend-item__color" :style="{backgroundColor: category.color}"></div>
          <a class="legend-item__caption" @click="toggleExpandCategory(category)">{{ category.name }} ({{ category.items.length}}) <i class="fa" :class="{'fa-plus-square': ! category.expanded, 'fa-minus-square': category.expanded}"></i></a>
        </div>
        <ul class="legend-item__items" v-show="category.expanded">
          <li class="legend-item__items-item" v-for="item in category.items" :key="item.name"><a @click="zoomToCategoryItem(category, item)">{{ item.name }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LGeoJson } from 'vue2-leaflet';
import polylabel from 'polylabel';
import 'leaflet.markercluster';

export default {
  props: {
    accessToken: {
      type: String,
      required: true,
    },
    datasetUrl: {
      type: String,
      required: true,
    },
    ideaFormUrl: {
      type: String,
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
  },
  data () {
    return {
      // Future map reference
      map: null,
      // Future geojson layer for the map
      layer: null,
      currentItem: null,
      categories: [],
      zoom:13,
      url:`https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=${this.accessToken}`,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      intentionMapLayerGeoJson: null,
    }
  },
  computed: {
    shareUrl: function () {
      return `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    },
    categoryListExpanded: function () {
      return Object.values(this.categories).reduce((result, category) => {
        return result || category.expanded;
      }, false);
    },
  },
  methods: {
    initCategories(features) {
      const categories = {};
      const palette = [
        '#1B0338',
        '#460795',
        '#B00080',
        '#EB2463',
        '#FF744A',
        '#FFB947',
        '#F9F871',
      ];

      const categoryNames = [...new Set(features.map(feature => feature.properties.category).filter(cat => !! cat))].sort();

      categoryNames.forEach((cat, index) => {
        const paletteColor = palette[index % palette.length];

        categories[cat] = {
          expanded: false,
          name: cat,
          color: paletteColor,
          items: [],
        };
      });

      features.forEach((feature, featureIndex) => {
        if (feature.properties.category) {
          categories[feature.properties.category].items.push({...feature.properties, featureIndex});
        }
      })

      this.categories = categories;
    },
    closeItemInfo() {
      this.currentItem = null;
    },
    toggleExpandCategory(category) {
      category.expanded = ! category.expanded;
    },
    zoomTo(layer) {
      this.map.fitBounds(layer.getBounds());
      this.currentItem = layer.feature.properties;
    },
    zoomToCategoryItem(category, item) {
      const layer = Object.values(this.layer._layers).find(l => l.feature.properties.fidx == item.fidx);
      if (layer) {
        this.zoomTo(layer);
      }
    },
  },
  mounted() {
    const pirateMarker = new L.Icon({
      iconUrl: '/assets/img/map-marker.svg',
      iconSize: [20, 32],
      iconAnchor: [10, 32],
    });

    // Markers are clustered for easier orientation.
    const markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
    });

    const getColorForFeature = feature => {
      const cat = feature.properties.category;

      if (cat) {
        return this.categories[cat].color;
      }

      return '#000';
    };

    const getStyleForFeature = feature => ({
        fillColor: getColorForFeature(feature),
        weight: 3,
        opacity: 1,
        color: '#fff',
        dashArray: '3',
        fillOpacity: 0.7
    });

    const onEachFeature = (feature, layer) => {
      // Find pole of inaccessibility (not centroid) for the polygon
      // @see: https://github.com/mapbox/polylabel
      const markerPos = polylabel(feature.geometry.coordinates, 1);
      const markerPosLatLng = L.latLng(markerPos[1], markerPos[0]);

      // add marker
      const featureMarker = new L
        .marker(markerPosLatLng, {icon: pirateMarker})
        .on('click', evt => {
          this.zoomTo(layer);
        });

      markers.addLayer(featureMarker);

      layer.on({
        click: evt => this.zoomTo(evt.target),
      });
    }

    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject; // work as expected

      this.$http.get(this.datasetUrl).then(resp => {
        // Annotate with fidx.
        const annotatedFeatures = resp.body.features.map((f, fidx) => {
          f.properties.fidx = fidx;
          return f;
        });
        const features = {features: annotatedFeatures};
        this.initCategories(features.features);
        this.layer = L.geoJSON(features, {
          style: getStyleForFeature,
          onEachFeature
        });
        this.layer.addTo(this.map);
        this.map.addLayer(markers);
        this.map.panTo(this.layer.getBounds().getCenter());
      });
    });

  }
}
</script>

<style lang="scss">
  @import "~leaflet/dist/leaflet.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "settings";

  .marker-cluster {
    border-radius: 50%;
    background-clip: padding-box;
  }

  .marker-cluster div {
    color: #fff;
    font-family: #{$body-font-family};
    font-weight: bold;
    text-align: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 5px;
    margin-top: 5px;
  }

  .marker-cluster span {
    line-height: 30px;
  }

  .marker-cluster-small,
  .marker-cluster-medium {
    background-color: transparentize(#000, .6);
  }

  .marker-cluster-small div {
    background-color: transparentize(#000, .5);
  }

  .marker-cluster-medium div {
    background-color: transparentize(#000, .1);
  }

  .marker-cluster-small:hover,
  .marker-cluster-medium:hover {
    background-color: transparentize(#000, .5);

    div {
      background-color: transparentize(#000, 0);
    }
  }

  .c-intention-map-layer {
    position: relative;
  }

  .c-intention-map-layer,
  .c-intention-map-layer__map {
    width: 100%;
    min-height: 300px;
    z-index: 1;

    @media (min-height: 500px) {
      min-height: 400px;
    }

    @media (min-height: 800px) {
      min-height: 500px;
    }

    @media (min-height: 900px) {
      min-height: 700px;
    }
  }

  .c-intention-map-layer__legend,
  .c-intention-map-layer__iteminfo,
  .c-intention-map-layer__cta {
    position: absolute;
    z-index: 2;
    background: rgba(255, 255, 255, 0.9);
  }

  .c-intention-map-layer__legend {
    top: 0;
    right: 2rem;
    padding: 1rem;
    width: 20em;
    max-height: calc(100% - 8rem);
    overflow-y: auto;

    @include breakpoint(medium down) {
      right: 0;
      max-width: 50%;
      max-height: 50%;
    }
  }

  .c-intention-map-layer__iteminfo {
    bottom: 0;
    left: 2rem;
    width: 33%;
    max-height: 80%;

    @include breakpoint(medium down) {
      top: auto;
      left: 0;
      right: 0;
      width: 100%;
      height: 40%;
    }
  }

  .c-intention-map-layer__cta {
    bottom: 2rem;
    right: 2rem;
    padding: 1rem;
    overflow-y: auto;

    @include breakpoint(medium down) {
      display: none;
    }
  }

  .legend-item__header {
    display: flex;
    align-items: center;
  }

  .legend-item__color {
    width: 1rem;
    height: 1rem;

    @include breakpoint(medium down) {
      width: .8rem;
      height: .8rem;
    }
  }

  .legend-item__caption {
    padding-left: .5rem;
    flex: 1;

    @include breakpoint(medium down) {
      font-size: 80%;
    }
  }

  .legend-item--expanded {
    &:not(:first-of-type) {
      margin-top: 1rem;
    }

    &:not(:last-of-type) {
      margin-bottom: 1rem;
    }

    .legend-item__caption {
      font-weight: bold;
    }
  }

  .legend-item__items {
    list-style-type: none;
    margin-left: 0;
    margin-bottom: 0;
  }

  .legend-item__items-item {
    text-decoration: underline;

    @include breakpoint(medium down) {
      font-size: 80%;
    }
  }

  .item-info {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }

  .item-info__close {
    position: absolute;
    top: .5rem;
    right: .5rem;
  }

  .item-info__body {
    padding: 1rem;
    overflow-y: auto;

    img {
      margin-bottom: 1rem;

      @include breakpoint(medium down) {
        display: none;
      }
    }
  }

  .intention-cta {
    display: inline-block;
  }

  .intention-cta + .intention-cta {
    margin-left: 1rem;
  }
</style>
