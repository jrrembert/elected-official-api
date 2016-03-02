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

describe('Test DB setup and structure', function() {
    var db,
        collection;

    before(function (done) {
        db = monk(db_uri);
        collection = db.get(config.get('database.gov_collection'));
        done();
    });
    after(function (done) {
        db.close(done);
    });
    it("connect and initialize db", function (done) {
        should.exist(db);
        done();
    });
    it("collections exist", function (done) {
        should.exist(collection);
        done();
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
            .expect(200, done);
    });
    it('server responds to /governors', function(done) {
        request(server)
            // TODO: pass in api version as slug
            .get('/v1/governors')
            .expect(200, done);
    });
    it('server responds to /congress', function(done) {
        request(server)
            .get('/v1/congress')
            .expect(200, done)
    })
    it('404 on routes that don\'t exist', function(done) {
        request(server)
            .get('/sultans')
            .expect(404, done);
    });
});

describe('Test endpoints that accept params', function() {
    var db,
        collection,
        doc,
        server;

    // TODO: If db isn't running, this may fail with a really unhelpful message.
    before(function (done) {
        db = monk(db_uri);
        collection = db.get(config.get('database.gov_collection'));
        collection.insert( {name: 'test_document'}, function(err, docs) {
            if (err) {
                return err;
            }
            doc = docs;
            done();
        });
    });
    after(function (done) {
        collection.drop(function (err) {
            if (err) {
                return err;
            }
        });
        db.close(done);
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
            .get('/v1/governors/' + doc['_id'])
            .expect(200, done);
    });
});
