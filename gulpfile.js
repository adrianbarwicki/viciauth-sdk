var gulp = require('gulp');
var jslint = require('gulp-jslint');
 



gulp.task('default', function () {
    return gulp.src(['index.js',"./models/*.js","routes.js"])
           .pipe(jslint())
           .pipe(jslint.reporter('default'));
});