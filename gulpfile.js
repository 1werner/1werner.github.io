var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

// Copy third party libraries from /node_modules into /vendor
const vendor = gulp.parallel(
    // Bootstrap
    function vendor_bootstrap() {
        return gulp.src([
            './node_modules/bootstrap/dist/**/*',
            '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
            '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
        ])
            .pipe(gulp.dest('./vendor/bootstrap'));
    },
    // Font Awesome
    function vendor_fontawesome() {
        return gulp.src([
            './node_modules/@fortawesome/**/*'
        ])
            .pipe(gulp.dest('./vendor'));
    },
    // jQuery
    function vendor_jQuery() {
        return gulp.src([
            './node_modules/jquery/dist/*',
            '!./node_modules/jquery/dist/core.js'
        ])
            .pipe(gulp.dest('./vendor/jquery'));
    },
    // jQuery Easing
    function vendor_jQuery_easing() {
        return gulp.src([
            './node_modules/jquery.easing/*.js'
        ])
            .pipe(gulp.dest('./vendor/jquery-easing'));
    }
);
gulp.task("vendor", vendor);

// Compile SCSS
function css_compile() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
}

// Minify CSS
function css_minify() {
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
}

// CSS
const css = gulp.series(css_compile, css_minify);
gulp.task('css', css);

// Minify JavaScript
function js() {
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
}
gulp.task("js", js);

// Browser Sync
function serve(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    done();
};

function reload(done) {
    browserSync.reload();
    done();
}

// Default task
gulp.task('default', gulp.parallel(css, js, vendor));

// Dev task
gulp.task('dev', gulp.series(
    gulp.parallel(css, js),
    serve,
    function watch() {
        gulp.watch('./scss/*.scss', css);
        gulp.watch('./js/*.js', js);
        gulp.watch('./*.html', reload);
    }
));
