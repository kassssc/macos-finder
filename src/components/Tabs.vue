<template>
<div  v-if="tabs.length > 1"
      id="tabs"
      class="d-flex">
  <div  v-for="(tab, idx) of tabs"
        :key="idx"
        class="tab"
        :class="{'active': activeTab === idx}"
        draggable
        @dragstart="onTabDragstart($event, idx)"
        @click="switchTab(idx)">
    <h6>
      <i class="mr-1" :class="getFile(tab).icon"></i>
      {{ getFile(tab).name }}
    </h6>
    <button class="btn btn-x"
            @click.stop="closeTab(idx)">
      <i class="fas fa-times"></i>
    </button>
  </div>
  <button class="btn btn-new-tab"
          @click="newTab()">
    <i class="fas fa-plus"></i>
  </button>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'tabs',
  computed: {
    ...mapGetters([
      'activeTab',
      'tabs',
      'getFile',
    ])
  },
  data () {
    return {
      paths: [
        '~', 'Documents', 'My Stuff'
      ]
    }
  },
  methods: {
    ...mapActions([
      'newTab',
      'closeTab',
      'switchTab',
      'goto',
    ]),
    onTabDragstart (ev) {

    }
  }
}
</script>

<style lang="scss" scoped>
#tabs {
  height: $tab-height;
}
.tab {
  @include unselectable;
  width: 100%;
  padding-left: 1rem;
  padding-right: .5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(.active) {
    cursor: pointer;
    &:hover {
      background: $accent;
    }
  }
  &.active {
    background: $body-bg;
  }
  &:hover {
    .btn-x {
      opacity: 1;
    }
  }
  .btn-x {
    opacity: 0;
  }
}
</style>