const
  gulp = require('gulp'),
  run = require('gulp-run'),
  replace = require('gulp-replace'),
  del = require('del');

const GEM_FILES = [
  './assets/**/*',
  '!assets/js/**/*',
  '_data/**/*',
  '!_data/webpackManifest.json',
  './_layouts/**/*',
  './_includes/**/*',
  './_sass/**/*',
  'README.md',
  'jekyll-theme-pirati.gemspec'
];

const GEM_BUILD_DIR = '.gembuild';

gulp.task('build', function () {
  const shellCommand = 'npm run build';
  return run(shellCommand, {verbosity: 3}).exec();
});

gulp.task('cleanGemDir', function () {
  return del(GEM_BUILD_DIR);
});

gulp.task('copyGemFiles', function () {
  return gulp
    .src(GEM_FILES, {base: '.'})
    .pipe(gulp.dest(GEM_BUILD_DIR));
});

gulp.task('copyWebpackBundles', function () {
  return gulp
    .src(['_site/assets/js/**/*'])
    .pipe(gulp.dest(`${GEM_BUILD_DIR}/assets/js`));
})

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

gulp.task('buildGem', function () {
  const shellCommand = `cd ${GEM_BUILD_DIR} && gem build jekyll-theme-pirati.gemspec > gemfile.gem`;
  return run(shellCommand, {verbosity: 3}).exec();
});

gulp.task('prepareGem', gulp.series(['cleanGemDir', 'copyGemFiles', 'copyWebpackBundles', 'writeManifest', 'buildGem']));


gulp.task('upload', function () {
  const shellCommand = `cd ${GEM_BUILD_DIR} && gem publish gemfile.gem`;
  return run(shellCommand, {verbosity: 3}).exec();
});

gulp.task('publish', gulp.series(['build', 'prepareGem', 'upload', 'cleanGemDir']));
