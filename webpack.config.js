const TerserJSPlugin = require('terser-webpack-plugin');
const path = require('path');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const nodeExternals = require('webpack-node-externals');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  // externals: [nodeExternals()],
  entry: {
    main: './src/main/main.js',
    auth: './src/auth/auth.js',
    admin: './src/admin/admin.js',
    service: './src/service/service.js',
    metan: './src/service/service-metan.js',
    dizel: './src/service/service-dizel.js',
    register: './src/service/service-register.js',
    variator: './src/service/service-variator.js',
    propan: './src/service/service-propan.js',
    stock: './src/stock/stock.js',
    'stock-item': './src/stock/stock-item.js',
    contact: './src/contact/contact.js',
    work: './src/work/work.js',
    'work-item': './src/work/work-item.js',
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
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
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
      chunkFilename: '[id].css'
    }),
    new WebpackMd5Hash()
  ]
};
