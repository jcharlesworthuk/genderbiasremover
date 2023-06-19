const path = require('path');
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");
const webpack = require('webpack');

const getTypescriptHandler = function () {
  return {
    test: /\.tsx?$/, use: [
      {
        loader: 'babel-loader',
        options: {
          compact: true
        }
      },
      'ts-loader']
  };
}

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  devtool: 'source-map',
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
    }
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  module: {
    rules: [
      getTypescriptHandler(),
    ]
  },
  plugins: [
  ]
};