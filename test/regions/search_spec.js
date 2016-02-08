require('../spec_helper.js');

var subject = require("../../nodejscomponent/regions/search/handler.js");

describe("Region", function () {
    describe("search", function () {

        var matchingRegions = [
            {
                type: 1,
                name: "Maastricht",
                poly: []
            },
            {
                type: 1,
                name: "Maasdam",
                poly: []
            }
        ]

        describe("when a match is found", function () {

            var event = {

            }

            var context = new MockContext();

            it("should return a list of the results", function () {
                subject.handler(event, context);
                expect(context.error).toBe(null);
                expect(context.response).toEqual(matchingRegions);
            });

            it("should return an OK status")

        })

        describe("when no match is found", function () {

            it("should return an empty list")

            it("should return an OK status")

        })
    })
});