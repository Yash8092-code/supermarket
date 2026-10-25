require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const profileRoutes = require('./routes/profileRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security HTTP headers with cross-origin resource policy enabled for API consumers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false
  })
);

// Cross-Origin Resource Sharing (CORS) Configuration
const defaultOrigins = [
  'https://yash8092-code.github.io',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const envOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
  : [];

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins])).map(o => o.replace(/\/+$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, same-origin, file://)
    if (!origin || origin === 'null') return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');
    const isAllowed = allowedOrigins.includes(cleanOrigin) || process.env.NODE_ENV === 'development';

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    message: 'SuperMart SAS API Server is operational',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: states[dbState] || 'unknown',
      connected: dbState === 1
    },
    version: '2.5.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Catch-all 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    errors: []
  });
});

// Global Error Handler
app.use(errorHandler);

// Start server if executed directly
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  SuperMart SAS Backend Server running on port ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  });
}

module.exports = app;
