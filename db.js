var mongojs = require('mongojs');

var databaseUrl = 'test';
var collections = ['member','payhistory'];

var connect = mongojs(databaseUrl, collections);

module.exports = {
    connect: connect
};