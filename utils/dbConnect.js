import mongoose from 'mongoose';


const db = process.env.MONGO_URI; // Load MongoDB URI from .env file

const connection = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const dbConnection = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("MongoDB Connected...");
    connection.isConnected = dbConnection.connections[0].readyState;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export default dbConnect;