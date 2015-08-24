module.exports = ($, usehtml) ->

  # distribution folder
  dist = '_build/'
  distApp = dist + 'app/'
  distAST = distApp + 'assets/'
  source = 'src/' # for abs path construction

  markupEngine = if usehtml then 'html' else 'jade'
  markupExt = '.' + markupEngine

  # main source folders
  srcAST  = 'assets/'
  srcIMG  = srcAST + 'img/'
  srcLNG  = srcAST + 'langs/'
  srcLESS = source + 'less/'
  srcHTML = source + markupEngine + '/'
  srcJS = source + 'js/'
  distJS = distApp + 'js'

  # Shared config object
  config =
    #
    # Paths
    #
    dist:    dist,
    distApp: distApp,
    distAST: distAST,
    distCSS: distApp + 'css',
    distIMG: distAST + 'img',
    distLNG: distAST + 'langs',
    distJS:  distJS,
    source:  source,
    srcAST:  srcAST,
    srcIMG:  srcIMG,
    srcLNG:  srcLNG,
    srcLESS: srcLESS,
    srcHTML: srcHTML,
    srcJS:   srcJS,
    html:
      index: [srcHTML + 'index' + markupExt],
      views: [srcHTML + '**/*' + markupExt, '!'+srcHTML + 'index' + markupExt ],
      templates: [srcHTML + 'views/cached/*' + markupExt]
      all: [srcHTML + '**/*' + markupExt]
    ,
    less:
      styles: [srcLESS + 'styles.less'],
      watch: [srcLESS + 'app/**/*.less']
    ,

    bootstrap: [srcLESS + 'bootstrap/bootstrap.less'],
    js: [srcJS + 'app.module.js', srcJS + 'modules/**/*.js', srcJS + 'custom/**/*.js'],
    assets: [srcAST + '**/*'], # TODO: separate plugins
    build: ['gulp*'],
    distJSPaths: ['app/js/app.js'],

    ###
    # Plugins
    ###
    plato:
      js: srcJS + '**/*.js'
    ,
    report: './report/',
    tplcache:
      file: 'templates.js',
      opts:
        standalone: false,
        root: 'templates',
        module: 'naut'
    ,
    webserver:
      webroot:          dist,
      # host:             'localhost',
      # port:             '3000',
      # host:             '192.168.38.1',
      # port:             '3333',
      host:             '192.168.40.38',
      port:             '5151',
      livereload:       true,
      directoryListing: false
    ,
    prettify:
      indent_char: ' ',
      indent_size: 3,
      unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
    ,
    usemin:
      path: '.',
      css: [$.minifyCss(), 'concat', $.rev()],
      # html: [$.minifyHtml({empty: true})],
      vendor: [$.uglify( {preserveComments:'some'} ), $.rev()],
      js: [$.ngAnnotate(), $.uglify( {preserveComments:'some'} ), $.rev()]

  # scripts to check with jshint
  config.lintJs = [].concat config.js, config.distJS

  config
