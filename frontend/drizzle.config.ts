import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema-local.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/centers-local.db",
  },
} satisfies Config;
