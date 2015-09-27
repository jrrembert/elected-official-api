'use strict';

var https = require('https');
var fs = require('fs');
var express = require('express');

var abbreviations = require('./mock/abbreviations.json');
var officials = require('./mock/state_officials.json');

// HTTPS config
var options = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt'),
	requireCert: false,
	rejectUnauthorized: false
};

var app = express();

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
}

app.get('/', function(req, res) {
	res.send('Welcome to the Elected Officials API!');
})

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
		res.json({"error": req.query.state + ' not found.'})
})

var server = https.createServer(options, app).listen(3000, function() {
	console.log("Server running on port 3000. Press Ctrl-C to exit.")
})
