require('../../spec_helper.js');

var subject = require("../../../nodejscomponent/regions/fetch/handler.js");
var db = require("../../../nodejscomponent/lib/models");
var Region = db["Region"];
var Utils = db["Utils"];

describe("/regions", function () {

  before(
    function (done) {
      Utils.wipe().then(
        function(result){
          return db["Region"].bulkCreate(
            [
              {id: 1, name: 'Maastricht', type: Region.TYPE_PLACE, area: {properties: {name: 'Maastricht'}, geometry: [[1,1]]}},
              {id: 2, name: 'Maasdamn', type: Region.TYPE_PLACE, area: {properties: {name: 'Maasdamn'}, geometry: [[2,1]]}},
              {id: 3, name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'bijdeMaas'}, geometry: [[3,1]]}},
              {id: 4, name: 'blub', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'blub'}, geometry: [[4,1]]}},
              {id: 5, name: 'blob', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'blob'}, geometry: [[5,1]]}},
              {id: 6, name: 'Maasland', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'Maasland'}, geometry: [[6,1]]}},
              {id: 7, name: 'Overblaak', type: Region.TYPE_PLACE, area: {properties: {name: 'Overblaak'}, geometry: [[7,1]]}},
              {id: 8, name: 'Ossdam', type: Region.TYPE_PLACE, area: {properties: {name: 'Ossdam'}, geometry: [[8,1]]}},
              {id: 9, name: 'Oss', type: Region.TYPE_PLACE, area: {properties: {name: 'Oss'}, geometry: [[9,1]]}}
            ]
          );
        }
      ).then(
        function (result) {
          done();
        }
      ).catch(
        function (error) {
          done(error);
        }
      )
    }
  )

  describe("/all", function () {

    var event = {
    }

    var matchingRegions = [
      {id: 3, name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'bijdeMaas'}, geometry: [[3,1]]}},
      {id: 5, name: 'blob', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'blob'}, geometry: [[5,1]]}},
      {id: 4, name: 'blub', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'blub'}, geometry: [[4,1]]}},
      {id: 2, name: 'Maasdamn', type: Region.TYPE_PLACE, area: {properties: {name: 'Maasdamn'}, geometry: [[2,1]]}},
      {id: 6, name: 'Maasland', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'Maasland'}, geometry: [[6,1]]}},
      {id: 1, name: 'Maastricht', type: Region.TYPE_PLACE, area: {properties: {name: 'Maastricht'}, geometry: [[1,1]]}},
      {id: 9, name: 'Oss', type: Region.TYPE_PLACE, area: {properties: {name: 'Oss'}, geometry: [[9,1]]}},
      {id: 8, name: 'Ossdam', type: Region.TYPE_PLACE, area: {properties: {name: 'Ossdam'}, geometry: [[8,1]]}},
      {id: 7, name: 'Overblaak', type: Region.TYPE_PLACE, area: {properties: {name: 'Overblaak'}, geometry: [[7,1]]}},
    ]

    it("should return a list of all Regions ordered by name", function (done) {
      var context = new MockContext()
      context.then(
        function (context) {
          expect(context.response).toEqual(matchingRegions);

          done();
        }
      ).fail(
        function(error){
          console.log(error);
          throw new Error(error);
        }
      );

      subject.handler(event, context);
    });

  })

  describe("search", function () {

    describe("when a match is found for a query", function () {

      it("should return a list of the results ordered by length and filters those without an area", function (done) {
        var event = {
          query: "oss"
        }

        var matchingRegions = [
          {id: 9, name: 'Oss', type: Region.TYPE_PLACE, area: {properties: {name: 'Oss'}, geometry: [[9,1]]}},
          {id: 8, name: 'Ossdam', type: Region.TYPE_PLACE, area: {properties: {name: 'Ossdam'}, geometry: [[8,1]]}},
        ]

        var context = new MockContext()
        context.then(
          function (context) {

            console.log("dub", context.response);

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegions);

            done();
          }
        ).fail(
          function(error){
            done(error);
          }
        );

        subject.handler(event, context);
      });

      it("should return a list of the results ordered by name and filters those without an area", function (done) {
        var event = {
          query: "maas"
        }

        var matchingRegions = [
          {id: 2, name: 'Maasdamn', type: Region.TYPE_PLACE, area: {properties: {name: 'Maasdamn'}, geometry: [[2,1]]}},
          {id: 6, name: 'Maasland', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'Maasland'}, geometry: [[6,1]]}},
          {id: 1, name: 'Maastricht', type: Region.TYPE_PLACE, area: {properties: {name: 'Maastricht'}, geometry: [[1,1]]}},
        ]

        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegions);

            done();
          }
        ).fail(
          function(error){
            done(error);
          }
        );

        subject.handler(event, context);
      });

    })

    describe("when no match is found for a query", function () {

      var event = {
        query: "qii"
      }

      var matchingRegions = []

      it("should return an empty list", function (done) {
        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegions);

            done();
          }
        ).fail(
          function(error){
            done(error);
          }
        );

        subject.handler(event, context);
      })

    })

  })

  describe("pagination", function () {

    describe("without a page", function () {

      var event = {
        limit: 2
      }

      var matchingRegions = [
        {id: 3, name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'bijdeMaas'}, geometry: [[3,1]]}},
        {id: 5, name: 'blob', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'blob'}, geometry: [[5,1]]}},
      ]

      it("should return a list of the first n Regions ordered by name", function (done) {
        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegions);

            done();
          }
        ).fail(
          function(error){
            done(error);
          }
        );

        subject.handler(event, context);
      });

    })

    describe("with a page", function () {

      // page has a zero index
      var event = {
        limit: 2,
        page: 1
      }

      var matchingRegions = [
        {id: 4, name: 'blub', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'blub'}, geometry: [[4,1]]}},
        {id: 2, name: 'Maasdamn', type: Region.TYPE_PLACE, area: {properties: {name: 'Maasdamn'}, geometry: [[2,1]]}},
      ]

      it("should return a list of n Regions ordered by name starting from the supplied page", function (done) {
        var context = new MockContext()
        context.then(
          function (context) {

            expect(context.error).toBe(null);
            expect(context.response).toEqual(matchingRegions);

            done();
          }
        ).fail(
          function(error){
            done(error);
          }
        );

        subject.handler(event, context);
      });

    })
  })

  describe("search and limit", function () {

    var event = {
      query: "maas",
      limit: 2
    }

    var matchingRegions = [
      {id: 2, name: 'Maasdamn', type: Region.TYPE_PLACE, area: {properties: {name: 'Maasdamn'}, geometry: [[2,1]]}},
      {id: 6, name: 'Maasland', type: Region.TYPE_MUNICIPALITY, area: {properties: {name: 'Maasland'}, geometry: [[6,1]]}},
    ]

    it("should return a list of n Regions ordered by name", function (done) {
      var context = new MockContext()
      context.then(
        function (context) {

          expect(context.error).toBe(null);
          expect(context.response).toEqual(matchingRegions);

          done();
        }
      ).fail(
        function(error){
          done(error);
        }
      );

      subject.handler(event, context);
    });

  })
});