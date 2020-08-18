const dotenv = require('dotenv');
dotenv.config();

const Sequelize = require('sequelize');


const sequelize = new Sequelize(`${process.env.SQL_DB}`, 'root', `${process.env.SQL_PASS}`, { 
    dialect: 'mysql', 
    host: `${SQL_HOST}` 
});

module.exports = sequelize;