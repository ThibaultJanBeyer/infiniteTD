var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');

var jsSrc = ['./src/assets/javascript/**/*.js','./bower_components/pathfinding/pathfinding-browser.js','./bower_components/espi-a11y-dialog/a11y-dialog.js'],
    jsDst = './dist/assets/javascript/';

var uglifyOptions = {
  compress: { drop_console: true }
};

module.exports = function () {
  return gulp.src(jsSrc)
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(concat('bundle.js'))
    .pipe(babel({ presets: ['es2015'] }))
    //.pipe(uglify(uglifyOptions))
    .pipe(gulp.dest(jsDst));
};
