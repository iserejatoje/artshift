let preprocessor = 'sass',
    fileswatch = 'html,htm,txt,json,md,woff2'

import pkg from 'gulp'

const {gulp, src, dest, parallel, series, watch} = pkg

import browserSync from 'browser-sync'
import bssi from 'browsersync-ssi'
import ssi from 'ssi'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import sassglob from 'gulp-sass-glob'

const sass = gulpSass(dartSass)
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import concat from 'gulp-concat'
import del from 'del'

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/',
            middleware: bssi({baseDir: 'app/', ext: '.html'})
        },
        ghostMode: {clicks: false},
        notify: false,
        online: true,
    })
}

function scripts() {
    return src(['app/js/*.js', '!app/js/*.min.js', '!app/js/_*.min.js'])
        .pipe(webpackStream({
            // mode: 'production',
            mode: 'development',
            performance: {hints: false},
            plugins: [
                new webpack.ProvidePlugin({
                    $: 'jquery/dist/jquery.slim.min.js',
                    jQuery: 'jquery/dist/jquery.slim.min.js',
                    'window.jQuery': 'jquery/dist/jquery.slim.min.js'
                }),
            ],
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                                plugins: ['babel-plugin-root-import']
                            }
                        }
                    }
                ]
            },
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {format: {comments: false}},
                        extractComments: false
                    })
                ]
            },
        }, webpack)).on('error', (err) => {
            this.emit('end')
        })
        .pipe(concat('app.min.js'))
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([`app/${preprocessor}/*.*`, `!app/${preprocessor}/_*.*`])
        .pipe(eval(`${preprocessor}glob`)())
        .pipe(eval(preprocessor)({'include css': true}))
        .pipe(postCss([
            autoprefixer({grid: 'autoplace'}),
            cssnano({preset: ['default', {discardComments: {removeAll: true}}]})
        ]))
        .pipe(concat('app.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function buildcopy() {
    return src([
        '{app/js,app/css}/*.min.*',
        'app/images/**/*.*',
        '!app/images/src/**/*',
        'app/fonts/**/*'
    ], {base: 'app/'})
        .pipe(dest('dist'))
}

async function buildhtml() {
    let includes = new ssi('app/', 'dist/', '/**/*.html')
    includes.compile()
    del('dist/parts', {force: true})
}

async function cleandist() {
    del('dist/**/*', {force: true})
}

function startwatch() {
    watch(`app/${preprocessor}/**/*`, {usePolling: true}, styles)
    watch(['app/js/**/*.js', '!app/js/**/*.min.js'], {usePolling: true}, scripts)
    watch('app/images/src/**/*', {usePolling: true})
    watch(`app/**/*.{${fileswatch}}`, {usePolling: true}).on('change', browserSync.reload)
}

export {scripts, styles}
export let assets = series(scripts, styles)
export let build = series(cleandist, scripts, styles, buildcopy, buildhtml)
export default series(scripts, styles, parallel(browsersync, startwatch))