var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  db = require(__dirname + '/../nodejscomponent/lib/models');

var Region = db["Region"];

var jsonData = 'postcodes.geo.json',
  stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
  parser = JSONStream.parse('*');

stream
  .pipe(parser)
  .pipe(es.mapSync(function (data) {
    {
      var _data = data;
      var name = _data["properties"]["PC4"].toString();
      var code = name;

      Region.findOrCreate({
        name: name,
        type: Region.TYPE_ZIP,
        code: code
      }).then(
        function (result) {
          var region = result[0];
          region.set("description", null);

          var area = _data;
          area["properties"] = {
            id: region.properties["_id"],
            name: name,
            description: null,
            type: Region.TYPE_ZIP
          };
          region.set("area", JSON.stringify(area));

          return region.save();
        }
      ).then(
        function (result) {
          console.log("result", result);
        }
      ).catch(
        function (error) {
          console.error(error);
        }
      );

    };
  }));
