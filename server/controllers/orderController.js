import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';
import Inventory from '../models/Inventory.js';
import Notification from '../models/Notification.js';

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Process stock deduction and auto-restock
    for (const item of items) {
      const qty = item.quantity || 1;
      if (item._id && !item.base) {
        // Pre-configured Pizza
        const pizza = await Pizza.findById(item._id);
        if (pizza) {
          pizza.stock = Math.max(0, pizza.stock - qty);
          await pizza.save();

          if (pizza.stock <= pizza.threshold) {
            const restockVal = 15;
            // Create notification for admin
            await Notification.create({
              message: `⚠️ WARNING: ${pizza.name} has low stock (${pizza.stock}). Automatically restocked to ${restockVal}.`,
              type: "stock_alert"
            });
            // Auto Restock
            pizza.stock = restockVal;
            await pizza.save();
          }
        }
      } else {
        // Custom Pizza: Deduct ingredients
        const ingredientsToDeduct = [];
        if (item.base) ingredientsToDeduct.push({ name: item.base.name, category: "base" });
        if (item.sauce) ingredientsToDeduct.push({ name: item.sauce.name, category: "sauce" });
        if (item.cheeses) ingredientsToDeduct.push({ name: item.cheeses.name, category: "cheese" });
        if (item.vegetables) {
          item.vegetables.forEach(v => {
            ingredientsToDeduct.push({ name: v.name, category: "vegetable" });
          });
        }

        for (const ing of ingredientsToDeduct) {
          const invItem = await Inventory.findOne({ name: ing.name, category: ing.category });
          if (invItem) {
            invItem.stock = Math.max(0, invItem.stock - qty);
            await invItem.save();

            if (invItem.stock <= invItem.threshold) {
              const restockVal = 50;
              // Create notification
              await Notification.create({
                message: `⚠️ WARNING: Ingredient '${invItem.name}' (${invItem.category}) is low on stock (${invItem.stock}). Automatically restocked to ${restockVal}.`,
                type: "stock_alert"
              });
              // Auto Restock
              invItem.stock = restockVal;
              await invItem.save();
            }
          }
        }
      }
    }

    // Adapt to pizza schema format for the first item as a fallback
    const firstItem = items[0];
    const pizzaData = {
      base: firstItem.base?.name || firstItem.name || "Custom Base",
      sauce: firstItem.sauce?.name || "Tomato Sauce",
      cheese: firstItem.cheeses?.name || "Mozzarella",
      vegetables: firstItem.vegetables?.map(v => v.name) || [],
    };

    const order = await Order.create({
      user: req.user.id,
      pizza: pizzaData,
      price: totalAmount,
      items,
      totalAmount,
      paymentStatus: "Paid",
      payment: {
        status: "paid"
      }
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
