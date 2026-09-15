/**
 * SuperMart SAS - Supermarket Automation Software
 * Role: Buyer Dashboard
 * Technology: Pure Vanilla JavaScript (ES6+)
 * No external frameworks, zero backend dependencies.
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. LOCAL DATA STORE & MOCK INVENTORY
     ========================================================================== */
  
  // Inline SVG visual fallback generator ensuring beautiful product visuals even when offline
  function generateSvgProductThumb(name, category, bgColor = '#dcfce7', textColor = '#166534') {
    const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
      <rect width="300" height="200" fill="${bgColor}"/>
      <circle cx="150" cy="90" r="50" fill="#ffffff" opacity="0.8"/>
      <text x="150" y="98" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
      <text x="150" y="160" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="${textColor}" text-anchor="middle">${category}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const INITIAL_PRODUCTS = [
    // 1. Fruits & Vegetables
    {
      id: 'prod-01',
      name: 'Fresh Shimla Apples',
      brand: 'FarmFresh Organic',
      category: 'Fruits & Vegetables',
      price: 120,
      unit: '₹120/kg',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Fresh Apples', 'Fruits & Veg', '#fee2e2', '#991b1b'),
      inStock: true,
      stockCount: 45,
      isPopular: true,
      rating: '4.8 (120+)',
      description: 'Crisp, sweet, handpicked Himalayan Shimla apples packed with dietary fiber, natural antioxidants, and freshness.'
    },
    {
      id: 'prod-02',
      name: 'Robusta Bananas',
      brand: 'Nature Choice',
      category: 'Fruits & Vegetables',
      price: 60,
      unit: '₹60/dozen',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Bananas', 'Fruits & Veg', '#fef9c3', '#854d0e'),
      inStock: true,
      stockCount: 30,
      isPopular: false,
      rating: '4.6 (95)',
      description: 'Naturally ripened nutrient-rich bananas rich in potassium and instant energy. Direct harvest from certified orchards.'
    },
    {
      id: 'prod-03',
      name: 'Farm Fresh Tomatoes',
      brand: 'Kisan Choice',
      category: 'Fruits & Vegetables',
      price: 40,
      unit: '₹40/kg',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Fresh Tomatoes', 'Fruits & Veg', '#fee2e2', '#b91c1c'),
      inStock: true,
      stockCount: 60,
      isPopular: true,
      rating: '4.7 (80)',
      description: 'Juicy, firm hybrid tomatoes perfect for delicious Indian curries, fresh salads, and culinary garnishing.'
    },

    // 2. Dairy & Bakery
    {
      id: 'prod-04',
      name: 'Amul Taaza Homogenised Milk',
      brand: 'Amul',
      category: 'Dairy & Bakery',
      price: 32,
      unit: '₹32/500ml',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Amul Milk', 'Dairy & Bakery', '#dbeafe', '#1e40af'),
      inStock: true,
      stockCount: 80,
      isPopular: true,
      rating: '4.9 (450+)',
      description: 'Pasteurised toned milk with essential calcium, proteins, and vitamins. The taste of India in every single sip.'
    },
    {
      id: 'prod-05',
      name: 'Britannia 100% Whole Wheat Bread',
      brand: 'Britannia',
      category: 'Dairy & Bakery',
      price: 45,
      unit: '₹45/packet',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Britannia Bread', 'Dairy & Bakery', '#fef3c7', '#92400e'),
      inStock: true,
      stockCount: 22,
      isPopular: false,
      rating: '4.5 (110)',
      description: 'Healthy whole-wheat brown loaf enriched with natural wheat germ and dietary fiber. Zero added maida.'
    },
    {
      id: 'prod-06',
      name: 'Amul Pasteurized Butter',
      brand: 'Amul',
      category: 'Dairy & Bakery',
      price: 58,
      unit: '₹58/100g',
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Amul Butter', 'Dairy & Bakery', '#fef08a', '#854d0e'),
      inStock: true,
      stockCount: 4, // Low stock test
      isPopular: true,
      rating: '4.9 (380+)',
      description: 'Utterly butterly delicious creamy salted butter prepared from pristine cow and buffalo cream.'
    },

    // 3. Beverages
    {
      id: 'prod-07',
      name: 'Coca-Cola Original Taste',
      brand: 'The Coca-Cola Company',
      category: 'Beverages',
      price: 40,
      unit: '₹40/750ml',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Coca-Cola', 'Beverages', '#fee2e2', '#991b1b'),
      inStock: true,
      stockCount: 50,
      isPopular: true,
      rating: '4.7 (310)',
      description: 'Iconic sparkling carbonated soft drink giving you that familiar uplifting refreshing kick.'
    },
    {
      id: 'prod-08',
      name: 'Pepsi Cola Chilled Bottle',
      brand: 'PepsiCo',
      category: 'Beverages',
      price: 40,
      unit: '₹40/750ml',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Pepsi', 'Beverages', '#dbeafe', '#1e40af'),
      inStock: true,
      stockCount: 35,
      isPopular: false,
      rating: '4.6 (180)',
      description: 'Bold, refreshing, fizzy cola beverage with crisp taste designed to quench your thirst.'
    },
    {
      id: 'prod-09',
      name: 'Réal Fruit Power Mixed Fruit Juice',
      brand: 'Dabur Réal',
      category: 'Beverages',
      price: 110,
      unit: '₹110/1L',
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Real Juice', 'Beverages', '#fed7aa', '#9a3412'),
      inStock: true,
      stockCount: 18,
      isPopular: true,
      rating: '4.8 (210)',
      description: 'Packed with goodness of 9 selected fruits with Vitamin C. No added preservatives or artificial colours.'
    },

    // 4. Snacks
    {
      id: 'prod-10',
      name: 'Lay\'s Classic Salted Potato Chips',
      brand: 'Lay\'s India',
      category: 'Snacks',
      price: 20,
      unit: '₹20/packet',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Lays Chips', 'Snacks', '#fef08a', '#854d0e'),
      inStock: true,
      stockCount: 90,
      isPopular: true,
      rating: '4.7 (520+)',
      description: 'Crispy wafer-thin potato chips seasoned with pure sea salt for an unmistakable crunchy crunch.'
    },
    {
      id: 'prod-11',
      name: 'Kurkure Masala Munch Namkeen',
      brand: 'Kurkure',
      category: 'Snacks',
      price: 20,
      unit: '₹20/packet',
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Kurkure Munch', 'Snacks', '#fed7aa', '#c2410c'),
      inStock: true,
      stockCount: 65,
      isPopular: false,
      rating: '4.6 (390)',
      description: 'Tedha hai par mera hai! Crunchy corn puffs tossed in spicy signature Indian masalas and spices.'
    },
    {
      id: 'prod-12',
      name: 'Parle-G Original Glucose Biscuits',
      brand: 'Parle Products',
      category: 'Snacks',
      price: 10,
      unit: '₹10/packet',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Parle-G', 'Snacks', '#fef3c7', '#78350f'),
      inStock: true,
      stockCount: 120,
      isPopular: true,
      rating: '4.9 (800+)',
      description: 'India\'s largest selling golden-baked glucose biscuit packed with wholesome milk & wheat goodness.'
    },

    // 5. Groceries
    {
      id: 'prod-13',
      name: 'Fortune Sunlite Refined Sunflower Oil',
      brand: 'Fortune Foods',
      category: 'Groceries',
      price: 160,
      unit: '₹160/1L',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Fortune Oil', 'Groceries', '#fef08a', '#713f12'),
      inStock: true,
      stockCount: 25,
      isPopular: true,
      rating: '4.7 (240)',
      description: 'Light, healthy cooking oil enriched with Vitamin A & D. Low absorption technology keeps dishes crisp.'
    },
    {
      id: 'prod-14',
      name: 'Tata Salt Vacuum Evaporated Iodised',
      brand: 'Tata Consumer',
      category: 'Groceries',
      price: 28,
      unit: '₹28/kg',
      image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Tata Salt', 'Groceries', '#f1f5f9', '#334155'),
      inStock: true,
      stockCount: 75,
      isPopular: false,
      rating: '4.9 (410)',
      description: 'Desh Ka Namak. Pure vacuum evaporated iodised salt ensuring mental development and daily health balance.'
    },
    {
      id: 'prod-15',
      name: 'India Gate Feast Rozzana Basmati Rice',
      brand: 'India Gate',
      category: 'Groceries',
      price: 180,
      unit: '₹180/kg',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Basmati Rice', 'Groceries', '#f8fafc', '#475569'),
      inStock: true,
      stockCount: 40,
      isPopular: true,
      rating: '4.8 (310)',
      description: 'Aged long-grain aromatic Basmati rice. Slender pearls cook up fluffy, fragrant, and non-sticky.'
    },

    // 6. Personal Care
    {
      id: 'prod-16',
      name: 'Dove Deeply Nourishing Beauty Bar Soap',
      brand: 'Dove Unilever',
      category: 'Personal Care',
      price: 55,
      unit: '₹55/100g',
      image: 'https://images.unsplash.com/photo-1607006314146-a05e8361b72e?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Dove Soap', 'Personal Care', '#f0fdf4', '#166534'),
      inStock: true,
      stockCount: 40,
      isPopular: true,
      rating: '4.8 (190)',
      description: 'Formulated with 1/4 moisturizing cream and gentle cleansers to keep skin softer, smoother, and radiant.'
    },
    {
      id: 'prod-17',
      name: 'Colgate Strong Teeth Dental Cream',
      brand: 'Colgate-Palmolive',
      category: 'Personal Care',
      price: 95,
      unit: '₹95/100g',
      image: 'https://images.unsplash.com/photo-1559591937-e1032c525f05?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Colgate', 'Personal Care', '#fee2e2', '#991b1b'),
      inStock: true,
      stockCount: 3, // Low stock test
      isPopular: false,
      rating: '4.6 (140)',
      description: 'Contains Amino Shakti formula that adds natural calcium to teeth, strengthening enamel against cavities.'
    },
    {
      id: 'prod-18',
      name: 'Dettol Original Germ Protection Liquid Handwash',
      brand: 'Dettol Reckitt',
      category: 'Personal Care',
      price: 110,
      unit: '₹110/250ml',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Dettol Handwash', 'Personal Care', '#ecfdf5', '#047857'),
      inStock: true,
      stockCount: 28,
      isPopular: true,
      rating: '4.9 (350+)',
      description: 'Trusted 99.9% germ protection hand hygiene wash with moisturizers and dermatologically tested formula.'
    },

    // 7. Household Items
    {
      id: 'prod-19',
      name: 'Surf Excel Quick Wash Detergent Powder',
      brand: 'Surf Excel',
      category: 'Household Items',
      price: 140,
      unit: '₹140/1kg',
      image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Surf Excel', 'Household', '#dbeafe', '#1d4ed8'),
      inStock: true,
      stockCount: 30,
      isPopular: true,
      rating: '4.7 (290)',
      description: 'X-tra clean particles deliver superior stain removal on tough collars and grease with half the effort.'
    },
    {
      id: 'prod-20',
      name: 'Vim Lemon Dishwash Gel Liquid',
      brand: 'Vim',
      category: 'Household Items',
      price: 120,
      unit: '₹120/500ml',
      image: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=500&auto=format&fit=crop&q=80',
      fallback: generateSvgProductThumb('Vim Gel', 'Household', '#fef08a', '#854d0e'),
      inStock: false, // Out of stock demo
      stockCount: 0,
      isPopular: false,
      rating: '4.6 (170)',
      description: 'Powered by 100 lemons. 1 spoon of Vim gel cleans an entire sink full of oily utensils effortlessly.'
    }
  ];

  const INITIAL_ORDERS = [
    {
      id: 'ORD-2026-1042',
      date: '12-Sep-2026 14:20',
      itemCount: 4,
      items: [
        { name: 'India Gate Basmati Rice', qty: 2, price: 180 },
        { name: 'Amul Butter', qty: 2, price: 58 }
      ],
      subtotal: 476.00,
      gst: 23.80,
      discount: 0,
      grandTotal: 499.80,
      paymentMethod: 'UPI',
      status: 'Completed'
    },
    {
      id: 'ORD-2026-1039',
      date: '08-Sep-2026 18:45',
      itemCount: 3,
      items: [
        { name: 'Fortune Sunflower Oil', qty: 1, price: 160 },
        { name: 'Tata Salt', qty: 1, price: 28 },
        { name: 'Britannia Bread', qty: 1, price: 45 }
      ],
      subtotal: 233.00,
      gst: 11.65,
      discount: 0,
      grandTotal: 244.65,
      paymentMethod: 'Cash',
      status: 'Completed'
    },
    {
      id: 'ORD-2026-1025',
      date: '01-Sep-2026 11:15',
      itemCount: 5,
      items: [
        { name: 'Dettol Handwash', qty: 2, price: 110 },
        { name: 'Dove Soap', qty: 2, price: 55 },
        { name: 'Coca-Cola', qty: 1, price: 40 }
      ],
      subtotal: 370.00,
      gst: 18.50,
      discount: 37.00, // Used promo
      grandTotal: 351.50,
      paymentMethod: 'Credit/Debit Card',
      status: 'Completed'
    },
    {
      id: 'ORD-2026-1018',
      date: '28-Aug-2026 16:30',
      itemCount: 6,
      items: [
        { name: 'Lay\'s Classic Chips', qty: 3, price: 20 },
        { name: 'Kurkure Masala Munch', qty: 2, price: 20 },
        { name: 'Amul Milk', qty: 1, price: 32 }
      ],
      subtotal: 132.00,
      gst: 6.60,
      discount: 0,
      grandTotal: 138.60,
      paymentMethod: 'UPI',
      status: 'Completed'
    },
    {
      id: 'ORD-2026-1002',
      date: '20-Aug-2026 10:05',
      itemCount: 2,
      items: [
        { name: 'Surf Excel Detergent', qty: 1, price: 140 },
        { name: 'Colgate Toothpaste', qty: 1, price: 95 }
      ],
      subtotal: 235.00,
      gst: 11.75,
      discount: 0,
      grandTotal: 246.75,
      paymentMethod: 'Cash',
      status: 'Completed'
    }
  ];

  /* ==========================================================================
     2. APP STATE CONTROLLER (LocalStorage Connected)
     ========================================================================== */
  class SuperMartApp {
    constructor() {
      this.products = [...INITIAL_PRODUCTS];
      this.cart = this.loadFromStorage('sms_buyer_cart', [
        { product: this.products[0], quantity: 1 }, // Shimla Apples
        { product: this.products[3], quantity: 2 }  // Amul Milk
      ]);
      this.orders = this.loadFromStorage('sms_buyer_orders', INITIAL_ORDERS);
      this.wishlist = this.loadFromStorage('sms_buyer_wishlist', ['prod-01', 'prod-04', 'prod-06', 'prod-15']);
      this.profile = this.loadFromStorage('sms_buyer_profile', {
        name: 'Yash Kumar',
        email: 'yash@example.com',
        phone: '+91 98765 43210',
        city: 'Kolkata, West Bengal',
        address: 'Flat 4B, Green Meadows Residency, Salt Lake Sector V, Kolkata - 700091'
      });
      this.currentView = 'dashboard';
      this.activeCategory = 'all';
      this.searchQuery = '';
      this.appliedDiscount = 0; // percentage e.g. 0.10
      this.appliedCouponCode = '';
      this.showWishlistOnly = false;
      this.inStockOnly = false;
      this.sortBy = 'popular';

      this.init();
    }

    loadFromStorage(key, fallback) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        console.warn('Storage read error:', e);
        return fallback;
      }
    }

    saveToStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Storage write error:', e);
      }
    }

    init() {
      this.setupDOMReferences();
      this.bindEvents();
      this.renderAll();
      this.handleUrlHash();
    }

    setupDOMReferences() {
      // Containers & Views
      this.dom = {
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        hamburgerBtn: document.getElementById('hamburgerBtn'),
        sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
        navLinks: document.querySelectorAll('.sidebar .nav-link[data-view]'),
        viewSections: document.querySelectorAll('.view-section'),
        currentBreadcrumb: document.getElementById('currentViewBreadcrumb'),
        pageHeadingTitle: document.getElementById('pageHeadingTitle'),
        
        // Header & Search
        topSearchInput: document.getElementById('topSearchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        searchDropdown: document.getElementById('searchDropdown'),
        topCartBadge: document.getElementById('topCartBadge'),
        navCartCountBadge: document.getElementById('navCartCountBadge'),
        navProductCountBadge: document.getElementById('navProductCountBadge'),
        topProfileChip: document.getElementById('topProfileChip'),
        notificationBtn: document.getElementById('notificationBtn'),
        notificationPopover: document.getElementById('notificationPopover'),
        topUserName: document.getElementById('topUserName'),
        welcomeUserName: document.getElementById('welcomeUserName'),
        heroCartCount: document.getElementById('heroCartCount'),

        // Stats
        statCartItems: document.getElementById('statCartItems'),
        statCartTotal: document.getElementById('statCartTotal'),
        statTotalOrders: document.getElementById('statTotalOrders'),
        statSavedItems: document.getElementById('statSavedItems'),

        // Grids & Catalog
        dashboardPopularProductsGrid: document.getElementById('dashboardPopularProductsGrid'),
        dashboardRecentOrdersMini: document.getElementById('dashboardRecentOrdersMini'),
        catalogProductsGrid: document.getElementById('catalogProductsGrid'),
        categoryTabs: document.getElementById('categoryTabs'),
        catalogSearchInput: document.getElementById('catalogSearchInput'),
        sortSelector: document.getElementById('sortSelector'),
        inStockOnlyCheckbox: document.getElementById('inStockOnlyCheckbox'),
        btnShowWishlistOnly: document.getElementById('btnShowWishlistOnly'),
        wishlistFilterText: document.getElementById('wishlistFilterText'),
        btnResetFilters: document.getElementById('btnResetFilters'),
        emptyCatalogState: document.getElementById('emptyCatalogState'),
        catalogVisibleCount: document.getElementById('catalogVisibleCount'),

        // Cart
        cartLayoutContainer: document.getElementById('cartLayoutContainer'),
        cartTableBody: document.getElementById('cartTableBody'),
        emptyCartState: document.getElementById('emptyCartState'),
        cartItemsTally: document.getElementById('cartItemsTally'),
        summarySubtotal: document.getElementById('summarySubtotal'),
        summaryGst: document.getElementById('summaryGst'),
        summaryDiscountRow: document.getElementById('summaryDiscountRow'),
        summaryDiscount: document.getElementById('summaryDiscount'),
        summaryGrandTotal: document.getElementById('summaryGrandTotal'),
        couponInput: document.getElementById('couponInput'),
        btnApplyCoupon: document.getElementById('btnApplyCoupon'),
        appliedCouponPill: document.getElementById('appliedCouponPill'),
        couponText: document.getElementById('couponText'),
        btnRemoveCoupon: document.getElementById('btnRemoveCoupon'),
        btnClearCartBtn: document.getElementById('btnClearCartBtn'),
        btnProceedToCheckout: document.getElementById('btnProceedToCheckout'),

        // Checkout
        checkoutBuyerName: document.getElementById('checkoutBuyerName'),
        checkoutMobile: document.getElementById('checkoutMobile'),
        checkoutAddress: document.getElementById('checkoutAddress'),
        checkoutItemsMiniList: document.getElementById('checkoutItemsMiniList'),
        checkoutSubtotal: document.getElementById('checkoutSubtotal'),
        checkoutGst: document.getElementById('checkoutGst'),
        checkoutDiscountRow: document.getElementById('checkoutDiscountRow'),
        checkoutDiscount: document.getElementById('checkoutDiscount'),
        checkoutGrandTotal: document.getElementById('checkoutGrandTotal'),
        btnGenerateBill: document.getElementById('btnGenerateBill'),

        // Orders & Transactions
        ordersTableBody: document.getElementById('ordersTableBody'),
        ordersCountBadge: document.getElementById('ordersCountBadge'),
        transactionsTableBody: document.getElementById('transactionsTableBody'),
        transactionsSearchInput: document.getElementById('transactionsSearchInput'),
        lifetimeSpendAmount: document.getElementById('lifetimeSpendAmount'),

        // Profile
        profileCardName: document.getElementById('profileCardName'),
        profileCardEmail: document.getElementById('profileCardEmail'),
        profileStatOrders: document.getElementById('profileStatOrders'),
        profileStatSaved: document.getElementById('profileStatSaved'),
        profileStatSpent: document.getElementById('profileStatSpent'),
        profileInputName: document.getElementById('profileInputName'),
        profileInputEmail: document.getElementById('profileInputEmail'),
        profileInputPhone: document.getElementById('profileInputPhone'),
        profileInputCity: document.getElementById('profileInputCity'),
        profileInputAddress: document.getElementById('profileInputAddress'),
        btnChangeAvatar: document.getElementById('btnChangeAvatar'),
        btnChangePassword: document.getElementById('btnChangePassword'),

        // Modals
        receiptModalOverlay: document.getElementById('receiptModalOverlay'),
        productModalOverlay: document.getElementById('productModalOverlay'),
        settingsModalOverlay: document.getElementById('settingsModalOverlay'),
        helpModalOverlay: document.getElementById('helpModalOverlay'),
        toastContainer: document.getElementById('toastContainer')
      };
    }

    bindEvents() {
      // Sidebar Navigation clicks
      this.dom.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetView = link.getAttribute('data-view');
          this.navigate(targetView);
          this.closeSidebarMobile();
        });
      });

      // Mobile drawer toggles
      this.dom.hamburgerBtn.addEventListener('click', () => this.toggleSidebarMobile());
      this.dom.sidebarCloseBtn.addEventListener('click', () => this.closeSidebarMobile());
      this.dom.sidebarOverlay.addEventListener('click', () => this.closeSidebarMobile());

      // Header actions
      document.getElementById('topCartBtn').addEventListener('click', () => this.navigate('cart'));
      this.dom.topProfileChip.addEventListener('click', () => this.navigate('profile'));
      
      // Settings & Help
      document.getElementById('btnOpenSettings').addEventListener('click', () => this.openModal('settingsModalOverlay'));
      document.getElementById('btnOpenHelp').addEventListener('click', () => this.openModal('helpModalOverlay'));
      document.getElementById('btnCloseSettingsModal').addEventListener('click', () => this.closeModal('settingsModalOverlay'));
      document.getElementById('btnCloseHelpModal').addEventListener('click', () => this.closeModal('helpModalOverlay'));
      document.getElementById('btnLogout').addEventListener('click', () => {
        this.showToast('Logged out session simulated. Welcome back!', 'info');
        this.navigate('dashboard');
      });

      // Notifications popover
      this.dom.notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.notificationPopover.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (!this.dom.notificationPopover.contains(e.target) && e.target !== this.dom.notificationBtn) {
          this.dom.notificationPopover.classList.remove('show');
        }
        if (!this.dom.searchDropdown.contains(e.target) && e.target !== this.dom.topSearchInput) {
          this.dom.searchDropdown.classList.remove('show');
        }
      });

      // Global Live Search input
      this.dom.topSearchInput.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
      this.dom.clearSearchBtn.addEventListener('click', () => {
        this.dom.topSearchInput.value = '';
        this.dom.clearSearchBtn.style.display = 'none';
        this.dom.searchDropdown.classList.remove('show');
      });

      // Catalog filters
      this.dom.categoryTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (!tab) return;
        this.dom.categoryTabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category;
        this.renderCatalog();
      });

      this.dom.catalogSearchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCatalog();
      });

      this.dom.sortSelector.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });

      this.dom.inStockOnlyCheckbox.addEventListener('change', (e) => {
        this.inStockOnly = e.target.checked;
        this.renderCatalog();
      });

      this.dom.btnShowWishlistOnly.addEventListener('click', () => {
        this.showWishlistOnly = !this.showWishlistOnly;
        this.dom.btnShowWishlistOnly.classList.toggle('active', this.showWishlistOnly);
        this.dom.wishlistFilterText.textContent = this.showWishlistOnly ? 'Showing Saved' : 'Saved Items';
        this.renderCatalog();
      });

      this.dom.btnResetFilters.addEventListener('click', () => this.resetFilters());

      // Cart Interactions
      this.dom.btnClearCartBtn.addEventListener('click', () => this.clearCart());
      this.dom.btnProceedToCheckout.addEventListener('click', () => {
        if (this.cart.length === 0) {
          this.showToast('Your cart is empty! Please add products first.', 'warning');
          return;
        }
        this.navigate('checkout');
      });

      // Coupon Handling
      this.dom.btnApplyCoupon.addEventListener('click', () => this.applyCoupon());
      this.dom.couponInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.applyCoupon();
      });
      this.dom.btnRemoveCoupon.addEventListener('click', () => this.removeCoupon());

      // Payment Selection Highlight
      const paymentCards = document.querySelectorAll('.payment-radio-card');
      paymentCards.forEach(card => {
        card.addEventListener('click', () => {
          paymentCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        });
      });

      // Generate Bill Button
      this.dom.btnGenerateBill.addEventListener('click', () => this.generateAndShowBill());

      // Receipt Modal Controls
      document.getElementById('btnCloseReceiptModal').addEventListener('click', () => this.closeModal('receiptModalOverlay'));
      document.getElementById('btnPrintReceiptBtn').addEventListener('click', () => window.print());
      document.getElementById('btnDownloadReceiptBtn').addEventListener('click', () => {
        this.showToast('Invoice prepared for export. Initiating print dialog...', 'info');
        setTimeout(() => window.print(), 500);
      });

      // Product Quick-view Modal close
      document.getElementById('btnCloseProductModal').addEventListener('click', () => this.closeModal('productModalOverlay'));

      // Transactions Search Filter
      this.dom.transactionsSearchInput.addEventListener('input', (e) => {
        this.renderTransactions(e.target.value.toLowerCase().trim());
      });

      // Profile avatar/password demo triggers
      this.dom.btnChangeAvatar.addEventListener('click', () => {
        this.showToast('Profile photo updated from supermarket camera register.', 'info');
      });
      this.dom.btnChangePassword.addEventListener('click', () => {
        this.showToast('Password change token dispatched to buyer email.', 'info');
      });

      // Window hash changes (e.g. browser back/forward buttons)
      window.addEventListener('hashchange', () => this.handleUrlHash());
    }

    handleUrlHash() {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      if (['dashboard', 'products', 'cart', 'checkout', 'orders', 'transactions', 'profile'].includes(hash)) {
        this.navigate(hash, false);
      }
    }

    /* ==========================================================================
       3. NAVIGATION & VIEW SWITCHING
       ========================================================================== */
    navigate(viewName, updateHash = true) {
      this.currentView = viewName;

      // Update sidebar nav active link
      this.dom.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-view') === viewName);
      });

      // Update main views
      this.dom.viewSections.forEach(section => {
        section.classList.toggle('active', section.id === `view-${viewName}`);
      });

      // Update breadcrumbs and titles
      const titles = {
        dashboard: 'Buyer Dashboard',
        products: 'Supermarket Catalogue',
        cart: 'My Shopping Cart',
        checkout: 'Supermarket POS Checkout',
        orders: 'Order & Purchase History',
        transactions: 'Bills & Transactions Audit',
        profile: 'Buyer Account Profile'
      };

      const title = titles[viewName] || 'Buyer Dashboard';
      this.dom.currentBreadcrumb.textContent = title;
      this.dom.pageHeadingTitle.textContent = title;

      if (updateHash) {
        window.location.hash = viewName;
      }

      // Re-render target views if required
      if (viewName === 'cart') this.renderCart();
      if (viewName === 'checkout') this.renderCheckout();
      if (viewName === 'orders') this.renderOrders();
      if (viewName === 'transactions') this.renderTransactions();
      if (viewName === 'profile') this.renderProfile();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleSidebarMobile() {
      this.dom.sidebar.classList.toggle('open');
      this.dom.sidebarOverlay.classList.toggle('active');
    }

    closeSidebarMobile() {
      this.dom.sidebar.classList.remove('open');
      this.dom.sidebarOverlay.classList.remove('active');
    }

    /* ==========================================================================
       4. GLOBAL RENDER ALL
       ========================================================================== */
    renderAll() {
      this.updateBadgesAndStats();
      this.renderDashboard();
      this.renderCatalog();
      this.renderCart();
      this.renderOrders();
      this.renderTransactions();
      this.renderProfile();
    }

    updateBadgesAndStats() {
      const totalCartQty = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      const totals = this.calculateTotals();

      // Top navbar badges
      this.dom.topCartBadge.textContent = totalCartQty;
      this.dom.navCartCountBadge.textContent = totalCartQty;
      this.dom.navProductCountBadge.textContent = this.products.length;
      this.dom.heroCartCount.textContent = totalCartQty;

      // Overview Stats
      this.dom.statCartItems.textContent = totalCartQty;
      this.dom.statCartTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
      this.dom.statTotalOrders.textContent = this.orders.length;
      this.dom.statSavedItems.textContent = this.wishlist.length;

      // Profile quick stats
      this.dom.profileStatOrders.textContent = this.orders.length;
      this.dom.profileStatSaved.textContent = this.wishlist.length;
      const lifetimeSpend = this.orders.reduce((sum, o) => sum + o.grandTotal, 0);
      this.dom.profileStatSpent.textContent = `₹${lifetimeSpend >= 1000 ? (lifetimeSpend / 1000).toFixed(1) + 'k' : lifetimeSpend.toFixed(0)}`;
      this.dom.lifetimeSpendAmount.textContent = `₹${lifetimeSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      this.saveToStorage('sms_buyer_cart', this.cart);
      this.saveToStorage('sms_buyer_orders', this.orders);
      this.saveToStorage('sms_buyer_wishlist', this.wishlist);
    }

    /* ==========================================================================
       5. DASHBOARD OVERVIEW RENDERING
       ========================================================================== */
    renderDashboard() {
      // 1. Popular Products (6 items)
      const popularProducts = this.products.filter(p => p.isPopular).slice(0, 4);
      this.dom.dashboardPopularProductsGrid.innerHTML = popularProducts.map(p => this.createProductCardHtml(p)).join('');

      // 2. Recent mini orders (3 items)
      const recentOrders = this.orders.slice(0, 3);
      this.dom.dashboardRecentOrdersMini.innerHTML = recentOrders.map(order => `
        <div class="recent-order-item" onclick="window.app.viewReceiptForOrder('${order.id}')" style="cursor:pointer;" title="Click to view receipt">
          <div class="roi-left">
            <div class="roi-icon">📦</div>
            <div>
              <div class="roi-id">${order.id}</div>
              <div class="roi-date">${order.date} • ${order.itemCount} items</div>
            </div>
          </div>
          <div class="roi-right">
            <div class="roi-amount">₹${order.grandTotal.toFixed(2)}</div>
            <span class="status-badge status-completed">${order.status}</span>
          </div>
        </div>
      `).join('');

      this.bindProductCardActions(this.dom.dashboardPopularProductsGrid);
    }

    /* ==========================================================================
       6. CATALOGUE RENDERING & FILTER ENGINE
       ========================================================================== */
    renderCatalog() {
      let filtered = [...this.products];

      // Category filter
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.activeCategory);
      }

      // Search keyword filter
      if (this.searchQuery) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(this.searchQuery) ||
          p.brand.toLowerCase().includes(this.searchQuery) ||
          p.category.toLowerCase().includes(this.searchQuery)
        );
      }

      // In stock toggle
      if (this.inStockOnly) {
        filtered = filtered.filter(p => p.inStock && p.stockCount > 0);
      }

      // Wishlist toggle
      if (this.showWishlistOnly) {
        filtered = filtered.filter(p => this.wishlist.includes(p.id));
      }

      // Sorting
      switch (this.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default: // 'popular'
          filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
      }

      // Update visible counter
      this.dom.catalogVisibleCount.textContent = filtered.length;

      if (filtered.length === 0) {
        this.dom.catalogProductsGrid.innerHTML = '';
        this.dom.emptyCatalogState.classList.remove('hidden');
      } else {
        this.dom.emptyCatalogState.classList.add('hidden');
        this.dom.catalogProductsGrid.innerHTML = filtered.map(p => this.createProductCardHtml(p)).join('');
        this.bindProductCardActions(this.dom.catalogProductsGrid);
      }
    }

    createProductCardHtml(product) {
      const isFavorited = this.wishlist.includes(product.id);
      let stockBadgeClass = 'stock-in';
      let stockBadgeText = 'In Stock';

      if (!product.inStock || product.stockCount === 0) {
        stockBadgeClass = 'stock-out';
        stockBadgeText = 'Out of Stock';
      } else if (product.stockCount <= 5) {
        stockBadgeClass = 'stock-low';
        stockBadgeText = `Low Stock (${product.stockCount} left)`;
      }

      return `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-media-wrap">
            <span class="product-stock-badge ${stockBadgeClass}">${stockBadgeText}</span>
            <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" data-action="wishlist" title="${isFavorited ? 'Remove from Saved' : 'Save to Wishlist'}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.onerror=null; this.src='${product.fallback}';" loading="lazy" />
            <button class="product-quick-btn" data-action="quickview">Quick View</button>
          </div>

          <div class="product-content">
            <div class="product-category-row">
              <span class="product-category">${product.category}</span>
              <span class="product-rating">★ ${product.rating}</span>
            </div>

            <h3 class="product-name" title="${product.name}">${product.name}</h3>
            <p class="product-brand">By <strong>${product.brand}</strong></p>

            <div class="product-pricing-row">
              <span class="product-price">₹${product.price}</span>
              <span class="product-unit">/ ${product.unit.split('/')[1] || 'unit'}</span>
            </div>

            <div class="product-actions-wrap">
              <div class="qty-counter">
                <button class="qty-btn" data-action="qty-minus" ${!product.inStock ? 'disabled' : ''}>-</button>
                <span class="qty-val" data-qty-val>1</span>
                <button class="qty-btn" data-action="qty-plus" ${!product.inStock ? 'disabled' : ''}>+</button>
              </div>
              <button class="btn-add-cart" data-action="add-to-cart" ${!product.inStock ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                ${product.inStock ? 'Add' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    bindProductCardActions(container) {
      container.querySelectorAll('.product-card').forEach(card => {
        const prodId = card.getAttribute('data-product-id');
        const product = this.products.find(p => p.id === prodId);
        if (!product) return;

        const qtyValElem = card.querySelector('[data-qty-val]');

        // Quantity Plus
        card.querySelector('[data-action="qty-plus"]')?.addEventListener('click', () => {
          let current = parseInt(qtyValElem.textContent, 10) || 1;
          if (current < product.stockCount) {
            qtyValElem.textContent = current + 1;
          } else {
            this.showToast(`Maximum stock of ${product.name} reached (${product.stockCount} units).`, 'warning');
          }
        });

        // Quantity Minus
        card.querySelector('[data-action="qty-minus"]')?.addEventListener('click', () => {
          let current = parseInt(qtyValElem.textContent, 10) || 1;
          if (current > 1) {
            qtyValElem.textContent = current - 1;
          }
        });

        // Add to Cart
        card.querySelector('[data-action="add-to-cart"]')?.addEventListener('click', () => {
          const qty = parseInt(qtyValElem.textContent, 10) || 1;
          this.addToCart(product, qty);
        });

        // Wishlist
        card.querySelector('[data-action="wishlist"]')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleWishlist(product.id);
        });

        // Quick View
        card.querySelector('[data-action="quickview"]')?.addEventListener('click', () => {
          this.showProductQuickView(product);
        });
      });
    }

    resetFilters() {
      this.activeCategory = 'all';
      this.searchQuery = '';
      this.dom.catalogSearchInput.value = '';
      this.dom.sortSelector.value = 'popular';
      this.sortBy = 'popular';
      this.dom.inStockOnlyCheckbox.checked = false;
      this.inStockOnly = false;
      this.showWishlistOnly = false;
      this.dom.btnShowWishlistOnly.classList.remove('active');
      this.dom.wishlistFilterText.textContent = 'Saved Items';
      
      this.dom.categoryTabs.querySelectorAll('.category-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.category === 'all');
      });

      this.renderCatalog();
      this.showToast('All product filters have been reset.', 'info');
    }

    showWishlistFilter() {
      this.navigate('products');
      this.showWishlistOnly = true;
      this.dom.btnShowWishlistOnly.classList.add('active');
      this.dom.wishlistFilterText.textContent = 'Showing Saved';
      this.renderCatalog();
    }

    toggleWishlist(productId) {
      const idx = this.wishlist.indexOf(productId);
      const product = this.products.find(p => p.id === productId);
      if (idx > -1) {
        this.wishlist.splice(idx, 1);
        this.showToast(`Removed "${product ? product.name : 'Item'}" from saved items.`, 'info');
      } else {
        this.wishlist.push(productId);
        this.showToast(`Saved "${product ? product.name : 'Item'}" to wishlist!`, 'success');
      }
      this.updateBadgesAndStats();
      this.renderCatalog();
      this.renderDashboard();
    }

    /* ==========================================================================
       7. GLOBAL TOPBAR SEARCH
       ========================================================================== */
    handleGlobalSearch(query) {
      const q = query.toLowerCase().trim();
      if (!q) {
        this.dom.clearSearchBtn.style.display = 'none';
        this.dom.searchDropdown.classList.remove('show');
        return;
      }

      this.dom.clearSearchBtn.style.display = 'block';
      const matches = this.products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        this.dom.searchDropdown.innerHTML = `<div style="padding:1rem; font-size:0.85rem; color:#6b7280; text-align:center;">No supermarket items found matching "${query}"</div>`;
      } else {
        this.dom.searchDropdown.innerHTML = matches.map(p => `
          <div class="search-result-item" data-search-prod-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='${p.fallback}';" />
            <div class="sr-info">
              <div class="sr-name">${p.name}</div>
              <div class="sr-meta">${p.brand} • ${p.category}</div>
            </div>
            <div class="sr-price">₹${p.price}</div>
          </div>
        `).join('');

        this.dom.searchDropdown.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const pid = item.getAttribute('data-search-prod-id');
            const targetProduct = this.products.find(p => p.id === pid);
            if (targetProduct) {
              this.dom.searchDropdown.classList.remove('show');
              this.showProductQuickView(targetProduct);
            }
          });
        });
      }

      this.dom.searchDropdown.classList.add('show');
    }

    /* ==========================================================================
       8. SHOPPING CART MANAGEMENT
       ========================================================================== */
    addToCart(product, quantity = 1) {
      if (!product.inStock || product.stockCount === 0) {
        this.showToast(`Sorry, ${product.name} is currently out of stock.`, 'danger');
        return;
      }

      const existing = this.cart.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity + quantity > product.stockCount) {
          this.showToast(`Cannot add more than available supermarket stock (${product.stockCount} units).`, 'warning');
          return;
        }
        existing.quantity += quantity;
      } else {
        this.cart.push({ product, quantity });
      }

      this.showToast(`Added ${quantity} × ${product.name} to your cart!`, 'success');
      this.updateBadgesAndStats();
      this.renderCart();
    }

    updateCartQuantity(productId, newQty) {
      const item = this.cart.find(i => i.product.id === productId);
      if (!item) return;

      if (newQty <= 0) {
        this.removeFromCart(productId);
        return;
      }

      if (newQty > item.product.stockCount) {
        this.showToast(`Maximum store stock for ${item.product.name} is ${item.product.stockCount}.`, 'warning');
        return;
      }

      item.quantity = newQty;
      this.updateBadgesAndStats();
      this.renderCart();
    }

    removeFromCart(productId) {
      const index = this.cart.findIndex(i => i.product.id === productId);
      if (index > -1) {
        const removed = this.cart.splice(index, 1)[0];
        this.showToast(`Removed "${removed.product.name}" from shopping cart.`, 'info');
        this.updateBadgesAndStats();
        this.renderCart();
      }
    }

    clearCart() {
      if (this.cart.length === 0) return;
      if (confirm('Are you sure you want to remove all items from your shopping basket?')) {
        this.cart = [];
        this.appliedDiscount = 0;
        this.appliedCouponCode = '';
        this.showToast('Shopping cart cleared successfully.', 'info');
        this.updateBadgesAndStats();
        this.renderCart();
      }
    }

    calculateTotals() {
      const subtotal = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const discount = subtotal * this.appliedDiscount;
      const taxableAmount = Math.max(0, subtotal - discount);
      const gst = taxableAmount * 0.05; // 5% GST for packed groceries
      const grandTotal = taxableAmount + gst;

      return {
        subtotal,
        discount,
        taxableAmount,
        gst,
        grandTotal
      };
    }

    renderCart() {
      if (this.cart.length === 0) {
        this.dom.cartLayoutContainer.classList.add('hidden');
        this.dom.emptyCartState.classList.remove('hidden');
        return;
      }

      this.dom.cartLayoutContainer.classList.remove('hidden');
      this.dom.emptyCartState.classList.add('hidden');

      // 1. Render Table Rows
      this.dom.cartTableBody.innerHTML = this.cart.map(item => {
        const p = item.product;
        const itemTotal = p.price * item.quantity;
        return `
          <tr data-cart-prod-id="${p.id}">
            <td class="cart-product-cell">
              <img src="${p.image}" alt="${p.name}" class="cart-item-img" onerror="this.src='${p.fallback}';" />
              <div class="cart-item-meta">
                <h4>${p.name}</h4>
                <p class="cart-item-brand">${p.brand} • ${p.category}</p>
              </div>
            </td>
            <td class="cart-item-unit-price">₹${p.price.toFixed(2)}</td>
            <td>
              <div class="qty-counter">
                <button class="qty-btn" data-cart-action="minus">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" data-cart-action="plus">+</button>
              </div>
            </td>
            <td class="cart-item-total">₹${itemTotal.toFixed(2)}</td>
            <td>
              <button class="cart-remove-btn" data-cart-action="remove" title="Remove Item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Bind Cart Table Actions
      this.dom.cartTableBody.querySelectorAll('tr').forEach(row => {
        const prodId = row.getAttribute('data-cart-prod-id');
        const item = this.cart.find(i => i.product.id === prodId);
        if (!item) return;

        row.querySelector('[data-cart-action="plus"]').addEventListener('click', () => {
          this.updateCartQuantity(prodId, item.quantity + 1);
        });

        row.querySelector('[data-cart-action="minus"]').addEventListener('click', () => {
          this.updateCartQuantity(prodId, item.quantity - 1);
        });

        row.querySelector('[data-cart-action="remove"]').addEventListener('click', () => {
          this.removeFromCart(prodId);
        });
      });

      // 2. Summary Financial Calculations
      const totals = this.calculateTotals();
      const totalItems = this.cart.reduce((s, i) => s + i.quantity, 0);
      this.dom.cartItemsTally.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} in your basket`;

      this.dom.summarySubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
      this.dom.summaryGst.textContent = `₹${totals.gst.toFixed(2)}`;
      
      if (totals.discount > 0) {
        this.dom.summaryDiscountRow.classList.remove('hidden');
        this.dom.summaryDiscount.textContent = `-₹${totals.discount.toFixed(2)}`;
        this.dom.appliedCouponPill.classList.remove('hidden');
        this.dom.couponText.textContent = `${this.appliedCouponCode} (${(this.appliedDiscount * 100).toFixed(0)}% OFF)`;
      } else {
        this.dom.summaryDiscountRow.classList.add('hidden');
        this.dom.appliedCouponPill.classList.add('hidden');
      }

      this.dom.summaryGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
    }

    applyCoupon() {
      const code = this.dom.couponInput.value.trim().toUpperCase();
      if (!code) {
        this.showToast('Please enter a promotional voucher code.', 'warning');
        return;
      }

      if (code === 'SUPER10') {
        this.appliedDiscount = 0.10;
        this.appliedCouponCode = 'SUPER10';
        this.showToast('Coupon SUPER10 applied! 10% discount added to order.', 'success');
      } else if (code === 'WELCOME50') {
        this.appliedDiscount = 0.15;
        this.appliedCouponCode = 'WELCOME50';
        this.showToast('VIP Voucher WELCOME50 applied! 15% discount applied.', 'success');
      } else {
        this.showToast(`Invalid coupon "${code}". Try using "SUPER10".`, 'danger');
        return;
      }

      this.dom.couponInput.value = '';
      this.renderCart();
      this.updateBadgesAndStats();
    }

    removeCoupon() {
      this.appliedDiscount = 0;
      this.appliedCouponCode = '';
      this.showToast('Promotional voucher removed.', 'info');
      this.renderCart();
      this.updateBadgesAndStats();
    }

    /* ==========================================================================
       9. CHECKOUT SECTION & DATA PREPARATION
       ========================================================================== */
    renderCheckout() {
      if (this.cart.length === 0) {
        this.navigate('cart');
        return;
      }

      // Populate prefilled user information
      this.dom.checkoutBuyerName.value = this.profile.name;
      this.dom.checkoutMobile.value = this.profile.phone;
      this.dom.checkoutAddress.value = this.profile.address;

      // Render miniature item checklist
      this.dom.checkoutItemsMiniList.innerHTML = this.cart.map(item => `
        <div class="checkout-mini-item">
          <div class="cmi-info">
            <img src="${item.product.image}" alt="${item.product.name}" class="cmi-img" onerror="this.src='${item.product.fallback}';" />
            <div>
              <div class="cmi-name">${item.product.name}</div>
              <div class="cmi-qty">${item.quantity} × ₹${item.product.price.toFixed(2)}</div>
            </div>
          </div>
          <div class="cmi-price">₹${(item.product.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('');

      // Calculations
      const totals = this.calculateTotals();
      this.dom.checkoutSubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
      this.dom.checkoutGst.textContent = `₹${totals.gst.toFixed(2)}`;

      if (totals.discount > 0) {
        this.dom.checkoutDiscountRow.classList.remove('hidden');
        this.dom.checkoutDiscount.textContent = `-₹${totals.discount.toFixed(2)}`;
      } else {
        this.dom.checkoutDiscountRow.classList.add('hidden');
      }

      this.dom.checkoutGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
    }

    /* ==========================================================================
       10. BILL GENERATION & THERMAL RECEIPT ENGINE
       ========================================================================== */
    generateAndShowBill() {
      if (this.cart.length === 0) {
        this.showToast('Cannot generate bill for empty cart!', 'warning');
        return;
      }

      const buyerName = this.dom.checkoutBuyerName.value.trim() || this.profile.name;
      const paymentModeInput = document.querySelector('input[name="paymentMethod"]:checked');
      const paymentMethod = paymentModeInput ? paymentModeInput.value : 'Cash';

      // Generate realistic invoice number and current formatted timestamp
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const invoiceNo = `SMS-INV-2026-${randomSuffix}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const totals = this.calculateTotals();
      const totalItemCount = this.cart.reduce((sum, i) => sum + i.quantity, 0);

      // Create new Order Record
      const newOrder = {
        id: invoiceNo,
        date: formattedDate,
        itemCount: totalItemCount,
        items: this.cart.map(i => ({
          name: i.product.name,
          qty: i.quantity,
          price: i.product.price,
          total: i.product.price * i.quantity
        })),
        subtotal: totals.subtotal,
        gst: totals.gst,
        discount: totals.discount,
        grandTotal: totals.grandTotal,
        paymentMethod: paymentMethod,
        status: 'Completed'
      };

      // Push to orders list at front
      this.orders.unshift(newOrder);

      // Populate Thermal Supermarket Receipt Modal
      document.getElementById('receiptInvoiceNo').textContent = invoiceNo;
      document.getElementById('receiptDateTime').textContent = formattedDate;
      document.getElementById('receiptCustomerName').textContent = buyerName;
      document.getElementById('receiptPayMethod').textContent = `${paymentMethod} POS`;
      document.getElementById('receiptBarcodeNumber').textContent = `*${invoiceNo}-BYR*`;

      const receiptTableBody = document.getElementById('receiptTableBody');
      receiptTableBody.innerHTML = this.cart.map(item => `
        <tr>
          <td class="text-left">${item.product.name}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">₹${item.product.price.toFixed(2)}</td>
          <td class="text-right">₹${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      document.getElementById('receiptSubtotal').textContent = `₹${totals.subtotal.toFixed(2)}`;
      document.getElementById('receiptGst').textContent = `₹${totals.gst.toFixed(2)}`;
      
      const discountRow = document.getElementById('receiptDiscountRow');
      if (totals.discount > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('receiptDiscount').textContent = `-₹${totals.discount.toFixed(2)}`;
      } else {
        discountRow.classList.add('hidden');
      }

      document.getElementById('receiptGrandTotal').textContent = `₹${totals.grandTotal.toFixed(2)}`;

      // Clear current cart now that order is generated
      this.cart = [];
      this.appliedDiscount = 0;
      this.appliedCouponCode = '';

      this.updateBadgesAndStats();
      this.renderCart();

      // Show receipt modal
      this.openModal('receiptModalOverlay');
      this.showToast(`Order ${invoiceNo} generated and registered!`, 'success');
    }

    viewReceiptForOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) return;

      document.getElementById('receiptInvoiceNo').textContent = order.id;
      document.getElementById('receiptDateTime').textContent = order.date;
      document.getElementById('receiptCustomerName').textContent = this.profile.name;
      document.getElementById('receiptPayMethod').textContent = `${order.paymentMethod} POS`;
      document.getElementById('receiptBarcodeNumber').textContent = `*${order.id}-BYR*`;

      const receiptTableBody = document.getElementById('receiptTableBody');
      receiptTableBody.innerHTML = order.items.map(item => `
        <tr>
          <td class="text-left">${item.name}</td>
          <td class="text-center">${item.qty}</td>
          <td class="text-right">₹${item.price.toFixed(2)}</td>
          <td class="text-right">₹${(item.price * item.qty).toFixed(2)}</td>
        </tr>
      `).join('');

      document.getElementById('receiptSubtotal').textContent = `₹${order.subtotal.toFixed(2)}`;
      document.getElementById('receiptGst').textContent = `₹${order.gst.toFixed(2)}`;
      
      const discountRow = document.getElementById('receiptDiscountRow');
      if (order.discount && order.discount > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('receiptDiscount').textContent = `-₹${order.discount.toFixed(2)}`;
      } else {
        discountRow.classList.add('hidden');
      }

      document.getElementById('receiptGrandTotal').textContent = `₹${order.grandTotal.toFixed(2)}`;

      this.openModal('receiptModalOverlay');
    }

    /* ==========================================================================
       11. MY ORDERS & TRANSACTIONS
       ========================================================================== */
    renderOrders() {
      this.dom.ordersCountBadge.textContent = this.orders.length;
      this.dom.ordersTableBody.innerHTML = this.orders.map(order => `
        <tr>
          <td><strong>${order.id}</strong></td>
          <td>${order.date}</td>
          <td>${order.itemCount} items</td>
          <td><strong>₹${order.grandTotal.toFixed(2)}</strong></td>
          <td>${order.paymentMethod}</td>
          <td><span class="status-badge status-completed">${order.status}</span></td>
          <td>
            <button class="btn btn-outline-sm" onclick="window.app.viewReceiptForOrder('${order.id}')">
              View Invoice
            </button>
          </td>
        </tr>
      `).join('');
    }

    renderTransactions(filterQuery = '') {
      let filtered = [...this.orders];
      if (filterQuery) {
        filtered = filtered.filter(o => 
          o.id.toLowerCase().includes(filterQuery) ||
          o.paymentMethod.toLowerCase().includes(filterQuery)
        );
      }

      this.dom.transactionsTableBody.innerHTML = filtered.map(trans => `
        <tr>
          <td><strong>${trans.id}</strong></td>
          <td>${trans.date}</td>
          <td><strong>₹${trans.grandTotal.toFixed(2)}</strong></td>
          <td>${trans.paymentMethod}</td>
          <td><span class="status-badge status-completed">Success</span></td>
          <td>
            <button class="btn btn-ghost-sm" onclick="window.app.viewReceiptForOrder('${trans.id}')" title="Inspect Receipt">
              🧾 Slip
            </button>
          </td>
        </tr>
      `).join('');
    }

    /* ==========================================================================
       12. BUYER PROFILE MANAGEMENT
       ========================================================================== */
    renderProfile() {
      this.dom.profileCardName.textContent = this.profile.name;
      this.dom.profileCardEmail.textContent = this.profile.email;
      this.dom.topUserName.textContent = this.profile.name;
      this.dom.welcomeUserName.textContent = this.profile.name.split(' ')[0] || 'Buyer';

      this.dom.profileInputName.value = this.profile.name;
      this.dom.profileInputEmail.value = this.profile.email;
      this.dom.profileInputPhone.value = this.profile.phone;
      this.dom.profileInputCity.value = this.profile.city;
      this.dom.profileInputAddress.value = this.profile.address;
    }

    saveProfile() {
      this.profile = {
        name: this.dom.profileInputName.value.trim() || 'Yash Kumar',
        email: this.dom.profileInputEmail.value.trim() || 'yash@example.com',
        phone: this.dom.profileInputPhone.value.trim() || '+91 98765 43210',
        city: this.dom.profileInputCity.value.trim() || 'Kolkata, West Bengal',
        address: this.dom.profileInputAddress.value.trim() || 'Salt Lake Sector V, Kolkata'
      };

      this.saveToStorage('sms_buyer_profile', this.profile);
      this.renderProfile();
      this.showToast('Buyer profile settings updated successfully!', 'success');
    }

    /* ==========================================================================
       13. PRODUCT QUICK VIEW MODAL
       ========================================================================== */
    showProductQuickView(product) {
      const isFavorited = this.wishlist.includes(product.id);
      const quickViewContent = document.getElementById('quickViewContent');
      quickViewContent.innerHTML = `
        <div class="qv-img-box">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='${product.fallback}';" />
        </div>
        <div class="qv-details">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p class="qv-brand">Brand: <strong>${product.brand}</strong> • Rating: ★ ${product.rating}</p>

          <div class="qv-price-row">
            <span class="qv-price">₹${product.price}</span>
            <span class="product-unit">(${product.unit})</span>
          </div>

          <p class="qv-desc">${product.description}</p>

          <div style="margin-bottom: 1.25rem;">
            <span class="product-stock-badge ${product.inStock ? 'stock-in' : 'stock-out'}">
              ${product.inStock ? `Available Stock: ${product.stockCount} units` : 'Currently Out of Stock'}
            </span>
          </div>

          <div class="product-actions-wrap" style="margin-top:auto;">
            <div class="qty-counter">
              <button class="qty-btn" id="qvQtyMinus" ${!product.inStock ? 'disabled' : ''}>-</button>
              <span class="qty-val" id="qvQtyVal">1</span>
              <button class="qty-btn" id="qvQtyPlus" ${!product.inStock ? 'disabled' : ''}>+</button>
            </div>
            <button class="btn btn-primary" id="qvAddToCartBtn" ${!product.inStock ? 'disabled' : ''} style="flex:1;">
              Add to Shopping Basket
            </button>
            <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" id="qvWishlistBtn" style="position:static; width:42px; height:42px;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      `;

      const qvQtyVal = document.getElementById('qvQtyVal');
      document.getElementById('qvQtyPlus')?.addEventListener('click', () => {
        let v = parseInt(qvQtyVal.textContent, 10) || 1;
        if (v < product.stockCount) qvQtyVal.textContent = v + 1;
      });
      document.getElementById('qvQtyMinus')?.addEventListener('click', () => {
        let v = parseInt(qvQtyVal.textContent, 10) || 1;
        if (v > 1) qvQtyVal.textContent = v - 1;
      });
      document.getElementById('qvAddToCartBtn')?.addEventListener('click', () => {
        const qty = parseInt(qvQtyVal.textContent, 10) || 1;
        this.addToCart(product, qty);
        this.closeModal('productModalOverlay');
      });
      document.getElementById('qvWishlistBtn')?.addEventListener('click', () => {
        this.toggleWishlist(product.id);
        this.closeModal('productModalOverlay');
      });

      this.openModal('productModalOverlay');
    }

    /* ==========================================================================
       14. MODAL CONTROLS & RESET HELPER
       ========================================================================== */
    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    }

    resetAllData() {
      if (confirm('Are you sure you want to reset all supermarket demo data (cart, orders, profile)?')) {
        localStorage.removeItem('sms_buyer_cart');
        localStorage.removeItem('sms_buyer_orders');
        localStorage.removeItem('sms_buyer_wishlist');
        localStorage.removeItem('sms_buyer_profile');
        location.reload();
      }
    }

    /* ==========================================================================
       15. TOAST NOTIFICATION ENGINE
       ========================================================================== */
    showToast(message, type = 'success') {
      const prefToast = document.getElementById('prefToastToggle');
      if (prefToast && !prefToast.checked) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const iconMap = {
        success: '✅',
        info: 'ℹ️',
        warning: '⚠️',
        danger: '❌'
      };

      toast.innerHTML = `
        <span class="toast-icon">${iconMap[type] || '🔔'}</span>
        <div class="toast-content">
          <div class="toast-title">${type.toUpperCase()}</div>
          <div class="toast-message">${message}</div>
        </div>
      `;

      this.dom.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3600);
    }
  }

  // Instantiate application on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new SuperMartApp();
  });

})();
