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

    // TODO: Validate that all options are strings.

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
        if (this.options === false) {
          this.options = Object.keys(assets);
        }

        // Remove selected assets.
        this.options.forEach((file) => compilation.deleteAsset(file));
      });
    });
  }
}

module.exports = NoEmitPlugin;
