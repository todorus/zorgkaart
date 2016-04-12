require('../../spec_helper.js');

var subject = require("../../../nodejscomponent/regions/atomize/handler.js");
var db = require("../../../nodejscomponent/lib/models");
var Region = db["Region"];
var RegionToRegions = db["RegionToRegions"];

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
              {id: 1, name: "Maas", type: Region.TYPE_PLACE},
              {id: 2, name: "Rijn", type: Region.TYPE_PLACE},
              {id: 10, name: '1001', type: Region.TYPE_ZIP, area: {properties: {name: '1001'}, geometry: [[1,1]]}},
              {id: 11, name: '1002', type: Region.TYPE_ZIP, area: {properties: {name: '1002'}, geometry: [[2,1]]}},
              {id: 12, name: '1003', type: Region.TYPE_ZIP, area: {properties: {name: '1003'}, geometry: [[3,1]]}},
              {id: 13, name: '1004', type: Region.TYPE_ZIP, area: {properties: {name: '1004'}, geometry: [[4,1]]}},
              {id: 14, name: '1005', type: Region.TYPE_ZIP, area: {properties: {name: '1005'}, geometry: [[5,1]]}},
              {id: 15, name: '1006', type: Region.TYPE_ZIP, area: {properties: {name: '1006'}, geometry: [[6,1]]}},
              {id: 16, name: '1007', type: Region.TYPE_ZIP, area: {properties: {name: '1007'}, geometry: [[7,1]]}}
            ]
          )
        }
      ).then(
        function(result){
          return RegionToRegions.bulkCreate(
            [
              { ParentId: 1, ChildId: 10 },
              { ParentId: 1, ChildId: 11 },
              { ParentId: 1, ChildId: 12 },
              { ParentId: 2, ChildId: 12 },
              { ParentId: 2, ChildId: 13 },
              { ParentId: 2, ChildId: 14 }
            ]
          )
        },
        function (error) {
          throw error;
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
        {id: 10, name: null, type: null, area: null},
        {id: 11, name: null, type: null, area: null},
        {id: 12, name: null, type: null, area: null},
        {id: 13, name: null, type: null, area: null},
        {id: 14, name: null, type: null, area: null},
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
        {id: 10, name: null, type: null, area: null},
        {id: 11, name: null, type: null, area: null},
        {id: 12, name: null, type: null, area: null},

        {id: 15, name: null, type: null, area: null},
        {id: 16, name: null, type: null, area: null},
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