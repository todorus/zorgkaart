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
          var query = "SELECT id FROM \"Regions\"" +
            " WHERE (type = " + type + " AND id in (" + ids +"))" +
            " OR (type = " + type + " AND id IN (SELECT \"ChildId\" FROM \"RegionToRegions\" WHERE \"ParentId\" IN (" + ids +")))" +
            " ORDER BY id";

          return sequelize.query(
            query,
            { type: sequelize.QueryTypes.SELECT}
          );
        },

        toJson: function(regions){
          return regions.map(function (currentValue, index, original) {

            return {
              id: currentValue["id"] != undefined ? currentValue["id"] : null,
              name: currentValue["name"] != undefined ? currentValue["name"] : null,
              type: currentValue["type"] != undefined ? currentValue["type"] : null,
              area: currentValue["area"] != undefined ? currentValue["area"] : null
            };
          });
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