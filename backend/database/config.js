const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const dbConnection = async () => {
  try{
    await mongoose.connect('mongodb://mongo:27017/');
    console.log('Success: DB connected');
  } catch(error){
    console.log(error);
    throw new Error('Error: DB connection failed');
  }
}

module.exports = {
  dbConnection
}