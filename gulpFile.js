const { src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const lineec = require('gulp-line-ending-corrector');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');

const srcFiles = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js',
    imgPath: 'app/img/*'
}

const destFiles = {
    cssPathDest: 'dist/css',
    jsPathDest: 'dist/js',
    imgPathDest: 'dist/images'
}

//sass task
function scssTask(){
    return src(srcFiles.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer('last 2 versions'), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(destFiles.cssPathDest))
        .pipe(browserSync.stream())
        .pipe(lineec());
}

//JS task
function jsTask(){
    return src(srcFiles.jsPath)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest(destFiles.jsPathDest))
        .pipe(lineec());
}

//Cachebusting task
const cbString = new Date().getTime();
function cacheBust(){
    return src('index.html') //can create a new variable for Html file fath if more modular approach
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString ))
        .pipe(dest('.')
    );
}

// watch task
function watchTask(){
    browserSync.init({
        server: {
         baseDir: './'
         }
    });
    watch(srcFiles.scssPath, scssTask);
    watch('./*.html').on('change', browserSync.reload);
    watch(srcFiles.jsPath, jsTask);
    watch(srcFiles.jsPath).on('change', browserSync.reload);
}

//image optimization
// function imagemin() {
//     return gulp.src(imgSRC)
// }

//Default task

// exports.scssTask = scssTask;
// exports.jsTask = jsTask;
// exports.watchTask = watchTask;

exports.default = series(
    scssTask, 
    jsTask,
    cacheBust,
    watchTask
);