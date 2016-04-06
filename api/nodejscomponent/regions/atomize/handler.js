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
  var ids = idArray.join();

  db.sequelize.query(
    "SELECT * FROM \"Regions\" WHERE id IN (" + ids + ") ",
    { type: db.sequelize.QueryTypes.SELECT}
  ).then(
    function (result) {

      var zips = [];
      for(var i = 0; i < result.length; i++){
        var region = result[i];
        for(var j=0; region.zips != null && j < region.zips.length; j++){
          var zip = region.zips[j];
          if(zips.indexOf(zip) == -1){
            zips.push(zip);
          }
        }
      }

      var zipsString = "'"+zips.join("','")+"'";

      return db.sequelize.query(
        "SELECT * FROM \"Regions\" WHERE name IN (" + zipsString + ") ",
        { type: db.sequelize.QueryTypes.SELECT}
      )

    },
    function (error) {
      context.fail(error);
    }
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