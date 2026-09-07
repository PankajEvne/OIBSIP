import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["base", "sauce", "cheese", "vegetable"],
      required: true,
    },
    name: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    threshold: { type: Number, default: 20 },
    lowStockNotified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;