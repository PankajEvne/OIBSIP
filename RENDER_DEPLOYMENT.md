# 🚀 Render Deployment Guide - PizzaHub

Yeh guide aapko Pizza Delivery project ko **Render** par bina kisi error ke successfully deploy karne ke liye step-by-step instructions provide karta hai.

---

## 📌 Architecture Overview
- **Backend**: Node.js / Express API (Render **Web Service**)
- **Frontend**: React + Vite (Render **Static Site** - *100% Free, Global CDN, No Sleep*)
- **Database**: MongoDB Atlas
- **Payments & Email**: Razorpay & Gmail SMTP (Nodemailer)

---

## ⚡ Option 1: 1-Click Blueprint Deployment (Sabse Aasan Tarika - Recommended)

Humne project ke root me `render.yaml` configure kar diya hai.

1. **Render Dashboard par jayein**: [dashboard.render.com](https://dashboard.render.com)
2. **New +** button par click karein aur **Blueprint** select karein.
3. Apna GitHub repository (`OIBSIP`) connect karein.
4. Render automatically `pizzahub-backend` aur `pizzahub-frontend` dono detect kar lega.
5. **Environment Variables** prompt aayega:
   - Backend ke liye:
     - `MONGODB_URI`: Apna MongoDB connection string daalein.
     - `JWT_SECRET`: Koi bhi strong secret key daalein (e.g. `my_super_secret_jwt_key_12345`).
     - `SMTP_USER`: Apna Gmail ID.
     - `SMTP_PASS`: Gmail App Password (16-digit).
     - `ADMIN_EMAIL`: Aapka Admin email.
     - `RAZORPAY_KEY_ID`: Razorpay Key ID (`rzp_test_...`).
     - `RAZORPAY_KEY_SECRET`: Razorpay Key Secret.
     - `CLIENT_URL`: Frontend deploy hone ke baad jo URL milega (e.g., `https://pizzahub-frontend.onrender.com`).
   - Frontend ke liye:
     - `VITE_API_URL`: Backend deploy hone ke baad jo URL milega (e.g., `https://pizzahub-backend.onrender.com`).
6. **Apply** par click karein! Render dono services ko deploy kar dega.

---

## 🛠️ Option 2: Manual Deployment (Agar Manual Setup Karna Ho)

### Step 1: Backend Deploy Karein (Web Service)
1. Render Dashboard me **New +** -> **Web Service** select karein.
2. Apna GitHub repository connect karein.
3. Settings fill karein:
   - **Name**: `pizzahub-backend` (ya apni pasand ka naam)
   - **Language**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `WebDev-L3-PizzaDelivery/server`  *(Yeh zaroor dalein)*
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. **Environment Variables** add karein:
   | Key | Value Example | Description |
   |-----|---------------|-------------|
   | `NODE_ENV` | `production` | Production environment |
   | `PORT` | `10000` | Render standard port |
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/pizzadb` | MongoDB Atlas URI |
   | `JWT_SECRET` | `your_secret_key_here` | JWT sign key |
   | `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP host |
   | `SMTP_PORT` | `587` | Gmail SMTP port |
   | `SMTP_USER` | `your-email@gmail.com` | Gmail address |
   | `SMTP_PASS` | `xxxx xxxx xxxx xxxx` | Gmail 16-digit App Password |
   | `ADMIN_EMAIL` | `admin@gmail.com` | Admin email address |
   | `CLIENT_URL` | `https://pizzahub-frontend.onrender.com` | Frontend URL |
   | `RAZORPAY_KEY_ID` | `rzp_test_xxxxxx` | Razorpay Key ID |
   | `RAZORPAY_KEY_SECRET` | `xxxxxx` | Razorpay Secret |
5. **Create Web Service** par click karein.
6. Backend deploy hone ke baad uska URL copy kar lijiye (e.g., `https://pizzahub-backend.onrender.com`).

---

### Step 2: Frontend Deploy Karein (Static Site)
1. Render Dashboard me **New +** -> **Static Site** select karein.
2. Apna wahi GitHub repository select karein.
3. Settings fill karein:
   - **Name**: `pizzahub-frontend` (ya apni pasand ka naam)
   - **Branch**: `main`
   - **Root Directory**: `WebDev-L3-PizzaDelivery/client` *(Yeh zaroor dalein)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Step 1 se mila Backend URL (e.g. `https://pizzahub-backend.onrender.com`) |
5. **Redirects/Rewrites (Important for React Router)**:
   - Settings tab -> **Redirects / Rewrites** me jayein:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
   *(Humne project me `public/_redirects` file bhi daal di hai, jisse yeh automatically handle ho jata hai).*
6. **Create Static Site** par click karein.

---

### Step 3: URL Linking & Final Touch
1. Frontend deploy hone ke baad uska URL copy karein (e.g., `https://pizzahub-frontend.onrender.com`).
2. Backend service ki **Environment** tab me jayein aur `CLIENT_URL` me frontend ka live URL daal kar save karein.
3. Backend automatically redeploy ho jayega.

---

## 🎯 Verification Checklist
- [ ] Backend status: **Live** (`https://<backend-name>.onrender.com/` open karne par `"Pizza Delivery API Running"` dikhai dega).
- [ ] Frontend status: **Live** (Home page, pizzas list, cart, and authentication working).
- [ ] Register new user -> Check verification email.
- [ ] Test admin login -> `/admin` dashboard accessible.
- [ ] Test refresh on any page (e.g. `/menu`, `/dashboard`) -> Should load properly without 404.
