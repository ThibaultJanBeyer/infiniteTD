var gulp = require('gulp');
var audiosprite = require('gulp-audiosprite');

var audioSrc = './src/assets/sounds/*.wav';
var audioDst = './www/assets/sounds';
    
module.exports = function () {
  return gulp.src(audioSrc)
        .pipe(audiosprite({
          export: 'ogg,mp3'
        }))
        .pipe(gulp.dest(audioDst));
};
