'use strict';

require('rootpath')();

var _ = require('underscore');
var String = require('./utils');
var config = require('src/config');

var fields = ['-_id'];

var queryResults = function(err, results) {
    if (!results) {
        console.error(err);
        return {results: "Something really bad happened. Try again later."};
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

var processCongressQuery = function(query) {
    var newQuery = query;

    if (query.state) {
        // We want 'state' to be flexible in terms of what it accepts as a
        // valid parameter as well as keep our search syntax somewhat
        // similar to /governor queries.

        // We're introducting an intentional bias towards the 'state' param.
        // If present in 'query', we will attempt to normalize 'newQuery' based
        // on the value of 'query.state' and update 'newQuery' accordingly.
        if (query.state.length === 2) {
            newQuery.state = query.state.toUpperCase();
            delete newQuery.state_name;
        } else {
            newQuery.state_name = query.state.capitalize();
            delete newQuery.state;
        }
    }

    if (query.party){
        var reRep = /republicans?\b/i;
        var reDem = /democrats?\b/i;
        var reInd = /independents?\b/i;

        newQuery.party = query.party.toUpperCase();

        reRep.test(query.party) ? newQuery.party = "R" : newQuery;
        reDem.test(query.party) ? newQuery.party = "D" : newQuery;
        reInd.test(query.party) ? newQuery.party = "I" : newQuery;
    }

    return newQuery;
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
	collection.findOne({ '_id': req.params.id }, fields, function(err, doc) {
        res.json(queryResults(err, doc));
	});
};

exports.getCongressMembers = function(req, res) {
    var db = req.db;
    var collection = db.get(config.get('database.congress_collection'));

    if (_.isEmpty(req.query)) {
        collection.find({}, fields, function(err, docs) {
            res.set({
                'Cache-Control': '3600'
            });
            res.json(queryResults(err, docs));
        });
    } else {
        collection.find(processCongressQuery(req.query), fields,
            function(err, docs) {
                res.json(queryResults(err, docs));
            }
        );
    }
};

exports.getCongressMemberById = function(req, res) {
    var db = req.db;
    var collection = db.get(config.get('database.congress_collection'));
    collection.findOne({ '_id': req.params.id }, fields, function(err, doc) {
        res.json(queryResults(err, doc));
	});
};
