module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        directories: {
          buildResources: 'assets'
        }
      }
    }
  }
}
