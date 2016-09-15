const gulp = require("gulp"),
  gulpIf = require("gulp-if"),
  jshint = require("gulp-jshint"),
  stylish = require("jshint-stylish"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  babel = require("gulp-babel"),
  rename = require("gulp-regex-rename"),
  useref = require("gulp-useref"),
  cssnano = require("gulp-cssnano"),
  uglify = require("gulp-uglify"),
  del = require("del"),
  runSequence = require("run-sequence"),
  deploy = require("gulp-gh-pages"),
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

gulp.task("useref", function() {
  return gulp.src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"));
});

gulp.task("clean:dist", function() {
  return del.sync("dist");
});

gulp.task("build", function(callback) {
  runSequence("clean:dist", ["sass", "babel"], "useref", callback);
});

gulp.task("deploy", function() {
  return gulp.src("dist/**/*")
    .pipe(deploy());
});

gulp.task("watch", ["sass", "babel", "browserSync"], function() {
  gulp.watch("src/scss/**/*.scss", ["sass"]);
  gulp.watch("src/js/**/*.es6.js", ["babel"]);
  gulp.watch("src/*.html", browserSync.reload);
});
