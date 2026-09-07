import Pizza from '../models/Pizza.js';

const DEFAULT_INVENTORY = []; // placeholder or empty

const DEFAULT_PIZZAS = [
  {
    name: "Margherita",
    description: "Classic delight with 100% real mozzarella cheese",
    price: 199,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Double Cheese Margherita",
    description: "The sweet temptation of extra cheese",
    price: 349,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Farmhouse",
    description: "Delightful combination of onion, capsicum, tomato & grilled mushroom",
    price: 399,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Peppy Paneer",
    description: "Flavorful trio of paneer, capsicum, and red paprika",
    price: 429,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Veg Extravaganza",
    description: "Black olives, capsicum, onion, grilled mushroom, corn, tomato & jalapeno",
    price: 499,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80"
  }
];

export const getPizzas = async (req, res) => {
  try {
    let pizzas = await Pizza.find();
    if (pizzas.length === 0) {
      // Seed default pizzas if DB is empty
      pizzas = await Pizza.insertMany(DEFAULT_PIZZAS);
    }
    res.json({ success: true, pizzas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPizza = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const pizza = await Pizza.create({ name, description, price, image: image || "🍕" });
    res.status(201).json({ success: true, pizza });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    res.json({ success: true, message: "Pizza removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
