import { useState, useEffect, useMemo } from "react";


const BASES = [
  { id: "thin", name: "Thin Crust", price: 0 },
  { id: "classic", name: "Classic Crust", price: 40 },
  { id: "cheese", name: "Cheese Burst", price: 100 },
  { id: "wheat", name: "Whole Wheat", price: 60 },
  { id: "herb", name: "Italian Herb", price: 70 },
];

const SAUCES = [
  { id: "tomato", name: "Classic Tomato", price: 0 },
  { id: "spicy", name: "Spicy Red", price: 20 },
  { id: "bbq", name: "BBQ", price: 30 },
  { id: "peri", name: "Peri Peri", price: 30 },
  { id: "garlic", name: "Creamy Garlic", price: 40 },
];

const CHEESES = [
  { id: "mozzarella", name: "Mozzarella", price: 50 },
  { id: "cheddar", name: "Cheddar", price: 70 },
  { id: "parmesan", name: "Parmesan", price: 80 },
  { id: "blend", name: "Cheese Blend", price: 90 },
  { id: "vegan", name: "Vegan Cheese", price: 100 },
];

const VEGETABLES = [
  { id: "onion", name: "Onion 🧅", price: 20 },
  { id: "capsicum", name: "Capsicum 🫑", price: 20 },
  { id: "corn", name: "Corn 🌽", price: 25 },
  { id: "olives", name: "Olives 🫒", price: 30 },
  { id: "mushroom", name: "Mushroom 🍄‍🟫", price: 30 },
  { id: "jalapeno", name: "Jalapeno 🌶️", price: 25 },
  { id: "tomato", name: "Tomato 🍅", price: 20 },
];

export default function PizzaBuilder({onAddToCart}){
  const [base, setBase] = useState(BASES[0]);
  const [sauce, setSauce] = useState(SAUCES[0]);
  const [cheeses, setCheeses] = useState(CHEESES[0]);
  const [vegetables, setVegetables] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [inventory, setInventory] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3000");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/inventory`);
        const data = await response.json();
        setInventory(data);
      } catch (err) {
        console.error("Failed to load inventory for builder", err);
      }
    };
    fetchInventory();
  }, []);

  const getStock = (name, category) => {
    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase() && i.category === category);
    return item ? item.stock : 50;
  };

  const toggleVegetable = (vegetable) => {
  const exist = vegetables.some((item) => item.id === vegetable.id);

  if (exist) {
    setVegetables(
      vegetables.filter((item) => item.id !== vegetable.id)
    );
  } else {
    setVegetables([...vegetables, vegetable]);
  }
};

const price = calculatePrice();
function calculatePrice(){
  const vegetablePrice = vegetables.reduce((total, item) => total + item.price, 0);
  const singlePizza = 199 + base.price + sauce.price + cheeses.price + vegetablePrice;
  return singlePizza * quantity;
}

const pizzaId = crypto.randomUUID();

