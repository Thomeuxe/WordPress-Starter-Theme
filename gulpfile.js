var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies']
});

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('serve', function() {
    plugins.browserSync.init({
      proxy: "http://localhost/"
    });

    gulp.watch("assets/_styles/**/*.scss", ['sass']);
    gulp.watch("assets/js/_source/*.js", ['scripts']);
    gulp.watch("assets/js/_vendor/**/*.js", ['vendor']);
    gulp.watch(["*.php", 'templates/*.php', 'template_parts/*.php']).on('change', plugins.browserSync.reload);
});

gulp.task('sass', function() {
    return gulp.src("assets/_styles/style.scss")
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .on('error', swallowError)
        .pipe(plugins.uncss({
            html: ['./*.php', './template-parts/**/*.php', './page-templates/**/*.php']
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest("./"))
        .pipe(plugins.browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('assets/js/_source/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./assets/js/'))
    .pipe(plugins.browserSync.stream());
});

gulp.task('images', function () {
    return gulp.src('assets/images/source/*')
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('assets/images'));
});

gulp.task('vendor', function() {
  return gulp.src('./assets/js/_vendor/*')
    .pipe(plugins.vendor('vendor.js'))
    .pipe(gulp.dest('./assets/js/'))
    .pipe(plugins.browserSync.stream());
});

gulp.task('minifyCSS', function() {
  return gulp.src('style.css')
    .pipe(plugins.minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest('./'));
});

gulp.task('minifyJS', function() {
  return gulp.src('./assets/js/*.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./assets/js'))
    .on('error', swallowError);
});

gulp.task('rsync', ['minifyCSS', 'minifyJS'] , function() {
  return gulp.src('./')
    .pipe(plugins.rsync({
      root: './',
      hostname: 'ftp.website.com',
      username: 'username',
      destination: '/dir/',
      recursive: true,
      exclude: ['_*/', '_.*', '.*', 'node_modules'],
    }));
});

// define tasks here
gulp.task('default', ['serve']);
