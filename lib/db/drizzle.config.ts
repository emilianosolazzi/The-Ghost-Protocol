import { defineConfig } from "drizzle-kit";
import "dotenv/config"; // ← Recommended: load .env early

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Please check your .env file and ensure the database is provisioned.");
}

export default defineConfig({
  // Use a glob so drizzle-kit resolves schema files consistently on Windows.
  schema: "./src/schema/*.ts",

  // Where migrations will be generated (highly recommended to specify)
  out: "./drizzle",

  // Database dialect
  dialect: "postgresql",

  // Database credentials
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  // Recommended development & debugging flags
  verbose: true,        // Shows detailed output during generate/push/migrate
  strict: true,         // Enables stricter checks (good for catching issues early)

  // Optional but useful for larger projects
  // migrations: {
  //   table: "__drizzle_migrations__",   // default is fine
  //   schema: "public",
  // },
});