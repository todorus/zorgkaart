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
  var ids = event["regions"].join();

  db.sequelize.query(
    "SELECT * FROM \"Regions\" "+
    "WHERE type=1 AND id IN (" + ids + ") "+
    "OR id IN ( SELECT \"ChildId\" FROM \"RegionToRegions\" WHERE \"ParentId\" IN (" + ids + "))",
    { type: db.sequelize.QueryTypes.SELECT}
  ).then(
    function (result) {
      var response = result.map(function (currentValue, index, original) {
        return {
          id: currentValue["id"],
          name: currentValue["name"],
          type: currentValue["type"],
          area: currentValue["area"]
        };
      });
      context.succeed(response);
    },
    function (error) {
      context.fail(error);
    }
  )

};