import { sql } from "@vercel/postgres";

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS passengers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        "fromCity" TEXT NOT NULL,
        "toCity" TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,  
        airlines TEXT,
        comments TEXT
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 + 1 AS sum`;
    if (result && result.rows && result.rows.length > 0 && 'sum' in result.rows[0]) {
      console.log("Database connection successful");
      return result.rows[0].sum === 2;
    } else {
      throw new Error('Unexpected query result structure');
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

// Run the initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().then(() => process.exit(0));
}

async function ensureTableExists() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS passengers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        "fromCity" TEXT NOT NULL,
        "toCity" TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,  // New field for email
        airlines TEXT,
        comments TEXT
      )
    `;
  } catch (error) {
    console.error('Error ensuring table exists:', error);
    throw error;
  }
}