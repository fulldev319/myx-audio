const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const Dotenv = require('dotenv-webpack');
const WebpackBar = require('webpackbar');
const WebpackObfuscator = require('webpack-obfuscator');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function override(webpackConfig, env) {
  // enable Hot Module Replacement
  webpackConfig = rewireReactHotLoader(webpackConfig, env);

  // set aliases
  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias
    //'react-dom$': '@hot-loader/react-dom'
  };

  // disable source maps
  //webpackConfig.devtool = 'none';

  // disable linter
  webpackConfig.module.rules[1] = {};

  // load mjs modules
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto'
  });

  // plugins
  const environment = new Dotenv();
  const isObfuscate = environment['definitions']['process.env.OBFUSCATE'];
  webpackConfig.plugins.push(
    // new BundleAnalyzerPlugin(),
    environment,
    new WebpackBar({
      name: '📦  MYX Bundler',
      color: 'green',
      minimal: false,
      profile: true,
      fancy: true
    })
  );
  if (isObfuscate === `"true"`) {
    webpackConfig.plugins.push(
      new WebpackObfuscator(
        {
          rotateStringArray: true
        },
        [
          'src/shared/functions/ipfs/hls.js',
          'src/shared/functions/ipfs/upload2IPFS.js'
        ]
      )
    );
    webpackConfig.optimization.minimizer.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    );
  }
  return webpackConfig;
};
