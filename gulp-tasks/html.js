var gulp = require('gulp');

var htmlSrc = './src/*.html',
    htmlDst = './dist';

module.exports = function () {
  return gulp.src(htmlSrc)
    .pipe(gulp.dest(htmlDst));
};
