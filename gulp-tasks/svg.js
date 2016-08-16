var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
// var svgSprite = require('gulp-svg-sprite');

var svgSrc = './src/assets/svg/*.svg',
    svgDst = './src/assets/svg/';

var svgOptions = {
    progressive: true,
    svgoPlugins: [
        {cleanupIDs: false}
    ]
  };

module.exports = function () {
  return gulp.src(svgSrc)
    .pipe(imagemin(svgOptions))
    .pipe(gulp.dest(svgDst));
};
