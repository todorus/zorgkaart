'use strict';
module.exports = function(sequelize, DataTypes) {
  var RegionToRegion = sequelize.define('RegionToRegion', {
    ChildId: {
      type:DataTypes.INTEGER
    },
    ParentId: {
      type:DataTypes.INTEGER
    }
  });

  return RegionToRegion;
};