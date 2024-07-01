const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const dbURI = process.env.MONGO_URI; // Access the MongoDB URI from environment variables

if (!dbURI) {
  console.error('The MONGO_URI environment variable is not set.');
  process.exit(1); // Exit the process with an error code if MONGO_URI is not set
}

const connection = {}; // Object to keep track of the MongoDB connection status

async function dbConnect() {
  if (connection.isConnected) {
    return; // If already connected, do nothing
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const dbConnection = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
    connection.isConnected = dbConnection.connections[0].readyState; // Update the connection status
  } catch (err) {
    if (err.name === 'MongoNetworkError') {
      console.error('Network issue, please check your connection and MongoDB server status.');
    } else if (err.name === 'MongoParseError') {
      console.error('There seems to be an issue with your MongoDB URI.');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('Could not connect to any servers in your MongoDB Atlas cluster.');
    } else {
      console.error('An unexpected error occurred:', err);
    }
    // Retry connection after 5 seconds
    setTimeout(dbConnect, 5000);
  }
}

module.exports = dbConnect;