const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-string-replace');
const watch = require('gulp-watch');
const wrap = require('gulp-wrap');

const ts = require('gulp-typescript');
const files = require('./files.json');
const package = require('./package.json');
const tsconfig = require('./tsconfig.json');

gulp.task('dist', ['dist:angular'], () => {
  return gulp.src(files)
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(concat(tsconfig.compilerOptions.outFile))
    .pipe(replace('DOUGAL_VERSION', package.version))
    .pipe(wrap("(function (Dougal) { 'use strict';\n<%= contents %>\n})(window.Dougal = {});"))
    .pipe(gulp.dest('.'));
});

gulp.task('watch:dist', ['dist'], () => {
  return watch('lib/**/*.ts', () => {
    gulp.start('dist');
  });
});

gulp.task('dist:angular', () => {
  return gulp.src('lib/dougal-angular.ts')
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(concat('dougal-angular.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['watch:dist']);
