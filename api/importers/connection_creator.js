var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  db = require(__dirname + '/../nodejscomponent/lib/models');

var Region = db["Region"];
var CONTAINS = db["CONTAINS"];

var connectionData = 'postcode-gemeente-tabel.json',
  connectStream = fs.createReadStream(connectionData, {encoding: 'utf8'}),
  parser = JSONStream.parse('*');

connectStream
  .pipe(parser)
  .pipe(es.mapSync(function (data) {
    {
      var _data = data;
      var municipalityCode = _data["Gemeentecode"];
      var zipCode = _data['Postcode'];

      var props = {
        parent: {
          type: Region.TYPE_MUNICIPALITY,
          code: municipalityCode
        },
        child: {
          type: Region.TYPE_ZIP,
          code: zipCode
        }
      };

      var contains = CONTAINS.build(props);
      contains.save()
        .then(
          function (result) {
            console.log("result", result.length > 0);
          }
        ).catch(
          function (error) {
            console.error(error);
          }
        );

    }
  }));
