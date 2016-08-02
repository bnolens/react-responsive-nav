var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        loader : 'babel?cacheDirectory=true'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("bundle.css")
  ],
  sassLoader: {
    outputStyle: 'compressed'
  },
  entry: './src/app.jsx',
  output: {
    filename: 'bundle.js',
    path: 'bin'
  }
};
