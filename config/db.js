const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async (uri) => {
  // prefer explicit uri param, fall back to env
  const mongoUri = uri || process.env.MONGODB_URI;

  // When running tests, the test setup (jest.setup.js) starts an in-memory
  // MongoDB instance and connects directly. If no MONGODB_URI is provided
  // in the test environment, skip auto-connecting here to avoid attempting
  // to connect with `undefined` and terminating the test runner.
  if (process.env.NODE_ENV === 'test' && !mongoUri) {
    // noop during tests - jest.setup.js will manage the connection
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // In tests we don't want to exit the process  let the test runner handle failures.
    if (process.env.NODE_ENV === 'test') {
      throw err;
    }
    process.exit(1);
  }
};

module.exports = connectDB;
