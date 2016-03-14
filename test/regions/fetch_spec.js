require('../spec_helper.js');

var subject = require("../../nodejscomponent/regions/fetch/handler.js");
var db = require("../../nodejscomponent/lib/models");
var Region = db["Region"];

describe("Region", function () {

  before(
    function (done) {
      // Wipe db
      db.sequelize.sync({force: true}).then(
        function () {
          // Seed db
          return db["Region"].bulkCreate(
            [
              {name: 'Maastricht', type: Region.TYPE_PLACE},
              {name: 'Maasdam', type: Region.TYPE_PLACE},
              {name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY},
              {name: 'blub', type: Region.TYPE_MUNICIPALITY},
              {name: 'blob', type: Region.TYPE_MUNICIPALITY}
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

  describe("all", function () {

    var event = {
    }

    var matchingRegions = [
      {name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY},
      {name: 'blob', type: Region.TYPE_MUNICIPALITY},
      {name: 'blub', type: Region.TYPE_MUNICIPALITY},
      {name: 'Maasdam', type: Region.TYPE_PLACE},
      {name: 'Maastricht', type: Region.TYPE_PLACE}
    ]

    it("should return a list of all Regions ordered by name", function (done) {
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

  describe("search", function () {

    describe("when a match is found for a query", function () {

      var event = {
        query: "maas"
      }

      var matchingRegions = [
        {name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY},
        {name: 'Maasdam', type: Region.TYPE_PLACE},
        {name: 'Maastricht', type: Region.TYPE_PLACE}
      ]

      it("should return a list of the results ordered by name", function (done) {
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
        {name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY},
        {name: 'blob', type: Region.TYPE_MUNICIPALITY}
      ]

      it("should return a list of the first n Regions ordered by name", function (done) {
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

    describe("with a page", function () {

      // page has a zero index
      var event = {
        limit: 2,
        page: 1
      }

      var matchingRegions = [
        {name: 'blub', type: Region.TYPE_MUNICIPALITY},
        {name: 'Maasdam', type: Region.TYPE_PLACE}
      ]

      it("should return a list of n Regions ordered by name starting from the supplied page", function (done) {
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

  describe("search and limit", function () {

    var event = {
      query: "maas",
      limit: 2
    }

    var matchingRegions = [
      {name: 'bijdeMaas', type: Region.TYPE_MUNICIPALITY},
      {name: 'Maasdam', type: Region.TYPE_PLACE}
    ]

    it("should return a list of n Regions ordered by name", function (done) {
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