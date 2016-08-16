var gulp = require('gulp');

var htmlSrc = './src/*.html',
    htmlDst = './www';

module.exports = function () {
  return gulp.src(htmlSrc)
    .pipe(gulp.dest(htmlDst));
};
