<template>
<div  @click="onFileEntryClick($event)"
      @dblclick="onFileEntryDblClick()"
      class="unselectable">
  <div class="col-5 filename d-flex align-items-center">
    <i v-if="file.icon" :class="file.icon"></i>
    <i v-else :class="getIcon(file.type)"></i>
    <div @click="onFilenameClick()" class="w-100"> 
      <input  v-if="editingFilename"
              v-focus-on-create
              type="text"
              class="form-control form-control-sm file-name"
              @focus="$event.target.select()"
              @blur="onFilenameBlur($event.target.value)"
              :value="file.name">
      <div  v-else
            class="file-name unselectable d-flex align-items-center">
        <h5>{{ file.name}}</h5>
      </div>
    </div>
  </div>
  <div class="col-2 d-flex align-items-center">
    <h6 class="text-medium">3/6/20  12:35 PM</h6>
  </div>
  <div class="col-1 d-flex align-items-center">
    <h6 class="text-medium">3 KB</h6>
  </div>
  <div class="col-2 d-flex align-items-center">
    <h6 class="text-medium">{{ file.type }}</h6>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'file-entry',
  props: {
    file: {
      required: true,
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      'getIcon'
    ])
  },
  data () {
    return {
      editingFilename: false,
      clickEditTimer: null,
      clickEditFileName: false,
    }
  },
  methods: {
    ...mapActions([
      'goto',
      'renameFile'
    ]),
    onFilenameClick () {
      if (this.file.protected) return

      if (!this.clickEditFileName) {
        this.clickEditTimer = setTimeout(
          () => this.allowClickEditFilename(),
          300
        )
      } else {
        this.$emit('editing-filename')
        this.editingFilename = true
      }
    },
    allowClickEditFilename () {
      this.clickEditFileName = true
      this.clickEditTimer = setTimeout(
        () => this.disableClickEditFilename(),
        750
      )
    },
    disableClickEditFilename () {
      this.clickEditFileName = false
      this.clickEditTimer = null
    },
    onFilenameBlur (name) {
      this.$emit('done-editing-filename')
      this.editingFilename = false
      this.clickEditFileName = false
      this.renameFile({ fileId: this.file.id, name: name })
    },
    onFileEntryClick (ev) {
      if (!this.editingFilename) {
        this.$emit('file-click', { clickEvent: ev, file: this.file.id })
      }
    },
    onFileEntryDblClick () {
      if (!this.editingFilename) {
        this.editingFilename = false
        clearTimeout(this.clickEditTimer)
        this.clickEditFileName = false
        this.goto(this.file.id)
      }
    },
  },
  mounted () {
    //this.editingFilename = true
  }
}

</script>
<style lang="scss" scoped>
.filename {
  i {
    font-size: 1.15rem;
    width: 1.25em;
    margin-right: .3em;
    text-align: center;
  }
}
.file-name {
  font-size: 1.25rem;
  padding-bottom: 0;
  padding: 0 .35em;
  height: 1.75em;
  min-width: 150px;
  &:focus {
    box-shadow: 0 0 0 .2rem rgba($primary, .65);
    background: $body-bg;
  }
}
</style>