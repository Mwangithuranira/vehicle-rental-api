import { config } from 'dotenv';
import { Client } from 'pg';

config(); // Load .env file

const client = new Client({
  connectionString: process.env.Database_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

export default client;
