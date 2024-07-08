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

// Ensure the process exits gracefully if it fails to connect to the database after several retries
const MAX_RETRIES = 10;
let retries = 0;

async function connectWithRetries() {
  try {
    await dbConnect();
  } catch (err) {
    retries += 1;
    if (retries > MAX_RETRIES) {
      console.error('Exceeded maximum number of retries. Exiting...');
      process.exit(1);
    }
    console.log(`Retrying to connect to MongoDB (${retries}/${MAX_RETRIES})...`);
    setTimeout(connectWithRetries, 5000);
  }
}

connectWithRetries();

module.exports = dbConnect;
