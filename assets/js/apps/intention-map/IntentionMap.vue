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
          <div class="legend-item" v-if="currentItem.categoryObj">
            <div class="legend-item__header">
              <div class="legend-item__color" :style="{backgroundColor: currentItem.categoryObj.color}"></div>
              <span class="legend-item__caption">{{ currentItem.categoryObj.name }}</span>
            </div>
          </div>
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

const mapMarkerPath = '/assets/img/map-markers';
const palette = {
  black: {
    color: '#000000',
    icon: 'map-marker-black.svg',
  },
  turqoise: {
    color: '#1abc9c',
    icon: 'map-marker-turqoise.svg',
  },
  emerald: {
    color: '#2ecc71',
    icon: 'map-marker-emerald.svg',
  },
  peterRiver: {
    color: '#3498db',
    icon: 'map-marker-peter-river.svg',
  },
  amethyst: {
    color: '#9b59b6',
    icon: 'map-marker-amethyst.svg',
  },
  wetAsphalt: {
    color: '#34495e',
    icon: 'map-marker-wet-asphalt.svg',
  },
  sunFlower: {
    color: '#f1c40f',
    icon: 'map-marker-sun-flower.svg',
  },
  carrot: {
    color: '#e67e22',
    icon: 'map-marker-carrot.svg',
  },
  alizarin: {
    color: '#e74c3c',
    icon: 'map-marker-alizarin.svg',
  },
  concrete: {
    color: '#95a5a6',
    icon: 'map-marker-concrete.svg'
  },
  greenSea: {
    color: '#16a085',
    icon: 'map-marker-green-sea.svg',
  },
  nephritis: {
    color: '#27ae60',
    icon: 'map-marker-nephritis.svg',
  },
  belizeHole: {
    color: '#2980b9',
    icon: 'map-marker-belize-hole.svg',
  },
  wisteria: {
    color: '#8e44ad',
    icon: 'map-marker-wisteria.svg',
  },
  midnightBlue: {
    color: '#2c3e50',
    icon: 'map-marker-midnight-blue.svg',
  },
  orange: {
    color: '#f39c12',
    icon: 'map-marker-orange.svg',
  },
  pumpkin: {
    color: '#d35400',
    icon: 'map-marker-pumpkin.svg',
  },
  pomegranate: {
    color: '#c0392b',
    icon: 'map-marker-pomegranate.svg',
  },
  asbestos: {
    color: '#7f8c8d',
    icon: 'map-marker-asbestos.svg',
  },
};

Object.keys(palette).forEach(key => {
  palette[key].marker = new L.Icon({
    iconUrl: `${mapMarkerPath}/${palette[key].icon}`,
    iconSize: [20, 32],
    iconAnchor: [10, 32],
  });
});

