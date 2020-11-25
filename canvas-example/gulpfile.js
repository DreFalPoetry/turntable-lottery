const gulp = require('gulp');

const cssmin = require('gulp-cssmin')
const autoPrefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const del = require('del')


const cssHandler = function(){
  return gulp.src('./css/*.css')
    .pipe(autoPrefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'))
}

const jsHandler = function(){
  return gulp.src(['./js/*.js'])
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'))
}

const commonJsHandler = function(){
  return gulp.src(['./js/commom/*.js'])
  .pipe(gulp.dest('./dist/js/common'))
}

const htmlHandler = function(){
  return gulp.src('./*.html')
  .pipe(gulp.dest('./dist/'))
}

const imgHandler = function(){
  return gulp.src('./images/*')
  .pipe(gulp.dest('./dist/images'))
}

const delHandler = function(){
  return del(['./dist'])
}

const watchHandler = function(){
  gulp.watch('./css/*.css',cssHandler)
  gulp.watch('./js/*.js',jsHandler)
}

module.exports.default = gulp.series(
  delHandler,
  gulp.parallel(cssHandler,jsHandler,commonJsHandler,htmlHandler,imgHandler),
  watchHandler,
);