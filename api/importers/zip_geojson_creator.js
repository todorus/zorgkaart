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

      Region.findOrCreate({where: {type: Region.TYPE_ZIP, name: name}})
        .spread(function(result, created) {
            if(result == null){
              console.error("result == null for name:",name);
              return;
            }

            _data["properties"] = {
              name: name,
              description: null,
              type: Region.TYPE_ZIP
            }
            result.area = _data;
            result.save();

          }
        )
    };
  }));
