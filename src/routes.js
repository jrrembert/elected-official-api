'use strict';

require('rootpath')();

var _ = require('underscore');
var String = require('./utils');
var config = require('src/config');

var fields = ['-_id'];

var queryResults = function(err, results) {
    if (!results) {
        return {results: "Something really bad happened. Try again later."}
    }

    if (results.length === 0) {
        return {results: "No results found."};
    }

    return results;
};

var processGovernorQuery = function(query) {
    var new_query = {};

    if (query.state) {
        // If 2-digit state code given, transform query to search
        // 'state_abbreviation' attribute rather than 'state'
        if (query.state.length === 2) {
            for (var key in query) {
                (key === "state") ? new_query : new_query[key] = query[key];
            }
            var stateAbbreviation = query.state.toUpperCase();
            new_query.state_abbreviation = stateAbbreviation;
            return new_query;
        }

        new_query = query;
        new_query.state = query.state.capitalize();
        return new_query;
    }

    return query;
};

exports.appRoot = function(req, res) {
    res.send('Welcome to the Elected Officials API!');
};

exports.getGovernors = function(req, res) {
    var db = req.db;
	var collection = db.get(config.get('database.gov_collection'));

    if (_.isEmpty(req.query)) {
        collection.find({}, fields, function(err, docs) {
            res.json(queryResults(err, docs));
        });
    } else {
        collection.find(processGovernorQuery(req.query), fields, function(err, docs) {
            res.json(queryResults(err, docs));
        });
    }
};

exports.getGovernorById = function(req, res) {
	var db = req.db;
	var collection = db.get(config.get('database.gov_collection'));
	collection.findOne({ '_id': req.params.id }, ['-_id'], function(err, doc) {
        res.json(queryResults(err, doc));
	});
};
