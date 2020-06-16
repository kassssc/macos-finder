module.exports = {
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'macOS Finder'
      return args
    })
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/styles/global.scss';
        `
      }
    }
  }
};