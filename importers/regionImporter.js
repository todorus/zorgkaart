var json = JSON.parse(require('fs').readFileSync(__dirname +'/pc_gem_prov.json', 'utf8'));

// Require Logic
var db = require(__dirname + '/../nodejscomponent/lib/models');

var Region = db["Region"];

//{
//  "PC": 1000,
//  "PLAATS": "Amsterdam",
//  "GEMEENTE": "Amsterdam",
//  "PROVINCIE": "Noord Holland",
//  "pc2": 1000
//}


var i = 0;
var data = json[i];
var zip = null;

Region.create(
  {
    name: String(data["PC"]),
    type: Region.TYPE_ZIP
  }
).then(
  function(result){
    zip = result;

    var data = null;
    for(var j = 0; j < json.length; j++){
      if(json[j]["PC"] == zip.name){
        data = json[j];
        break;
      }
    }

    console.log("data",data,"zip",zip);

    // PLACE
    return Region.create(
      {
        name: String(data["PLAATS"]),
        type: Region.TYPE_PLACE
      }
    )
  }
).then(
  function(result){
    var place = result;
    zip.addParent(place);

    // MUNICIPALITY
    return Region.create(
      {
        name: String(data["GEMEENTE"]),
        type: Region.TYPE_MUNICIPALITY
      }
    );
  }
).then(
  function(result){
    var municipality = result;
    zip.addParent(municipality);

    return Region.create(
      {
        name: String(data["PROVINCIE"]),
        type: Region.TYPE_PROVINCE
      }
    )
  }
).then(
  function(result){
    var province = result;
    return zip.addParent(province);
  }
);