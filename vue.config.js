module.exports = {
  publicPath: '',
  devServer: {
    port: 8082
  },
  configureWebpack: config => {
    config.target = 'electron-renderer'
  }
};
