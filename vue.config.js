const webpack = require('webpack');
const config = require('./compile-config')
// const isProd = process.env.NODE_ENV === "production";

process.env.VUE_APP_GOOGLE_API_KEY = config.googleApiOptions.apiKey

module.exports = {
  configureWebpack: {
    // Set up all the aliases we use in our app.
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  pwa: {
    name: 'JBs Dashboard',
    themeColor: '#172b4d',
    msTileColor: '#172b4d',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#172b4d'
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },
  // pluginOptions: {
  //   electronBuilder: {
  //     builderOptions: {
  //       appId: 'net.battlemoose.jbs-dashboard',
  //       publish: [
  //         {
  //           provider: 'generic',
  //           url: 'https://hughblackall.gitlab.io'
  //         }
  //       ],
  //       win: {
  //         target: ['nsis', 'zip'],
  //       },
  //     }
  //   }
  // }
};
