const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Could not load .env from ${envPath}:`, result.error.message);
} else if (!result.parsed || Object.keys(result.parsed).length === 0) {
  console.warn(
    `No variables loaded from ${envPath}. Ensure lines are not commented out (no leading #).`
  );
}

module.exports = { envPath };
