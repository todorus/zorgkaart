'use strict';
module.exports = function(sequelize, DataTypes) {
  var Region = sequelize.define('Region', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Region;
};