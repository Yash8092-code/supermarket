# SuperMart SAS - Buyer Dashboard Assets & Architecture

This folder contains asset documentation and structural references for the **SuperMart SAS (Supermarket Automation Software)** frontend application.

## Application Architecture
- **index.html**: Semantic HTML5 single-page application with accessible sections (Dashboard, Products, Cart, Checkout, Orders, Transactions, Profile).
- **style.css**: Modern vanilla CSS3 design system with CSS custom variables, elevation shadows, responsive desktop/tablet/mobile layouts, and thermal invoice print formatting (`@media print`).
- **script.js**: Vanilla ES6+ object-oriented application controlling product cataloging, category filtering, search, dynamic cart calculations (5% GST, coupons, subtotal, grand total), thermal supermarket receipt generation, and localStorage persistence.

## Standalone Zero-Dependency Execution
- No server, database, node_modules, or build steps required.
- Double click `index.html` in any modern browser to run immediately.
