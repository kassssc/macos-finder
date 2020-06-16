<template>
<div  id="finder"
      class="d-flex flex-column unselectable"
      @mouseup="endDragSelect($event)"
      @mouseleave="endDragSelect($event)"
      @contextmenu.prevent.stop="onFinderViewRightClick($event)">
  <div  id="toolbar"
        class="w-100 d-flex justify-content-between align-items-center">
    <div class="d-flex w-100">
      <button class="btn btn-toolbar mr-1">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="btn btn-toolbar mr-3">
        <i class="fas fa-chevron-right"></i>
      </button>
      <button class="btn btn-toolbar mr-3"
              :disabled="activeDir.parent === null"
              @click="goto(activeDir.parent)">
        <i class="fas fa-chevron-up"></i>
      </button>
    </div>
    <div class="d-flex w-100 justify-content-end">
      <button class="btn btn-toolbar mr-2"
              @click="newFile(activeDirId)">
        <i class="fas fa-file-medical"></i>
      </button>
      <button class="btn btn-toolbar mr-2"
              @click="newFolder(activeDirId)">
        <i class="fas fa-folder-plus"></i>
      </button>
      <button class="btn btn-toolbar mr-2">
        <i class="fas fa-share"></i>
      </button>
      <button class="btn btn-toolbar">
        <i class="far fa-trash-alt"></i>
      </button>
      <div  class="search-bar local ml-3">
        <i class="fas fa-search search-icon"></i>
        <input  class="form-control"
                type="text"
                placeholder="Search current directory">
      </div>
    </div>
  </div>
  <div  id="header"
        class="d-flex justify-content-between align-items-center w-100 pl-2">
    <div class="d-flex justify-content-between align-items-center">
      <div class="curr-folder-name d-flex align-items-center">
        <i  v-if="activeDir.icon"
            :class="activeDir.icon"></i>
        <h3 class="text-heavy no-wrap mr-3">{{ activeDir.name }}</h3>
      </div>
    </div>
    <div  id="path"
          class="d-flex no-wrap mr-2">
      <div  v-for="path of activeDirFullPath"
            :key="path.file"
            class="d-flex"
            @click="goto(path.file)">
        <h6 class="path-btn">{{ path.name }}</h6>
        <h6>/</h6>
      </div>
    </div>
  </div>
  <div  id="files"
        class="pl-2">
    <div  id="sortbar"
          class="row pt-1 pb-2">
      <div class="col-5 d-flex align-items-center">
        <h6 class="text-muted">Name</h6>
      </div>
      <div class="col-2 d-flex align-items-center">
        <h6 class="text-muted">Date Modified</h6>
      </div>
      <div class="col-1 d-flex align-items-center">
        <h6 class="text-muted">Size</h6>
      </div>
      <div class="col-2 d-flex align-items-center">
        <h6 class="text-muted">Kind</h6>
      </div>
    </div>
    <div  v-for="(file, idx) of activeDirChildren"
          :key="idx"
          :id="`file-${file.id}`"
          class="file-entry"
          :class="{'selected': fileSelected(file.id)}"
          :draggable="!file.protected && !editingFilename"
          @dragstart="onFileDrag($event, file)"
          @dragend="onFileDragEnd($event)"
          @contextmenu.prevent.stop="onFileRightClick($event, file.id)">
      <div  v-if="isDragging && file.type == 'Folder' && !fileSelected(file.id)"
            class="zone"
            @dragover.prevent
            @dragenter.prevent.stop="onFileDragEnter($event, file.id)"
            @dragleave.prevent.stop="onFileDragLeave($event, file.id)"
            @drop="onFileDrop($event, file)" />
      <div  v-if="dragSelecting"
            class="zone"
            @mouseenter="dragSelectMouseenter($event, file.id)" />
      <FileEntry
        class="row"
        :file="file"
        @file-click="onFileClick($event, idx)"
        @editing-filename="editingFilename = true"
        @done-editing-filename="editingFilename = false" />
    </div>
  </div>
  <div  class="zone selectzone"
        @click="clearSelection()"
        @mousedown="startDragSelect($event)" />
  <VueContext ref="generalmenu"
              class="contextmenu">
    <li>New Tab</li>
    <li>New File</li>
    <li>New Folder</li>
  </VueContext>
  <VueContext ref="filemenu"
              class="contextmenu">
    <li v-if="selectedFiles.length <= 0">New Tab</li>
    <li v-else>Open in New Tab</li>
    <li>Copy</li>
    <li>Delete</li>
    <li>New File</li>
    <li>New Folder</li>
  </VueContext>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { VueContext } from 'vue-context'
import FileEntry from './FileEntry'

