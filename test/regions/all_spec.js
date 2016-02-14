require('../spec_helper.js');

var subject = require("../../nodejscomponent/regions/all/handler.js");

describe("Region", function () {
    describe("all", function () {

        var db = require("../../nodejscomponent/lib/models");
        before(
            function (done) {
                // Wipe db
                db.sequelize.sync({force: true}).then(
                    function() {
                        // Seed db
                        return db["Region"].bulkCreate(
                            [
                                {name: 'Maastricht'},
                                {name: 'Maasdam'},
                                {name: 'BijdeMaas'},
                                {name: 'blub'},
                                {name: 'blob'}
                            ]
                        )
                    }
                ).then(
                    function(result){
                        done();
                    },
                    function(error){
                        throw error;
                    }
                )
            }
        )

        describe("return all", function () {

            var event = {
            }

            var matchingRegionNames = [
                "BijdeMaas",
                "blob",
                "blub",
                "Maasdam",
                "Maastricht"
            ]

            it("should return a list of the results ordered by name", function (done) {
                var context = new MockContext()
                context.then(
                    function(context){

                        expect(context.error).toBe(null);

                        var responseNames = context.response.map(function(currentValue, index, original){
                           return currentValue["name"];
                        });
                        expect(responseNames).toEqual(matchingRegionNames);

                        done();
                    }
                );

                subject.handler(event, context);
            });

        })

    })
});