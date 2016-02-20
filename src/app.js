'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var config = require('./config.js');
var routes = require('./routes.js');

// DB settings
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.DB_URI ||
			  config.get('database.host') + ':' +
			  config.get('database.port') + '/' +
			  config.get('database.name'));

var app = express();
app.settings.env = config.get('env');
// Needed to allow Heroku to set port
var port = process.env.PORT || config.get("app.port");

app.use(favicon(__dirname + '/../assets/favicon.ico'));

// Make db accessible to requests
app.use(function(req, res, next) {
	req.db = db;
	next();
});

app.get('/', routes.appRoot);
app.get('/v1/governors', routes.getGovernors);
app.get('/v1/governors/:id', routes.getGovernorById);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('404 Not Found');
	err.status = 404;
	next(err);
});

// Error handlers

// Development/Local or Test - print stacktraces
if (app.get('env').toString() !== 'production') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		// Would be better to render this in html
		res.json({message: err.message, status: res.statusCode, error: err.stack });
	});
}

// Production - don't display stacktraces
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({message: err.message, error: {}});
});

var server = app.listen(port, function() {
	console.log("Server running on port " + port + ". Press Ctrl-C to exit.");
});

module.exports = server;
