/* jshint node: true */
var gulp = require('gulp');

var del = require('del');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var fs = require('fs');

gulp.task('lint', function () {
  return gulp.src('{addon,app,config,tests}/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('clean-dist', function (cb) {
  del(['dist/'], cb);
});

gulp.task('test-page', ['clean-dist'], function() {
  return gulp.src('vendor/legacy/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('build-legacy', ['lint', 'clean-dist'], function() {
  var b = browserify(['vendor/legacy/emberfire.js'], {
    debug: true
  });

  return b.bundle()
    .pipe(source('emberfire.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.header(fs.readFileSync('vendor/legacy/header.js', 'utf8')))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-legacy-minified', ['build-legacy', 'test-page'], function() {
  return gulp.src('dist/emberfire.js')
    .pipe($.rename('emberfire.min.js'))
    .pipe($.uglify())
    .on('error', function (e) {
      throw new $.util.PluginError('gulp-uglify', e.message);
    })
    .pipe($.header(fs.readFileSync('vendor/legacy/header.js', 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('legacy', ['build-legacy-minified']);

gulp.task('default', ['legacy']);
