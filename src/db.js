const dns = require("dns");
const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require("./config");

// Only needed on machines whose DNS cannot resolve mongodb+srv:// addresses.
if (!config.isProduction) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const client = new MongoClient(config.mongoUri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
});

let db;

async function connectDb() {
  await client.connect();
  db = client.db(config.dbName);
  console.log("Connected successfully to MongoDB Atlas!");
  return db;
}

function getDb() {
  if (!db) throw new Error("Database is not connected yet");
  return db;
}

module.exports = { connectDb, getDb, client };

