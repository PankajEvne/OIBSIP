import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "🍕" },
    stock: { type: Number, required: true, default: 15 },
    threshold: { type: Number, default: 3 },
  },
  { timestamps: true }
);

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
