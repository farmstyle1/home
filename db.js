var mongojs = require('mongojs');

var databaseUrl = 'test';
var collections = ['member','payhistory','counters'];

var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};