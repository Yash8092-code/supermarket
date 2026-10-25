# SuperMart SAS — Supermarket Automation Software
> **Assigned Role:** Buyer Dashboard  
> **Course / Assignment:** Software Engineering Laboratory Assignment  
> **Live GitHub Pages Frontend:** [https://yash8092-code.github.io/supermarket/](https://yash8092-code.github.io/supermarket/)  
> **GitHub Repository:** [https://github.com/Yash8092-code/supermarket](https://github.com/Yash8092-code/supermarket)

---

## 📋 Project Overview

**SuperMart SAS (Supermarket Automation Software)** is a full-stack, enterprise-grade educational supermarket management application designed specifically for the **Buyer** role. The system automates product discovery, shopping cart management with stock constraints, POS order checkout, automated thermal invoice generation, real-time dynamic dashboard metrics, and personal buyer profile administration.

The frontend is built using clean, responsive **HTML5, CSS3, and Vanilla JavaScript**, preserving the original design and DOM architecture without external frontend frameworks. The backend is powered by a robust **Node.js, Express.js, and MongoDB Atlas (Mongoose)** REST API featuring JWT authentication, password hashing with bcrypt, Helmet security headers, rate limiting, and an automated test suite.

---

## 🏗️ Architecture & Technology Stack

```
                          ┌─────────────────────────────────────┐
                          │         Client Web Browser          │
                          │   (GitHub Pages / Local Host)       │
                          │   • HTML5 Semantic Structure        │
                          │   • Vanilla CSS3 Design System      │
                          │   • Vanilla JavaScript (ES6+)       │
                          └──────────────────┬──────────────────┘
                                             │
                        REST API (JSON / Bearer JWT)
                                             │
                                             ▼
                          ┌─────────────────────────────────────┐
                          │     Node.js / Express Backend       │
                          │   • Port: 5000                      │
                          │   • CORS & Helmet Security          │
                          │   • Express Rate Limiting           │
                          │   • express-validator               │
                          │   • JWT Auth & bcryptjs             │
                          └──────────────────┬──────────────────┘
                                             │
                                  Mongoose ODM (TLS)
                                             │
                                             ▼
                          ┌─────────────────────────────────────┐
                          │        MongoDB Atlas Database       │
                          │   • Database: supermart_sas         │
                          │   • Collections: users, products,   │
                          │     orders, wishlists               │
                          └─────────────────────────────────────┘
```

### Technology Breakdown:
* **Frontend**:
  - **HTML5**: Semantic tags, accessible modals, forms, and SVG icons.
  - **CSS3**: Custom design system (`--primary: #16A34A`), flexbox/grid, print styling (`@media print` thermal slip), and responsive breakpoints.
  - **Vanilla JavaScript**: Object-oriented `SuperMartApp` with `ApiClient` helper, responsive live search, filters, and offline fallback.
* **Backend**:
  - **Runtime**: Node.js (v18+) & Express.js
  - **Database & ODM**: MongoDB Atlas & Mongoose
  - **Security & Middleware**: `bcryptjs` (salt rounds 10), `jsonwebtoken` (JWT), `helmet`, `cors`, `express-rate-limit`, `express-validator`
* **Testing**:
  - Built-in Node.js Test Runner (`node --test`)
  - `supertest` for HTTP request assertions
  - `mongodb-memory-server` for isolated, zero-risk in-memory test database execution

---

## 🗂️ Repository Directory Structure

```
supermarket/
├── index.html                   # Existing Buyer Dashboard markup & modals
├── style.css                    # Design system, thermal receipt print styles, responsive CSS
├── script.js                    # Vanilla JS controller with ApiClient & local fallback
├── assets/                      # Product images, documentation, and screenshots
│   └── README.md
├── backend/                     # Dedicated Node.js & Express REST Backend
│   ├── package.json             # Backend dependencies & npm scripts
│   ├── server.js                # Express app entrypoint with security & routes
│   ├── .env.example             # Environment variable template (safe placeholders)
│   ├── .gitignore               # Excludes node_modules, .env, and logs
│   ├── config/
│   │   └── database.js          # Mongoose connection with error handling
│   ├── models/
│   │   ├── User.js              # Buyer schema with bcrypt hashing & cart storage
│   │   ├── Product.js           # Catalogue item schema with inventory virtuals
│   │   ├── Order.js             # Purchase snapshots, 5% GST & unique invoice generator
│   │   └── Wishlist.js          # Buyer saved items relation
│   ├── middleware/
│   │   ├── auth.js              # JWT Bearer token verification middleware
│   │   ├── errorHandler.js      # Centralized JSON error formatting
│   │   └── validateRequest.js   # express-validator result handler
│   ├── routes/
│   │   ├── authRoutes.js        # Register, Login, Me, Logout endpoints
│   │   ├── productRoutes.js     # Products list, search, filters, category endpoints
│   │   ├── cartRoutes.js        # Cart items, qty, and voucher validation
│   │   ├── orderRoutes.js       # Order checkout, invoice generation, buyer isolation
│   │   ├── invoiceRoutes.js     # Invoice history and printable thermal slip data
│   │   ├── profileRoutes.js     # Profile retrieval and field-validated patch
│   │   ├── wishlistRoutes.js    # Persistent wishlist add/remove/list
│   │   └── dashboardRoutes.js   # Dynamic buyer metrics & lifetime spend
│   ├── controllers/             # Clean business logic controllers for all routes
│   ├── scripts/
│   │   └── seedProducts.js      # Idempotent 51-product catalogue & demo buyer seeder
│   └── tests/                   # Automated backend test suite (28 passing tests)
│       ├── setup.js             # MongoMemoryServer lifecycle management
│       ├── auth.test.js         # Registration, duplicate check, login, JWT tests
│       ├── products.test.js     # Search, filter, sorting, categories tests
│       ├── cart.test.js         # Cart operations, bounds, coupon validation tests
│       ├── orders.test.js       # Checkout, 5% GST, inventory decrement, buyer isolation tests
│       └── profile_wishlist.test.js # Profile updates, wishlist persistence, health tests
└── README.md                    # Comprehensive project documentation
```

---

## 🛒 Expanded Supermarket Catalogue (51 Products)

The catalogue has been expanded from the initial 20 items to **51 authentic supermarket products** spanning 7 primary retail aisles. Every product includes an authentic package photograph, SKU, unit pricing, real-time inventory count, rating, and an inline SVG fallback:

| Category | Sample Products | Unit Pricing | Stock |
| :--- | :--- | :--- | :--- |
| **Fruits & Vegetables** | Shimla Apples, Robusta Bananas, Tomatoes, Green Grapes, Oranges, Pomegranate, Potatoes, Onions, Spinach | ₹25 – ₹150 | 25 – 100 |
| **Dairy & Bakery** | Amul Milk, Whole Wheat Bread, Amul Butter, Cheese Slices, Mother Dairy Dahi, Paneer, Farm Fresh Eggs, Truffle Cake, Croissants | ₹32 – ₹350 | 12 – 80 |
| **Beverages** | Coca-Cola, Pepsi, Réal Fruit Juice, Nescafé Instant Coffee, Tata Tea Gold, Red Bull, Bisleri Mineral Water | ₹20 – ₹165 | 18 – 150 |
| **Snacks** | Lay's Classic, Kurkure Masala Munch, Parle-G, Oreo Vanilla Creme, Maggi 2-Min Noodles, Haldiram's Bhujia, Dairy Milk Silk | ₹10 – ₹80 | 40 – 120 |
| **Groceries** | Fortune Sunflower Oil, Tata Salt, Basmati Rice, Aashirvaad Atta, Toor Dal, Chana Dal, Kissan Ketchup, Saffola Oats | ₹28 – ₹245 | 25 – 75 |
| **Personal Care** | Dove Soap, Colgate Dental Cream, Dettol Handwash, Head & Shoulders Shampoo, Colgate Toothbrush, Nivea Body Lotion | ₹55 – ₹220 | 22 – 40 |
| **Household Items** | Surf Excel Powder, Vim Dishwash Gel, Harpic 10X Gel, Lizol Floor Cleaner, Biodegradable Garbage Bags | ₹85 – ₹140 | 25 – 50 |

---

## 🚀 Getting Started & Local Installation

### Prerequisites
* **Node.js**: v18.0.0 or later ([Download Node.js](https://nodejs.org/))
* **npm**: v9.0.0 or later (bundled with Node.js)
* **MongoDB**: A free MongoDB Atlas cluster ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas)) or local MongoDB service.

### Step 1: Clone Repository
```bash
git clone https://github.com/Yash8092-code/supermarket.git
cd supermarket
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `backend/` directory by copying the provided `.env.example`:
```bash
cp .env.example .env
```
Edit `backend/.env` with your preferred settings:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/supermart_sas?retryWrites=true&w=majority
JWT_SECRET=supermart_secure_jwt_secret_key_2026_exam_lab
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://127.0.0.1:5500,https://yash8092-code.github.io
```
*(Note: Never commit real credentials to GitHub. `.env` is ignored by `.gitignore`.)*

### Step 4: Seed the Product Catalogue
Run the idempotent database seeding script:
```bash
npm run seed
```
**Output:**
```
[Seeding] Connecting to MongoDB...
[Seeding] Successfully connected to MongoDB database.
[Seeding] Processing 51 catalogue items...
[Seeding Complete] New items inserted: 51, Existing items updated: 0
[Demo User Created] Email: yash@example.com | Default Password: Password123!
[Verification] Total products in database: 51
```

### Step 5: Start the Backend Server
```bash
npm start
```
The server will boot on `http://localhost:5000`. Test the health check endpoint:
```bash
curl http://localhost:5000/api/health
```

### Step 6: Launch the Frontend
You can open `index.html` directly in any modern browser, or launch a simple local development server:
```bash
# In the root repository folder:
npx serve .
# or
python -m http.server 5500
```
Visit `http://localhost:5500` or open `index.html`. The connectivity pill at the sidebar footer will illuminate green (`Backend Online`).

---

## 🧪 Automated Testing

The project includes an automated test suite verifying all 28 API criteria across 5 test suites:
```bash
cd backend
npm test
```

### Test Coverage Summary:
```
# Subtest: Authentication API Tests
    ok 1 - POST /api/auth/register - Successfully registers new buyer
    ok 2 - POST /api/auth/register - Rejects duplicate email registration
    ok 3 - POST /api/auth/register - Rejects password mismatch and short passwords
    ok 4 - POST /api/auth/login - Successfully logs in with valid credentials
    ok 5 - POST /api/auth/login - Rejects incorrect password
    ok 6 - GET /api/auth/me - Protected route rejects missing token and accepts valid token

# Subtest: Shopping Cart API Tests
    ok 1 - POST /api/cart - Adds item to cart and calculates subtotal & 5% GST
    ok 2 - POST /api/cart - Rejects adding out-of-stock product
    ok 3 - POST /api/cart - Rejects quantity exceeding inventory stock
    ok 4 - PATCH /api/cart/:productId - Updates quantity properly
    ok 5 - DELETE /api/cart/:productId - Removes item from cart
    ok 6 - DELETE /api/cart - Clears all cart contents
    ok 7 - POST /api/cart/validate-coupon - Validates SUPER10 and rejects invalid codes

# Subtest: Orders and Checkout API Tests
    ok 1 - POST /api/orders - Creates order, decrements stock, calculates 5% GST, and generates invoice
    ok 2 - POST /api/orders - Rejects checkout when requested quantity exceeds available inventory
    ok 3 - GET /api/orders - Returns only authenticated buyer orders
    ok 4 - GET /api/orders/:id and invoice - Prevents buyer from accessing another buyer order

# Subtest: Product Catalogue API Tests
    ok 1 - GET /api/products - Returns list of products with pagination
    ok 2 - GET /api/products - Category filter works
    ok 3 - GET /api/products - Search query works on name and brand
    ok 4 - GET /api/products - In-stock filter excludes out of stock items
    ok 5 - GET /api/products - Sorting by price ascending and descending
    ok 6 - GET /api/products/:id - Returns product by SKU or ObjectId
    ok 7 - GET /api/products/categories - Returns categories list

# Subtest: Profile, Wishlist, and Dashboard API Tests
    ok 1 - GET /api/profile & PATCH /api/profile - Retrieves and updates allowed profile fields
    ok 2 - POST /api/wishlist/:productId & DELETE - Adds to wishlist, prevents duplicate, and removes
    ok 3 - GET /api/dashboard/stats - Returns real dynamic buyer metrics
    ok 4 - GET /api/health - Returns 200 and operational server info

# tests 28
# suites 5
# pass 28
# fail 0
```

---

## 📡 REST API Reference

All protected endpoints require the HTTP header:  
`Authorization: Bearer <your_jwt_token>`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System status, uptime, and database connection state |
| `POST` | `/api/auth/register` | Public | Register new buyer (name, email, phone, password) |
| `POST` | `/api/auth/login` | Public | Buyer login (returns JWT token and profile) |
| `GET` | `/api/auth/me` | Protected | Current authenticated buyer session data |
| `GET` | `/api/products` | Public | List products with pagination, search, category & stock filters |
| `GET` | `/api/products/:id` | Public | Retrieve single product by SKU or MongoDB ID |
| `GET` | `/api/products/categories` | Public | List all 7 distinct supermarket categories |
| `GET` | `/api/cart` | Protected | Get buyer's server-stored cart and computed totals |
| `POST` | `/api/cart` | Protected | Add item to cart with stock validation |
| `PATCH` | `/api/cart/:productId` | Protected | Update cart line item quantity |
| `DELETE`| `/api/cart/:productId` | Protected | Remove line item from cart |
| `DELETE`| `/api/cart` | Protected | Clear entire shopping basket |
| `POST` | `/api/cart/validate-coupon`| Protected | Validate promotional vouchers (`SUPER10`, `WELCOME50`) |
| `POST` | `/api/orders` | Protected | POS checkout: validates stock, decrements inventory, creates order |
| `GET` | `/api/orders` | Protected | Retrieve all past orders owned by authenticated buyer |
| `GET` | `/api/orders/:id` | Protected | View single order detail (ownership strictly enforced) |
| `GET` | `/api/orders/:id/invoice`| Protected | Retrieve thermal printable invoice slip for order |
| `GET` | `/api/invoices` | Protected | List all invoices for authenticated buyer |
| `GET` | `/api/profile` | Protected | Get buyer account profile data |
| `PATCH`| `/api/profile` | Protected | Update profile (name, phone, address, city) |
| `GET` | `/api/wishlist` | Protected | Retrieve buyer's saved wishlist items |
| `POST` | `/api/wishlist/:productId`| Protected | Save product to wishlist (prevents duplicates) |
| `DELETE`| `/api/wishlist/:productId`| Protected | Remove product from wishlist |
| `GET` | `/api/dashboard/stats` | Protected | Dynamic metrics: total orders, lifetime spend, wishlist count |

---

## 🔐 Security & Educational Compliance

1. **Zero Secret Leakage**: No MongoDB Atlas credentials or JWT secrets are hardcoded in the repository or frontend scripts. All credentials reside exclusively in `.env`.
2. **Password Security**: Passwords are cryptographically salted and hashed using `bcryptjs` with 10 rounds. Password hashes are never exposed in API responses (`select('-password')`).
3. **Data Isolation**: Multi-tenant authorization ensures buyers can only view and modify their own carts, orders, invoices, and wishlist entries.
4. **Server-Authoritative Pricing**: Frontend cannot manipulate prices or bypass stock limits. All calculations (subtotal, 5% simplified GST, line totals) occur strictly on the Express server.
5. **CORS & HTTP Headers**: Helmet enforces HTTP security headers, and CORS strictly validates against allowed origins (`CLIENT_ORIGIN`).

---

## 🌐 Deployment Instructions

### Deploy Backend (e.g. Render / Railway):
1. Create a **Web Service** on [Render.com](https://render.com) connected to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Configure Environment Variables in the Render dashboard:
   - `MONGODB_URI`: Your production MongoDB Atlas connection string
   - `JWT_SECRET`: A long random secret key
   - `CLIENT_ORIGIN`: `https://yash8092-code.github.io,http://127.0.0.1:5500`
   - `NODE_ENV`: `production`
6. Deploy the service and copy the live URL (e.g. `https://supermart-sas-api.onrender.com`).

### Deploy Frontend (GitHub Pages):
1. In `script.js` (or via `window.SUPERMART_CONFIG`), set:
   ```javascript
   window.SUPERMART_CONFIG = {
     API_BASE_URL: 'https://supermart-sas-api.onrender.com/api'
   };
   ```
2. Commit and push to the `main` branch. GitHub Pages will automatically redeploy the live website at `https://yash8092-code.github.io/supermarket/`.

---

## 👤 Author & Lab Information
* **Developer:** Yash Kumar
* **Role:** Buyer
* **Project:** SuperMart SAS (Supermarket Automation Software)
* **Academic Submission:** Software Engineering Laboratory Assignment (2026)
