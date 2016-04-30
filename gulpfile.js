var gulp        = require("gulp");
var browserSync = require("browser-sync").create();
var inject = require('gulp-inject');
var gulpBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');

gulp.task('serve', ['inject', 'bower-files'], function() {
    browserSync.init({
        server: "./app"
    });
    gulp.watch("./app/**/*.*", ['inject']);
    gulp.watch("./app/**/*.*").on('change', browserSync.reload);
    gulp.watch("./app/*.*").on('change', browserSync.reload);
});

gulp.task('inject', function () {
    var target = gulp.src('./app/index.html');
    var sources = gulp.src(['./app/**/*.js', './app/**/*.css'], {read: false});
    return target.pipe(inject(sources, {relative: false, ignorePath: '/app/'}))
        .pipe(gulp.dest('./app/'));
});

gulp.task("bower-files", function(){
    return gulp.src(gulpBowerFiles())
        .pipe(uglify())
        .pipe(gulp.dest('./app/libs'));
});
