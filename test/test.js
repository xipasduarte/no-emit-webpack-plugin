const del = require('del');
const path = require('path');
const test = require('ava');
const webpack = require('webpack');
const baseConfig = require('./fixtures/webpack.config');
const NoEmitPlugin = require('../index');

const cleanup = async (t) => {
  try {
    await del(path.resolve(__dirname, '../dist'));
  } catch (err) {
    t.fail();
  }
};

test.beforeEach(cleanup);
test.afterEach(cleanup);

test('fail when initializing with non string|array options', (t) => {
  try {
    new NoEmitPlugin({});
    t.fail();
  } catch {
    t.pass();
  }
});

test.cb('remove all outputs', (t) => {
  const config = {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      new NoEmitPlugin(),
    ],
  };

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
      return;
    }

    const files = stats.toJson().assets.map((file) => file.name);
    t.true(files.length === 0);
    t.end();
  });
});

test.cb('remove an output file using string option', (t) => {
  const config = {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      new NoEmitPlugin('style.js'),
    ],
  };

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
    }

    const files = stats.toJson().assets.map((file) => file.name);
    t.true(files.length === 2);
    t.true(files.indexOf('main.js') !== -1);
    t.true(files.indexOf('style.js') === -1);
    t.true(files.indexOf('style.css') !== -1);
    t.end();
  });
});

test.cb('remove an output file using array option', (t) => {
  const config = {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      new NoEmitPlugin(['style.js']),
    ],
  };

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
      return;
    }

    const files = stats.toJson().assets.map((file) => file.name);
    t.true(files.length === 2);
    t.true(files.indexOf('main.js') !== -1);
    t.true(files.indexOf('style.js') === -1);
    t.true(files.indexOf('style.css') !== -1);
    t.end();
  });
});

test.cb('add compile error when type option is different than string', (t) => {
  const config = {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      new NoEmitPlugin([{}]),
    ],
  };

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
      return;
    }

    t.true(stats.hasErrors());
    t.end();
  });
});

test.cb('add compile warning when file name is not in compilation.assets', (t) => {
  const config = {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      new NoEmitPlugin('not-found.js'),
    ],
  };

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
      return;
    }

    t.true(stats.toJson().warnings.length === 1);
    t.end();
  });
});
