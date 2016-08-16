var gulp = require('gulp');
var clean = require('gulp-clean');

var jsDst = './www/';
    
module.exports = function () {
  console.log('~~~~~~~~~~~ Your room is now clean, Master :-) ~~~~~~~~~');
  return gulp.src(jsDst, {read: false})
        .pipe(clean({force: true}));
};
