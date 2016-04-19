'use strict';
var Q = require('q');

module.exports = function (db, databaseName) {
  function Region() {
    this.data = {};
    this.properties = ["name", "description", "type", "code", "area"];
  };

  Region.db = db;
  Region.databaseName = databaseName;

  Region.TYPE_ZIP = "Zip";
  Region.TYPE_PLACE = "Place";
  Region.TYPE_MUNICIPALITY = "Municipality";
  Region.TYPE_PROVINCE = "Province";

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
    var deferred = Q.defer();

    var region = Region.build(properties);
    var labels = buildLabels(region);

    Region.db.cypherQuery(
      "MERGE (" +
      "n" + labels +
      buildPropertyQuery(properties) +
      ") RETURN n",
      properties,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(resultToRegions(result));
        }
      }
    );

    return deferred.promise;
  }

  Region.bulkCreate = function (propertiesArray) {
    var deferred = Q.defer();
    var statements = []
    for (var i = 0; i < propertiesArray.length; i++) {
      var props = propertiesArray[i];
      if (props["area"] != null) {
        props["area"] = JSON.stringify(props["area"]);
      }

      var labels = buildLabels(Region.build(props));
      var query = 'CREATE (' +
        'n' + labels +
        buildPropertyQuery(props) +
        ') RETURN n';

      var statement = {
        statement: query,
        parameters: props
      }
      statements.push(statement)
    }

    db.beginAndCommitTransaction({
      statements: statements
    }, function (err, result) {
      if (err) {
        deferred.reject(err);
      } else if (result["errors"].length > 0) {
        deferred.reject(result["errors"]);
      } else {
        deferred.resolve(result);
      }
    });

    return deferred.promise;
  };

  Region.search = function (name) {
    var deferred = Q.defer();

    var query = "MATCH (n" + buildLabels(null) + ") " +
      "WHERE n.name =~ '(?i)" + name + ".*' " +
      "RETURN n";
    db.cypherQuery(
      query,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(result);
        }
      });

    return deferred.promise;
  };

  Region.toJson = function (result) {
    var response = [];
    var regions = resultToRegions(result);
    for(var i=0 ; i < regions.length; i++){
      var region = regions[i];
      response.push(region.data);
    }

    return response;
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

    var id = this.data["_id"];
    if (id == null) {

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
            deferred.resolve(resultToRegions(result));
          }
        }
      );
    } else {
      Region.db.cypherQuery(
        'MATCH (n) WHERE id(n)= ' + id + ' ' +
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

  Region.prototype.toString = function () {
    return "Region: " + JSON.stringify(this.data);
  }

  Region.prototype.inspect = function () {
    return this.toString();
  }

  function buildLabels(region) {
    var labels = ':Region:' + Region.databaseName;
    if (region != null && region.data["type"] != null) {
      labels += ":" + region.data["type"];
    }
    return labels;
  }

  function buildPropertyQuery(data) {
    var preFix = "{ ";
    var postFix = " }";

    var query = "";
    for (var key in data) {
      if (query.length > 0) {
        query += ", ";
      }
      query += key + ": " + "{" + key + "}";
    }

    return preFix + query + postFix;
  }

  function resultToRegions(result) {
    var converted = [];
    for (var i = 0; i < result.data.length; i++) {
      converted.push(Region.build(result.data[i]));
    }
    return converted;
  }

  return Region;
}