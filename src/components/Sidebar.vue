<template>
<div  id="sidebar"
      class="d-flex flex-column">
  <div  id="window-controls"
        class="d-flex">
    <button class="btn window-ctrl-btn red"></button>
    <button class="btn window-ctrl-btn yellow"></button>
    <button class="btn window-ctrl-btn green"></button>
  </div>
  <div  id="global-search"
        class="search-bar">
    <i class="fas fa-search search-icon"></i>
    <input  class="form-control"
            type="text"
            placeholder="Search entire MacBook">
  </div>
  <div>
    <div  v-for="group of sidebar"
          :key="group.name"
          class="sidebar-section d-flex flex-column">
      <h6 class="mb-1 group-title">{{ group.name }}</h6>
      <button v-for="(item, idx) of group.items"
              :key="idx"
              class="btn btn-block btn-sidebar"
              :class="{'active': activeDirId === item}"
              @click="goto(item)">
        <i :class="getFile(item).icon"></i> {{ getFile(item).name }}
      </button>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'sidebar',
  computed: {
    ...mapGetters([
      'getFile',
      'sidebar',
      'activeDirId'
    ])
  },
  methods: {
    ...mapActions([
      'goto',
    ])
  }
}
</script>

<style lang="scss" scoped>
#sidebar {
  min-width: 235px;
  height: 100%;
  #global-search {
    margin: 1rem $sidebar-margin-x;
  }
  #window-controls {
    height: $tab-height;
    padding: .75rem $sidebar-margin-x;
    .window-ctrl-btn {
      margin-right: .6em;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      padding: 0;
      &.red { background: $red; }
      &.yellow { background: $yellow; }
      &.green { background: $green; }
    }
  }
  .sidebar-section {
    padding: 0 $sidebar-margin-x;
    margin-bottom: 1rem;
    .group-title {
      color: $accent-darker;
    }
  }
}
</style>