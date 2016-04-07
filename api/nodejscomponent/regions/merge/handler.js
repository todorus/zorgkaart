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
var turf = require('turf');
var db = require(__dirname + '/../../lib/models');
var Region = db["Region"];

// Lambda Handler
module.exports.handler = function (event, context) {

  var type = Region.TYPE_ZIP;
  // Serverless does not support parsed query parameters, but rather a string. This is a workaround until this issue
  // is resolved
  var idArray = JSON.parse(event["regions"])
  var ids = idArray.join();
  var areas = [];

  db.sequelize.query(
    "SELECT * FROM \"Regions\" WHERE id IN (" + ids + ") ",
    { type: db.sequelize.QueryTypes.SELECT}
  ).then(
    function (result) {

      var zips = [];
      for(var i = 0; i < result.length; i++){
        var region = result[i];
        if(region.area != null){
          areas.push(region.area);
        } else {
          //split it up into zips and try to merge those
          for (var j = 0; region.zips != null && j < region.zips.length; j++) {
            var zip = region.zips[j];
            if (zips.indexOf(zip) == -1) {
              zips.push(zip);
            }
          }
        }
      }

      var zipsString = "'"+zips.join("','")+"'";

      return db.sequelize.query(
        "SELECT * FROM \"Regions\" WHERE name IN (" + zipsString + ") AND area IS NOT NULL",
        { type: db.sequelize.QueryTypes.SELECT}
      )

    },
    function (error) {
      context.fail(error);
    }
  ).then(
    function (result) {

      var polygons = {
        type: "FeatureCollection",
        features: []
      };

      for(var i = 0; i < result.length; i++){
        var region = result[i];
        areas.push(region.area);
      }
      for(var i = 0; i < areas.length; i++){
        var area = areas[i];
        area["properties"] = {};
        polygons["features"].push(area);
      }

      var merged = turf.merge(polygons);

      var response = {
        id: null,
        name: null,
        type: null,
        area: merged
      }
      context.succeed(response);
    },
    function (error) {
      context.fail(error);
    }
  )

};