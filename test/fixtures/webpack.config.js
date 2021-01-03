const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  cache: false,
  entry: {
    style: path.resolve(__dirname, 'style.css'),
    main: path.resolve(__dirname, 'main.js'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.css/iu,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
      ],
    }],
  },
  plugins: [new MiniCssExtractPlugin()],
};
