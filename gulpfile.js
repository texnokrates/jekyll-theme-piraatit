const
  gulp = require('gulp'),
  run = require('gulp-run'),
  replace = require('gulp-replace'),
  del = require('del');


/**
 * Gem build pipeline.
 *
 * This gulpfile contains the build pipeline necessary for building and publishing
 * new jekyll-theme-pirati Gem versions. The process goes like this:
 *
 * 1) First, run the production build of the site. This ensures, Webpack build
 *    artifacts (JS and CSS files) are created in _site/assets/js and properly
 *    hashed.
 * 2) Next, temporary directory .gembuild is created.
 * 3) All the files of the new Gem are copied over to this temporary directory.
 *    This includes the Webpack artifacts too (to assets/js).
 * 4) JS include file in the build dir (.gembuild/_includes/js/main.html) is
 *    updated to include files from Webpack build. It now specifically includes
 *    the build artifacts along with their hashed filenames.
 * 5) gemspec file is copied over to the build dir.
 * 6) A `gem build` command is issued in the build directory and new gemfile
 *    is created.
 * 7) Gem file is pushed to the RubyGems repository.
 * 8) When everyting is done, build dir is deleted once again.
 */


const packageFile = require('./package.json');

/**
 * List of files to be included in the Ruby Gem.
 */
const GEM_FILES = [
  './assets/**/*',
  '!assets/js/**/*',
  '_data/**/*',
  '!_data/webpackManifest.json',
  './_layouts/**/*',
  './_includes/**/*',
  './_sass/**/*',
  'README.md',
];

// Temporary directory to store the files for the Gem in,
const GEM_BUILD_DIR = '.gembuild';

// Run site build. This consists of webpack and full production build.
gulp.task('build', function () {
  const shellCommand = 'npm run build';
  return run(shellCommand, {verbosity: 3}).exec();
});

// Get rid of temporary directory.
gulp.task('cleanGemDir', function () {
  return del(GEM_BUILD_DIR);
});

// Copy over all the gem files to the build directory.
gulp.task('copyGemFiles', function () {
  return gulp
    .src(GEM_FILES, {base: '.'})
    .pipe(gulp.dest(GEM_BUILD_DIR));
});

// Copy over gemspec file to the build directory and update the path to package.json.
gulp.task('copyGemSpec', function () {
  return gulp
    .src(['./jekyll-theme-pirati.gemspec'])
    .pipe(replace('./package.json', '../package.json'))
    .pipe(gulp.dest(GEM_BUILD_DIR));
});

// Copy over all artifacts created by Webpack.
gulp.task('copyWebpackBundles', function () {
  return gulp
    .src(['_site/assets/js/**/*'])
    .pipe(gulp.dest(`${GEM_BUILD_DIR}/assets/js`));
});

// Update `_include/js/main.html` to embed all the JS and CSS files created
// by Webpack previously in `copyWebpackBundles`.
gulp.task('writeManifest', function () {
  const manifest = require('./_data/webpackManifest.json');

  const writeJS = file => `<script src="${file}"></script>`;
  const writeCSS = file => `<link rel="stylesheet" href="${file}" />`;

  const cssFiles = manifest.manifest.css.map(writeCSS);
  const jsFiles = manifest.manifest.js.map(writeJS);
  const allFiles = cssFiles.concat(jsFiles).join("\n");

  return gulp
    .src([`${GEM_BUILD_DIR}/_includes/js/main.html`])
    .pipe(replace('{% include js/webpack.html %}', allFiles))
    .pipe(gulp.dest(`${GEM_BUILD_DIR}/_includes/js`));
});

// Runs `gem build` command in the build directory.
gulp.task('buildGem', function () {
  const shellCommand = `cd ${GEM_BUILD_DIR} && gem build jekyll-theme-pirati.gemspec --config-file ../.gemrc`;
  return run(shellCommand, {verbosity: 3}).exec();
});

// This build pipeline will create the gem file.
gulp.task('prepareGem',
  gulp.series([
    'cleanGemDir',
    gulp.parallel(['copyGemFiles', 'copyWebpackBundles', 'copyGemSpec']),
    'writeManifest',
    'buildGem'
  ]));

// Upload the gem file to the RubyGems repository.
gulp.task('upload', function () {
  // Gemfile name will match the version in the package.json.
  const gemFileName = `${packageFile.name}-${packageFile.version}.gem`;
  const shellCommand = `cd ${GEM_BUILD_DIR} && gem push ${gemFileName}`;
  return run(shellCommand, {verbosity: 3}).exec();
});

// This is the entrypoint command.
gulp.task('publishGem', gulp.series([
  'build',      // Run site build
  'prepareGem', // Create .gembuild directory and prepare all the necessary files
  'upload',     // Upload the Gem to RubyGems
  'cleanGemDir' // Delete .gembuild directory when finished.
]));
