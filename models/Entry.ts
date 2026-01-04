import mongoose, { Schema, model, models } from "mongoose";

const EntrySchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    mood: {
      type: String,
      enum: ["happy", "sad", "neutral", "anxious", "excited"],
      default: "neutral",
    },
    visibility: {
      type: String,
      enum: ["private", "draft", "public"],
      default: "private",
    },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Entry = models.Entry || model("Entry", EntrySchema);

export default Entry;
