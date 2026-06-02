const mongoose = require('mongoose');

const mongooseOptions = {
  serverSelectionTimeoutMS: 15000,
  family: 4, // Prefer IPv4 (helps on some Windows networks)
};

function printAtlasHelp() {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  MongoDB Atlas — connection failed                               ║
╠══════════════════════════════════════════════════════════════════╣
║  1. Open https://cloud.mongodb.com → your cluster                ║
║  2. Network Access → Add IP Address                              ║
║  3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for dev      ║
║     OR add your current public IP → Confirm                      ║
║  4. Wait 1–2 minutes, then restart: npm run dev                  ║
║                                                                  ║
║  Also verify Database Access user password in server/.env        ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in server/.env');
  }

  await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
  console.log('MongoDB connected');
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

function requireDatabase(req, res, next) {
  if (isDatabaseConnected()) return next();
  res.status(503).json({
    message:
      'Database not connected. Whitelist your IP in MongoDB Atlas (Network Access), then restart the server.',
    database: 'disconnected',
  });
}

module.exports = {
  mongooseOptions,
  connectDatabase,
  isDatabaseConnected,
  requireDatabase,
  printAtlasHelp,
};
