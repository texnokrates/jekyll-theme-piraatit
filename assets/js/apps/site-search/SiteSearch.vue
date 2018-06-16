<template>
  <v-autocomplete
    class="autocomplete"
    v-model="item"
    :input-attrs="{'class': 'autocomplete__input'}"
    :items="items"
    :get-label="getLabel"
    :component-item="itemTemplate"
    :auto-select-one-item="false"
    :wait="0"
    :min-len="0"
    @item-selected="onItemSelected"
    @update-items="onUpdateItems"></v-autocomplete>
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
  }

  .v-autocomplete,
  .v-autocomplete-input-group {
    display: inline-block;
  }

  .v-autocomplete-list {
    position: absolute;
    z-index: 9999;
    width: 100%;
    min-width: 400px;
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
    border: $input-border;
  }

  .v-autocomplete-list-item {
    cursor: pointer;
    background-color: $white;
    padding: .75em;
    border-bottom: $input-border;

    &:last-child {
      border-bottom: 0;
    }

    &:hover {
      background-color: $light-gray;
    }
  }
</style>

