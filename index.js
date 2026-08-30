const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');

dotenv.config();


dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: [
    "http://localhost:3000",
  "https://campus-flow-theta-bay.vercel.app",
  ],
  credentials: true
}));
app.use(express.json()); 

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //await client.connect();
    
    const db = client.db("campus-flow");
    const usersCollection = db.collection("users");

    console.log("Connected successfully to MongoDB Atlas!");

    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        console.log("Received User Data:", user);


        const result = await usersCollection.insertOne(user);

        res.status(201).send({
          success: true,
          message: "User saved successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({
          success: false,
          message: "Failed to save user",
        });
      }
    });

  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('CampusFlow Server is running');
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});