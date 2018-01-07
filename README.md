# No Emit WebPack Plugin

Stop an asset from being emitted by the webpack compiler.

## Install

```bash
npm install --save-dev no-emit-webpack-plugin
```

## Usage

This plugin is most useful when you are bundling assets that start from file types other than JavaScript, like styles for instance. With it you can remove the resulting file difined in the `output` option of your `webpack.config.js`.

Below is an example on how to remove the `style.js` file from the emitted assets. We'll use the [Extract Text Plugin](https://webpack.js.org/plugins/extract-text-webpack-plugin/) to generate the CSS asset.

```js
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const NoEmitPlugin = require("no-emit-webpack-plugin");

module.exports = {
  entry: './src/style.scss',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new NoEmitPlugin()
  ]
}
```

## Options

> :warning: By default, if you don't supply any options the bundles for all entrypoints will be removed.

```js
new NoEmitPlugin(options: string | array)
```

* If a `string` is supplied only one asset bundle will be removed.
* The array must be composed of elements with type `string` that will be matched with asset bundle names, and removed.
