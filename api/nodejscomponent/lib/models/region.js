'use strict';
var Q = require('q');

module.exports = function(db, databaseName){
  function Region() {
    this._id = null;
    this.name = null;
    this.description = null;
    this.type = null;
    this.area = null;

    Region.db = db;
    Region.databaseName = databaseName;

    Region.TYPE_ZIP = "Zip";
    Region.TYPE_PLACE = "Place";
    Region.TYPE_MUNICIPALITY = "Municipality";
    Region.TYPE_PROVINCE = "Province";

  };

  Region.build = function(properties){
    var instance = new Region();
    instance.setAll(properties);
    return instance;
  }

  Region.create = function(properties){
    var instance = Region.build(properties);
    return instance.save()
  };

  Region.prototype.setAll = function(properties){
    for (var key in properties) {
      this.set(key, properties[key]);
    }
  }

  Region.prototype.set = function (propertyName, value) {
    this[propertyName] = value != undefined ? value : null;
  }

  Region.prototype.save = function(){
    //Run raw cypher with params
    var labels = ':Region:'+Region.databaseName;
    if(this.type != null){
      labels += ":" + this.type;
    }

    var deferred = Q.defer();

    Region.db.cypherQuery(
      'CREATE (' +
        'n'+ labels +
        ' { name: {name}, description: {description}, type: {type}, area: {area} }' +
      ') RETURN n',
      {
        name: this.name,
        description: this.description,
        type: this.type,
        area: this.area,
      }, function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(result);
        }
      }
    );

    return deferred.promise;
  }

  return Region;
}