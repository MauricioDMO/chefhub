import { createClient } from '@libsql/client';
import { TURSO_AUTH_TOKEN, TURSO_DB_URL } from '@/consts/env';

if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_DB_URL and TURSO_AUTH_TOKEN must be set in environment variables");
}

// Create database client
export const client = createClient({
  url: TURSO_DB_URL,
  authToken: TURSO_AUTH_TOKEN,
});
