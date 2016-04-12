'use strict';
module.exports = function (sequelize, DataTypes) {

  var Region = sequelize['import'](__dirname + "/Region.js");

  var RegionToRegions = sequelize.define(
    'RegionToRegions',
    {
      ChildId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Region,
          key: 'id',
          deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      ParentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Region,
          key: 'id',
          deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      }
    }
  );


  return RegionToRegions;
};

