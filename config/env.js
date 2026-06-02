const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Try multiple paths to find .env file
const possiblePaths = [
  path.resolve(__dirname, '..', '.env'),  // server/.env (when running from server/)
  path.resolve(__dirname, '../../server', '.env'),  // server/.env (when running from root)
  path.resolve(process.cwd(), 'server', '.env'),  // server/.env (from any working directory)
  path.resolve(process.cwd(), '.env'),  // .env in current directory
];

let envPath = null;
for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    envPath = filePath;
    break;
  }
}

const isRender = Boolean(process.env.RENDER || process.env.RENDER_EXTERNAL_URL);
const hasRuntimeEnv = Boolean(
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  process.env.JWT_SECRET
);

if (!envPath) {
  // On cloud platforms, env vars are usually injected by the platform UI.
  if (!isRender || !hasRuntimeEnv) {
    console.warn('No .env file found. Using runtime environment variables only.');
  }
  module.exports = { envPath: null };
} else {
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    if (!isRender || !hasRuntimeEnv) {
      console.warn(`Could not load .env from ${envPath}:`, result.error.message);
    }
  } else if (!result.parsed || Object.keys(result.parsed).length === 0) {
    if (!isRender || !hasRuntimeEnv) {
      console.warn(
        `No variables loaded from ${envPath}. Ensure lines are not commented out (no leading #).`
      );
    }
  }
}

module.exports = { envPath };
