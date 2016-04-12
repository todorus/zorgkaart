require('../../spec_helper.js');

var subject = require("../../../nodejscomponent/regions/atomize/handler.js");
var db = require("../../../nodejscomponent/lib/models");
var Region = db["Region"];

describe("/regions", function () {

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
              {id: 2, name: "Rijn", type: Region.TYPE_PLACE, zips: [1003, 1004, 1005]},
              {id: 10, name: '1001', type: Region.TYPE_ZIP, area: {properties: {name: '1001'}, geometry: [[1,1]]}, zips: [1001]},
              {id: 11, name: '1002', type: Region.TYPE_ZIP, area: {properties: {name: '1002'}, geometry: [[2,1]]}, zips: [1002]},
              {id: 12, name: '1003', type: Region.TYPE_ZIP, area: {properties: {name: '1003'}, geometry: [[3,1]]}, zips: [1003]},
              {id: 13, name: '1004', type: Region.TYPE_ZIP, area: {properties: {name: '1004'}, geometry: [[4,1]]}, zips: [1004]},
              {id: 14, name: '1005', type: Region.TYPE_ZIP, area: {properties: {name: '1005'}, geometry: [[5,1]]}, zips: [1005]},
              {id: 15, name: '1006', type: Region.TYPE_ZIP, area: {properties: {name: '1006'}, geometry: [[6,1]]}, zips: [1006]},
              {id: 16, name: '1007', type: Region.TYPE_ZIP, area: {properties: {name: '1007'}, geometry: [[7,1]]}, zips: [1007]}
            ]
          )
        }
      ).then(
        function(result){
          done();
        },
        function (error) {
          throw error;
        }
      )
    }
  )

  describe("/atomize", function () {

    describe("with Regions that share zipcodes", function() {

      var event = {
        regions: "[ 1, 2]"
      }

      var matchingRegions = [
        {id: 10, name: '1001', type: Region.TYPE_ZIP, area: {properties: {name: '1001'}, geometry: [[1,1]]}},
        {id: 11, name: '1002', type: Region.TYPE_ZIP, area: {properties: {name: '1002'}, geometry: [[2,1]]}},
        {id: 12, name: '1003', type: Region.TYPE_ZIP, area: {properties: {name: '1003'}, geometry: [[3,1]]}},
        {id: 13, name: '1004', type: Region.TYPE_ZIP, area: {properties: {name: '1004'}, geometry: [[4,1]]}},
        {id: 14, name: '1005', type: Region.TYPE_ZIP, area: {properties: {name: '1005'}, geometry: [[5,1]]}},
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

    describe("with zipcodes mixed with higher Regions", function() {

      var event = {
        regions: "[ 1, 15, 16]"
      }

      var matchingRegions = [
        {id: 10, name: '1001', type: Region.TYPE_ZIP, area: {properties: {name: '1001'}, geometry: [[1,1]]}},
        {id: 11, name: '1002', type: Region.TYPE_ZIP, area: {properties: {name: '1002'}, geometry: [[2,1]]}},
        {id: 12, name: '1003', type: Region.TYPE_ZIP, area: {properties: {name: '1003'}, geometry: [[3,1]]}},

        {id: 15, name: '1006', type: Region.TYPE_ZIP, area: {properties: {name: '1006'}, geometry: [[6,1]]}},
        {id: 16, name: '1007', type: Region.TYPE_ZIP, area: {properties: {name: '1007'}, geometry: [[7,1]]}}
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

});