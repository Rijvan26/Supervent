const mongoose = require('mongoose');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // ignore fallback
}

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autoparts_inventory');
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`Error connecting to MongoDB (Attempt ${retries}/${MAX_RETRIES}): ${error.message}`);
      if (retries === MAX_RETRIES) {
        console.error('Failed to connect to MongoDB after max retries. Exiting...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

module.exports = connectDB;
