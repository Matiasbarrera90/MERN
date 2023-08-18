import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all the products.
router.get("/", async (req, res) => {
  let collection = await db.collection("products");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// Get a single product by id.
router.get("/:id", async (req, res) => {
  let collection = await db.collection("products");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Create a new product.
router.post("/", async (req, res) => {
  let newProduct = {
    name: req.body.name,
    price: req.body.price,
    label: req.body.label,
    variants: req.body.variants
  };
  let collection = await db.collection("products");
  let result = await collection.insertOne(newProduct);
  res.send(result).status(204);
});

// Update a product by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      name: req.body.name,
      price: req.body.price,
      label: req.body.label,
      variants: req.body.variants
    }
  };

  let collection = await db.collection("products");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// Delete a product
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("products");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;