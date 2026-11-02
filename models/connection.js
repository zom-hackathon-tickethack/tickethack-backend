const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

const connMongoDB = mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));

module.exports = connMongoDB    //c'est une Promise qui est retournée (le '.then')
