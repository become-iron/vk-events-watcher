const CircularDependencyPlugin = require('circular-dependency-plugin')


if (!parseInt(process.env.VUE_APP_VK_APPLICATION_ID, 10)) {
  throw new Error('VK application ID is not set')
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vk-events-watcher/'
    : '/',
  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  configureWebpack: {
    plugins: [
      new CircularDependencyPlugin({
        exclude: /node_modules/u,
        failOnError: true,
        cwd: process.cwd()
      })
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
}