export default {
  name: 'finder-view',
  components: { 
    FileEntry,
    VueContext
  },
  computed: {
    ...mapGetters([
      'activeDir',
      'activeDirId',
      'activeDirChildren',
      'activeDirFullPath',
      'getIcon'
    ])
  },
  data () {
    return {
      selectedFiles: [],
      dragSelecting: false,
      isDragging: false,
      editingFilename: false,
    }
  },
  watch: {
    activeDir (val) {
      this.selectedFiles = []
    }
  },
  methods: {
    ...mapActions([
      'goto',
      'newFolder',
      'newFile',
      'moveFile'
    ]),
    onFileClick ({ clickEvent, file }, idx) {
      if (clickEvent.metaKey) {
        this.toggleFileSelection(file)
      } else {
        if (this.fileSelected(file) && !this.selectedFiles.length > 1) {
          this.selectedFiles = []
        } else {
          this.selectedFiles = [file]
        }
      }
    },
    toggleFileSelection (file) {
      if (this.fileSelected(file)) {
        this.selectedFiles.splice(this.selectedFiles.indexOf(file), 1)
      } else {
        this.selectedFiles.push(file)
      }
    },
    fileSelected (file) {
      return this.selectedFiles.indexOf(file) !== -1
    },
    onFileDrag (ev, file) {
      this.isDragging = true
      if (!this.fileSelected(file.id)) {
        this.selectedFiles = []
      }
      if (this.selectedFiles.length <= 0) {
        this.selectedFiles.push(file.id)
      }
      ev.dataTransfer.setData('text/plain', JSON.stringify(this.selectedFiles))
      const ghost = document.createElement('span')
      ghost.id = 'drag-ghost'
      ghost.innerHTML = this.dragGhostTemplate(file)
      document.body.appendChild(ghost)
      ev.dataTransfer.setDragImage(ghost, 50, 100)
    },
    onFileDragEnd (ev) {
      this.isDragging = false
      const ghost = document.getElementById('drag-ghost')
      if (ghost.parentNode) {
        ghost.parentNode.removeChild(ghost)
      }
    },
    onFileDrop (ev, file) {
      if (file.type !== 'Folder') return
      const entry = document.getElementById(`file-${file.id}`)
      entry.classList.remove('dragover')
      const src = JSON.parse(ev.dataTransfer.getData('text/plain'))
      this.moveFile({ files: src, destId: file.id })
    },
    onFileDragEnter (ev, file) {
      const entry = document.getElementById(`file-${file}`)
      entry.classList.add('dragover')
    },
    onFileDragLeave (ev, file) {
      const entry = document.getElementById(`file-${file}`)
      entry.classList.remove('dragover')
    },
    dragGhostTemplate (file) {
      if (this.selectedFiles.length <= 1) {
        return `
          <h5>
            <i class="mr-2 ${file.icon? file.icon : this.getIcon(file.type)}"></i>
          </h5> 
          <h5>${file.name}</h5>
        `
      }
      return `
        <h5>
          <i class="fas fa-archive text-primary mr-2"></i>
        </h5>
        <h5>${this.selectedFiles.length} items</h5>
      `
    },
    startDragSelect (ev) {
      this.dragSelecting = true
      this.clearSelection()
    },
    endDragSelect (ev) {
      this.dragSelecting = false
    },
    dragSelectMouseenter (ev, file) {
      if (!this.dragSelecting) return
      this.toggleFileSelection(file)
    },
    clearSelection () {
      this.selectedFiles = []
    },
    onFileRightClick (ev, fileId) {
      if (!this.fileSelected(fileId)) {
        this.selectedFiles = [fileId]
      }
      this.$refs.filemenu.open(ev)
    },
    onFinderViewRightClick (ev) {
      this.$refs.filemenu.open(ev)
    }
  }
}
</script>

<style lang="scss" scoped>
#finder {
  background: $body-bg;
  height: 100%;
  padding: 1rem;
  border-bottom-right-radius: $border-radius;
  position: relative;
  * { z-index: 1; }
  .selectzone {
    z-index: 0;
  }
}
#path {
  color: $medium;
}
#toolbar {
  margin-bottom: 1rem;
}
.curr-folder-name {
  i {
    font-size: 1.5em;
    margin-right: .75em;
  }
}
#sortbar {
  border-bottom: 1px solid $accent-light;
}
.file-entry {
  border-bottom: 1px solid $accent-light;
  cursor: pointer;
  position: relative;
  &:hover {
    background: $accent-light;
  }
  &.selected {
    background: $accent;
  }
  &.dragover {
    background: rgba($primary, .4);
  }
  .zone {
    z-index: 10;
  }
}
.zone {
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
}
</style>