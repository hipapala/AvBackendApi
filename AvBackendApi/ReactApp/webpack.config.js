var path = require('path');
var webpack = require('webpack');
 
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
		path: __dirname + "../wwwroot/dist",
    filename: "bundle.js",
    publicPath: '/'
	},
  module: {
    loaders: [   
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-3'],
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract("css-loader")
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=public/fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),    
    new ExtractTextPlugin('style.bundle.css'),
    // new webpack.optimize.UglifyJsPlugin({
    //   include: /\.min\.js$/,
    //   minimize: true
    // })
  ],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9463',
        secure: false,
        changeOrigin: true
      }
    }
  }
};
