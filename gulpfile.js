const gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  stylish = require("jshint-stylish"),
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

gulp.task("watch", ["babel", "browserSync"], function() {
  gulp.watch("src/js/**/*.es6.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
