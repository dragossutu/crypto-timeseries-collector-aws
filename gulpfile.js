'use strict';

const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('default', () =>
    gulp.src(['index.js', 'src/*'], {base: './'})
        .pipe(zip('lambda.zip'))
        .pipe(gulp.dest('dist'))
);
