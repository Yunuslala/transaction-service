const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
// Load the CA certificate
const caPath = path.resolve(__dirname, '../ca.pem');
const caCert = fs.readFileSync(caPath);

// Create a Sequelize instance with the same configuration
const sequelize = new Sequelize(process.env.dbname, process.env.username, process.env.passworddata, {
  host: process.env.host,
  port: process.env.port,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: caCert
    }
  },
  logging: false 
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {sequelize};
