'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
//var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Logic
var db = require(__dirname + '/../../lib/models');
var Region = db["Region"];

// Lambda Handler
module.exports.handler = function (event, context) {

    Region.findAll(
        {
            where: {
                name: {
                    $iLike: '%' + event.query + '%'
                }
            },
            order: [
                ['name', 'ASC']
            ]

        }
    ).then(
        function (result) {
            context.succeed(result);
        },
        function (error) {
            context.fail(error);
        }
    );

};