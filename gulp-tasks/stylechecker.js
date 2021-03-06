var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var merge = require('merge-stream');

var scssSrc = 
  gulp.src(['./src/assets/stylesheet/**/*.scss', '!./src/assets/stylesheet/plugin/*'])
  .pipe(scsslint());

var jsSrc =
  gulp.src(['./src/assets/javascript/**/*.js', '!./src/assets/javascript/polyfills/*'])
  .pipe(jscs())
  .pipe(jshint({ esnext: true }))
  .pipe(jshint.reporter('jshint-stylish'));

module.exports = function () {
  console.log('~~~~~~~~~~~ Wow, neat coding! :-) ~~~~~~~~~');
  return merge(scssSrc, jsSrc);
};
