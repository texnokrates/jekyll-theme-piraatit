/**
 * Webpack config which handles following:
 * - CSS bundle build.
 * - JS bundle build (including vendor libs).
 */

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
    const isExtension = (filename, ext) => filename.endsWith('.' + ext);
    const isJS = (filename) => isExtension(filename, 'js');
    const isCSS = (filename) => isExtension(filename, 'css');
    const isOther = (filename) => ! isJS(filename) && ! isCSS(filename);

    compiler.hooks.done.tap('ExportWebpackHashPlugin', (stats) => {
      const output = stats.compilation.chunks.reduce((acc, current) => {
        const jsFiles = current.files.filter(isJS);
        const cssFiles = current.files.filter(isCSS);
        const otherFiles = current.files.filter(isOther);
        return {
          js: [...acc.js, ...jsFiles],
          css: [...acc.css, ...cssFiles],
          other: [...acc.other, ...otherFiles]
        }
      }, {
        js: [],
        css: [],
        other: []
      });

      fs.writeFileSync(this.options.filepath, JSON.stringify({
        hash: stats.hash,
        manifest: {
          js: output.js,
          css: output.css,
          other: output.other
        }
      }));
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

    new VueLoaderPlugin(),
    /**
     * Creates CSS bundle out of SASS files.
     */
    new MiniCssExtractPlugin({
      filename: isProduction ? 'assets/js/main.[hash].css' : 'js/main.css',
      chunkFilename: "[id].css"
    }),

  ];

  if (isProduction) {
    /**
     * Write Webpack build hash to a _data/webpack.yml file.
     */
    plugins.push(new ExportWebpackHashPlugin({
      filepath: path.resolve(path.join(paths.src, '_data', 'webpackManifest.json')),
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
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [
        'babel-loader',
      ],
    },
    {
      test: /\.scss$/,
      use: [
        ...(isProduction ? [MiniCssExtractPlugin.loader]: ['vue-style-loader']),
        {
          loader: 'css-loader',
          options: {
            autoprefixer: false,
            sourceMap: true,
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: isProduction,
            ident: 'postcss',
            plugins: () => [
              autoprefixer({
                browsers: [
                  'last 3 version',
                  'ie >= 10',
                ],
              })
            ]
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: isProduction,
            includePaths: [
              path.resolve(paths.src, '_sass'),
              path.resolve(paths.src, 'node_modules'),
            ]
          }
        },
      ]
    },
    {
      test: /\.(png|gif|jpg)$/,
      include: paths.images,
      use: 'url-loader?limit=20480&name=assets/js/[name]-[hash].[ext]',
    },
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
      minimize: isProduction,
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
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.vue'],
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
