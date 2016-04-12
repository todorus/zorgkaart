'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
var env = require('serverless-helpers-js').loadEnv();

// Require Logic
var db = require(__dirname + '/../../lib/models');
var Region = db["Region"];

// Lambda Handler
module.exports.handler = function (event, context) {

  var type = Region.TYPE_ZIP;
  // Serverless does not support parsed query parameters, but rather a string. This is a workaround until this issue
  // is resolved
  var idArray = JSON.parse(event["regions"])

  Region.atomize(idArray).then(
    function (result) {
      var response = Region.toJson(result);
      context.succeed(response);
    },
    function (error) {
      context.fail(error);
    }
  )

};