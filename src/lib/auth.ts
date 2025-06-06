import { betterAuth } from "better-auth"
import { LibsqlDialect } from "@libsql/kysely-libsql"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TURSO_AUTH_TOKEN, TURSO_DB_URL } from "@/consts/env"
import { nextCookies } from "better-auth/next-js"

if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_DB_URL and TURSO_AUTH_TOKEN must be set in environment variables");
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables");
}

const dialect = new LibsqlDialect({
    url: TURSO_DB_URL || "",
    authToken: TURSO_AUTH_TOKEN || "",
})
 
export const auth = betterAuth({
  database: {
    dialect,
    type: "sqlite"
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [
    nextCookies()
  ]
})
