var gulp = require('gulp');
var del = require('del');

var staticPath = './static';
var outputPath = './dist';

gulp.task('default', ['clean']);

gulp.task('clean', function cleanTask(cb) {
    del([outputPath], cb);
});
