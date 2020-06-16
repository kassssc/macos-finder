<template>
  <div  id="window"
        class="d-flex">
    <Sidebar />
    <div  id="content"
          class="d-flex flex-column">
      <Tabs />
      <FinderView />
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Tabs from './Tabs'
import FinderView from './FinderView'

export default {
  name: 'finder-window',
  components: {
    Sidebar,
    Tabs,
    FinderView
  },
}
</script>

<style scoped lang="scss">
#window {
  margin: auto;
  width: 1200px;
  height: 800px;
  border-radius: $border-radius;
  background: rgba(#303030, .6);
  backdrop-filter: blur(40px);
}
#content {
  width: 100%;
  height: 100%;
}
</style>
