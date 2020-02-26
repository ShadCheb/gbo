
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/main/main.js',
  },
  output: {
    filename: '[name].js',    
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
          test: /\.js$/,
          loader: 'babel-loader'
      },
      {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
      },
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  }
};
