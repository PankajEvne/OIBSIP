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


import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

ConnectDb();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const altClientDistPath = path.resolve(__dirname, '../frontend/dist');
const clientDistPath = path.resolve(__dirname, '../../frontend/dist');
const distPath = fs.existsSync(altClientDistPath) ? altClientDistPath : (fs.existsSync(clientDistPath) ? clientDistPath : null);

if (distPath) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Pizza Delivery API Running');
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Sever is running on port ${PORT}`);
})