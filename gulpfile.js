var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var cp          = require('child_process');
var env         = require('gulp-env');

gulp.task('jekyll-build', [], function (done) {
  var jekyll = cp.spawn('bundle', ['exec', 'jekyll build'], {stdio: 'inherit'}).on('close', done);
});

gulp.task('browser-stream', [], function () {
  gulp.src(['_site/public/css/*.css',
            '!_site/public/css/hyde.css',
            '!_site/public/css/poole.css',
            '!_site/public/css/styles.css',
            '!_site/public/css/syntax.css']).pipe(browserSync.stream());
});

gulp.task('set-env', function () {
  env({
    vars: {
      JEKYLL_SERVING: true
    }
  });
});

gulp.task('browser-sync', [], function (gulpCallback) {
  browserSync.init({
    server: {
      baseDir: '_site'
    }
  }, function () {
    gulp.watch(['_sass/*', '_sass/**', 'public/css/*'], ['jekyll-build']);
    gulp.watch(['_site/public/css/*.css'], ['browser-stream']);
    gulpCallback();
  });
});

gulp.task('default', ['set-env', 'jekyll-build', 'browser-sync']);
