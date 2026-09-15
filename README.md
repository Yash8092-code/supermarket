# SuperMart SAS - Supermarket Automation Software
> **Role:** Buyer Dashboard  
> **Type:** Frontend-Only Web Application (Software Engineering Lab Project)

A modern, responsive, and feature-rich Buyer Dashboard for **SuperMart SAS (Supermarket Automation Software)** built using pure **HTML5, CSS3, and Vanilla JavaScript** with zero external libraries or backend dependencies.

---

## 🏬 Features

- **Dashboard Overview**: Live statistical metrics (Cart Items, Dynamic Cart Value, Total Orders, Saved Wishlist Items), interactive promotional banners, popular supermarket products preview, and quick reorder section.
- **Product Catalogue**: 20 authentic supermarket products across 7 categories:
  - Fruits & Vegetables
  - Dairy & Bakery
  - Beverages
  - Snacks
  - Groceries
  - Personal Care
  - Household Items
- **Search & Filtering**: Real-time keyword search, category tabs, availability filters (In-Stock only), and sorting (Price Low/High, Name A-Z, Popularity).
- **Interactive Shopping Cart**:
  - Quantity steppers (`+` / `-`) with inventory stock constraints
  - Promotional discount vouchers (e.g. `SUPER10` for 10% off)
  - Real-time 5% GST computation and dynamic grand total
  - LocalStorage persistence across page reloads
- **Automated POS Bill Generation**:
  - Customer identification details (Name, Mobile, Address)
  - Simulated payment modes: Cash on Counter, UPI / QR Code, Credit/Debit Card
  - Instant generation of thermal-style supermarket receipts with dynamic invoice numbers, timestamps, store GSTIN, itemized breakdown, and barcodes
  - Dedicated **Print Bill** styling via CSS `@media print`
- **Orders & Transactions Audit**: History of completed orders and financial audit trail with receipt viewer.
- **Buyer Profile**: Editable personal information for Yash Kumar (Buyer) with saved preferences and toast alert engine.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, accessible modals, and forms
- **CSS3**: Vanilla design system, custom properties (`--primary: #16A34A`), flexbox/grid, responsive layouts, print styling
- **Vanilla JavaScript (ES6+)**: Zero dependencies, state management with `localStorage`, dynamic receipt generator

---

## 🚀 How to Run Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Yash8092-code/supermarket.git
   ```
2. Navigate to the project folder:
   ```bash
   cd supermarket
   ```
3. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari) or run a simple local server:
   ```bash
   python -m http.server 5500
   ```
4. Visit `http://localhost:5500` in your browser.
