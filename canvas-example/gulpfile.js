const gulp = require('gulp');

const cssmin = require('gulp-cssmin')
const autoPrefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const connect = require('gulp-connect')
const del = require('del')

const server = () => {
  connect.server({ //创建服务器
      root: 'dist',//根目录
      port: '2000',//端口号
      livereload:true//服务器热更新
  })
}


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
  return gulp.src(['./js/common/*.js'])
  .pipe(gulp.dest('./dist/js/common'))
}

const htmlHandler = () => { //创建任务，并命名任务名
  return gulp.src('./*.html') //打开读取文件
      .pipe(htmlmin({
          removeComments: true, //清除HTML注释
          collapseWhitespace: true, //压缩HTML
          collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
          removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
          removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
          removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
          minifyJS: true, //压缩页面JS
          minifyCSS: true //压缩页面CSS
      })) //管道流操作，压缩文件
      .pipe(gulp.dest('./dist/')) //指定压缩文件放置的目录
}

// const htmlHandler = function(){
//   return gulp.src('./*.html')
//   .pipe(gulp.dest('./dist/'))
// }

const imgHandler = function(){
  return gulp.src('./images/*')
  .pipe(gulp.dest('./dist/images'))
}

const delHandler = function(){
  return del(['./dist'])
}

const watchHandler = function(){
  gulp.watch('./*.html',htmlHandler)
  gulp.watch('./css/*.css',cssHandler)
  gulp.watch('./js/*.js',jsHandler)
}

module.exports.default = gulp.series(
  delHandler,
  gulp.parallel(htmlHandler,cssHandler,jsHandler,commonJsHandler,imgHandler,server),
  watchHandler,
);