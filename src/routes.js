'use strict';

var _ = require('underscore');
var String = require('./utils')

var fields = ['-_id'];

var queryResults = function(err, results) {
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
	var collection = db.get('governors');

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
	var collection = db.get('governors');

	collection.findOne({ '_id': req.params.id }, ['-_id'], function(err, doc) {
		res.json(queryResults(err, doc));
	});
};
