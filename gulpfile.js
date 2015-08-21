var fs = require('fs'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jslint = require('gulp-jslint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    awspublish = require('gulp-awspublish'),
    browserSync = require('browser-sync').create(),
    shell = require('gulp-shell');

var reload = browserSync.reload;

var jsPrefix = 'js/src/';

var paths = {
    jsCoreIn: ['init'],
    jsCoreDist: 'js/dist',
    html: ['./**/*.html']
};

paths.jsCoreIn.forEach(function(path, i) {
    paths.jsCoreIn[i] = jsPrefix + path + '.js';
});

function fullAndMin(dest) {

    gulp.src( paths.jsCoreIn )
        .pipe(concat('martin-colorpicker.js'))
        .pipe(gulp.dest( dest ));

    gulp.src( paths.jsCoreIn )
        .pipe(concat('martin-colorpicker.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( dest ));
}

gulp.task('js', function() {
    fullAndMin( paths.jsCoreDist );
});

gulp.task('serve', ['js'], function() {

    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch( paths.jsCoreIn, ['js'] ).on('change', reload);
    gulp.watch( paths.plugins, ['js'] ).on('change', reload);
    gulp.watch( './test/test.js' ).on('change', reload);
    gulp.watch( paths.html ).on('change', reload);

});

gulp.task('default', ['serve']);
