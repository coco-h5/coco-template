let path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const externals = {
  vue: 'Vue'
};
const cdn = {
  // 生产环境
  build: {
    css: [],
    js: ['https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.12/vue.min.js']
  }
};
module.exports = {
  lintOnSave: false,
  devServer: {
    disableHostCheck: true
  },
  publicPath: './',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 100, // 换算的基数(设计图750的根字体为32)
            propList: ['*'], //可以从px更改为rem的属性。
            minPixelValue: 2 // 设置要替换的最小像素值。
          })
        ]
      }
    }
  },
  configureWebpack: config => {
    Object.assign(config, {
      externals: externals
    });
  },
  chainWebpack: config => {
    // 对vue-cli内部的 webpack 配置进行更细粒度的修改
    config.plugin('html').tap(args => {
      args[0].cdn = cdn.build;
      args[0].title = require('./src/package.json').data.title
      if (process.env.NODE_ENV === 'production') {
        args[0].minify.removeComments = false;
      }
      return args;
    });
  }
};
