<template>
  <div>
    <strong v-html="item.label"></strong>
    <em>{{ item.value }}</em>
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true },
    searchText: { required: true }
  }
}
</script>

<style lang="scss" scoped>
  @import 'settings';

  strong {
    display: block;
  }

  em {
    color: $dark-gray;
  }
</style>


