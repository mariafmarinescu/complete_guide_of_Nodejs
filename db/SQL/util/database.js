const Sequalize = require('sequelize');


const sequalize = new Sequalize('nodejs', 'root', 'wacomforever7', { 
    dialect: 'mysql', 
    host: 'localhost' 
});

module.exports = sequalize;