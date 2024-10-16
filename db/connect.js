const { Client } = require("cassandra-driver");
require("dotenv").config();

const client = new Client({
  cloud: {
    secureConnectBundle: process.env.CASSANDRA_SECURE_BUNDLE_PATH, // Update this path accordingly
  },
  credentials: {
    username: process.env.CASSANDRA_CLIENT_ID, // Use environment variables for credentials
    password: process.env.CASSANDRA_CLIENT_SECRET,
  },
  keyspace: process.env.CASSANDRA_KEYSPACE, // Specify your keyspace here
});

async function connect() {
  try {
    await client.connect();
    console.log("Connected to Cassandra");
  } catch (error) {
    console.error("Error connecting to Cassandra", error);
  }
}

async function shutdown() {
  await client.shutdown();
}

async function executeQuery(query, params = []) {
  try {
    const result = await client.execute(query, params, { prepare: true });
    return result;
  } catch (error) {
    console.error("Query execution error:", error);
    return error;
  }
}

module.exports = { connect, shutdown, executeQuery };
