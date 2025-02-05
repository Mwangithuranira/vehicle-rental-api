import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
// You config here

dialect: "postgresql",
schema: "./src/drizzle/schema.ts",
out: "./src/drizzle/migrations",


dbCredentials: {
    url: process.env.DATABASE_URL as string,
} as { url: string },
verbose: true,
strict: true,

});
