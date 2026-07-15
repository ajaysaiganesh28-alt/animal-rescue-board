const mongoose = require("mongoose");

const rescueRequestSchema = new mongoose.Schema(
  {
    animalType: {
      type: String,
      required: [true, "Animal type is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    reporterName: {
      type: String,
      required: [true, "Reporter name is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    location: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    photoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "claimed", "in-progress", "rescued", "closed"],
      default: "pending",
    },
    claimedBy: {
      name: { type: String, default: null },
      organization: { type: String, default: null },
      contactNumber: { type: String, default: null },
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RescueRequest", rescueRequestSchema);
