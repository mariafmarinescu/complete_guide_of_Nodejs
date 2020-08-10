const Sequalize = require('sequelize');


const sequalize = new Sequalize('nodejs', 'root', 'passwordHere', { 
    dialect: 'mysql', 
    host: 'localhost' 
});

module.exports = sequalize;