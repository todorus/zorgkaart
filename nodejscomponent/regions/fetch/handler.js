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

  var where = null;
  if (event.query != undefined && event.query != null) {
    where = {
      name: {
        $iLike: '%' + event.query + '%'
      }
    };
  }

  var limit = null;
  if (event.limit != undefined && event.limit != null) {
    limit = event.limit;
  }

  Region.findAll(
    {
      where: where,
      limit: limit,
      order: 'lower("Region"."name") ASC'

    }
  ).then(
    function (result) {
      var response = result.map(function (currentValue, index, original) {
        return {
          name: currentValue["name"],
          type: currentValue["type"]
        };
      });
      context.succeed(response);
    },
    function (error) {
      context.fail(error);
    }
  );

};