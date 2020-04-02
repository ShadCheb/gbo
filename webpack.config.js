
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  entry: {
    main: './src/main/main.js',
    auth: './src/auth/auth.js',
    admin: './src/admin/admin.js',
    service: './src/service/service.js',
    metan: './src/service/service-metan.js',
    dizel: './src/service/service-dizel.js',
    registr: './src/service/service-register.js',
    variator: './src/service/service-variator.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
          test: /\.js$/,
          loader: 'babel-loader',
      },
      {
          test: /\.css$/,
          use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new WebpackMd5Hash()
  ]
};
