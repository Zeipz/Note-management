require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'notes_app',
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },
  // Añade configuraciones para test y production si es necesario
};