require('../spec_helper.js');

var subject = require("../../nodejscomponent/regions/atomize/handler.js");
var db = require("../../nodejscomponent/lib/models");
var Region = db["Region"];

describe("Region", function () {

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
              {id: 10, name: '1001', type: Region.TYPE_ZIP, Parents:[{id: 1, name: "Maas", type: Region.TYPE_PLACE}]},
              {id: 11, name: '1002', type: Region.TYPE_ZIP, Parents:[{id: 1, name: "Maas", type: Region.TYPE_PLACE}]},
              {id: 12, name: '1003', type: Region.TYPE_ZIP, Parents:[{id: 1, name: "Maas", type: Region.TYPE_PLACE},{id: 2, name: "Rijn", type: Region.TYPE_PLACE}]},
              {id: 13, name: '1004', type: Region.TYPE_ZIP, Parents:[{id: 2, name: "Rijn", type: Region.TYPE_PLACE}]},
              {id: 14, name: '1005', type: Region.TYPE_ZIP, Parents:[{id: 2, name: "Rijn", type: Region.TYPE_PLACE}]},
              {id: 15, name: '1006', type: Region.TYPE_ZIP},
              {id: 16, name: '1007', type: Region.TYPE_ZIP}
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

  describe("atomize", function () {

    describe("with Regions that share zipcodes", function() {

      var event = {
        regions: [ 1, 2]
      }

      var matchingRegions = [
        {id: 10, name: '1001', type: Region.TYPE_ZIP},
        {id: 11, name: '1002', type: Region.TYPE_ZIP},
        {id: 12, name: '1003', type: Region.TYPE_ZIP},
        {id: 13, name: '1004', type: Region.TYPE_ZIP},
        {id: 14, name: '1005', type: Region.TYPE_ZIP},
      ]

      it("should return a list of all zipcodes ordered by name", function (done) {
        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegions);

            done();
          }
        );

        subject.handler(event, context);
      });
    })

  })

  describe("with zipcodes mixed with higher Regions", function() {

    var event = {
      regions: [ 1, 15, 16]
    }

    var matchingRegions = [
      {id: 10, name: '1001', type: Region.TYPE_ZIP},
      {id: 11, name: '1002', type: Region.TYPE_ZIP},
      {id: 12, name: '1003', type: Region.TYPE_ZIP},

      {id: 15, name: '1006', type: Region.TYPE_ZIP},
      {id: 16, name: '1007', type: Region.TYPE_ZIP}
    ]

    it("should return a list of all zipcodes ordered by name", function (done) {
      var context = new MockContext()
      context.then(
        function (context) {

          expect(context.error).toBe(null);
          expect(context.response).toEqual(matchingRegions);

          done();
        }
      );

      subject.handler(event, context);
    });
  })

});