var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
  return gulp.src([
      './src/**/*.js',
      './test/**/*.js',
      'webpack.config.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
