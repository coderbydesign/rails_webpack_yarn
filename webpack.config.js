'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const fs = require('fs');
const prod = process.argv.indexOf('-p') !== -1;
const CSSOutputTemplate = prod ? 'stylesheets/[name]-[hash].css' : 'stylesheets/[name].css';
const JSOutputTemplate = prod ? 'javascripts/[name]-[hash].js' : 'javascripts/[name].js';

module.exports = {
  context: __dirname + '/app/assets',

  entry: {
    application: ['./javascripts/application.js', './stylesheets/application.css'],
    some_feature: ['./javascripts/some_feature.js', './stylesheets/some_feature.scss']
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
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
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
    },
    function() {
      // delete old outputs
      this.plugin('compile', function() {
        let basePath = __dirname + '/public';
        let paths = ['/javascripts', '/stylesheets'];

        for (let x = 0; x < paths.length; x++) {
          const assetPath = basePath + paths[x];

          fs.readdir(assetPath, function(err, files) {
            if (files === undefined) {
              return;
            }

            for (let i = 0; i < files.length; i++) {
              fs.unlinkSync(assetPath + '/' + files[i]);
            }
          });
        }
      });
    }
  ]
}
