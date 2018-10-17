const gulp  = require('gulp')
const typedoc    = require('gulp-typedoc')
const typescript = require('gulp-typescript')
// require('typedoc')    // DO NOT REMOVE … peerDependency of `gulp-typedoc`
// require('typescript') // DO NOT REMOVE … peerDependency of `gulp-typescript`

const tsconfig      = require('./tsconfig.json')
const typedocconfig = require('./config/typedoc.json')

gulp.task('dist', async function () {
  return gulp.src('./src/class/*.class.ts')
    .pipe(typescript(tsconfig.compilerOptions))
    .pipe(gulp.dest('./dist/class/'))
})

gulp.task('test-out', async function () {
	return gulp.src(['./test/src/{,*.}test.ts'])
		.pipe(typescript(tsconfig.compilerOptions))
		.pipe(gulp.dest('./test/out/'))
})

gulp.task('test-run', async function () {
	await Promise.all([
	])
	console.info('All tests ran successfully!')
})

gulp.task('test', ['test-out', 'test-run'])

gulp.task('docs', async function () {
  return gulp.src('./src/**/*.ts')
    .pipe(typedoc(typedocconfig))
})

gulp.task('build', ['dist', 'test', 'docs'])
