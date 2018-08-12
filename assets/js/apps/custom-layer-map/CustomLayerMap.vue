<template>
  <div class="c-custom-layer-map">
    <div class="c-custom-layer-map-infowindow" v-if="selectionInfo">
      <div class="c-custom-layer-map-infowindow__container">
        <div class="c-custom-layer-map-infowindow__body">
          <a class="c-custom-layer-map-infowindow__close" @click="closeInfoWindow"><i class="fa fa-times"></i></a>
          <div class="c-custom-layer-map-infowindow__content">
            <h2 class="t-h3" v-if="selectionInfo.title">{{ selectionInfo.title }}</h2>
            <p v-if="selectionInfo.content" v-html="selectionInfo.content"></p>
          </div>
        </div>
      </div>
    </div>

    <googlemaps-map
      class="c-custom-layer-map__map"
      ref="map"
      :center.sync="center"
      :zoom.sync="zoom"
      :options="mapOptions"
      @ready="onMapReady"></googlemaps-map>
  </div>
</template>

<script>
  const mapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d3d3d3"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "color": "#808080"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b3b3b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "weight": 1.8
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d7d7d7"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ebebeb"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a7a7a7"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#696969"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#737373"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d6d6d6"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {},
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    }
  ];

  export default {
    props: {
      layerId: {
        type: String,
        required: true,
      },
      layerCacheVersion: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        zoom: 7,
        center: {lat: 0, lng: 0},
        mapOptions: {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: mapStyle,
        },
        selectionInfo: null
      };
    },
    methods: {
      hideCurrentMarker() {
        if (this.selectionInfo && this.selectionInfo.marker) {
          this.selectionInfo.marker.setMap(null);
        }
      },
      closeInfoWindow() {
        this.hideCurrentMarker();
        this.selectionInfo = null;
      },
      onMapReady() {
        const overlay = new google.maps.KmlLayer({
            url: 'https://www.google.com/maps/d/kml?forcekml=1&mid=' + this.layerId + '&__v=' + this.layerCacheVersion,
            map: this.$refs.map.$_map,
            suppressInfoWindows: true,
        });

        overlay.addListener('click', kmlEvent => {
          this.hideCurrentMarker();

          const selectionMarker = new google.maps.Marker({
            position: kmlEvent.latLng,
            map: this.$refs.map.$_map,
            icon: '/assets/img/map-marker.svg',
          });

          this.selectionInfo = {
            title: kmlEvent.featureData.name,
            content: kmlEvent.featureData.description,
            marker: selectionMarker,
          }
        });

        this.$refs.map.$_map.addListener('click', evt => {
          this.closeInfoWindow();
        });
      }
    }
  };
</script>

<style lang="scss">
  @import 'settings';

  .c-custom-layer-map {
    position: relative;
  }

  .c-custom-layer-map__map,
  .c-custom-layer-map__map .map-view {
    width: 100%;
    min-height: 300px;

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

  .c-custom-layer-map-infowindow {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40vh;

    @include breakpoint(large) {
      width: $global-width;
      height: 100%;
      left: 50%;
      margin-left: -0.5 * $global-width;
    }
  }

  .c-custom-layer-map-infowindow__container {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.8);

    @include breakpoint(large) {
      height: 70%;
      width: 20rem;
    }
  }

  .c-custom-layer-map-infowindow__body {
    position: relative;
    padding: 1.5rem;
    height: 100%;

    @include breakpoint(small down) {
      img {
        max-height: 120px;
      }
    }
  }

  .c-custom-layer-map-infowindow__content {
    height: 100%;
    overflow-y: scroll;
  }

  .c-custom-layer-map-infowindow__close {
    position: absolute;
    top: .5rem;
    right: .5rem;
    z-index: 3;
  }
</style>
