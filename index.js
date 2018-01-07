const validateOptions = require('schema-utils');

const schema = {
  type: 'array',
  additionalProperties: false
};

class NoEmitPlugin {
  constructor(options) {
    if ( options === undefined ) {
      options = false;
    } else if (this.isString(options)) {
      options = [ options ];
    } else {
      validateOptions(schema, options, 'No Emit Plugin');
    }

    this.options = options;
  }

  isString(target) {
    return typeof target === 'string';
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      if (!this.options) {
        Object.keys(compilation.entrypoints).forEach((asset) => {
          delete compilation.assets[asset + '.js'];
        });
      } else {
        this.options.forEach((asset) => {
          if (this.isString(asset)) {
            delete compilation.assets[asset];
          }
        });
      }

      callback();
    });
  }
}

module.exports = NoEmitPlugin;
