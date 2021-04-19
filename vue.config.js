
process.env.VUE_APP_DE_PLAYER_ENV = process.argv.includes('build') ? 'prod' : 'dev';

module.exports = {
  publicPath: './',
  devServer: {
    open: false,
    port: 8989,
    https: false,
    hot: true,
    inline: true,
    hotOnly: false,
    // proxy: {},
  }
};
