'use strict';
var Q = require('q');

module.exports = function (db, databaseName) {
  function Region() {
    this._id = null;
    this.data = {};
    this.properties = ["name", "description", "type", "area"];

    Region.db = db;
    Region.databaseName = databaseName;

    Region.TYPE_ZIP = "Zip";
    Region.TYPE_PLACE = "Place";
    Region.TYPE_MUNICIPALITY = "Municipality";
    Region.TYPE_PROVINCE = "Province";

  };

  Region.build = function (properties) {
    var instance = new Region();
    instance.setAll(properties);
    return instance;
  }

  Region.create = function (properties) {
    var instance = Region.build(properties);
    return instance.save()
  };

  Region.findOrCreate = function (properties) {
    var region = Region.build(properties);
    var labels = buildLabels(region);

    // "MERGE (n:"+labels+" { name:'Michael Douglas' })
    // RETURN michael.name, michael.bornIn
  }

  Region.prototype.setAll = function (properties) {
    for (var key in properties) {
      this.set(key, properties[key]);
    }
  }

  Region.prototype.set = function (propertyName, value) {
    this.data[propertyName] = value != undefined ? value : null;
  }

  Region.prototype.save = function () {

    var deferred = Q.defer();

    var labels = buildLabels(this);

    var props = {};
    for (var i = 0; i < this.properties.length; i++) {
      var key = this.properties[i];
      props[key] = this.data[key] != undefined ? this.data[key] : null;
    }

    if (this._id == null) {

      Region.db.cypherQuery(
        'CREATE (' +
        'n' + labels +
        buildPropertyQuery(props) +
        ') RETURN n',
        props,
        function (error, result) {
          if (error) {
            deferred.reject(new Error(error));
          } else {
            deferred.resolve(result);
          }
        }
      );
    } else {
      Region.db.cypherQuery(
        'MATCH (n) WHERE id(n)= ' + this._id + ' ' +
        'SET n = { props }' +
        'RETURN n',
        {
          props: props
        }, function (error, result) {
          if (error) {
            deferred.reject(new Error(error));
          } else {
            deferred.resolve(result);
          }
        });
    }

    return deferred.promise;
  }

  function buildLabels(region) {
    var labels = ':Region:' + Region.databaseName;
    if (region.type != null) {
      labels += ":" + region.type;
    }
    return labels;
  }

  function buildPropertyQuery(data) {
    var preFix = "{ ";
    var postFix =  " }";

    var query = "";
    for (var key in data) {
      if(query.length > 0){
        query += ", ";
      }
      query += key + ": " + "{" + key + "}";
    }

    return preFix + query + postFix;
  }

  return Region;
}