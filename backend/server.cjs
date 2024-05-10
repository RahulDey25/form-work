// server.cjs
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();


// Define your schemas and models
const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  states: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }],
});

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
});

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
});

const Country = mongoose.model("Country", countrySchema);
const State = mongoose.model("State", stateSchema);
const City = mongoose.model("City", citySchema);

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.VITE_REACT_APP_PORT;
const mongoURI = process.env.VITE_REACT_APP_MONGODB_STRING;

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("MongoDB connected");
    // Populate the database here
    populateDatabase();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const populateDatabase = async () => {
  try {
    // Check if the database already contains data
    const existingCountries = await Country.find();
    if (existingCountries.length > 0) {
      console.log("Database already populated.");
      return;
    }

    // Create 3 countries
    const usa = await Country.create({ name: "United States of America" });
    const canada = await Country.create({ name: "Canada" });
    const uk = await Country.create({ name: "United Kingdom" });

    // Create 2 states for each country
    const nyState = await State.create({ name: "New York", country: usa._id });
    const caState = await State.create({
      name: "California",
      country: usa._id,
    });
    const onState = await State.create({
      name: "Ontario",
      country: canada._id,
    });
    const qcState = await State.create({ name: "Quebec", country: canada._id });
    const engState = await State.create({ name: "England", country: uk._id });
    const scotState = await State.create({ name: "Scotland", country: uk._id });

    // Create 2 cities for each state
    await City.create({ name: "New York City", state: nyState._id });
    await City.create({ name: "Buffalo", state: nyState._id });
    await City.create({ name: "Los Angeles", state: caState._id });
    await City.create({ name: "San Francisco", state: caState._id });
    await City.create({ name: "Toronto", state: onState._id });
    await City.create({ name: "Ottawa", state: onState._id });
    await City.create({ name: "Montreal", state: qcState._id });
    await City.create({ name: "Quebec City", state: qcState._id });
    await City.create({ name: "London", state: engState._id });
    await City.create({ name: "Manchester", state: engState._id });
    await City.create({ name: "Edinburgh", state: scotState._id });
    await City.create({ name: "Glasgow", state: scotState._id });

    // Update the countries with their corresponding states
    await Country.updateMany({}, { $set: { states: [] } });
    await Country.updateOne(
      { _id: usa._id },
      { $push: { states: nyState._id } }
    );
    await Country.updateOne(
      { _id: usa._id },
      { $push: { states: caState._id } }
    );
    await Country.updateOne(
      { _id: canada._id },
      { $push: { states: onState._id } }
    );
    await Country.updateOne(
      { _id: canada._id },
      { $push: { states: qcState._id } }
    );
    await Country.updateOne(
      { _id: uk._id },
      { $push: { states: engState._id } }
    );
    await Country.updateOne(
      { _id: uk._id },
      { $push: { states: scotState._id } }
    );

    console.log("Database populated successfully!");
  } catch (err) {
    console.error("Error populating database:", err);
  }
};

// Endpoint to fetch list of countries
app.get("/api/countries", async (req, res) => {
  try {
    const countries = await Country.find().populate("states");
    res.json(countries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to fetch list of states based on country
app.get("/api/states/:countryId", async (req, res) => {
  const { countryId } = req.params;
  try {
    const states = await State.find({ country: countryId }).populate("cities");
    res.json(states);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to fetch list of cities based on state
app.get("/api/cities/:stateId", async (req, res) => {
  const { stateId } = req.params;
  try {
    const cities = await City.find({ state: stateId });
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
