require('../../spec_helper.js');

var subject = require("../../../nodejscomponent/regions/merge/handler.js");
var db = require("../../../nodejscomponent/lib/models");
var Region = db["Region"];

describe("/regions", function () {

  // testdata from http://turfjs.org/static/docs/module-turf_merge.html

  var polyA = {
    "type": "Polygon",
    "coordinates": [
      [
        [
          9.994812,
          53.549487
        ],
        [
          10.046997,
          53.598209
        ],
        [
          10.117721,
          53.531737
        ],
        [
          9.994812,
          53.549487
        ]
      ]
    ]
  };

  var polyB = {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.000991,
          53.50418
        ],
        [
          10.03807,
          53.562539
        ],
        [
          9.926834,
          53.551731
        ],
        [
          10.000991,
          53.50418
        ]
      ]
    ]
  };

  var polyAB = {
    "type": "Polygon",
    "coordinates": [
      [
        [
          10.005390809136088,
          53.55936379867258
        ],
        [
          10.046997,
          53.598209
        ],
        [
          10.117721,
          53.531737
        ],
        [
          10.026838636912657,
          53.54486184801601
        ],
        [
          10.000991,
          53.50418
        ],
        [
          9.926834,
          53.551731
        ],
        [
          10.005390809136088,
          53.55936379867258
        ]
      ]
    ]
  }

  before(
    function (done) {
      // Wipe db
      db.sequelize.sync(
        {force: true}
      ).then(
        function (result) {

          // Define zipcodes
          return Region.bulkCreate(
            [
              {id: 1, name: "Maas", type: Region.TYPE_PLACE, zips: [1001, 1002, 1003]},
              {
                id: 10,
                name: '1001',
                type: Region.TYPE_ZIP,
                area: {type: "Feature", properties: {name: '1001'}, geometry: polyA},
                zips: [1001]
              },
              {
                id: 11,
                name: '1002',
                type: Region.TYPE_ZIP,
                area: {type: "Feature", properties: {name: '1002'}, geometry: polyB},
                zips: [1002]
              }
            ]
          )
        }
      ).then(
        function (result) {
          done();
        },
        function (error) {
          throw error;
        }
      )
    }
  )

  describe("/merge", function () {

    describe("with Region that has multiple zipcodes", function () {

      var event = {
        regions: "[ 1 ]"
      }

      var matchingRegion = {id: null, name: null, type: null, area: {type: "Feature", properties: {}, geometry: polyAB} };

      it("should return a list of all zipcodes ordered by name", function (done) {
        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegion);

            done();
          }
        );

        subject.handler(event, context);
      });
    })

    describe("with zipcodes", function () {

      var event = {
        regions: "[ 10, 11]"
      }

      var matchingRegion = {id: null, name: null, type: null, area: {type: "Feature", properties: {}, geometry: polyAB} };

      it("should return a list of all zipcodes ordered by name", function (done) {
        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegion);

            done();
          }
        );

        subject.handler(event, context);
      });
    })
  })

});