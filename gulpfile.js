var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-stream', [], function () {
  gulp.src(['_site/public/css/*.css',
            '!_site/public/css/hyde.css',
            '!_site/public/css/poole.css',
            '!_site/public/css/styles.css',
            '!_site/public/css/syntax.css']).pipe(browserSync.stream());
});

gulp.task('browser-sync', [], function (gulpCallback) {
  browserSync.init({
    server: {
      baseDir: '_site'
    }
  }, function () {
    gulp.watch(['_site/public/css/*.css'], ['browser-stream']);
    gulpCallback();
  });
});

gulp.task('default', ['browser-sync']);
