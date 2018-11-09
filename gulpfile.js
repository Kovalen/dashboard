var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var concat       = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps   = require('gulp-sourcemaps');
var spritesmith  = require('gulp.spritesmith');
var merge        = require ('merge-stream');
var cssnano      = require ('gulp-cssnano');
var sass         = require('gulp-sass');
sass.compiler    = require('node-sass');

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
});

// sass

gulp.task('sass', function() {
    return gulp.src('app/sass/main.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.reload({stream: true}))
});


// concat js

gulp.task('scripts', function() {
  return gulp.src([
        'app/js/libs/jquery-3.3.1.min.js',
        ])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/js/'));
});


// sprites

gulp.task('sprite', function () {
    let spriteData = gulp.src('app/img/icons/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../img/sprite.png'
        }));

    let imgStream = spriteData.img
        .pipe(gulp.dest('app/img'));

    let cssStream = spriteData.css
        .pipe(gulp.dest('app/css/components/'));
    return merge(imgStream, cssStream);
})

//min

gulp.task('css-min', function() {
    return gulp.src('app/css/all.css')
    .pipe(cssnano())
    .pipe(gulp.dest('app/css/'))
});


//build
gulp.task('build', function() {
    var buildCss = gulp.src([
            'app/css/reset.css',
            'app/css/main.css',
            'app/css/all.css'
        ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

    var buildImg = gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));

    var buildJs = gulp.src([
            'app/js/all.js',
            'app/js/common.js'
        ])
    .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

// gulp watch
gulp.task('watch', ['browser-sync', 'scripts', 'sprite', 'sass'], function() {
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/css/**/*.css', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/img/icons/*.png', ['sprite']);
    gulp.watch('app/sass/**/*.scss', ['sass'], browserSync.reload);
});

gulp.task('default', ['watch']);