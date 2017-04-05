'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const fs = require('fs');
const prod = process.argv.indexOf('-p') !== -1;
const CSSOutputTemplate = prod ? 'stylesheets/[name]-[hash].css' : 'stylesheets/[name].css';
const JSOutputTemplate = prod ? 'javascripts/[name]-[hash].js' : 'javascripts/[name].js';

module.exports = {
  context: __dirname + '/app/assets/javascripts',

  entry: {
    application: './application.js'
  },

  output: {
    path: __dirname + '/public',
    filename: JSOutputTemplate
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("css!sass")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(CSSOutputTemplate),
    function() {
      this.plugin('done', function(stats) {
        let output = "ASSET_FINGERPRINT = \"" + stats.hash + "\""
        fs.writeFileSync('config/initializers/fingerprint.rb', output, 'utf8');
      });
    }
  ]
}
