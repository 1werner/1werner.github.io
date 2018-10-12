var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

function bootstrap() {
    return gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
        .pipe(gulp.dest('./vendor/bootstrap'));
}

function fontawesome() {
    return gulp.src([
        './node_modules/@fortawesome/**/*'
    ])
        .pipe(gulp.dest('./vendor'));
}

function jQuery() {
    return gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./vendor/jquery'));
}

function jQuery_easing() {
    return gulp.src([
        './node_modules/jquery.easing/*.js'
    ])
        .pipe(gulp.dest('./vendor/jquery-easing'));
}

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', gulp.parallel(bootstrap, fontawesome, jQuery, jQuery_easing));

// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', function () {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', gulp.series('css:compile', 'css:minify'));

// Minify JavaScript
gulp.task('js', function () {
    return gulp.src([
        './js/*.js',
        '!./js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

// Default task
gulp.task('default', gulp.parallel('css', 'js', 'vendor'));

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Dev task
gulp.task('dev', gulp.series(
    gulp.parallel('css', 'js', 'browserSync'),
    function () {
        gulp.watch('./scss/*.scss', ['css']);
        gulp.watch('./js/*.js', ['js']);
        gulp.watch('./*.html', browserSync.reload);
    })
);
