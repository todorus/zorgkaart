'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('RegionToRegions', {
      ParentId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: "compIndex",
        references: {
          model: 'Regions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ChildId: {
        alowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: "compIndex",
        references: {
          model: 'Regions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('RegionToRegions');
  }
};