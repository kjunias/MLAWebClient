argv = require('yargs').argv
usehtml = argv.usehtml
usertl  = argv.usertl

gulp        = require 'gulp'
gutil       = require 'gulp-util'
path        = require 'path'
glob        = require 'glob'
del         = require 'del'
runSequence = require 'run-sequence'
gulpsync    = require('gulp-sync')(gulp)
$           = require('gulp-load-plugins')()
config      = require('./gulp.config')($, usehtml)

# production mode
isProduction = false

##########
# TASKS
##########

# APP LESS
gulp.task 'styles', () ->
  log 'Compiling styles from LESS to CSS..'
  gulp.src(config.less.styles)
    .pipe( if isProduction then gutil.noop() else $.sourcemaps.init())
    .pipe($.less())
    .on("error", handleError)
    .pipe( $.if(usertl, $.rtlcss()) )
    .pipe( if isProduction then $.minifyCss() else gutil.noop() )
    .pipe( if isProduction then gutil.noop() else $.sourcemaps.write("./"))
    .pipe(gulp.dest( config.distCSS ))

# BOOSTRAP
gulp.task 'bootstrap', () ->
  log 'Compiling Bootstrap..'
  gulp.src(config.bootstrap)
    .pipe( if isProduction then gutil.noop() else $.sourcemaps.init())
    .pipe($.less())
    .on("error", handleError)
    .pipe( $.if(usertl, $.rtlcss()) )
    .pipe( if isProduction then $.minifyCss() else gutil.noop() )
    .pipe( if isProduction then gutil.noop() else $.sourcemaps.write("./"))
    .pipe(gulp.dest( config.distCSS ))

# SCRIPTS
gulp.task 'scripts', () ->
  log 'Compiling Scripts..'
  gulp.src(config.js)
    .pipe( if isProduction then gutil.noop() else $.sourcemaps.init())
    .pipe($.concat('app.js'))
    .on("error", handleError)
    .pipe( if isProduction then $.minifyCss() else gutil.noop() )
    .pipe( if isProduction then gutil.noop() else $.sourcemaps.write("./"))
    .pipe(gulp.dest( config.distJS ))

# BOWER VENDOR SCRIPTS
gulp.task 'bower', () ->
  log 'Fetching Bower Vendor Scripts..'
  $.bower()

# ASSETS
gulp.task 'assets', () ->
  log 'Copying assets..'
  gulp.src(config.srcAST + '**/*')
    .pipe(gulp.dest( config.distAST ))

# HTML
gulp.task 'markup', ['index', 'views']

gulp.task 'views', () -> buildMarkup(config.html.views, config.distApp)
  
gulp.task 'index', ['templatecache'], () -> buildMarkup(config.html.index, '_build/', false, true)

gulp.task 'templatecache', () -> buildMarkup(config.html.templates, config.distApp + 'js', true)

###
# SERVER
###
gulp.task 'webserver', () ->
  log "Starting web server on port #{config.webserver.port}..."
  gulp.src config.webserver.webroot
    .pipe $.webserver config.webserver

# gulp.task 'myserv', () ->
#   log 'Starting express server...'
#   server.startServer config.server.port

###
# WATCH
###
# Rerun the task when a file changes
gulp.task 'watch', () ->
  log('Starting watch with live reload ...')

  $.livereload.listen()

  gulp.watch([config.less.watch, config.less.styles], ['styles'])
  gulp.watch(config.bootstrap, ['bootstrap'])
  gulp.watch(config.html.all, ['markup'])
  gulp.watch(config.js, ['scripts'])
  gulp.watch(config.html.templates, ['templatecache'])
  gulp.watch(config.assets, ['assets', 'templatecache'])
  gulp.watch(config.build, ['default'])

  gulp.watch([].concat(config.less.watch, config.assets, config.html.views, config.html.templates, config.js, config.build))
    .on 'change', (event) ->
      setTimeout () ->
        $.livereload.changed event.path
      , 700
    
###
# Clean
###
gulp.task 'clean-full', ['clean-scripts','clean-vendor-scripts', 'clean-styles', 'clean-markup', 'clean-assets']

gulp.task 'clean', ['clean-scripts', 'clean-styles', 'clean-markup', 'clean-assets']

gulp.task 'clean-scripts', (cb) ->
  js = config.distJS + '/*{js,map}'
  clean(js, cb)

