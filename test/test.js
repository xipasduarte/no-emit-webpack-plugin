const del = require('del');
const path = require('path');
const test = require('ava');
const webpack = require('webpack');
const NoEmitPlugin = require('../index');

const baseConfig = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, 'fixtures/main.js'),
    other: path.resolve(__dirname, 'fixtures/other.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
  }
};

const cleanup = async (t) => {
  try {
    await del(path.resolve(__dirname, '../dist'));
  } catch (err) {
    t.fail();
  }
};

test.beforeEach(cleanup);
test.afterEach(cleanup);

test.cb('remove all outputs', (t) => {
  const config = Object.assign(
    baseConfig,
    {
      plugins: [new NoEmitPlugin()]
    }
  );

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
    } else if (stats.hasErrors()) {
      t.end(stats.toString());
    }

    const files = stats.toJson().assets.map((file) => file.name);
    t.true(files.length === 0);
    t.end();
  });
});

test.cb('remove an output file using string option', (t) => {
  const config = Object.assign(
    baseConfig,
    {
      plugins: [new NoEmitPlugin('other.js')]
    }
  );

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
    } else if (stats.hasErrors()) {
      t.end(stats.toString());
    }

    const files = stats.toJson().assets.map((file) => file.name);
    t.true(files.length === 1);
    t.true(files.indexOf('main.js') !== -1);
    t.true(files.indexOf('other.js') === -1);
    t.end();
  });
});

test.cb('remove an output file using array option', (t) => {
  const config = Object.assign(
    baseConfig,
    {
      plugins: [
        new NoEmitPlugin(['other.js']),
      ],
    }
  );

  webpack(config, (err, stats) => {
    if (err) {
      t.end(err);
    } else if (stats.hasErrors()) {
      t.end(stats.toString());
    }

    const files = stats.toJson().assets.map((file) => file.name);
    t.true(files.length === 1);
    t.true(files.indexOf('main.js') !== -1);
    t.true(files.indexOf('other.js') === -1);
    t.end();
  });
});
