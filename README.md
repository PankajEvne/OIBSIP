# 🍕 PizzaHub - Full-Stack Artisanal Pizza Web Application

A full-stack pizza ordering and custom DIY builder web application built with **React**, **Tailwind CSS**, **Node.js / Express**, **MongoDB**, and **Razorpay Payment Gateway**.

---

## 🔗 Live Deployment Links

| Service | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Render (Static Site) | [https://pizzahub-frontend.onrender.com](https://pizzahub-frontend.onrender.com) | [![Render Frontend](https://img.shields.io/badge/Render-Live-success?style=flat-square&logo=render)](https://pizzahub-frontend.onrender.com) |
| **Backend API** | Render (Web Service) | [https://pizzahub-backend.onrender.com](https://pizzahub-backend.onrender.com) | [![Render Backend](https://img.shields.io/badge/API-Active-blue?style=flat-square&logo=render)](https://pizzahub-backend.onrender.com) |
| **GitHub Repo** | GitHub | [https://github.com/PankajEvne/OIBSIP](https://github.com/PankajEvne/OIBSIP) | [![GitHub](https://img.shields.io/badge/Repo-PankajEvne%2FOIBSIP-black?style=flat-square&logo=github)](https://github.com/PankajEvne/OIBSIP) |

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

## ☁️ Deploying on Render

This project is pre-configured for seamless deployment on [Render](https://render.com):

### 1. Backend Service (Web Service)
- **Repository**: Connect your GitHub repository (`OIBSIP`)
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Add variables from `server/.env.example` (`MONGODB_URI`, `JWT_SECRET`, `SMTP_*`, `RAZORPAY_*`, `CLIENT_URL`).

### 2. Frontend Service (Static Site)
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: 
  - `VITE_API_URL`: Your deployed backend URL (e.g. `https://pizzahub-backend.onrender.com`)

---

## 📄 License
This project is licensed under the ISC License.
