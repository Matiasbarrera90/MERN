import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a business by RUT Empresa or a list of all the businesses if no RUT is provided.
router.get("/", async (req, res) => {
  let collection = await db.collection("businesses");
  if (req.query.rutEmpresa) {
     let regex = new RegExp("^" + req.query.rutEmpresa);
     let query = { rutEmpresa: regex };
     let results = await collection.find(query).toArray();

     if (results.length === 0) {
         res.status(404).json({ message: "Business not found" });
         return;
     }
     
     res.send(results).status(200);
  } else {
     let results = await collection.find({}).toArray();
     res.send(results).status(200);
  }
});

// Get a single business by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("businesses");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Business not found").status(404);
  else res.send(result).status(200);
});

// Create a new business record
router.post("/", async (req, res) => {
  const newDocument = {
    rutEmpresa: req.body.rutEmpresa,
    nombreFantasia: req.body.nombreFantasia,
    numeroContacto: req.body.numeroContacto,
    correoContacto: req.body.correoContacto,
    razonSocial: req.body.razonSocial,
    giroComercial: req.body.giroComercial,
    direccionComercial: req.body.direccionComercial
  };
  const collection = await db.collection("businesses");
  const result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Update a business by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      rutEmpresa: req.body.rutEmpresa,
      nombreFantasia: req.body.nombreFantasia,
      numeroContacto: req.body.numeroContacto,
      correoContacto: req.body.correoContacto,
      razonSocial: req.body.razonSocial,
      giroComercial: req.body.giroComercial,
      direccionComercial: req.body.direccionComercial
    }
  };

  const collection = await db.collection("businesses");
  const result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete a business
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = await db.collection("businesses");
  const result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
