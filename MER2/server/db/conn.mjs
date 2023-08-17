import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log('Successfully connected to MongoDB');  // <-- Added this log here.
} catch(e) {
  console.error('Failed to connect to MongoDB:', e); // <-- Added a more descriptive error message.
}

let db = conn.db("sample_training");

export default db;