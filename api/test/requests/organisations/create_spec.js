require('../../spec_helper.js');

var subject = require("../../../nodejscomponent/organisations/create-organisation/handler.js");
var db = require("../../../nodejscomponent/lib/models");
var Organisation = db["Organisation"];
var Utils = db["Utils"];

describe("/organisations", function () {

  describe("create", function () {

    before(
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

      it("should create a new organisation record");
      it("should return the newly created Organisation");
      it("should link the newly created Organisation to the supplied regions");

    });

    describe("with non existing Regions", function(){

      it("should not create a new organisation record");
      it("should return the newly created Organisation");
      it("should link the newly created Organisation to the supplied regions");

    });

  });

});