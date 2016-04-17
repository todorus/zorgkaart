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
  .pipe(es.mapSync(function (data) {
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

      var promise = Region.create({
        name: name,
        description: null,
        type: Region.TYPE_MUNICIPALITY,
        area: JSON.stringify(area)
      }).then(
        function(result){
          console.log(result.data); // delivers an array of query results
          console.log(result.columns); // delivers an array of names of objects getting returned
        },
        function(error){
          console.error(err);
        }
      );

    };
  }));
