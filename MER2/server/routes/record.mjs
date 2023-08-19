import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a record by RUT or a list of all the records if no RUT is provided.
router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  if (req.query.rut) {
     let regex = new RegExp("^" + req.query.rut); // This creates a regex pattern to match the start of a string.
     let query = { rut: regex };
     let results = await collection.find(query).toArray();

     if (results.length === 0) {
         res.status(404).json({ message: "Not found" });
         return;
     }
     
     res.send(results).status(200);
  } else {
     let results = await collection.find({}).toArray();
     res.send(results).status(200);
  }
});



// Get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Create a new record.
router.post("/", async (req, res) => {
  let newDocument = {
    Nombre: req.body.Nombre,
    Numero: req.body.Numero,
    email: req.body.email,
    rut: req.body.rut
  };
  let collection = await db.collection("records");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});


// Update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      Nombre: req.body.Nombre,
      Numero: req.body.Numero,
      email: req.body.email,
      rut: req.body.rut
    }
  };

  let collection = await db.collection("records");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("records");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
