const { readFileSync } = require('fs');
const gulp = require('gulp');
const cssmin = require('gulp-cssmin')
const autoPrefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')
const rev = require('gulp-rev')
const revRewrite = require('gulp-rev-rewrite')
const connect = require('gulp-connect')
const del = require('del')

const server = (done) => {
  connect.server({ //创建服务器
      root: 'dist',//根目录
      port: '2000',//端口号
      host: '0.0.0.0',
      livereload:true,//服务器热更新
  })
  done()
}

const delHandler = function(){
  return del(['./dist'])
}

const commonJsHandler = function(){
  return gulp.src(['./js/common/*.js'])
  .pipe(gulp.dest('./dist/js/common'))
}

const cssHandler = function(){
  return gulp.src('./css/*.css')
    .pipe(autoPrefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload())
}

const jsHandler = function(){
  return gulp.src(['./js/*.js'])
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'))
  .pipe(connect.reload())
}

const htmlHandler = function(){
  return gulp.src('./*.html')
  .pipe(gulp.dest('./dist/'))
  .pipe(connect.reload())
}

const imgHandler = function(){
  return gulp.src('./images/*')
  .pipe(gulp.dest('./dist/images'))
}

const cssHandlerProd = function(){
  return gulp.src('./css/*.css')
    .pipe(autoPrefixer())
    .pipe(cssmin())
    .pipe(rev())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rev.manifest('css-rev.json'))
    .pipe(gulp.dest('./dist/css'))   // 将map映射文件添加到打包目录
}

const htmlHandlerProd = () => { //创建任务，并命名任务名
  const jsManifest =  readFileSync('./dist/js/js-rev.json'); //获取js映射文件
  const cssManifest = readFileSync('./dist/css/css-rev.json'); //获取css映射文件
  return gulp.src('./*.html') //打开读取文件
  .pipe(revRewrite({manifest: jsManifest})) // 把引用的js替换成有版本号的名字
  .pipe(revRewrite({manifest: cssManifest})) // 把引用的css替换成有版本号的名字
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

const jsHandlerProd = function(){
  return gulp.src(['./js/*.js'])
  .pipe(babel())
  .pipe(uglify())
  .pipe(rev())  
  .pipe(gulp.dest('./dist/js'))
  .pipe(rev.manifest('js-rev.json'))
  .pipe(gulp.dest('./dist/js')) // 将map映射文件添加到打包目录
}

const watchHandler = function(){
  gulp.watch('./*.html',htmlHandler)
  gulp.watch('./css/*.css',cssHandler)
  gulp.watch('./js/*.js',jsHandler)
}

// 开发环境
module.exports.default = gulp.series(
  delHandler,
  gulp.parallel(cssHandler,jsHandler,commonJsHandler,imgHandler,htmlHandler,watchHandler,server),
);

// 生产环境
// module.exports.default = gulp.series(
//   delHandler,
//   gulp.parallel(cssHandlerProd,jsHandlerProd,commonJsHandler,imgHandler),
//   htmlHandlerProd
// );