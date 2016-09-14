const gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  stylish = require("jshint-stylish"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  babel = require("gulp-babel"),
  rename = require("gulp-regex-rename"),
  browserSync = require("browser-sync").create();

gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "src"
    }
  });
});

gulp.task("sass", function() {
  return gulp.src("src/scss/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ["> 1%"]
    }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("lint", function() {
  return gulp.src("src/js/**/*.es6.js")
    .pipe(jshint({
      esversion: 6
    }))
    .pipe(jshint.reporter(stylish));
});

gulp.task("babel", ["lint"], function() {
  return gulp.src("src/js/**/*.es6.js")
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(rename(/\.es6/, ""))
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("watch", ["sass", "babel", "browserSync"], function() {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/**/*.es6.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