const handleAddToCart = () => {
  const pizza = {
    id: crypto.randomUUID(),
    base,
    sauce,
    cheeses,
    vegetables,
    quantity,
    price,
  };


  onAddToCart(pizza);
};

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-orange-100/60">
      <div className="builder-header flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-orange-100 pb-6 mb-8">
        <div>
          <span className="eyebrow text-xs font-semibold tracking-widest text-orange-600 uppercase">
            CREATE YOUR OWN
          </span>
          <h2 className="mt-1 text-3xl font-extrabold text-gray-900 tracking-tight">
            Build Your Perfect Pizza 🍕
          </h2>
          <p className="mt-1.5 text-sm text-gray-600">
            Pick your favorite crust, sauce, cheese and toppings.
          </p>
        </div>

        <div className="price-box flex flex-col items-end rounded-2xl bg-orange-50 px-6 py-3 border border-orange-100 shadow-sm min-w-[120px]">
          <span className="text-xs font-medium text-orange-850 uppercase tracking-wider">Total</span>
          <strong className="text-3xl font-extrabold text-orange-700">
            ₹{price}
          </strong>
        </div>
      </div>

      <div className="builder-section mb-8">
        <h3 className="mb-3 text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">1</span>
          Choose Your Crust: <span className="text-orange-600 font-semibold">{base.name}</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {BASES.map((item) => {
            const isActive = base.id === item.id;
            const stock = getStock(item.name, "base");
            const isOutOfStock = stock === 0;
            return (
              <button
                key={item.id}
                disabled={isOutOfStock}
                onClick={() => setBase(item)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 font-semibold text-sm flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                  isActive
                    ? "border-orange-500 bg-orange-50 text-orange-950 font-bold"
                    : isOutOfStock
                    ? "border-red-100 bg-red-50 text-red-400 opacity-60 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/20"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs font-normal text-gray-500">
                  {isOutOfStock ? "Out of Stock" : item.price > 0 ? `+ ₹${item.price} (Qty: ${stock})` : `Free (Qty: ${stock})`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="builder-section mb-8">    
        <h3 className="mb-3 text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">2</span>
          Select Sauce: <span className="text-orange-600 font-semibold">{sauce.name}</span>
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {SAUCES.map((item) => {
            const isActive = sauce.id === item.id;
            const stock = getStock(item.name, "sauce");
            const isOutOfStock = stock === 0;
            return (
              <button
                key={item.id}
                disabled={isOutOfStock}
                onClick={() => setSauce(item)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 font-semibold text-sm flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                  isActive
                    ? "border-orange-500 bg-orange-50 text-orange-950 font-bold"
                    : isOutOfStock
                    ? "border-red-100 bg-red-50 text-red-400 opacity-60 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/20"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs font-normal text-gray-500">
                  {isOutOfStock ? "Out of Stock" : item.price > 0 ? `+ ₹${item.price} (Qty: ${stock})` : `Free (Qty: ${stock})`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="builder-section mb-8">   
        <h3 className="mb-3 text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">3</span>
          Select Cheese: <span className="text-orange-600 font-semibold">{cheeses.name}</span>
        </h3>   
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CHEESES.map((item) => {
            const isActive = cheeses.id === item.id;
            const stock = getStock(item.name, "cheese");
            const isOutOfStock = stock === 0;
            return (
              <button
                key={item.id}
                disabled={isOutOfStock}
                onClick={() => setCheeses(item)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 font-semibold text-sm flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                  isActive
                    ? "border-orange-500 bg-orange-50 text-orange-950 font-bold"
                    : isOutOfStock
                    ? "border-red-100 bg-red-50 text-red-400 opacity-60 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/20"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs font-normal text-gray-500">
                  {isOutOfStock ? "Out of Stock" : `+ ₹${item.price} (Qty: ${stock})`}
                </span>
              </button>
            );
          })}
        </div>
      </div>   

      <div className="builder-section mb-8">  
        <h3 className="mb-3 text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">4</span>
          Fresh Veggies: <span className="text-orange-600 font-semibold">{vegetables.length > 0 ? vegetables.map((v)=>v.name).join(", ") : "None Selected"}</span>
        </h3>   
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {VEGETABLES.map((item) => {
            const isActive = vegetables.some((v) => v.id === item.id);
            const stock = getStock(item.name, "vegetable");
            const isOutOfStock = stock === 0;
            return (
              <button
                key={item.id}
                disabled={isOutOfStock}
                onClick={() => toggleVegetable(item)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 font-semibold text-sm flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer ${
                  isActive
                    ? "border-orange-500 bg-orange-50 text-orange-950 font-bold"
                    : isOutOfStock
                    ? "border-red-100 bg-red-50 text-red-400 opacity-60 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50/20"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs font-normal text-gray-500">
                  {isOutOfStock ? "Out of Stock" : `+ ₹${item.price} (Qty: ${stock})`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="quantity-control flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 border-t border-orange-100 pt-8">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-gray-800">Quantity:</span>
          <div className="flex items-center gap-3 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
            <button
              type="button"
              className="text-xl font-bold text-orange-700 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-orange-100 transition active:scale-90"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="text-lg font-extrabold text-orange-950 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              className="text-xl font-bold text-orange-700 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-orange-100 transition active:scale-90"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-base rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>Add Custom Pizza</span>
          <span>·</span>
          <span>₹{price}</span>
        </button>
      </div>
          
       
    </div>
  )
}











