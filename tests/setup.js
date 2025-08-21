const mongoose = require('mongoose');
require('dotenv').config();

jest.setTimeout(30000);

beforeAll(async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGODB_URI_TEST);
});



afterAll(async () => {
  await mongoose.connection.close();
});