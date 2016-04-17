'use strict';

var env       = process.env.NODE_ENV || 'local';
var config    = require(__dirname + '/../config/db.json')[env];

//Create a db object. We will using this object to work on the DB.
var url = config["protocol"] + "://" + config["username"] + ":" + config["password"] + "@" + config["host"] + ":" + config["port"];
var neo4j = require('node-neo4j');
var db = new neo4j(url);
var databaseName = config["database"];

module.exports = db;
module.exports.Region = require('./Region.js')(db, databaseName);
