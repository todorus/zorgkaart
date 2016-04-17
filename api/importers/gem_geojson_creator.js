var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  db = require(__dirname + '/../nodejscomponent/lib/models');

var Region = db["Region"];

var jsonData = 'gemeentes.geo.json',
  stream = fs.createReadStream(jsonData, {encoding: 'utf8'}),
  parser = JSONStream.parse('*');

stream
  .pipe(parser)
  .pipe(es.mapSync(
    function (data) {
      {
        var _data = data;
        console.log("data", _data);
        var name = _data["properties"]["gemeentena"];
        var area = _data;
        area["properties"] = {
          name: name,
          description: null,
          type: Region.TYPE_MUNICIPALITY
        }

        Region.findOrCreate({
          name: name,
          type: Region.TYPE_MUNICIPALITY
        }).then(
          function (result) {
            var region = result[0];
            region.set("description", null);
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

      }
    })
  );
