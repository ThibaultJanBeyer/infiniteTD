var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

var imgSrc = './src/assets/img/**/*',
    imgDst = './dist/assets/img';

module.exports = function () {
    return gulp.src(imgSrc)
      .pipe(imagemin())
      .pipe(gulp.dest(imgDst));
};
