const gulp = require('gulp');
const sass = require('gulp-sass');
const mincss = require('gulp-csso');
const server = require('gulp-webserver');
const htmlmin = require('gulp-htmlmin');
const jsmin = require('gulp-uglify');
const image = require('gulp-imagemin');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const data = require('./src/data/data.json')
var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
};
gulp.task('default', ['css', 'js', 'img', 'web']);
gulp.task('js', () => {
    gulp.watch('./src/js/*.js', () => {
        gulp.src('./src/js/*.js', {
                base: './src/js'
            })
            .pipe(jsmin())
            .pipe(rename('.min'))
            .pipe(gulp.dest('src/js'));
    });
});
gulp.task('css', () => {
    gulp.watch('./src/css/*.scss', () => {
        gulp.src('./src/*/*.scss', {
                base: 'src/css'
            })
            .pipe(sass())
            .pipe(mincss())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('src/css'));
    });
});
gulp.task('html', () => {
    gulp.watch('./src/*.html', () => {
        gulp.src('./src/*.html', {
                base: './src'
            })
            .pipe(htmlmin(options))
            .pipe(gulp.dest('src/html'))
    });
});
gulp.task('img', () => {
    gulp.src('./src/img/*.{jpg,png}', {
            base: './src/img'
        })
        .pipe(image())
        .pipe(gulp.dest('src/imgmin'))
});
gulp.task('web', () => {
    gulp.src('src')
        .pipe(server({
            port: 8080,
            open: true,
            livereload: true,
            middleware: (req, res, next) => {
                console.log(req.url);
                if (/\/datas/g.test(req.url)) {
                    res.end(JSON.stringify(data))
                }
                next();
            }
        }))
});