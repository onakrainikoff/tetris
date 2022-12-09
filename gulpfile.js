const { src, dest, series, task, parallel, watch} = require('gulp')
const clean = require('gulp-clean')
const gulpif = require('gulp-if')
const rename  = require('gulp-rename')
const debug  = require('gulp-debug')
const replace = require('gulp-replace')

const browsersync = require('browser-sync')


const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config')

const dartsass = require('sass')
const gulpsass = require('gulp-sass')
const mincss = require('gulp-clean-css')
const sass = gulpsass(dartsass);

let isProd = process.env.NODE_ENV === 'production'
webpackConfig.mode = isProd ? "production" : "development";
webpackConfig.devtool = isProd ? false : "source-map";

const srcDir = './src'
const distDir = './dist'
const paths = {
    saas: {
        src: `${srcDir}/sass/**/*.{scss,sass}`,
        dest: `${distDir}/css/`
    },
    img: {
        src: `${srcDir}/img/**/*.{jpg,jpeg,png,gif,tiff,svg}`,
        dest: `${distDir}/img/`
    },
    ts: {
        src: `${srcDir}/ts/index.ts`,
        watch: `${srcDir}/ts/**/*.ts`,
        dest: `${distDir}/js/`
    },
    html: {
        src: `${srcDir}/**/*.html`,
        dest: `${distDir}/`
    }
}


task("clean", ()=> {
    return src(`${distDir}/*`, {allowEmpty: true})
    .pipe(clean())
    .pipe(debug({
        "title": "Clean files"
    }))
})

task("sass", ()=> {
    return src(paths.saas.src)
    .pipe(sass())
    .pipe(gulpif(isProd, mincss()))
    .pipe(gulpif(isProd, rename({
        suffix: ".min"
    })))
    .pipe(dest(paths.saas.dest))
    .pipe(debug({
        "title": "Css files"
    }))
    .on("end", browsersync.reload);
})


task("img", ()=> {
    return src(paths.img.src)
    .pipe(dest(paths.img.dest))
    .pipe(debug({
        "title": "Image files"
    }))
    .pipe(browsersync.stream())
})

task("ts", ()=> {
    return src(paths.ts.src)
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulpif(isProd, rename({
            suffix: ".min"
        })))
        .pipe(dest(paths.ts.dest))
        .pipe(debug({
            "title": "JS files"
        }))
        .pipe(browsersync.stream());
})

task("html", ()=> {
    return src(paths.html.src)
    .pipe(gulpif(isProd, replace("style.css", "style.min.css")))
    .pipe(gulpif(isProd, replace("index.bundle.js", "index.bundle.min.js")))
    .pipe(dest(paths.html.dest))
    .pipe(debug({
        "title": "Html files"
    }))
    .pipe(browsersync.stream())
})

task("serve", () => {
    browsersync.init({
        server: paths.html.dest,
        port: 4000,
        notify: true
    });
    watch(paths.saas.src, parallel("sass"));
    watch(paths.img.src, parallel("img"));
    watch(paths.ts.watch, parallel("ts"));
    watch(paths.html.src, parallel("html"));
});

const serve = series("clean", parallel(["sass", "img", "ts", "html"]), parallel("serve"));
const build = series("clean", parallel(["sass", "img", "ts", "html"]));
exports.serve = serve
exports.build = build
exports.default = build