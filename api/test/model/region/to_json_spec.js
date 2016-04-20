require('../../spec_helper.js');

var db = require("../../../nodejscomponent/lib/models");
var Region = db["Region"];

describe("Region", function () {



  describe("toJson", function () {

    it("should renames _id to id", function(){
      var regionData = {
        _id : 12,
        name: "name",
        description: "description",
        code: "11121",
        type: "Munipalicty"
      };

      var expected = [
        {
          code: "11121",
          description: "description",
          id : 12,
          name: "name",
          type: "Munipalicty"
        }
      ];

      expect(Region.toJson([regionData])).toEqual(expected);
    });

  })

});