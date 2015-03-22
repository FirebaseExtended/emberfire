/* jshint node: true */
var gulp = require('gulp');

var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var transpile  = require('gulp-es6-module-transpiler');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var header = require('gulp-header');
var fs = require('fs');

gulp.task('lint', function () {
  return gulp.src('{addon,app,config,tests}/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean-dist', function (cb) {
  del([
    'dist/',
    'dist/tmp',
  ], cb);
});

gulp.task('build-legacy', ['lint'], function() {
  return gulp.src('vendor/legacy-shims/emberfire.js')
    .pipe(sourcemaps.init())
    .pipe(transpile({
      importPaths: ['vendor/legacy-shims'],
      formatter: 'bundle'
    }))
    .pipe(concat('emberfire.js'))
    .pipe(header(fs.readFileSync('vendor/legacy-shims/header.js', 'utf8')))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-legacy-minified', ['lint'], function() {
  return gulp.src('vendor/legacy-shims/emberfire.js')
    .pipe(transpile({
      importPaths: ['vendor/legacy-shims'], // for 'ember' and 'ember-data' global shims
      formatter: 'bundle'
    }))
    .pipe(concat('emberfire.min.js'))
    .pipe(header(fs.readFileSync('vendor/legacy-shims/header.js', 'utf8')))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('legacy', ['clean-dist', 'build-legacy', 'build-legacy-minified']);

gulp.task('default', ['legacy']);
