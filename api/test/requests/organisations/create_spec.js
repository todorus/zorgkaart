require('../../spec_helper.js');

var subject = require("../../../nodejscomponent/organisations/create-organisation/handler.js");
var db = require("../../../nodejscomponent/lib/models");
var Organisation = db["Organisation"];
var Region = db["Region"];
var Utils = db["Utils"];

describe("/organisations", function () {

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

  describe("create", function () {

    beforeEach(
      function (done) {
        // Wipe db
        Utils.wipe().then(
          function (result) {
            done();
          }
        ).catch(function (error) {
          done(error);
        })
      });

    describe("without regions", function () {

      var event = {
        name: "name",
        description: "description",
        contact_information: "contact information"
      };

      var matchingOrganisation = {
        name: "name",
        description: "description",
        contact_information: "contact information",
        regions: []
      };

      it("should create a new organisation record", function (done) {

        var oldCount;
        var context = new MockContext();
        context.then(function (response) {
          return Organisation.count();
        }).then(function (newCount) {
          expect(newCount).toEqual(oldCount + 1);
          done();
        }).catch(function (error) {
          done(error);
        });

        Organisation.count().then(
          function (result) {
            oldCount = result;
            subject.handler(event, context);
          }
        ).catch(function (error) {
          done(error);
        });

      });

      it("should return the newly created Organisation", function (done) {
        var context = new MockContext();
        context.then(
          function (context) {

            expect(context.error).toBe(null);

            filterIds([context.response]);
            expect(context.response).toEqual(matchingOrganisation);

            done();
          }
        ).catch(function (error) {
          done(error);
        });

        subject.handler(event, context);

      });

    });

    describe("with Regions", function(){

      var event = {
        name: "name",
        description: "description",
        contact_information: "contact information"
      };

      var matchingOrganisation = {
        name: "name",
        description: "description",
        contact_information: "contact information",
        regions: [
          {
            name: '1001',
            code: '1001',
            type: Region.TYPE_ZIP,
            area: {type: "Feature", properties: {name: '1001'}, geometry: polyA}
          },
          {
            name: '1002',
            code: '1002',
            type: Region.TYPE_ZIP,
            area: {type: "Feature", properties: {name: '1002'}, geometry: polyB}
          }
        ]
      };

      beforeEach(function(done){
        Region.bulkCreate(
          [
            {
              name: "Maas",
              code: "1001",
              type: Region.TYPE_PLACE
            },
            {
              name: '1001',
              code: '1001',
              type: Region.TYPE_ZIP,
              area: {type: "Feature", properties: {name: '1001'}, geometry: polyA}
            },
            {
              name: '1002',
              code: '1002',
              type: Region.TYPE_ZIP,
              area: {type: "Feature", properties: {name: '1002'}, geometry: polyB}
            }
          ]
        ).then(function(result){
          return Region.find(
            {
              type: Region.TYPE_ZIP
            }
          )
        }).then(function(result){

          event["regions"] = [];
          for(var i=0; i < result.length; i++){
            var region = result[i];
            var id = region.data["_id"];
            event["regions"].push(id);
          }

          done();
        }).catch(function(error){
          done(error);
        });
      });

      it("should create a new organisation record", function (done) {

        var oldCount;
        var context = new MockContext();
        context.then(function (response) {
          return Organisation.count();
        }).then(function (newCount) {
          expect(newCount).toEqual(oldCount + 1);
          done();
        }).catch(function (error) {
          done(error);
        });

        Organisation.count().then(
          function (result) {
            oldCount = result;
            subject.handler(event, context);
          }
        ).catch(function (error) {
          done(error);
        });

      });

      it("should return the newly created Organisation", function (done) {
        var context = new MockContext();
        context.then(
          function (context) {

            expect(context.error).toBe(null);

            filterIds([context.response]);
            filterIds(context.response.regions);
            expect(context.response).toEqual(matchingOrganisation);

            done();
          }
        ).catch(function (error) {
          done(error);
        });

        subject.handler(event, context);

      });

      it("should link the newly created Organisation to the supplied regions");

    });

    describe("with non existing Regions", function(){

      it("should not create a new organisation record");
      it("should return the newly created Organisation");
      it("should link the newly created Organisation to the supplied regions");

    });

  });

});