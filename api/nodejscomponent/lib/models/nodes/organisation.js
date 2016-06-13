'use strict';
var Q = require('q');

module.exports = function (db, databaseName) {
  function Organisation() {
    this.data = {};
    this.properties = ["name", "description", "contact_information", "regions"];
  };

  Organisation.db = db;
  Organisation.databaseName = databaseName;

  Organisation.build = function (properties) {
    var instance = new Organisation();
    instance.setAll(properties);
    return instance;
  };

  Organisation.create = function (properties) {
    var instance = Organisation.build(properties);
    return instance.save();
  };

  Organisation.count = function(name){
    var deferred = Q.defer();

    var whereClause = name != null && name != undefined ? "WHERE n.name =~ '(?i)" + name + ".*' " : "";

    var query = "MATCH (n" + buildLabels(null) + ") " +
      whereClause +
      "RETURN COUNT(n)";

    Organisation.db.cypherQuery(
      query,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(result.data[0]);
        }
      }
    );

    return deferred.promise;
  };

  Organisation.find = function (properties) {
    var deferred = Q.defer();

    var organisation = Organisation.build(properties);
    var labels = buildLabels(organisation);

    Organisation.db.cypherQuery(
      "MATCH (" +
      "n" + labels +
      buildPropertyQuery(properties) +
      ") RETURN n",
      properties,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(Organisation.resultToOrganisations(result));
        }
      }
    );

    return deferred.promise;
  };

  Organisation.findOrCreate = function (properties) {
    var deferred = Q.defer();

    var organisation = Organisation.build(properties);
    var labels = buildLabels(organisation);

    Organisation.db.cypherQuery(
      "MERGE (" +
      "n" + labels +
      buildPropertyQuery(properties) +
      ") RETURN n",
      properties,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(Organisation.resultToOrganisations(result));
        }
      }
    );

    return deferred.promise;
  };

  Organisation.bulkCreate = function (propertiesArray) {
    var deferred = Q.defer();
    var statements = [];
    for (var i = 0; i < propertiesArray.length; i++) {
      var props = propertiesArray[i];
      var statement = Organisation.buildStatement(props);

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

  Organisation.buildStatement = function(properties){

    var labels = buildLabels(Organisation.build(properties));
    var query = 'CREATE (' +
      'n' + labels +
      buildPropertyQuery(properties) +
      ') RETURN n';

    var statement = {
      statement: query,
      parameters: properties
    };

    return statement;
  }

  Organisation.search = function (name, limit, skip) {
    var deferred = Q.defer();

    var whereClause = name != null && name != undefined ? "WHERE n.name =~ '(?i)" + name + ".*' " : "";

    var queryData = "MATCH (n" + buildLabels(null) + ") " +
      whereClause +
      "RETURN n " +
      "ORDER BY LOWER(n.name), length(n.name) ASC " +
      "SKIP " + skip + " " +
      "LIMIT " + limit;

    db.cypherQuery(
      queryData,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(result);
        }
      });

    return deferred.promise;
  };

  /**
   * Takes a collection of ids and returns those organisationnodes
   * @param idArray
   * @returns a promise which will return organisationnodes
   */
  Organisation.byIds = function (idArray){
    var deferred = Q.defer();
    var ids = idArray.toString();
    var labels = buildLabels(Organisation.build({}));

    var query = "MATCH (child" + labels + ")" +
      "WHERE ID(child) IN [" + ids + "] " +
      "RETURN child " +
      "ORDER BY child.name";

    db.cypherQuery(
      query,
      function (error, result) {
        if (error) {
          deferred.reject(new Error(error));
        } else {
          deferred.resolve(Organisation.resultToOrganisations(result));
        }
      });


    return deferred.promise;
  };

  Organisation.resultToOrganisations = function(result) {
    var converted = [];
    for (var i = 0; i < result.data.length; i++) {
      var organisation = Organisation.build(result.data[i]);
      converted.push(organisation);
    }

    return converted;
  };

  Organisation.toJson = function (input) {
    var response;

    if(Array.isArray(input)) {
      response = [];

      for (var i = 0; i < input.length; i++) {
        var data = input[i];
        response.push(Organisation.toJson(data));
      }

    } else {
      var data = input;

      if (data["_id"]) {
        data["id"] = data["_id"];
        delete data["_id"];
      }

      response = data;
    }

    return response;
  };

  Organisation.prototype.setAll = function (properties) {
    for (var key in properties) {
      this.set(key, properties[key]);
    }
  };

  Organisation.prototype.set = function (propertyName, value) {
    this.data[propertyName] = value != undefined ? value : null;
  };

  Organisation.prototype.save = function () {

    var deferred = Q.defer();

    var labels = buildLabels(this);

    var props = {};
    for (var i = 0; i < this.properties.length; i++) {
      var key = this.properties[i];
      props[key] = this.data[key] != undefined ? this.data[key] : null;
    }

    var id = this.data["_id"];
    if (id == null) {

      Organisation.db.cypherQuery(
        'CREATE (' +
        'n' + labels +
        buildPropertyQuery(props) +
        ') RETURN n',
        props,
        function (error, result) {
          if (error) {
            deferred.reject(new Error(error));
          } else {
            deferred.resolve(Organisation.resultToOrganisations(result));
          }
        }
      );
    } else {
      Organisation.db.cypherQuery(
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

  Organisation.prototype.toString = function () {
    return "Organisation: " + JSON.stringify(this.data);
  };

  Organisation.prototype.inspect = function () {
    return this.toString();
  };

  function buildConnectionQuery(label, propertiesStart, propertiesEnd) {

  }

  function buildLabels(organisation) {
    var labels = ':Organisation:' + Organisation.databaseName;
    if (organisation != null && organisation.data["type"] != null) {
      labels += ":" + organisation.data["type"];
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

  return Organisation;
}