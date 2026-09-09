# 🍕 PizzaHub - Full-Stack Artisanal Pizza Web Application

A full-stack pizza ordering and custom DIY builder web application built with **React**, **Tailwind CSS**, **Node.js / Express**, **MongoDB**, and **Razorpay Payment Gateway**.

---

## 🔗 Live Application Link

[![Live App](https://img.shields.io/badge/Live_App-PizzaHub-brightgreen?style=for-the-badge&logo=render)](https://pizzahub-app.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/PankajEvne/OIBSIP)

- 🌐 **Single Unified URL (Frontend + Backend API)**: [https://pizzahub-app.onrender.com](https://pizzahub-app.onrender.com)

---

## 🌟 Key Features

### 🖥️ Public Website
- **Home Landing Page (`/`)**: Hero banner, best-seller pizzas showcase with high-res photos, 30-minute delivery badges, customer testimonials, and quick ordering.
- **Menu Page (`/menu`)**: Public pizza catalog with instant live search and direct "Order Now" action.
- **About Us (`/about`)**: Kitchen story, authentic dough fermentation, and 100% pure dairy mozzarella quality pledge.
- **Contact Us (`/contact`)**: Store details, operational hours (11:00 AM – 11:30 PM), order hotline, contact message form, and interactive FAQ accordion.
- **Navbar & Footer**: Responsive navigation with mobile menu drawer and dynamic authentication state.

### 🛠️ Pizza Ordering & DIY Builder
- **Pre-configured Menu**: Fresh pizzas (`Margherita`, `Double Cheese Margherita`, `Farmhouse`, `Peppy Paneer`, `Veg Extravaganza`).
- **Interactive DIY Pizza Builder**: Custom pizza creator slice-by-slice — choose crust base, signature sauce, cheese portions, and fresh vegetable toppings with real-time price calculation.
- **Cart & Sync**: Persistent cart sync across device and backend database.
- **Payment Gateway**: Integrated Razorpay checkout with secure test verification and instant status update.
- **Live Order Tracking**: Real-time order status tracking (*Order Received*, *In Kitchen*, *Sent to Delivery*, *Delivered*).

### ⚙️ Admin Dashboard (`/admin`)
- **Order Management**: View customer orders, items, totals, and update live preparation and delivery statuses.
- **Product Management**: Add new pizzas with name, description, price, and image URL; delete old items.
- **User Database**: View registered users, toggle admin/user roles, and manage users.
- **Stock & Inventory Alerts**: Real-time restock warnings and inventory logs.

### 🔐 Authentication & Security
- User registration with email verification.
- **OTP Password Reset**: 6-digit OTP verification sent to email for secure password recovery.
- Role-based protected routes (`admin` vs `user`).
- JWT token session management.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS v4, Vite, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js
- **Services**: Razorpay API, Nodemailer (SMTP)

---

## 📁 Project Structure

```
OIBSIP/
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, PizzaBuilder, ProtectedRoute
│   │   ├── pages/          # Home, Menu, About, Contact, Dashboard, Admin, Login, Register, ForgotPassword
│   │   ├── data/           # Shared pizza datasets
│   │   ├── App.jsx         # Routes definition
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/                 # Backend Node.js / Express API
│   ├── config/             # Database connection
│   ├── controllers/        # Auth, Order, Pizza, Payment, Inventory, Cart
│   ├── middleware/         # JWT Auth & Admin guards
│   ├── models/             # User, Order, Pizza, Inventory, Notification, Cart
│   ├── routes/             # Express API routes
│   ├── utils/              # Email transporter & Cron jobs
│   ├── .env.example
│   └── package.json
├── .gitignore              # Git ignore rules for node_modules and .env files
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) or local MongoDB instance
- [Razorpay Test Account](https://razorpay.com/)

---

### 2. Installation

Clone the repository and install dependencies for both `client` and `server`:

```bash
# Clone repository
git clone https://github.com/<your-username>/pizza-delivery-app.git
cd pizza-delivery-app

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 3. Environment Configuration

#### Server (`server/.env`):
Copy `server/.env.example` to `server/.env` and update with your credentials:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pizzadb
JWT_SECRET=your_jwt_secret_key

# Nodemailer Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
ADMIN_EMAIL=your_email@gmail.com
CLIENT_URL=http://localhost:5173

# Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxx
```

#### Client (`client/.env`):
Copy `client/.env.example` to `client/.env`:
```env
VITE_API_URL=http://localhost:3000
```

---

### 4. Running Locally

Start the backend server and frontend development server in separate terminals:

```bash
# Terminal 1: Start backend server (runs on http://localhost:3000)
cd server
npm run dev

# Terminal 2: Start frontend client (runs on http://localhost:5173)
cd client
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## ☁️ Deploying on Render (Single Web Service)

This full-stack project is configured to run on **a single unified Web Service on Render** (serving both the React Frontend and Node.js Express APIs from the same domain):

1. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `https://github.com/PankajEvne/OIBSIP`.
3. Configure the service:
   - **Name**: `pizzahub-app`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables (from `server/.env.example`):
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`: Gmail credentials for auth & order emails
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Razorpay keys
   - `CLIENT_URL`: `https://pizzahub-app.onrender.com`
5. Click **Deploy Web Service**! Both the frontend website and backend APIs will be live on this single link.

---

## 📄 License
This project is licensed under the ISC License.
