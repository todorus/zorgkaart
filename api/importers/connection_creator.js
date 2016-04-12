var fs = require('fs'),
  JSONStream = require('JSONStream'),
  es = require('event-stream'),
  db = require(__dirname + '/../nodejscomponent/lib/models');

var Region = db["Region"];

var connectionData = 'postcode-gemeente-tabel.json',
  connectStream = fs.createReadStream(connectionData, {encoding: 'utf8'}),
  parser = JSONStream.parse('*');

connectStream
  .pipe(parser)
  .pipe(es.mapSync(function (data) {
    {
      var _data = data;
      var zipCode = _data['Postcode'];
      var municipalityCode = _data["Gemeentecode"];
      var zip;
      var municipality;

      Region.find({where: {code: municipalityCode, type: Region.TYPE_MUNICIPALITY}})
        .then(function(result) {
            if(result == null){
              console.error("result == null for code:",municipalityCode);
              return;
            }

            municipality = result;

            Region.find({where: {code: zipCode, type: Region.TYPE_ZIP}})
              .then(function(result){
                if(result == null){
                  console.error("result == null for code:",zipCode);
                  return;
                }

                zip = result;
                zip.addParent(municipality);
              })

          }
        )
    };
  }));
