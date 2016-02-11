var mongojs = require('mongojs');

var databaseUrl = 'test';
var collections = ['users','friends'];

var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};