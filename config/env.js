const path = require('path');
const dotenv = require('dotenv');

// Try multiple paths to find .env file
const possiblePaths = [
  path.resolve(__dirname, '..', '.env'),  // server/.env (when running from server/)
  path.resolve(__dirname, '../../server', '.env'),  // server/.env (when running from root)
  path.resolve(process.cwd(), 'server', '.env'),  // server/.env (from any working directory)
  path.resolve(process.cwd(), '.env'),  // .env in current directory
];

let envPath = null;
for (const filePath of possiblePaths) {
  try {
    require('fs').accessSync(filePath);
    envPath = filePath;
    break;
  } catch (e) {
    // Continue to next path
  }
}

if (!envPath) {
  envPath = possiblePaths[0]; // Use first path for error message if none found
}

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Could not load .env from ${envPath}:`, result.error.message);
} else if (!result.parsed || Object.keys(result.parsed).length === 0) {
  console.warn(
    `No variables loaded from ${envPath}. Ensure lines are not commented out (no leading #).`
  );
}

module.exports = { envPath };
