import Inventory from '../models/Inventory.js'

const DEFAULT_INVENTORY = [
  { category: "base", name: "Thin Crust", stock: 50, threshold: 10 },
  { category: "base", name: "Classic Crust", stock: 50, threshold: 10 },
  { category: "base", name: "Cheese Burst", stock: 50, threshold: 10 },
  { category: "base", name: "Whole Wheat", stock: 50, threshold: 10 },
  { category: "base", name: "Italian Herb", stock: 50, threshold: 10 },
  { category: "sauce", name: "Classic Tomato", stock: 50, threshold: 10 },
  { category: "sauce", name: "Spicy Red", stock: 50, threshold: 10 },
  { category: "sauce", name: "BBQ", stock: 50, threshold: 10 },
  { category: "sauce", name: "Peri Peri", stock: 50, threshold: 10 },
  { category: "sauce", name: "Creamy Garlic", stock: 50, threshold: 10 },
  { category: "cheese", name: "Mozzarella", stock: 50, threshold: 10 },
  { category: "cheese", name: "Cheddar", stock: 50, threshold: 10 },
  { category: "cheese", name: "Parmesan", stock: 50, threshold: 10 },
  { category: "cheese", name: "Cheese Blend", stock: 50, threshold: 10 },
  { category: "cheese", name: "Vegan Cheese", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Onion 🧅", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Capsicum 🫑", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Corn 🌽", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Olives 🫒", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Mushroom 🍄‍🟫", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Jalapeno 🌶️", stock: 50, threshold: 10 },
  { category: "vegetable", name: "Tomato 🍅", stock: 50, threshold: 10 }
];

// GET /api/inventory 
export const getInventory = async (req, res) => {
  try {
    let items = await Inventory.find().sort({ category: 1, name: 1 });
    if (items.length === 0) {
      items = await Inventory.insertMany(DEFAULT_INVENTORY);
      items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/inventory/:id  (admin only - manual stock update)
export const updateStock = async (req, res) => {
  try {
    const { stock, threshold } = req.body;
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (stock !== undefined) item.stock = stock;
    if (threshold !== undefined) item.threshold = threshold;

    // Reset the low-stock notification flag if restocked above threshold
    if (item.stock > item.threshold) item.lowStockNotified = false;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/inventory  (admin only - create a new inventory item)
export const createItem = async (req, res) => {
  try {
    const { category, name, stock, threshold } = req.body;
    const item = await Inventory.create({ category, name, stock, threshold });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};