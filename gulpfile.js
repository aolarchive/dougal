const gulp        = require('gulp');
const concat      = require('gulp-concat');
const eslint      = require('gulp-eslint');
const liveServer  = require('gulp-live-server');
const replace     = require('gulp-string-replace');
const watch       = require('gulp-watch');
const wrap        = require('gulp-wrap');

const ts          = require('gulp-typescript');
const files       = require('./files.json');
const package     = require('./package.json');
const tsconfig    = require('./tsconfig.json');

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

gulp.task('lint', () => {
  return gulp.src(['**/*.ts', '!node_modules/**/*.ts'])
    .pipe(eslint({configFile: '.eslintrc.yml'}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// e2e tasks

gulp.task('e2e:server', () => {
  let server = liveServer.new('e2e/server.js');
  server.start();
});

gulp.task('default', ['watch:dist']);
