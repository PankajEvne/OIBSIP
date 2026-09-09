import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import PizzaBuilder from "../components/PizzaBuilder";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("menu");
  const [pizzas, setPizzas] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [cart, setCart] = useState([]);

  // Load cart from server on mount / login
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && data.cart) {
          setCart(data.cart.items || []);
        }
      } catch (error) {
        console.error("Failed to load cart from server", error);
      }
    };
    if (user?.id) {
      fetchCart();
    }
  }, [user?.id]);

  // Sync cart to server and local storage on cart change
  useEffect(() => {
    if (!user?.id) return;

    const token = sessionStorage.getItem("token");
    if (!token) return;

    const delayDebounce = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: cart }),
        });
      } catch (error) {
        console.error("Failed to sync cart to server", error);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [cart, user?.id]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen]);

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pizzas`);
        const data = await response.json();

        if (data.success) {
          setPizzas(data.pizzas);
        }
      } catch (error) {
        console.error("Failed to load pizzas", error);
      }
    };

    fetchPizzas();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/order/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMyOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  useEffect(() => {
    let interval;
    if (activeTab === "orders") {
      fetchMyOrders();
      interval = setInterval(fetchMyOrders, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  const addToCart = (pizza) => {
    setCart((cur) => {
      if (pizza._id) {
        // Standard pre-configured pizza from menu
        const existingIndex = cur.findIndex((item) => item._id === pizza._id);
        if (existingIndex > -1) {
          const updated = [...cur];
          const newQty = (updated[existingIndex].quantity || 1) + 1;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: pizza.price * newQty,
          };
          return updated;
        } else {
          return [
            ...cur,
            {
              id: Math.random().toString(36).substring(2, 9),
              _id: pizza._id,
              name: pizza.name,
              description: pizza.description,
              price: pizza.price,
              quantity: 1,
              basePrice: pizza.price,
            },
          ];
        }
      } else {
        // Custom Pizza (has base, sauce, etc.)
        const existingIndex = cur.findIndex((item) => {
          if (!item.base || !pizza.base) return false;
          const sameBase = item.base.id === pizza.base.id;
          const sameSauce = item.sauce.id === pizza.sauce.id;
          const sameCheese = item.cheeses.id === pizza.cheeses.id;
          const sameVegs =
            item.vegetables.length === pizza.vegetables.length &&
            item.vegetables.every((v) =>
              pizza.vegetables.some((pv) => pv.id === v.id)
            );
          return sameBase && sameSauce && sameCheese && sameVegs;
        });

        if (existingIndex > -1) {
          const updated = [...cur];
          const newQty = (updated[existingIndex].quantity || 1) + pizza.quantity;
          const singlePrice = updated[existingIndex].price / updated[existingIndex].quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
            price: singlePrice * newQty,
          };
          return updated;
        } else {
          return [...cur, pizza];
        }
      }
    });
  };

  const updateQuantity = (itemId, change) => {
    setCart((cur) => {
      return cur
        .map((item) => {
          if (item.id === itemId) {
            const newQty = Math.max(0, (item.quantity || 1) + change);
            if (newQty === 0) return null;
            const singlePrice = item.price / (item.quantity || 1);
            return {
              ...item,
              quantity: newQty,
              price: singlePrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const token = sessionStorage.getItem("token");

      // Step 1: Create Razorpay Order in Backend
      const payOrderRes = await fetch(`${API_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const payOrderData = await payOrderRes.json();
      if (!payOrderRes.ok) {
        alert(payOrderData.message || "Failed to initiate payment");
        return;
      }

      // Step 2: Open Razorpay checkout modal or simulate mock payment
      if (payOrderData.order.isMock) {
        alert("Simulating Razorpay Test-Mode Payment... (Mock Mode Active) 💳");

        // Directly simulate successful payment handler callback
        const mockPaymentResponse = {
          razorpay_order_id: payOrderData.order.id,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          razorpay_signature: "mock_signature_1234"
        };

        // Step 3: Create Order in DB
        const orderRes = await fetch(`${API_URL}/api/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart,
            totalAmount: cartTotal,
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          alert("Order placement failed!");
          return;
        }

        // Step 4: Verify Mock Payment
        const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: mockPaymentResponse.razorpay_order_id,
            razorpay_payment_id: mockPaymentResponse.razorpay_payment_id,
            razorpay_signature: mockPaymentResponse.razorpay_signature,
            orderId: orderData.order._id
          }),
        });

        if (verifyRes.ok) {
          alert("Mock Payment successful & Order placed! 🍕");
          setCart([]);
          setIsCartOpen(false);
          fetchMyOrders();
        } else {
          alert("Mock Payment verification failed!");
        }
        return;
      }

      // Step 2: Ensure Razorpay checkout script is loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = resolve;
          s.onerror = reject;
          document.body.appendChild(s);
        });
      }

      const options = {
        key: payOrderData.key_id || "rzp_test_TW4LH7cfEa10gF",
        amount: payOrderData.order.amount,
        currency: "INR",
        name: "PizzaHub",
        description: "Order Checkout Payment",
        order_id: payOrderData.order.id,
        handler: async function (response) {
          // Step 3: Create Order in DB
          const orderRes = await fetch(`${API_URL}/api/order`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: cart,
              totalAmount: cartTotal,
            }),
          });
          const orderData = await orderRes.json();
          if (!orderRes.ok) {
            alert("Order placement failed after payment!");
            return;
          }

          // Step 4: Verify Payment
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order._id
            }),
          });

          if (verifyRes.ok) {
            alert("Payment successful & Order placed! 🍕");
            setCart([]);
            setIsCartOpen(false);
            fetchMyOrders();
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#ea580c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse) {
        alert(failResponse.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setCart([]);
    navigate("/login");
  };

  return (
    <div className="dashboard min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      <nav className="navbar relative flex items-center justify-between px-6 py-4 md:px-10 bg-slate-900/60 backdrop-blur-md shadow-lg border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition cursor-pointer">
            PizzaHub 🍕
          </Link>
          <Link to="/" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer">
            ← Home
          </Link>
        </div>

        <div className="nav-actions flex items-center gap-6">
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setIsCartOpen((prev) => !prev)}
              className="flex items-center gap-1 text-lg font-medium text-orange-500 hover:text-orange-400 transition cursor-pointer"
            >
              🛒 {cart.length}
            </button>

            {/* Cart Dropdown Panel with High Z-Index to stay on top of other pages */}
            {isCartOpen && (
              <div className="absolute right-0 top-12 z-[9999] w-80 rounded-2xl bg-slate-900 p-4 shadow-2xl border border-slate-800 text-white">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                  <h3 className="text-lg font-bold text-white">Your Cart</h3>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 transition active:scale-95 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">
                    Cart is empty 🍕
                  </p>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-xl bg-slate-800 p-3 border border-slate-700"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {item.base ? `${item.base.name} Pizza` : item.name}
                            </p>
                            {item.base ? (
                              <>
                                <p className="text-xs text-slate-400">
                                  {item.sauce.name} · {item.cheeses.name}
                                </p>
                                {item.vegetables.length > 0 && (
                                  <p className="text-xs text-slate-500 truncate">
                                    {item.vegetables.map((v) => v.name).join(", ")}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-slate-400 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-slate-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="flex flex-col items-end justify-between self-stretch">
                            <strong className="whitespace-nowrap text-sm font-bold text-orange-500">
                              ₹{item.price}
                            </strong>
                            <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-700 px-2 py-1 shadow-sm border border-slate-600">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-1 text-sm font-bold text-orange-500 hover:text-orange-400 cursor-pointer"
                                type="button"
                              >
                                -
                              </button>
                              <span className="text-xs font-semibold text-white min-w-[12px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-1 text-sm font-bold text-orange-500 hover:text-orange-400 cursor-pointer"
                                type="button"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-slate-800 pt-4">
                      <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                        <span>Total Amount</span>
                        <strong className="text-lg font-bold text-orange-500">₹{cartTotal}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="mt-3 w-full rounded-xl bg-orange-600 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 active:scale-95 cursor-pointer"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main mx-auto max-w-6xl px-6 py-10">
        <div className="welcome mb-10 text-center">
          <span className="eyebrow text-xs font-semibold tracking-widest text-orange-500">
            WELCOME BACK
          </span>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Hey {user?.name}! 👋
          </h1>
          <p className="mt-2 text-slate-400">
            Hungry? Let's build your perfect pizza.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${activeTab === "menu"
                ? "bg-orange-650 text-white shadow-md"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
          >
            🍕 Ready-made Pizza
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${activeTab === "builder"
                ? "bg-orange-650 text-white shadow-md"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
          >
            🛠️ Pizza Builder (DIY)
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${activeTab === "orders"
                ? "bg-orange-650 text-white shadow-md"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
          >
            📜 Order History
          </button>
        </div>

        {activeTab === "menu" ? (
          <section className="menu-section">
            <div className="mb-6 text-center">
              <span className="eyebrow text-xs font-semibold tracking-widest text-orange-500">
                OUR MENU
              </span>
              <h2 className="mt-1 text-2xl font-bold text-white">
                Popular Pizzas
              </h2>
            </div>

            <div className="pizza-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pizzas.map((pizza) => (
                <article
                  className="pizza-card flex flex-col items-center rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  key={pizza._id}
                >
                  <div className="w-full h-40 flex items-center justify-center rounded-2xl mb-4 overflow-hidden bg-slate-850">
                    {pizza.image && pizza.image.startsWith("http") ? (
                      <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    ) : (
                      <span className="text-5xl">{pizza.image || "🍕"}</span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {pizza.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400 flex-grow">
                    {pizza.description}
                  </p>

                  <strong className="mt-3 text-xl text-orange-500">
                    ₹{pizza.price}
                  </strong>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-2 ${pizza.stock === 0 ? "bg-red-950 text-red-400 border border-red-900/50" :
                      pizza.stock <= (pizza.threshold || 3) ? "bg-amber-950 text-amber-400 border border-amber-900/50" :
                        "bg-green-950 text-green-400 border border-green-900/50"
                    }`}>
                    {pizza.stock === 0 ? "Out of Stock" : `Stock: ${pizza.stock} left`}
                  </span>

                  <button
                    type="button"
                    disabled={pizza.stock === 0}
                    onClick={() => addToCart(pizza)}
                    className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition shadow-sm active:scale-95 cursor-pointer ${pizza.stock === 0 ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
                      }`}
                  >
                    {pizza.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : activeTab === "builder" ? (
          <div className="pizza-builder-section">
            <PizzaBuilder onAddToCart={addToCart} />
          </div>
        ) : (
          <section className="orders-section animate-fadeIn">
            <div className="mb-6 text-center">
              <span className="eyebrow text-xs font-semibold tracking-widest text-orange-500">
                HISTORY
              </span>
              <h2 className="mt-1 text-2xl font-bold text-white">
                My Pizza Orders
              </h2>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              {myOrders.length === 0 ? (
                <p className="text-center text-slate-450 py-12 bg-slate-900/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-800">
                  You haven't placed any orders yet 🍕
                </p>
              ) : (
                myOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                          Order ID: #{order._id.slice(-8)}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${order.status === "Delivered"
                            ? "bg-green-950 text-green-400 border-green-900/50"
                            : order.status === "Cancelled"
                              ? "bg-red-950 text-red-400 border-red-900/50"
                              : "bg-blue-950 text-blue-400 border-blue-900/50"
                          }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start text-sm bg-slate-800/50 rounded-xl p-3 border border-slate-800/40"
                        >
                          <div>
                            <span className="text-white font-bold block">
                              {item.name || (item.base ? `${item.base.name} Pizza` : "Custom Pizza")}
                            </span>
                            {item.base && (
                              <span className="text-xs text-slate-400 block mt-0.5">
                                {item.base.name} · {item.sauce?.name} · {item.cheeses?.name}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold bg-slate-700 border border-slate-600 px-2 py-0.5 rounded-lg text-white whitespace-nowrap">
                            × {item.quantity || 1}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-800 pt-3 font-bold text-slate-100">
                      <span className="text-sm font-medium text-slate-400">Total Amount Paid</span>
                      <span className="text-xl font-extrabold text-orange-500">
                        ₹{order.totalAmount || order.price}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
