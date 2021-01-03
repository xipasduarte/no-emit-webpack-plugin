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
  constructor(options = []) {
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
    compiler.hooks.compilation.tap('NoEmitPlugin', (compilation) => {
      compilation.hooks.processAssets.tap({
        name: 'NoEmitPlugin',
        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        additionalAssets: true,
      }, (assets) => {
        // Put all assets in removal list.
        if (this.options.length === 0) {
          this.options = Object.keys(assets).filter((key) => key !== '*');
        }

        // Remove selected assets.
        this.options.forEach((file) => {
          if (!this.isString(file)) {
            compilation.errors.push(Error(`All bundle names in the options must be strings. ${JSON.stringify(file)} is not a string.`));
            return;
          }

          if (compilation.getAsset(file) === undefined) {
            compilation.warnings.push(`Output asset does not exist: ${file}`);
            return;
          }

          compilation.deleteAsset(file);
        });
      });
    });
  }
}

module.exports = NoEmitPlugin;
