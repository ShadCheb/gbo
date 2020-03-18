
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
// const TerserJsPlugin = require('terser-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main/main.js',
    auth: './src/auth/auth.js',
    admin: './src/admin/admin.js',
  },
  output: {
    filename: '[name].js',    
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
          test: /\.js$/,
          loader: 'babel-loader',
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
    // new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // new HtmlWebpackPlugin({
    //   title: 'Development',
    // }),
    // new CleanWebpackPlugin(),
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  },
};
