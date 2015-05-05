/* jshint node: true */
var gulp = require('gulp');

var del = require('del');
var $ = require('gulp-load-plugins')();
var fs = require('fs');

gulp.task('lint', function () {
  return gulp.src('{addon,app,config,tests}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('clean-dist', function (cb) {
  del([
    'dist/',
    'dist/tmp',
  ], cb);
});

gulp.task('build-legacy', ['lint'], function() {
  return gulp.src('vendor/legacy-shims/emberfire.js')
    .pipe($.sourcemaps.init())
    .pipe($.es6ModuleTranspiler({
      importPaths: ['vendor/legacy-shims'],
      formatter: 'bundle'
    }))
    .pipe($.concat('emberfire.js'))
    .pipe($.header(fs.readFileSync('vendor/legacy-shims/header.js', 'utf8')))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-legacy-minified', ['lint'], function() {
  return gulp.src('vendor/legacy-shims/emberfire.js')
    .pipe($.es6ModuleTranspiler({
      importPaths: ['vendor/legacy-shims'], // for 'ember' and 'ember-data' global shims
      formatter: 'bundle'
    }))
    .pipe($.concat('emberfire.min.js'))
    .pipe($.uglify())
    .on('error', function (e) {
      throw new $.util.PluginError('gulp-uglify', e.message);
    })
    .pipe($.header(fs.readFileSync('vendor/legacy-shims/header.js', 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('legacy', ['clean-dist', 'build-legacy', 'build-legacy-minified']);

gulp.task('default', ['legacy']);
