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

const gatherAllAssets = (entrypoints) => {
  const keys = entrypoints instanceof Map ?
    Array.from(entrypoints.keys()) :
    Object.keys(entrypoints);
  return keys.map((asset) => `${asset}.js`);
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

      // Remove all assets when none are specified.
      if (this.options === false) {
        this.options = gatherAllAssets(compilation.entrypoints);
      }

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

      callback();
    });
  }
}

module.exports = NoEmitPlugin;
