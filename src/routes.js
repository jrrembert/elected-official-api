'use strict';

var _ = require('underscore');
// var express = require('express');
// var router = express.Router();
//
//
// router.get('/v1/myapi', function(req, res) {
// 	var db = req.db;
// 	var collection = db.get('governors');
//
// 	collection.find({}, {}, function(e, docs) {
// 		res.json(docs);
// 	});
//
// 	// if (!req.query.state) {
// 	// 	res.json(officials);
// 	// }
// 	// debugger;
//
//     //
// 	// var official = "";
//     //
// 	// if (req.query.state.length < 3) {
// 	// 	var stateAbbreviation = req.query.state.toUpperCase();
// 	// 	var state = abbreviations[stateAbbreviation];
// 	// 	official = officials[state];
// 	// } else {
// 	// 	official = officials[req.query.state.capitalize()];
// 	// }
//     //
// 	// if (official !== undefined) {
// 	// 	res.json(official);
// 	// } else
// 	// 	res.status(400).json({error: req.query.state + ' not found.'});
// });
//
// module.exports = router;

var queryResults = function(err, results) {
    if (results.length === 0) {
        return {results: "No results found."};
    }
    return results;
};


exports.appRoot = function(req, res) {
    res.send('Welcome to the Elected Officials API!');
};

exports.getAllGovernors = function(req, res) {
    var db = req.db;
	var collection = db.get('governors');

    if (_.isEmpty(req.query)) {
        collection.find({}, ['-_id'], function(err, docs) {
            res.json(docs);
        });
    } else {
        if (req.query.state) {
            // A bit superfluous, kill at earliest leisure
            if (req.query.state.length > 2) {
                collection.find({'state': req.query.state}, ['-_id'], function(err, docs) {
                    res.json(queryResults(err, docs));
                });
            }
            // if (req.query.state.length === 2) {
            //     var stateAbbreviation = req.query.state.toUpperCase();
            //     collection.find({
            //         'state_abbreviation': stateAbbreviation},
            //         ['-_id', {'url': req.domain.path}],
            //         function(e, docs) {
            //
            //
            // }
        } else {

        collection.find(req.query, function(err, docs) {
            res.json(docs);
        });
    }
        //
        // if (req.query.state.length < 3) {
        //     var stateAbbreviation = req.query.state.toUpperCase();
        //     collection.find({'state_abbreviation': stateAbbreviation}, ['-_id', {'url': req.domain.path}], function(e, docs) {
        //         res.json(docs);
        //     });
        // } else if (req.query.state) {
        //     collection.find({'state': req.query.state}, ['-_id'], function(e, docs) {
        //         res.json(docs);
        //     });
        // }
    }
};

exports.getGovernorById = function(req, res) {
	var db = req.db;
	var collection = db.get('governors');

	collection.findOne({ '_id': req.params.id }, ['-_id'], function(err, doc) {
		res.json(doc);
	});
};

// app.get('/v1/governors', function(req, res) {
// 	var db = req.db;
// 	var collection = db.get('governors');
//
// 	collection.find({}, ['-_id'], function(e, docs) {
// 		res.json(docs);
// 	});
//
// 	if (req.query) {
// 		debugger;
// 	}
//
// 	// if (!req.query.state) {
// 	// 	res.json(officials);
// 	// }
// 	// debugger;
// 	//
// 	//
// 	// var official = "";
// 	//
// 	// if (req.query.state.length < 3) {
// 	// 	var stateAbbreviation = req.query.state.toUpperCase();
// 	// 	var state = abbreviations[stateAbbreviation];
// 	// 	official = officials[state];
// 	// } else {
// 	// 	official = officials[req.query.state.capitalize()];
// 	// }
// 	//
// 	// if (official !== undefined) {
// 	// 	res.json(official);
// 	// } else
// 	// 	res.status(400).json({error: req.query.state + ' not found.'});
// });
