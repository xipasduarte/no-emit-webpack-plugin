const { validate } = require('schema-utils');

const schema = {
  type: 'array',
  additionalProperties: false
};

class NoEmitPlugin {
  constructor(options) {
    if (options === undefined) {
      options = false;
    } else if (this.isString(options)) {
      options = [ options ];
    } else {
      validate(schema, options, 'No Emit Plugin');
    }

    this.options = options;
  }

  isString(target) {
    return typeof target === 'string';
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('NoEmitPlugin', (compilation, callback) => {
      if (!this.options) {
        const keys = compilation.entrypoints instanceof Map ?
          Array.from(compilation.entrypoints.keys()) :
          Object.keys(compilation.entrypoints);
        keys.forEach((asset) => {
          delete compilation.assets[`${asset}.js`];
        });
      } else {
        this.options.forEach((asset) => {
          // TODO: Display message when the asset name is not present.
          if (this.isString(asset)) {
            delete compilation.assets[asset];
          } else {
            console.log('All bundle names in the options must be strings. "' + asset + '" is not a string.');
          }
        });
      }

      callback();
    });
  }
}

module.exports = NoEmitPlugin;
