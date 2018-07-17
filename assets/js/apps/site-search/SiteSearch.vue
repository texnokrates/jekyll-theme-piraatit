<template>
  <div class="c-search c-top-bar__search-container">
    <v-autocomplete
      class="autocomplete"
      v-model="item"
      :input-attrs="{class: 'autocomplete__input c-search__input c-top-bar__search-input', placeholder: 'Hledaný výraz'}"
      :items="items"
      :get-label="getLabel"
      :component-item="itemTemplate"
      :auto-select-one-item="false"
      :wait="0"
      :min-len="0"
      @item-selected="onItemSelected"
      @update-items="onUpdateItems"></v-autocomplete>
    <button type="button" class="c-search__confirm c-top-bar__search-confirm"><i class="fa fa-search" aria-hidden="true"></i></button>
  </div>
</template>

<script>
import ItemTemplate from './SiteSearchItemTemplate.vue';

export default {
  name: 'SiteSearch',
  data () {
    return {
      item: null,
      items: [],
      itemTemplate: ItemTemplate
    }
  },
  methods: {
    getLabel (item) {
      return item.label;
    },
    onItemSelected(item) {
      // Redir
      window.location.href = item.value;
    },
    onUpdateItems(searchText) {
      this.items = this.allItems.filter(i => i.label.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
  },
  mounted() {
    this.$http.get('/api/search.json').then(resp => {
      this.allItems = this.items = resp.body.filter(i => !! i.label);
    });
  }
}
</script>

<style lang="scss">
  @import 'settings';

  .v-autocomplete {
    position: relative;
    width: 100%;
  }

  .v-autocomplete-list {
    position: absolute;
    z-index: 9999;
    width: 100%;
    top: 40px;
    min-width: 400px;
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
    border: 1px $dark-gray solid;
  }

  .v-autocomplete-list-item {
    color: $primary-color;
    cursor: pointer;
    background-color: $white;
    padding: .75em;
    border-bottom: 1px $dark-gray solid;

    &:last-child {
      border-bottom: 0;
    }

    &:hover,
    &.v-autocomplete-item-active {
      background-color: $light-gray;
    }
  }
</style>

