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

function findOrCreate(properties){
  return Region.findAndCountAll({where: properties}).then(
    function(result){
      if(result.count == 0){
        return Region.create(properties);
      } else {
        return Region.findOne(properties);
      }
    }
  )
}

function addData(data){
  return findOrCreate(
    {
      name: String(data["PC"]),
      type: Region.TYPE_ZIP
    }
  ).then(
    function(result){
      zip = result;

      // PLACE
      return findOrCreate(
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
      return findOrCreate(
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

      return findOrCreate(
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
  )
}



function loopData(index, json){
  if(index >= json.length){
    return null;
  }

  data = json[index];
  return addData(data).then(
    function(result){
      index++
      return loopData(index, json);
    }
  )
}

loopData(0, json);
