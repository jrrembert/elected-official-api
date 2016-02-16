'use strict';

var express = require('express');
var favicon = require('serve-favicon');

// DB settings
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017')



var abbreviations = require('./mock/abbreviations.json');
var officials = require('./mock/state_officials.json');

// Serve favicon
// TODO: is this overkill?
app.use(favicon(__dirname + '/assets/favicon.ico'));



var app = express();

// Needed to allow Heroku to set port
var port = process.env.PORT || 8080;

// Simple attempt to normalize data by extending the native String object.
// Wouldn't normally play with native types like this, but it's convenient here.
String.prototype.capitalize = function() {
	var strSplit = this.split(" ");
	var newStr = "";

	for (var i = 0; i < strSplit.length; i++) {
		if (i === 0) {
			newStr += strSplit[i].charAt(0).toUpperCase() + strSplit[i].slice(1).toLowerCase();
		} else {
			newStr += " " + strSplit[i].charAt(0).toUpperCase() + strSplit[i].slice(1).toLowerCase();
		}
	}
	return newStr;
};





app.get('/', function(req, res) {
	res.send('Welcome to the Elected Officials API!');
});

app.get('/myapi', function(req, res) {
	if (!req.query.state) {
		res.json(officials);
	}

	var official = "";

	if (req.query.state.length < 3) {
		var stateAbbreviation = req.query.state.toUpperCase();
		var state = abbreviations[stateAbbreviation];
		official = officials[state];
	} else {
		official = officials[req.query.state.capitalize()];
	}

	if (official !== undefined) {
		res.json(official);
	} else
		res.status(400).json({error: req.query.state + ' not found.'});
});


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('404 Not Found');
	err.status = 404;
	next(err);
});

// Error handlers

// Development - print stacktraces
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// Production - don't display stacktraces
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



app.listen(port, function() {
	console.log("Server running on port " + port + ". Press Ctrl-C to exit.");
});

module.exports = app;
