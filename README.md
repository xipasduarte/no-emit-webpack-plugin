# No Emit WebPack Plugin

[![Build Status](https://travis-ci.org/xipasduarte/no-emit-webpack-plugin.svg?branch=master)](https://travis-ci.org/xipasduarte/no-emit-webpack-plugin)

Stop an asset from being emitted by the webpack compiler.

## Install

**Webpack 5**

```bash
npm install --save-dev no-emit-webpack-plugin
```

```bash
yarn add -D no-emit-webpack-plugin
```

**Webpack 4**

```bash
npm install --save-dev no-emit-webpack-plugin@3.0.0
```

```bash
yarn add -D no-emit-webpack-plugin@3.0.0
```

## Options

> :warning: By default, if you don't supply any options the bundles for all entry points will be removed.

```js
new NoEmitPlugin(options: string | array)
```

* If a `string` is supplied only one asset bundle will be removed.
* The array must be composed of elements with type `string` that will be matched with asset bundle names, and removed.

## Usage

This plugin is most useful when you are bundling assets that start from file types other than JavaScript, like styles for instance. With it you can remove the resulting file defined in the `output` option of your `webpack.config.js`.

Below is an example on how to remove the `style.js` file from the emitted assets. We'll use the [Mini CSS Extract Plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to generate the CSS asset.

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NoEmitPlugin = require('no-emit-webpack-plugin');

module.exports = {
  entry: {
    style: path.resolve(__dirname, 'style.css'),
    main: path.resolve(__dirname, 'main.js'),
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
}
```

## License

MIT © [Pedro Duarte](https://github.com/xipasduarte)
