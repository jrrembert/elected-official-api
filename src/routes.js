'use strict';
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

exports.appRoot = function(req, res) {
    res.send('Welcome to the Elected Officials API!');
};

exports.getAllGovernors = function(req, res) {
    var db = req.db;
	var collection = db.get('governors');

	collection.find({}, ['-_id'], function(e, docs) {
		res.json(docs);
    });
};

exports.getGovernorById = function(req, res) {
	var db = req.db;
	var collection = db.get('governors');

	collection.findOne({ '_id': req.params.id }, ['-_id'], function(e, doc) {
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
