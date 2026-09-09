import mongoose from "mongoose";



const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pizza: {
      base: { type: String, required: true },
      sauce: { type: String, required: true },
      cheese: { type: String, required: true },
      vegetables: [{ type: String }],
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered", "Cancelled"],
      default: "In Kitchen",
    },
    payment: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    totalAmount: { type: Number },
    paymentStatus: { type: String, default: "Paid" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
