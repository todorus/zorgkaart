'use strict';
var sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {

  var Region = sequelize.define(
    'Region',
    {
      name: DataTypes.STRING,
      type: {
        type: DataTypes.INTEGER,
        unique: "compIndex"
      },
      code: {
        type: DataTypes.INTEGER,
        unique: "compIndex"
      },
      description: DataTypes.TEXT,
      area: DataTypes.JSON,
      zips: DataTypes.JSON
    },
    {
      classMethods: {
        atomize: function (input) {
          var ids = input.join();
          var type = Region.TYPE_ZIP;
          var query = "SELECT id, name FROM \"Regions\"" +
            " WHERE type = " + type +
            " AND id IN (SELECT \"ChildId\" FROM \"RegionToRegions\" WHERE \"ParentId\" IN (" + ids +"))";


          console.log("query", query);
          return sequelize.query(
            query,
            { type: sequelize.QueryTypes.SELECT}
          );
        }
      }
    }
  );

  Region.belongsToMany(
    Region,
    {
      as: 'Parents',
      foreignKey: 'ChildId',
      through: 'RegionToRegions'
    }
  );

  Region.TYPE_ZIP = 1;
  Region.TYPE_PLACE = 100;
  Region.TYPE_MUNICIPALITY = 200;
  Region.TYPE_PROVINCE = 300;


  return Region;
};