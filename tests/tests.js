'use strict';

require('rootpath')();

var request = require('supertest');
var config = require('src/config');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var assert = chai.assert;
var should = chai.should();
var monk = require('monk');

var db_uri = config.get('database.host') + ':' + config.get('database.port') +
    '/' + config.get('database.name');

chai.use(chaiAsPromised);

if (process.env.NODE_ENV !== 'test') {
    console.log("NODE_ENV=" + process.env.NODE_ENV + ". NODE_ENV should equal 'test' when running tests.");
    process.exit(1);
}

describe('Helper methods', function() {
    describe('#String.prototype.capitalize', function() {
        require('src/utils');
        it('should capitalize the first letter in each space-delimited word passed to it', function() {
            assert.equal('Foo,bar%baz', 'foo,bar%baz'.capitalize());
            assert.equal('Foo Bar Baz', 'Foo bar baz'.capitalize());
            assert.equal('Foo', 'foo'.capitalize());
        });
    });
});

describe('Test API endpoints', function() {
    var server;

    beforeEach(function() {
        delete require.cache[require.resolve('src/app')];
        server = require('src/app');
    });
    afterEach(function (done) {
        server.close(done);
    });
    it('server responds to / (root)', function(done) {
        request(server)
            .get('/')
            .expect(200)
            .expect('Welcome to the Elected Officials API!', done);
    });
    it('server responds to /governors', function(done) {
        request(server)
            // TODO: pass in api version as slug
            .get('/v1/governors')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done);
    });
    it('server responds to /congress', function(done) {
        request(server)
            .get('/v1/congress')
            .expect(200, done);
    });
    it('404 on routes that don\'t exist', function(done) {
        request(server)
            .get('/sultans')
            .expect(404, done);
    });
});

describe('Test endpoints that accept params', function() {
    var db,
        govCollection,
        congressCollection,
        govDoc,
        congressDoc,
        server;

    var testGovDoc = {
        'name': 'test_gov_document',
        'party': 'test_party',
        'state': 'sc'
    };
    var testCongressDoc = {
        'name': 'test_congress_document',
        'party': 'test_party',
        'state': 'nc'
    };

    // TODO: If db isn't running, this may fail with a really unhelpful message.
    before(function (done) {
        db = monk(db_uri);
        govCollection = db.get(config.get('database.gov_collection'));
        congressCollection = db.get(config.get('database.congress_collection'));

        govCollection.insert(testGovDoc, function(err, docs) {
            if (err) {
                return err;
            }
            govDoc = docs;
        });
        congressCollection.insert(testCongressDoc, function(err, docs) {
            if (err) {
                return err;
            }
            congressDoc = docs;
        });
        setTimeout(done, 1000);
    });
    after(function (done) {
        govCollection.drop(function (err) {
            if (err) {
                return err;
            }
        });
        congressCollection.drop(function (err) {
            if (err) {
                return err;
            }
        });
        setTimeout(db.close(done), 1000);
    });
    beforeEach(function() {
        delete require.cache[require.resolve('src/app')];
        server = require('src/app');
    });
    afterEach(function (done) {
        server.close(done);
    });
    it('can call a governor resource by id', function(done) {
        request(server)
            .get('/v1/governors/' + govDoc._id)
            .expect(200)
            .end(function(err, result) {
                assert.equal(result.body.name, 'test_gov_document');
                assert.equal(result.body.state, 'sc');
                done();
            });
    });
    it('can call a congress resource by id', function(done) {
        request(server)
            .get('/v1/congress/' + congressDoc._id)
            .expect(200, {
                name: 'test_congress_document',
                party: 'test_party',
                state: 'nc'
            }, done);
    });
});
