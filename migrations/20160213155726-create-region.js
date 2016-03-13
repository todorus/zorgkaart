'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Regions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: "compIndex",
        alowNull: false
      },
      kind: {
        allowNull: false,
        unique: "compIndex",
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(
        function(){
          return queryInterface.addIndex(
            'Regions',
            ['name', 'kind'],
            {
              indexName: 'compIndex',
              indicesType: 'UNIQUE'
            }
          )
        }
    );
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Regions');
  }
};