const gulp = require('gulp');
const concat = require('gulp-concat');
const wrap = require('gulp-wrap');

const ts = require('gulp-typescript');
const tsconfig = require('./tsconfig.json');

gulp.task('dist', () => {
  return gulp.src(tsconfig.files)
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(concat(tsconfig.compilerOptions.outFile))
    .pipe(wrap("(function (Dougal) { 'use strict';\n<%= contents %>\n})(window.Dougal = {});"))
    .pipe(gulp.dest('.'));
});
