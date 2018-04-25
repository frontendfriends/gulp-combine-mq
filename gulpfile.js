 // Require Gulp
 var gulp = require('gulp');

 // Require tasks
 var combineMq = require('./index');

 // This plugin's task
 gulp.task('combineMq', function () {
 	return gulp.src('test/fixtures/**/*.css')
 	.pipe(combineMq())
 	.pipe(gulp.dest('tmp'));
 });

// Default task does all of the things
gulp.task('default', gulp.series('combineMq'));
