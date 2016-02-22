'use strict';

require('rootpath')();

var app_name = 'elected-officials-rest-api';

var convict = require('convict');
var fs = require('fs');

var config = convict({
    env: {
        doc: app_name + ' application environment.',
        format: ['production', 'local', 'development', 'test'],
        default: 'local',
        env: 'NODE_ENV',
        arg: 'node-env'
    },
    app: {
        host: {
            doc: 'Application hostname/IP.',
            format: String,
            default: 'localhost',
            env: 'APP_HOST'
        },
        port: {
            doc: 'Application port.',
            format: 'port',
            default: 3000,
            env: 'APP_PORT'
        }
    },
    database: {
        host: {
            doc: 'Database hostname/IP.',
            format: String,
            default: 'localhost',
            env: 'DB_HOST'
        },
        port: {
            doc: 'Database port.',
            format: 'port',
            default: 27017,
            env: 'DB_PORT'
        },
        name: {
            doc: 'Database name.',
            format: String,
            default: 'elected_officials',
            env: 'DB_NAME'
        }
    }
});

// Load environment configs
var env = config.get('env');

var config_path = 'src/' + env + '_config.json';
try {
    fs.accessSync(config_path, fs.F_OK);
    config.loadFile(config_path);
} catch (err) {
    console.log(err);
}

config.validate({strict: true});

module.exports = config;
