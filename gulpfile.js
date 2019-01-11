const gulp = require('gulp');
const pi = require('gulp-load-plugins')();
const path = {
	"js": [
		'js/*.js',
		'!js/swiper.min.js',
		'!js/echarts-tempture.js',
		'!js/jquery.js'
	],
	"noBuild-js":['js/swiper.min.js', 'js/echarts-tempture.js', 'js/jquery.js'] 
}


gulp.task('uglifyJs', () =>{
	return gulp.src(path["noBuild-js"])
		.pipe(pi.sourcemaps.init())
		.pipe(pi.uglify())
		.pipe(pi.sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
});

gulp.task('es6Toes5', ()=>{
	return gulp.src(path['js'])
		.pipe(pi.sourcemaps.init())
		.pipe(pi.babel())
		.pipe(pi.uglify())
		.pipe(pi.sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
})

gulp.task('default', ['es6Toes5', 'uglifyJs']);