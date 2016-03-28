'use strict';
module.exports = function(sequelize, DataTypes) {

  var Region = sequelize.define('Region', {
    name: {
      type:DataTypes.STRING,
      unique: "compIndex"
    },
    type: {
      type: DataTypes.INTEGER,
      unique: "compIndex"
    },
    description: DataTypes.TEXT
  });

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