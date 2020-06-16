import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  fs: {
    0: {
      name: 'Home',
      type: 'Folder',
      icon: 'fas fa-home',
      protected: true,
      parent: null,
      children: [
        1, 2, 3, 4, 5, 6, 9, 10, 11
      ]
    },
    1: {
      name: 'Applications',
      type: 'Folder',
      icon: 'fab fa-app-store-ios',
      protected: true,
      parent: 0,
      children: [

      ]
    },
    2: {
      name: 'Documents',
      type: 'Folder',
      icon: 'fas fa-file-alt',
      protected: true,
      parent: 0,
      children: [
        7
      ]
    },
    3: {
      name: 'Pictures',
      type: 'Folder',
      icon: 'fas fa-camera',
      protected: true,
      parent: 0,
      children: [

      ]
    },
    4: {
      name: 'Desktop',
      type: 'Folder',
      icon: 'fas fa-desktop',
      protected: true,
      parent: 0,
      children: [

      ]
    },
    5: {
      name: 'Downloads',
      type: 'Folder',
      icon: 'fas fa-file-download',
      protected: true,
      parent: 0,
      children: [

      ]
    },
    6: {
      name: 'iCloud Drive',
      type: 'Folder',
      icon: 'fas fa-cloud',
      protected: true,
      parent: 0,
      children: [

      ]
    },
    7: {
      name: 'My Vacations',
      type: 'Folder',
      protected: false,
      parent: 2,
      children: [
        8
      ]
    },
    8: {
      name: 'Phuket Trip 2020',
      type: 'Folder',
      protected: false,
      parent: 7,
      children: [
        
      ]
    },
    9: {
      name: 'Folder 9',
      type: 'Folder',
      protected: false,
      parent: 0,
      children: [
        
      ]
    },
    10: {
      name: 'Folder 10',
      type: 'Folder',
      protected: false,
      parent: 0,
      children: [
        
      ]
    },
    11: {
      name: 'File 11',
      type: 'File',
      protected: false,
      parent: 0,
      children: [
        
      ]
    },
    99999: {
      name: 'Macbook Pro',
      type: 'Folder',
      icon: 'fas fa-laptop',
      protected: true,
      parent: null,
      children: [
        
      ]
    },
    999999: {
      name: 'External SSD',
      type: 'Folder',
      icon: 'fas fa-hdd',
      protected: true,
      parent: null,
      children: [
        
      ]
    },
    9999999: {
      name: 'Search',
      type: 'Folder',
      icon: 'fas fa-search',
      protected: true,
      parent: null,
      children: [
        
      ]
    }
  },
  fileIdCounter: 1000,
  tabs: [ 0, 8, 3 ],
  activeTab: 0,
  sidebar: [
    {
      name: 'Favorites',
      items: [ 0, 1, 2, 3, 4, 5 ]
    },
    {
      name: 'iCloud',
      items: [ 6 ]
    },
    {
      name: 'Locations',
      items: [ 99999, 999999 ]
    }
  ],
  icons: {
    Folder: 'fas fa-folder text-primary',
    File: 'fas fa-file'
  }
}

const getters = {
  sidebar: state => {
    return state.sidebar
  },
  activeTab: state => {
    return state.activeTab
  },
  tabs: state => {
    return state.tabs
  },
  getFile: state => id => {
    return state.fs[id]
  },
  activeDir: state => {
    return state.fs[state.tabs[state.activeTab]]
  },
  activeDirId: state => {
    return state.tabs[state.activeTab]
  },
  activeDirChildren: state => {
    return state.fs[state.tabs[state.activeTab]].children.map(
      childId => { return { ...state.fs[childId], id: childId } }
    )
  },
  activeDirFullPath: state => {
    let paths = []
    let parent = state.fs[state.tabs[state.activeTab]].parent
    if (parent === null) return paths
    while (parent !== null) {
      paths.unshift({file: parent, name: parent === 0? '~' : state.fs[parent].name})
      parent = state.fs[parent].parent
    }
    return paths
  },
  getIcon: state => type => {
    return state.icons[type]
  }
}

const mutations = {
  newTab: (state, newTab) => {
    state.tabs.push(newTab)
  },
  closeTab: (state, idx) => {
    state.tabs.splice(idx, 1)
    if (state.activeTab >= state.tabs.length) {
      state.activeTab = state.tabs.length - 1
    }
  },
  switchTab: (state, idx) => {
    state.activeTab = idx
  },
  goto: (state, file) => {
    if (state.fs[file].type !== 'Folder') return
    const newTabs = [...state.tabs]
    newTabs[state.activeTab] = file
    state.tabs = newTabs
  },
  addChild: (state, { parent, child }) => {
    Vue.set(state.fs, state.fileIdCounter, child)
    state.fs[parent].children.push(state.fileIdCounter)
    state.fileIdCounter++
  },
  renameFile: (state, { fileId, name }) => {
    Vue.set(state.fs[fileId], 'name', name)
  },
  moveFile: (state, { files, destId }) => {
    files.forEach( file => {
      // remove from old parent
      const oldParentChildren = state.fs[state.fs[file].parent].children
      oldParentChildren.splice(oldParentChildren.indexOf(file), 1)
      // set new parent of file
      Vue.set(state.fs[file], 'parent', destId)
      // add as child to new parent
      state.fs[destId].children.push(file)
    })
  }
}

const actions = {
  newTab: (context, tab) => {
    const newTab = tab === undefined? 0 : tab
    context.commit('newTab', newTab)
  },
  closeTab: (context, idx) => {
    context.commit('closeTab', idx)
  },
  switchTab: (context, idx) => {
    context.commit('switchTab', idx)
  },
  goto: (context, file) => {
    context.commit('goto', file)
  },
  newFolder: (context, parent) => {
    context.commit(
      'addChild',
      {
        parent: parent,
        child: {
          name: 'New Folder',
          type: 'Folder',
          protected: false,
          parent: parent,
          children: []
        }
      }
    )
  },
  newFile: (context, parent) => {
    context.commit(
      'addChild',
      {
        parent: parent,
        child: {
          name: 'New File',
          type: 'File',
          protected: false,
          parent: parent,
          children: []
        }
      }
    )
  },
  renameFile: (context, { fileId, name }) => {
    context.commit(
      'renameFile',
      { fileId, name }
    )
  },
  moveFile: (context, { files, destId }) => {
    context.commit(
      'moveFile',
      { files, destId }
    )
  },
  deleteFile: (context, fileId) => {
    
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
