#
# Module dependencies
#
express = require 'express'
http    = require 'http'
path    = require 'path'
api     = require './api'
logger  = require 'morgan'
multer  = require 'multer'
bodyParser = require 'body-parser'
errorHandler = require 'errorhandler'
methodOverride  = require 'method-override'

app = module.exports = express()
#
# Configuration
#

assetsPath = path.join(__dirname, '../../', 'build')

# all environments
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded({ extended: true })
app.use multer()
app.use methodOverride()
app.use express.static(assetsPath)

# development only
if app.get('env') is 'development'
	app.use errorHandler()

# production only
# if app.get('env') is 'production'
# TODO

#
# Routes
#

# JSON API
app.get '/leaksdata/:id', (req, res) -> res.send 'testing 1'# api.getReportersLeaksData
app.get '/reporters',  (req, res) -> res.send 'testing 2'# api.getReporters

# serve index for all other routes
app.get '*', (req, res) -> res.sendFile "#{assetsPath}/index.html"

#
# Start Server
#
module.exports.startServer = (port, path, callback) ->
	app.set 'port', port
	http.createServer(app).listen port, ->
		console.log "Express server listening on port #{port}"
		callback?()
