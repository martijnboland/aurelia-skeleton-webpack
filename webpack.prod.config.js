var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var pkg = require('./package.json');

var outputFileTemplateSuffix = '-' + pkg.version;

module.exports = {
  entry: {
    main: [
      './src/main'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]' + outputFileTemplateSuffix + '.js',
    chunkFilename: '[id]' + outputFileTemplateSuffix + '.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      __APP_SRC__: JSON.stringify(path.resolve('./src'))
    }),
    new HtmlWebpackPlugin({
        title: 'Aurelia webpack skeleton - ' + pkg.version,
        template: 'index.prod.html',
        filename: 'index.html'
    })
  ],
  resolve: {
    root: [
      path.resolve('./'),
    ]
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/, query: {stage: 0} }, 
      { test: /\.css?$/, loader: 'style!css' }, 
      { test: /\.html$/, loader: 'raw' },
      { test: /\.(png|gif|jpg)$/, loader: 'url-loader?limit=8192' },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff2" },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};