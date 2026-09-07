import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import ConnectDb from './config/db.js';

import authRoutes from './routes/authRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import pizzaRoutes from './routes/pizzaRoutes.js'
import userRoutes from './routes/userRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import './utils/cronJobs.js';


const app = express();

app.use(cors());
app.use(express.json());

ConnectDb();

app.get('/', (req, res)=>{
    res.send('Pizza Delivery API Running');
})

app.use("/auth/api", authRoutes)
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/notifications", notificationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Sever is running on port ${PORT}`);
})