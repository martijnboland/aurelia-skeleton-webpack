var path = require('path');
var fileSystem = require('fs');
var webpack = require('webpack');
var AureliaContextPlugin = require('./webpack/AureliaContextPlugin');
var pkg = require('./package.json');

var vendorPackages = Object.keys(pkg.dependencies).filter(function(el) {
  return el.indexOf('font') === -1; // exclude font packages from vendor bundle
});
    
var createContextMap = function(fs, callback) {
  var contextMap = {};
  vendorPackages.forEach(function(moduleId) {
    var vendorPkgPath = path.resolve(__dirname, 'node_modules', moduleId, 'package.json');
    var vendorPkg = JSON.parse(fileSystem.readFileSync(vendorPkgPath, 'utf8'));
    contextMap[moduleId] = path.resolve(__dirname, 'node_modules', moduleId, vendorPkg.browser || vendorPkg.main);
  });
  callback(null, contextMap);
};    
    
module.exports = {
  devServer: {
    host: 'localhost',
    port: 3000
  },
  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './src/main'
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  plugins: [
    new AureliaContextPlugin(
      /aurelia-loader-context/, 
      path.resolve('./src'),
      createContextMap
    )
  ],
  resolve: {
    root: [
      path.resolve('./src'),
    ]
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: {stage: 0} }, 
      { test: /\.css?$/, loader: 'style!css' }, 
      { test: /\.html$/, loader: 'raw' },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.(png|gif|jpg)$/, loader: 'url-loader?limit=8192' },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff2" },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};