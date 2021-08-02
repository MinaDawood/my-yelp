require("dotenv").config();
const express = require("express");
const db = require("./db");

const app = express();

// Middlewares
app.use(express.json());

// Get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM restaurants");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        restaurants: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query("SELECT * FROM restaurants WHERE id = $1", [
      id,
    ]);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const { name, location, price_range } = req.body;
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
      [name, location, price_range]
    );
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, price_range } = req.body;
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *",
      [name, location, price_range, id]
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await db.query("DELETE FROM restaurants WHERE id = $1", [
      id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`express server started on port ${process.env.PORT}`);
});
