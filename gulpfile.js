'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var stylish = require('jshint-stylish');
var bowerFiles = require('gulp-bower-files');
var wiredep = require('wiredep').stream;
var less = require('gulp-less');

var bases = {
  app: 'web/app/',
  dist: 'web/dist/',
};

var paths = {
  scripts: ['scripts/**/*.js', '!scripts/libs/'],
  styles: ['styles/**/*.css'],
  html: ['index.html', '404.html'],
  images: ['images/**/*.png'],
  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
    .pipe(clean());
});

// Process frontend scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
  gulp.src(paths.scripts, { cwd: bases.app })
    .pipe(jshint({
      browser: true,
      jquery: true
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    // .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(bases.dist + 'scripts/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(bases.dist));
});

// Copy bower components to dist
gulp.task('bower', ['clean'], function() {
  bowerFiles()
    .pipe(gulp.dest(bases.dist + 'components'));
});

// Wire dependencies
gulp.task('deps', ['clean', 'bower'], function() {
  gulp.src(paths.html, { cwd: bases.app })
    .pipe(wiredep())
    .pipe(gulp.dest(bases.dist));
});

// Less the CSS's
gulp.task('less', ['clean'], function(){
  gulp.src(bases.app + 'styles.less')
    .pipe(less())
    .pipe(gulp.dest(bases.dist + 'styles'));
});

// Copy extra html5bp files
gulp.task('extras', ['clean'], function() {
  gulp.src(paths.extras, { cwd: bases.app })
   .pipe(gulp.dest(bases.dist));
});

// Orchestration task to perform entire build
gulp.task('build', ['clean', 'scripts', 'imagemin', 'less', 'deps', 'extras']);

// Default task run everything
gulp.task('default', ['build']);

// Heroku deploy only performs a build since CI should be running the tests
gulp.task('heroku:prod', ['build']);
