var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var karma = require('karma').server;

gulp.task('test', function (done) {
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('scripts', ['clean', 'deps'], function() {
  return gulp.src('src/*.js')
    .pipe(plugins.angularFilesort())
    .pipe(plugins.concat('ahdin.js'))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify())
    .pipe(plugins.rename('ahdin.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(plugins.clean());
});

gulp.task('deps', ['clean'], function() {
  return gulp.src([
    'bower_components/blob-util/dist/blob-util.min.js',
    'bower_components/blueimp-load-image/js/load-image.all.min.js'
  ])
    .pipe(plugins.copy('dist', {prefix: 3}));
});

gulp.task('build', ['test', 'scripts']);
