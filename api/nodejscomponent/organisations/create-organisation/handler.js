'use strict';

// Require Serverless ENV vars
var env = require('serverless-helpers-js').loadEnv();

// Require Logic
var db = require(__dirname + '/../../lib/models');
var Organisation = db["Organisation"];

module.exports.handler = function(event, context) {

  var properties = {
    name: event["name"],
    description: event["description"],
    contact_information: event["contact_information"]
  };

  Organisation.create(properties).then(
    function(result){
      var created = result[0];
      var response = Organisation.toJson(created.data);
      context.succeed(response);
    }
  ).catch(function(error){
    console.log("create org "+error);
    context.fail(error);
  });

};
