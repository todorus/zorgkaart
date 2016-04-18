'use strict';
var Q = require('q');

module.exports = function (db, databaseName) {
  function Utils() {
    this.data = {};

    Utils.db = db;
    Utils.databaseName = databaseName;
  };

  Utils.wipe = function(){
    var deferred = Q.defer();

    var query = "MATCH (n:"+databaseName+")-[r]->(m) DELETE n,m,r";

    db.cypherQuery(
      query,
      function (error, result) {
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(null);
        }
      },
      true
    );

    return deferred.promise;
  }

  return Utils;
}