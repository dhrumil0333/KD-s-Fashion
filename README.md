# 👕 KD's Fashion – 3D Custom T-Shirt Platform

**KD's Fashion** is an interactive web platform that lets users customize their own T-shirts in 3D and purchase exclusive designs uploaded by the admin. With real-time color changes, logo/image uploads, and 3D previews, it combines fashion with cutting-edge technology.
---

## 🧩 Key Features

### 👤 User Features
- 🌀 3D T-Shirt preview with rotation & zoom
- 🖼️ Upload custom logos or images onto the T-shirt
- 🎨 Change T-shirt colors in real-time
- 🛒 Add admin-designed shirts to cart and checkout
- 🔐 Login/Register functionality

### 🛠️ Admin Features
- Upload 3D-designed T-shirts with images
- View/manage users and orders
- Role-based protected routes

---

## 🛠️ Tech Stack

| Layer     | Technology               |
|-----------|---------------------------|
| Backend   | Node.js, Express.js       |
| Database  | MongoDB + Mongoose        |
| Auth      | JWT, bcrypt               |
| Storage   | Cloudinary (for images)   |
| Middleware| Custom Admin/User Auth    |

---

## 📁 Folder Structure
KD's Fashion/
├── Backend/
│ ├── models/ # Mongoose schemas (User, Product, Admin, etc.)
│ ├── routes/ # API routes (auth, cart, admin, etc.)
│ ├── middleware/ # Auth middleware
│ ├── server.js # Express entry point
│ └── .env # Environment config
└── (Frontend not included in zip)



---

## 🚀 Getting Started (Backend)

### 1. Clone the repository

```bash
git clone https://github.com/dhrumil0333/KD-s-Fashion.git
cd kds-fashion/Backend
```

2. Install dependencies
```bash
npm install
```

3. Add your .env file
``` bash
PORT=5000
MONGO_URI=mongodb+srv://your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the server
```bash
node server.js
```

🔐 Available API Routes

| Route           | Method | Description      |
| --------------- | ------ | ---------------- |
| `/api/auth`     | POST   | Login / Register |
| `/api/admin`    | GET    | Admin operations |
| `/api/cart`     | POST   | Add to cart      |
| `/api/products` | GET    | List products    |



👤 Author
Korat Dhrumil
Full Stack Developer & 3D Commerce Enthusiast
🔗 [LinkedIn](https://www.linkedin.com/in/korat-dhrumil-740817320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)




