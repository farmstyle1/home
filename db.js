var mongojs = require('mongojs');

var databaseUrl = 'test';
var collections = ['users'];

var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};