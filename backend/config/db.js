const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set strictQuery to true
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Event-manager",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 