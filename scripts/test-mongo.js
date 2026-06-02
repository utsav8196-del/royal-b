require('../config/env');
const { connectDatabase, printAtlasHelp } = require('../config/db');

connectDatabase()
  .then(() => {
    console.log('✓ MongoDB connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    printAtlasHelp();
    process.exit(1);
  });