gulp.task 'clean-vendor-scripts', (cb) ->
  js = config.dist + 'vendor/*'
  clean(js, cb)

gulp.task 'clean-styles', (cb) ->
  css = config.distCSS + '/*{css,map}'
  clean(css, cb)

gulp.task 'clean-assets', (cb) ->
  ast = config.distAST + '*'
  clean(ast, cb)

gulp.task 'clean-markup', (cb) ->
  html = [config.dist + 'index.html', config.distApp + 'views/']
  clean html, cb

gulp.task 'clean-build', ['clean-markup'], (cb) ->
  log 'Removing development js & css'
  delFiles = [
        config.distJS + '/' + config.tplcache.file,
        config.distCSS + '/bootstrap.css',
        config.distCSS + '/styles.css'
    ]
  clean delFiles, cb

###
# Lint the code and create coverage report
###
gulp.task 'lint', () ->
  log 'Analyzing source with JSHint'
  gulp
    .src config.lintJs
    .pipe $.jshint()
    .pipe $.jshint.reporter 'jshint-stylish', verbose: true
    .pipe $.jshint.reporter 'fail'


###
# Visualizer report
###
gulp.task 'plato', (done) ->
  log 'Analyzing source with Plato'
  log 'Browse to /report/plato/index.html to see Plato results'
  startPlatoVisualizer done


###
# MAIN TASKS
###
# build for production
gulp.task 'build', [], (callback) ->
  runSequence 'clean', 'production', 'compile', 'clean-build', callback

gulp.task 'production', () -> isProduction = true

# default (no minify, sourcemaps and watch)
gulp.task 'default', (callback) ->
  runSequence 'clean', 'compile', 'watch', 'done', callback
.task 'done', done

# serve development by default
gulp.task 'serve', (cb) ->
  runSequence 'default', 'webserver', cb

# optional serve production
gulp.task 'serve-build', (cb) ->
  runSequence 'clean-vendor-scripts', 'bower', 'build', 'webserver', cb

# run tasks without watch
gulp.task 'compile',[
          'bower',
          'bootstrap',
          'styles',
          'scripts',
          'assets',
          'templatecache',
          'markup'
        ]

###
# Error handler
###
handleError = (err) ->
  console.log(err.toString())
  this.emit('end')


###
# Build html templates
# @param  {string} src           source files folder
# @param  {string} dst           target folder
# @param  {boolean} useTplcache  Should generate angular template cache
# @return {stream}
###
buildMarkup = (src, dst, useTplcache, useMin) ->
  if useTplcache then log('Creating AngularJS templateCache..')
  gulp.src( src )
    .pipe( if isProduction then gutil.noop() else $.changed(dst, { extension: '.html' }))
    .pipe( $.if( !usehtml, $.jade( {
      locals: {
        # scripts: glob.sync(config.source  + 'js/**/*.js')
        scripts: config.distJSPaths
      }
    })))
    .on("error", handleError)
    .pipe($.htmlPrettify(config.prettify))
    .pipe( if (isProduction and useMin) then $.usemin( config.usemin ) else gutil.noop())
    .pipe( if useTplcache then $.angularTemplatecache( config.tplcache.file, config.tplcache.opts ) else gutil.noop())
    .pipe(gulp.dest( dst ))

###
# Delete all files in a given path
# @param  {Array}   path - array of paths to delete
# @param  {Function} done - callback when complete
###
clean = (path, done) ->
  log('Cleaning: ' + $.util.colors.blue(path))
  del path, done

###
# Start Plato inspector and visualizer
###
startPlatoVisualizer = (done) ->
  log 'Running Plato'
  files = glob.sync config.plato.js
  excludeFiles = /.*\.spec\.js/
  plato = require 'plato'
  options =
        title: 'Plato Inspections Report',
        exclude: excludeFiles

  outputDir = config.report + 'plato/'
  plato.inspect files, outputDir, options, platoCompleted

  platoCompleted = (report) ->
    overview = plato.getOverviewReport report
    log overview.summary
    if done then done()

###
# Just to be polite :)
###
done = () ->
  setTimeout(() ->
    log('Done.. Watching code and reloading on changes..')
  , 500)


###
# Standard log
###
log = (msg) ->
  prefix = '*** '
  gutil.log(prefix + msg)
