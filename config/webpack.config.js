/**
 * Webpack config which handles following:
 * - CSS bundle build.
 * - JS bundle build (including vendor libs).
 */

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootPath = '..';
const assetsSrcPath = path.join(__dirname, 'assets');

const paths = {
  src: path.join(__dirname, rootPath),
  dist: path.join(__dirname, rootPath, './_site'),
  js: path.join(__dirname, rootPath, './assets/js'),
};


class ExportWebpackHashPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.done.tap('ExportWebpackHashPlugin', (stats) => {
      const content = `hash: "${stats.hash}"`;
      fs.writeFileSync(this.options.filepath, content);
      console.log(`Webpack hash written to ${this.options.filepath}`);
    });
  }
}

/**
 * Get array of all plugins that should be used.
 * @param {boolean} isProduction Is this a production build?
 */
const getPlugins = (isProduction) => {
  const env = isProduction ? 'production' : 'development';
  const plugins = [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          /**
           * Automatically adds vendor prefixes to resulting CSS file.
           */
          autoprefixer({
            browsers: [
              'last 3 version',
              'ie >= 10',
            ],
          }),
        ],
        context: paths.src,
      },
      minimize: isProduction ? true : false,
      debug: isProduction ? false : true,
    }),
    /**
     * Expose jQuery
     */
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    /**
     * Creates CSS bundle out of SASS files.
     */
    // new ExtractTextPlugin({
    //   filename: isProduction ? 'assets/main.[hash].css' : 'main.[hash].css',
    //   allChunks: ! isProduction,
    // }),

  ];

  if (isProduction) {
    /**
     * Write Webpack build hash to a _data/webpack.yml file.
     */
    plugins.push(new ExportWebpackHashPlugin({
      filepath: path.resolve(path.join(paths.src, '_data', 'webpack.yml')),
    }));
  } else  {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins;
}

/**
 * Get array of all webpack rules to use for this build.
 * @param {boolean} isProduction Is this a production build?
 */
const getRules = (isProduction) => {
  return [
    {
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/],
      use: [
        'babel-loader',
      ],
    },
    {
      test: /\.(png|gif|jpg)$/,
      include: paths.images,
      use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
    },
    {
      test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
      include: paths.fonts,
      loader: 'url-loader',
      options: {
        limit: 50000,
        mimetype: 'application/font-woff',
        name: './assets/fonts/[name].[ext]',
        publicPath: '../',
      }
    },
    // {
    //   test: /\.scss$/,
    //   use: ExtractTextPlugin.extract({
    //     fallback: 'style-loader',
    //     use: [
    //       { loader: 'css-loader', options: { autoprefixer: false, sourceMap: true, importLoaders: 1 } },
    //       { loader: 'postcss-loader', options: { sourceMap: isProduction, plugins: () => []} },
    //       { loader: 'resolve-url-loader' },
    //       { loader: 'sass-loader', options: { sourceMap: isProduction } },
    //     ]
    //   }),
    // }
  ];
}

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production';
  const mode = argv.mode;

  console.log(`Running Webpack: ${mode}`);
  console.log(`Output to: ${paths.dist}`);

  return {
    mode,
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    context: paths.src,
    entry: {
      main: './assets/js/index.js',
    },
    output: {
      path: paths.dist,
      publicPath: isProduction ? '/' : 'http://localhost:3000/',
      filename: isProduction ? 'assets/js/main.[hash].js' : 'main.js',
    },
    module: {
      rules: getRules(isProduction)
    },
    /**
     * Extract vendor JS to a separate chunks so that clients do not need
     * to fetch it again when only our JS changes.
     */
    optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendor',
                  chunks: 'all'
              }
          }
      }
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        path.resolve(paths.src, 'node_modules'),
        path.resolve(paths.js),
      ],
    },
    plugins: getPlugins(isProduction),
    stats: {
      excludeAssets: [
        /.*assets\/img/,
        /.*assets\/fonts/,
        /.*assets\/icons/,
        /.*assets\/favicon/,
        /\.(png|jpg)$/
      ],
      modules: false,
      children: false,
    },
    devServer: {
      contentBase: isProduction ? './_site' : '.',
      historyApiFallback: true,
      port: 3000,
      compress: isProduction,
      inline: ! isProduction,
      hot: ! isProduction,
      host: '0.0.0.0',
      overlay: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        maxModules: 15,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        },
        exclude: [
          "node_modules",
          "*/assets/images",
          "*/assets/fonts",
        ]
      }
    }
  };
}
