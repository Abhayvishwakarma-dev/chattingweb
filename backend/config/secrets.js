import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First, try to load existing .env
const envPath = path.join(__dirname, '..', '.env');

// Load existing .env if it exists
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Generate a secure random secret
const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Ensure .env exists with secrets
const ensureSecrets = () => {
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  const hasAccessSecret = envContent.includes('JWT_ACCESS_SECRET=');
  const hasRefreshSecret = envContent.includes('JWT_REFRESH_SECRET=');

  let updated = false;
  let newContent = envContent;

  if (!hasAccessSecret) {
    const secret = generateSecret(32);
    newContent += `\nJWT_ACCESS_SECRET=${secret}`;
    updated = true;
    console.log('🔑 Generated new JWT_ACCESS_SECRET');
  }

  if (!hasRefreshSecret) {
    const secret = generateSecret(32);
    newContent += `\nJWT_REFRESH_SECRET=${secret}`;
    updated = true;
    console.log('🔑 Generated new JWT_REFRESH_SECRET');
  }

  // Add Google placeholders if not present
  if (!newContent.includes('GOOGLE_CLIENT_ID=')) {
    newContent += '\nGOOGLE_CLIENT_ID=your_google_client_id_here';
    updated = true;
  }
  
  if (!newContent.includes('GOOGLE_CLIENT_SECRET=')) {
    newContent += '\nGOOGLE_CLIENT_SECRET=your_google_client_secret_here';
    updated = true;
  }
  
  if (!newContent.includes('GOOGLE_CALLBACK_URL=')) {
    newContent += '\nGOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback';
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(envPath, newContent.trim());
    console.log('✅ .env file updated');
  }

  // Reload .env after updates
  dotenv.config({ path: envPath });
};

// Run the function
ensureSecrets();

export const getAccessSecret = () => process.env.JWT_ACCESS_SECRET;
export const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET;

export default {
  getAccessSecret,
  getRefreshSecret,
  ensureSecrets,
  generateSecret,
};