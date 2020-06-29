import { config } from "dotenv";
config();

import { createDb, migrate } from "postgres-migrations";
import { Client } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
const MIGRATION_DIR = "./migrations";
const MIGRATION_DB = "migrations";

async function run() {
  console.log("Migration started with following:", {
    DATABASE_URL,
    MIGRATION_DIR,
    MIGRATION_DB,
  });

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: false,
  });
  await client.connect();

  try {
    await createDb(MIGRATION_DB, { client });
    await migrate({ client }, MIGRATION_DIR);
  } catch (error) {
    console.log("An error occurred during migration");
    console.error(error);
  } finally {
    await client.end();
  }
}

run();
