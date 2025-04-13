// ./configs/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if(process.env.MONGODB)
    {
    const conn = await mongoose.connect(process.env.MONGODB, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    else
    {
      console.warn(`No MongbDB Connection String. Please add one and try again.`);
    }
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1); // Exit process with failure if connection fails
  }
};

// Export the connection function
module.exports = connectDB;