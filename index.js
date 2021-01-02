const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    options: {
      type: 'array',
    },
  },
  additionalProperties: false
};

class NoEmitPlugin {
  constructor(options) {
    if (options === undefined) {
      this.options = false;
      return;
    }

    if (this.isString(options)) {
      options = [options];
    }

    validate(schema, { options }, { name: 'No Emit Plugin' });

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
          if (!this.isString(asset)) {
            compilation.errors.push(Error(`All bundle names in the options must be strings. ${JSON.stringify(asset)} is not a string.`));
            return;
          }

          if (compilation.assets[asset] === undefined) {
            compilation.warnings.push(`Output asset does not exist: ${asset}`);
            return;
          }

          delete compilation.assets[asset];
        });
      }

      callback();
    });
  }
}

module.exports = NoEmitPlugin;