export default {
  props: {
    /**
     * Access token for mapbox.
     */
    accessToken: {
      type: String,
      required: true,
    },
    /**
     * URL to the GeoJSON dataset to populate map from.
     */
    datasetUrl: {
      type: String,
      required: true,
    },
    /**
     * Optional link to "send us your idea" form.
     */
    ideaFormUrl: {
      type: String,
      required: false,
    },
    /**
     * Optional color mapping for categories.
     */
    categoryColors: {
      type: Object,
      required: false,
    },
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
      zoom: 13,
      url:`https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=${this.accessToken}`,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      intentionMapLayerGeoJson: null,
    }
  },
  computed: {
    shareUrl: function () {
      let url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href.split('#')[0]}`;

      if (this.currentItem) {
        url += `#${this.currentItem.url}`;
      }

      return url;
    },
    categoryListExpanded: function () {
      return Object.values(this.categories).reduce((result, category) => {
        return result || category.expanded;
      }, false);
    },
  },
  methods: {
    initialize(geoJSON) {
      // Annotate with proper id, slug and composed url.
      const annotatedFeatures = geoJSON.features.map(f => {
        f.properties.id = parseInt(f.properties.id);
        f.properties.slug = this.slugify(f.properties.name);
        f.properties.url = `${f.properties.id}-${f.properties.slug}`;
        return f;
      });
      const features = {features: annotatedFeatures};

      // Build category list.
      this.initCategories(features);

      features.features.forEach(f => {
        if (f.properties.category && this.categories[f.properties.category]) {
          f.properties.categoryObj = this.categories[f.properties.category];
        }
      })

      // Draw the map.
      this.initMap(features);
    },
    /**
     * Traverse list of features a build list of categories
     * with features assigned.
     *
     * @param {GeoJSON features} features
     */
    initCategories(data) {
      const categories = {};
      const categoryNames = [...new Set(data.features.map(feature => feature.properties.category).filter(cat => !! cat))].sort();
      const paletteKeys = Object.keys(palette);

      categoryNames.forEach((cat, index) => {
        let paletteKey = null;

        if (this.categoryColors && this.categoryColors[cat]) {
          paletteKey = this.categoryColors[cat];
        } else {
          paletteKey = paletteKeys[index % paletteKeys.length];
        }

        categories[cat] = {
          expanded: false,
          name: cat,
          color: palette[paletteKey].color,
          markerIcon: palette[paletteKey].marker,
          items: [],
        };
      });

      data.features.forEach((feature, featureIndex) => {
        if (feature.properties.category) {
          categories[feature.properties.category].items.push({...feature.properties, featureIndex});
        }
      })

      this.categories = categories;
    },
    initMap(data) {
      // Markers are clustered for easier orientation.
      const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 48,
      });

      // Get color for feature - either from category or fall back to default.
      const colorForFeature = feature => {
        const cat = feature.properties.category;
        return cat ? this.categories[cat].color : '#000';
      }

      // Get style for given feature.
      const style = feature => ({
          fillColor: colorForFeature(feature),
          weight: 2,
          opacity: 1,
          color: colorForFeature(feature),
          fillOpacity: 0.7
      });

      // Called for each feature when building the map.
      const onEachFeature = (feature, layer) => {
        // Find pole of inaccessibility (not centroid) for the polygon
        // @see: https://github.com/mapbox/polylabel
        const markerPos = polylabel(feature.geometry.coordinates, 1);
        const markerPosLatLng = L.latLng(markerPos[1], markerPos[0]);

        // add marker
        const markerIcon = feature.properties.category && this.categories[feature.properties.category] ?
          this.categories[feature.properties.category].markerIcon :
          palette.black.markerIcon;

        const featureMarker = new L
          .marker(markerPosLatLng, {icon: markerIcon})
          .on('click', evt => {
            this.zoomTo(layer);
          });

        // Add item marker to the cluster.
        markers.addLayer(featureMarker);

        // Bind click event on the layer.
        layer.on({click: evt => this.zoomTo(evt.target)});
      }

      this.layer = L.geoJSON(data, {style, onEachFeature});
      this.layer.addTo(this.map);
      this.map.addLayer(markers);
      this.map.panTo(this.layer.getBounds().getCenter());

      // If hash is present when starting, locate the item and zoom to i.
      if (window.location.hash) {
        this.zoomToItemBySlugUrl(window.location.hash.substring(1));
      }

      // Listen to hashbang changes when user users browser history navigation.
      window.addEventListener('hashchange', this.onHashChange, false);
    },
    /**
     * Creates an URL-friendly version of given text.
     *
     * @param {String} str
     */
    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      const from = "áěščřžýíéěňúůóť–-·/_,:;";
      const to   = "aescrzyieenuuot--------";

      for (let i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

      return str;
    },
    /**
     * Stores item's url in the hashbang.
     *
     * @param {Object} item
     */
    setUrlHash(item) {
      if (item === null) {
        history.pushState({}, null, '#');
      } else {
        history.pushState({}, item.name, '#' + item.url);
      }
    },
    /**
     * Called when URL hash changes. Will display detail
     * of corresponding item if such exist.
     *
     * @param {Event} evt
     */
    onHashChange(evt) {
      const urlBits = evt.newURL.split('#');

      if (urlBits.length == 2) {
        this.zoomToItemBySlugUrl(urlBits[1]);
      }
    },
    /**
     * Hide current item detail, drop it from URL.
     */
    closeItemInfo() {
      this.currentItem = null;
      this.setUrlHash(null);
    },
    /**
     * Expand category, show list of items belonging to id.
     * @param {String} category
     */
    toggleExpandCategory(category) {
      category.expanded = ! category.expanded;
    },
    /**
     * Zoom to a detail of a layer.
     *
     * @param {L.Layer} layer
     * @param {Boolean} pushState whether to push new state to history.
     */
    zoomTo(layer, updateUrl = true) {
      this.map.fitBounds(layer.getBounds());
      this.currentItem = layer.feature.properties;

      if (updateUrl) {
        this.setUrlHash(this.currentItem);
      }
    },
    /**
     * Zoom to a cateogry item. Wraps `zoomTo`.
     *
     * @param {Object} category
     * @param {Object} item
     */
    zoomToCategoryItem(category, item) {
      const layer = Object.values(this.layer._layers).find(l => l.feature.properties.id == item.id);
      if (layer) {
        this.zoomTo(layer);
      }
    },
    /**
     * Zoom to a item with corresponding slugified URL.
     *
     * @param {String} slugUrl
     */
    zoomToItemBySlugUrl(slugUrl) {
      const layer = Object.values(this.layer._layers).find(l => l.feature.properties.url == slugUrl);
      if (layer) {
        this.zoomTo(layer, false);
      }
    }
  },
  mounted() {
    // Download the dataset and then initialize.
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject;
      this.$http.get(this.datasetUrl).then(resp => this.initialize(resp.body));
    });
  },
  // Unbind event listener on component destroy.
  beforeDestroy() {
    window.removeEventListener('hashchange', this.onHashChange);
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
      min-height: 600px;
    }

    @media (min-height: 900px) {
      min-height: 750px;
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
      max-width: 40%;
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

    .legend-item {
      margin-bottom: 1rem;
    }
  }

  .intention-cta {
    display: inline-block;
  }

  .intention-cta + .intention-cta {
    margin-left: 1rem;
  }
</style>
