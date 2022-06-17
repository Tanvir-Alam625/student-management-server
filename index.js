const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2vv5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const studentCollection = client
      .db("students")
      .collection("studentCollection");
    app.get("/students", async (req, res) => {
      const query = {};
      const students = await studentCollection.find(query).toArray();
      res.send(students);
    });
    app.get("/student", async (req, res) => {
      const roll = parseInt(req.query.roll);
      const query = { roll: roll };
      const student = await studentCollection.findOne({ roll: roll });
      if (student) {
        res.send(student);
      } else {
        res.status(403).send({ message: "Not Found Student" });
      }
    });
    app.post("/student", async (req, res) => {
      const student = req.body;
      const storedStudent = await studentCollection.insertOne(student);
      res.send(storedStudent);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Student Management Server is Running");
});
app.listen(port, () => {
  console.log(port, " port is running");
});
