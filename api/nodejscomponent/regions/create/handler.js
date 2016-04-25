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

  if(event["children"] == null || event["children"] == undefined){
    context.fail(new Error("must provide children ids"));
    return;
  }

  if(event["name"] == null || event["name"] == undefined){
    context.fail(new Error("must provide children ids"));
    return;
  }

  var ids = event["children"].join();
  var regions = [];
  var properties = {
    name: event["name"],
    description: event["description"],
    type: Region.TYPE_CARE
  };

  Region.byIds(ids)
    .then(function (result) {
      regions = regions.concat(result);
      return Region.children(ids);
    }).then(function (result) {
    regions = regions.concat(result);

    var polygons = {
      type: "FeatureCollection",
      features: []
    };

    for (var i = 0; i < regions.length; i++) {
      var region = regions[i];
      var area = region.data["area"];

      if (area != undefined && area != null) {
        area["properties"] = {};
        polygons["features"].push(area);
      }
    }

    var merged = turf.merge(polygons);
    properties["area"] = JSON.stringify(merged);

    return Region.create(properties);

  }).then(function(result){

    var response = Region.toJson(result[0].data);
    context.succeed(response);

  }).catch(function (error) {
    context.fail(error);
  });


};