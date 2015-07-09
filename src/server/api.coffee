elasticsearch = require 'elasticsearch'

client = new elasticsearch.Client
	host: 'localhost:9200'
	log: 'error'

class Api
	constructor: ()->
		
	getLeaksData: (req, res) ->
		searchObj =
			index: 'dbleaks'
			type: 'currentMemoryLeaksLogs'
			size: 1000
			body:
				sort: [
					{date: {"order": "asc"}}
					{date: {"order": "asc"}}
				],
				"query":
					"filtered" :
						"filter" :
							"bool" :
								"must" : [
									{"term" :
										"_type" : "currentMemoryLeaksLogs"
									}
									{"term" :
										"idReporters" : "4"
									}
								]
		client.search(searchObj
		,(error, response) ->
			if error
				res.status(500).send(error)
				throw error

			res.send(response)
		)

	getReportersLeaksData: (req, res) ->
		searchObj =
			index: 'dbleaks'
			type: 'currentMemoryLeaksLogs'
			size: 1000
			body:
				sort: [
					{date: {"order": "asc"}}
					{date: {"order": "asc"}}
				],
				"query":
					"filtered" :
						"filter" :
							"bool" :
								"must" : [
									{"term" : 
										"_type" : "currentMemoryLeaksLogs"
									}
									{"term" :
										"idReporters" : req.params.id
									}
								]
		client.search(searchObj
		,(error, response) ->
			if error
				res.status(500).send(error)
				throw error

			res.send(response)
		)


	getReporters: (req, res) ->
		searchObj =
			index: 'dbleaks'
			type: 'reporters'
			size: 50
			body:
				sort: [
					{strFrom: {"order": "asc"}}
				],
				"query":
					"filtered" :
						"filter" :
							"bool" :
								"must" : [
									{"term" : 
										"_type" : "reporters"
									}
								]
		client.search(searchObj
		,(error, response) ->
			if error
				res.status(500).send(error)
				throw error

			res.send(response)
		)

module.exports = new Api()
