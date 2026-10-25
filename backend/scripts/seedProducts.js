require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

function generateSvgThumb(name, category, bgColor = '#dcfce7', textColor = '#166534') {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
    <rect width="300" height="200" fill="${bgColor}"/>
    <circle cx="150" cy="90" r="50" fill="#ffffff" opacity="0.8"/>
    <text x="150" y="98" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="150" y="160" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="${textColor}" text-anchor="middle">${category}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const EXPANDED_PRODUCTS = [
  // ================= 1. FRUITS & VEGETABLES =================
  {
    sku: 'prod-01',
    name: 'Fresh Shimla Apples',
    brand: 'FarmFresh Organic',
    category: 'Fruits & Vegetables',
    price: 120,
    unit: '₹120/kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Fresh Apples', 'Fruits & Veg', '#fee2e2', '#991b1b'),
    inStock: true,
    stockCount: 45,
    isPopular: true,
    rating: '4.8 (120+)',
    description: 'Crisp, sweet, handpicked Himalayan Shimla apples packed with dietary fiber, natural antioxidants, and freshness.'
  },
  {
    sku: 'prod-02',
    name: 'Robusta Bananas',
    brand: 'Nature Choice',
    category: 'Fruits & Vegetables',
    price: 60,
    unit: '₹60/dozen',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Bananas', 'Fruits & Veg', '#fef9c3', '#854d0e'),
    inStock: true,
    stockCount: 30,
    isPopular: false,
    rating: '4.6 (95)',
    description: 'Naturally ripened nutrient-rich bananas rich in potassium and instant energy. Direct harvest from certified orchards.'
  },
  {
    sku: 'prod-03',
    name: 'Farm Fresh Tomatoes',
    brand: 'Kisan Choice',
    category: 'Fruits & Vegetables',
    price: 40,
    unit: '₹40/kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Fresh Tomatoes', 'Fruits & Veg', '#fee2e2', '#b91c1c'),
    inStock: true,
    stockCount: 60,
    isPopular: true,
    rating: '4.7 (80)',
    description: 'Juicy, firm hybrid tomatoes perfect for delicious Indian curries, fresh salads, and culinary garnishing.'
  },
  {
    sku: 'prod-21',
    name: 'Fresh Thompson Green Grapes',
    brand: 'FarmFresh Organic',
    category: 'Fruits & Vegetables',
    price: 90,
    unit: '₹90/500g',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Green Grapes', 'Fruits & Veg', '#dcfce7', '#15803d'),
    inStock: true,
    stockCount: 35,
    isPopular: true,
    rating: '4.7 (110)',
    description: 'Crisp, sweet, seedless Indian Thompson green grapes bursting with refreshing natural sweetness and vitamins.'
  },
  {
    sku: 'prod-22',
    name: 'Nagpur Sweet Oranges',
    brand: 'Nature Choice',
    category: 'Fruits & Vegetables',
    price: 80,
    unit: '₹80/kg',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Oranges', 'Fruits & Veg', '#ffedd5', '#c2410c'),
    inStock: true,
    stockCount: 40,
    isPopular: false,
    rating: '4.5 (88)',
    description: 'Citrusy, succulent, Vitamin C loaded authentic Nagpur oranges with easy-to-peel rind.'
  },
  {
    sku: 'prod-23',
    name: 'Ruby Red Pomegranate',
    brand: 'FarmFresh Organic',
    category: 'Fruits & Vegetables',
    price: 150,
    unit: '₹150/kg',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Pomegranate', 'Fruits & Veg', '#ffe4e6', '#be123c'),
    inStock: true,
    stockCount: 25,
    isPopular: true,
    rating: '4.9 (145)',
    description: 'Plump deep-red arils rich in antioxidants, hemoglobin boosters, and dietary potassium.'
  },
  {
    sku: 'prod-24',
    name: 'Fresh Jyoti Potatoes',
    brand: 'Kisan Choice',
    category: 'Fruits & Vegetables',
    price: 30,
    unit: '₹30/kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Potatoes', 'Fruits & Veg', '#fef3c7', '#92400e'),
    inStock: true,
    stockCount: 100,
    isPopular: false,
    rating: '4.6 (220)',
    description: 'Uniform, clean, thin-skinned potato tubers ideal for frying, baking, boiling, and daily vegetable preparations.'
  },
  {
    sku: 'prod-25',
    name: 'Nasik Red Onions',
    brand: 'Kisan Choice',
    category: 'Fruits & Vegetables',
    price: 35,
    unit: '₹35/kg',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Onions', 'Fruits & Veg', '#fce7f3', '#9d174d'),
    inStock: true,
    stockCount: 85,
    isPopular: true,
    rating: '4.7 (310)',
    description: 'Pungent, firm Nasik red onions essential for rich aromatic Indian gravy bases and fresh salads.'
  },
  {
    sku: 'prod-26',
    name: 'Tender Fresh Spinach (Palak)',
    brand: 'FarmFresh Organic',
    category: 'Fruits & Vegetables',
    price: 25,
    unit: '₹25/bunch',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Spinach', 'Fruits & Veg', '#dcfce7', '#166534'),
    inStock: true,
    stockCount: 30,
    isPopular: false,
    rating: '4.8 (95)',
    description: 'Hydroponically washed iron-rich green spinach leaves perfect for Palak Paneer, wholesome soups, and detox smoothies.'
  },

  // ================= 2. DAIRY & BAKERY =================
  {
    sku: 'prod-04',
    name: 'Amul Taaza Homogenised Milk',
    brand: 'Amul',
    category: 'Dairy & Bakery',
    price: 32,
    unit: '₹32/500ml',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Amul Milk', 'Dairy & Bakery', '#dbeafe', '#1e40af'),
    inStock: true,
    stockCount: 80,
    isPopular: true,
    rating: '4.9 (450+)',
    description: 'Pasteurised toned milk with essential calcium, proteins, and vitamins. The taste of India in every single sip.'
  },
  {
    sku: 'prod-05',
    name: 'Britannia 100% Whole Wheat Bread',
    brand: 'Britannia',
    category: 'Dairy & Bakery',
    price: 45,
    unit: '₹45/packet',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Britannia Bread', 'Dairy & Bakery', '#fef3c7', '#92400e'),
    inStock: true,
    stockCount: 22,
    isPopular: false,
    rating: '4.5 (110)',
    description: 'Healthy whole-wheat brown loaf enriched with natural wheat germ and dietary fiber. Zero added maida.'
  },
  {
    sku: 'prod-06',
    name: 'Amul Pasteurized Butter',
    brand: 'Amul',
    category: 'Dairy & Bakery',
    price: 58,
    unit: '₹58/100g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Amul Butter', 'Dairy & Bakery', '#fef08a', '#854d0e'),
    inStock: true,
    stockCount: 15,
    isPopular: true,
    rating: '4.9 (380+)',
    description: 'Utterly butterly delicious creamy salted butter prepared from pristine cow and buffalo cream.'
  },
  {
    sku: 'prod-27',
    name: 'Amul Processed Cheese Slices',
    brand: 'Amul',
    category: 'Dairy & Bakery',
    price: 135,
    unit: '₹135/200g (10 slices)',
    image: 'https://images.unsplash.com/photo-1618060932014-4deda4932554?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Amul Cheese', 'Dairy & Bakery', '#fef08a', '#b45309'),
    inStock: true,
    stockCount: 30,
    isPopular: true,
    rating: '4.8 (290)',
    description: 'Rich, creamy pasteurized processed cheese slices that melt deliciously over breakfast toasts and burgers.'
  },
  {
    sku: 'prod-28',
    name: 'Mother Dairy Classic Dahi (Curd)',
    brand: 'Mother Dairy',
    category: 'Dairy & Bakery',
    price: 35,
    unit: '₹35/400g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Mother Dairy Dahi', 'Dairy & Bakery', '#e0f2fe', '#0369a1'),
    inStock: true,
    stockCount: 45,
    isPopular: false,
    rating: '4.7 (180)',
    description: 'Thick, creamy set curd containing beneficial live probiotic cultures for digestive wellness and cool summer raitas.'
  },
  {
    sku: 'prod-29',
    name: 'Amul Malai Fresh Paneer',
    brand: 'Amul',
    category: 'Dairy & Bakery',
    price: 90,
    unit: '₹90/200g',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Amul Paneer', 'Dairy & Bakery', '#f1f5f9', '#334155'),
    inStock: true,
    stockCount: 25,
    isPopular: true,
    rating: '4.9 (340)',
    description: 'High-protein, super soft traditional cottage cheese cubes. Retains its tender texture across curries and tikkas.'
  },
  {
    sku: 'prod-30',
    name: 'Farm Fresh White Eggs (Pack of 6)',
    brand: 'Eggoz Nutrition',
    category: 'Dairy & Bakery',
    price: 55,
    unit: '₹55/6 pcs',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Fresh Eggs', 'Dairy & Bakery', '#fef3c7', '#78350f'),
    inStock: true,
    stockCount: 50,
    isPopular: true,
    rating: '4.7 (210)',
    description: 'Clean, sanitized, protein-dense farm fresh eggs enriched with essential Vitamin B12 and Omega-3.'
  },
  {
    sku: 'prod-31',
    name: 'Dutch Chocolate Truffle Cake',
    brand: 'The Bake Shop',
    category: 'Dairy & Bakery',
    price: 350,
    unit: '₹350/500g',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Choco Cake', 'Dairy & Bakery', '#fed7aa', '#7c2d12'),
    inStock: true,
    stockCount: 12,
    isPopular: true,
    rating: '4.9 (170)',
    description: 'Decadent moist chocolate sponge layered with velvety Belgian dark chocolate ganache. Perfect for celebrations.'
  },
  {
    sku: 'prod-32',
    name: 'French Butter Croissants (Pack of 2)',
    brand: 'The Bake Shop',
    category: 'Dairy & Bakery',
    price: 85,
    unit: '₹85/2 pcs',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Croissants', 'Dairy & Bakery', '#fef3c7', '#92400e'),
    inStock: true,
    stockCount: 18,
    isPopular: false,
    rating: '4.6 (64)',
    description: 'Flaky, golden-crusted artisanal croissants layered with pure churned butter. Warm gently for café-style delight.'
  },

  // ================= 3. BEVERAGES =================
  {
    sku: 'prod-07',
    name: 'Coca-Cola Original Taste',
    brand: 'The Coca-Cola Company',
    category: 'Beverages',
    price: 40,
    unit: '₹40/750ml',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Coca-Cola', 'Beverages', '#fee2e2', '#991b1b'),
    inStock: true,
    stockCount: 50,
    isPopular: true,
    rating: '4.7 (310)',
    description: 'Iconic sparkling carbonated soft drink giving you that familiar uplifting refreshing kick.'
  },
  {
    sku: 'prod-08',
    name: 'Pepsi Cola Chilled Bottle',
    brand: 'PepsiCo',
    category: 'Beverages',
    price: 40,
    unit: '₹40/750ml',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Pepsi', 'Beverages', '#dbeafe', '#1e40af'),
    inStock: true,
    stockCount: 35,
    isPopular: false,
    rating: '4.6 (180)',
    description: 'Bold, refreshing, fizzy cola beverage with crisp taste designed to quench your thirst.'
  },
  {
    sku: 'prod-09',
    name: 'Réal Fruit Power Mixed Fruit Juice',
    brand: 'Dabur Réal',
    category: 'Beverages',
    price: 110,
    unit: '₹110/1L',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Real Juice', 'Beverages', '#fed7aa', '#9a3412'),
    inStock: true,
    stockCount: 18,
    isPopular: true,
    rating: '4.8 (210)',
    description: 'Packed with goodness of 9 selected fruits with Vitamin C. No added preservatives or artificial colours.'
  },
  {
    sku: 'prod-33',
    name: 'Nescafé Classic Instant Coffee',
    brand: 'Nestlé Nescafé',
    category: 'Beverages',
    price: 165,
    unit: '₹165/100g Jar',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Nescafe Coffee', 'Beverages', '#fed7aa', '#7c2d12'),
    inStock: true,
    stockCount: 40,
    isPopular: true,
    rating: '4.9 (420)',
    description: '100% pure roasted Robusta coffee beans delivering that unmistakable bold morning aroma and rich signature flavour.'
  },
  {
    sku: 'prod-34',
    name: 'Tata Tea Gold Leaf Tea',
    brand: 'Tata Consumer',
    category: 'Beverages',
    price: 140,
    unit: '₹140/250g',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Tata Tea', 'Beverages', '#fef08a', '#78350f'),
    inStock: true,
    stockCount: 60,
    isPopular: true,
    rating: '4.8 (310)',
    description: 'Exquisite blend of strong Assam CTC tea leaves gently scented with 15% long orthodox aromatic tea leaves.'
  },
  {
    sku: 'prod-35',
    name: 'Red Bull Energy Drink',
    brand: 'Red Bull',
    category: 'Beverages',
    price: 125,
    unit: '₹125/250ml Can',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Red Bull', 'Beverages', '#dbeafe', '#1d4ed8'),
    inStock: true,
    stockCount: 30,
    isPopular: false,
    rating: '4.7 (195)',
    description: 'Vitalizes body and mind. Appreciated worldwide by top athletes, busy professionals, and college students.'
  },
  {
    sku: 'prod-36',
    name: 'Bisleri Packaged Mineral Water',
    brand: 'Bisleri',
    category: 'Beverages',
    price: 20,
    unit: '₹20/1L',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Bisleri Water', 'Beverages', '#cffafe', '#0e7490'),
    inStock: true,
    stockCount: 150,
    isPopular: false,
    rating: '4.9 (600+)',
    description: 'Pure, safe drinking water that undergoes a meticulous 10-step purification process and added essential minerals.'
  },

  // ================= 4. SNACKS =================
  {
    sku: 'prod-10',
    name: 'Lay\'s Classic Salted Potato Chips',
    brand: 'Lay\'s India',
    category: 'Snacks',
    price: 20,
    unit: '₹20/packet',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Lays Chips', 'Snacks', '#fef08a', '#854d0e'),
    inStock: true,
    stockCount: 90,
    isPopular: true,
    rating: '4.7 (520+)',
    description: 'Crispy wafer-thin potato chips seasoned with pure sea salt for an unmistakable crunchy crunch.'
  },
  {
    sku: 'prod-11',
    name: 'Kurkure Masala Munch Namkeen',
    brand: 'Kurkure',
    category: 'Snacks',
    price: 20,
    unit: '₹20/packet',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Kurkure Munch', 'Snacks', '#fed7aa', '#c2410c'),
    inStock: true,
    stockCount: 65,
    isPopular: false,
    rating: '4.6 (390)',
    description: 'Tedha hai par mera hai! Crunchy corn puffs tossed in spicy signature Indian masalas and spices.'
  },
  {
    sku: 'prod-12',
    name: 'Parle-G Original Glucose Biscuits',
    brand: 'Parle Products',
    category: 'Snacks',
    price: 10,
    unit: '₹10/packet',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Parle-G', 'Snacks', '#fef3c7', '#78350f'),
    inStock: true,
    stockCount: 120,
    isPopular: true,
    rating: '4.9 (800+)',
    description: 'India\'s largest selling golden-baked glucose biscuit packed with wholesome milk & wheat goodness.'
  },
  {
    sku: 'prod-37',
    name: 'Oreo Original Vanilla Creme Sandwich Biscuits',
    brand: 'Cadbury Oreo',
    category: 'Snacks',
    price: 35,
    unit: '₹35/120g',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Oreo', 'Snacks', '#e2e8f0', '#0f172a'),
    inStock: true,
    stockCount: 70,
    isPopular: true,
    rating: '4.8 (430)',
    description: 'Twist, lick, and dunk! Rich cocoa biscuits filled with smooth sweet vanilla cream filling.'
  },
  {
    sku: 'prod-38',
    name: 'Maggi 2-Minute Masala Instant Noodles (4-Pack)',
    brand: 'Nestlé Maggi',
    category: 'Snacks',
    price: 56,
    unit: '₹56/280g',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Maggi Noodles', 'Snacks', '#fef08a', '#b45309'),
    inStock: true,
    stockCount: 95,
    isPopular: true,
    rating: '4.9 (950+)',
    description: 'India\'s most loved instant noodle with authentic blend of 10 roasted Indian spices and fortification.'
  },
  {
    sku: 'prod-39',
    name: 'Haldiram\'s Nagpur Bhujia Sev',
    brand: 'Haldiram\'s',
    category: 'Snacks',
    price: 50,
    unit: '₹50/150g',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Bhujia Sev', 'Snacks', '#fed7aa', '#c2410c'),
    inStock: true,
    stockCount: 45,
    isPopular: false,
    rating: '4.7 (240)',
    description: 'Traditional crispy tepary bean and chickpea noodles flavored with black pepper and clove seasonings.'
  },
  {
    sku: 'prod-40',
    name: 'Cadbury Dairy Milk Silk Chocolate Bar',
    brand: 'Cadbury',
    category: 'Snacks',
    price: 80,
    unit: '₹80/60g',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Dairy Milk Silk', 'Snacks', '#ede9fe', '#5b21b6'),
    inStock: true,
    stockCount: 40,
    isPopular: true,
    rating: '4.9 (610)',
    description: 'Velvety smooth milk chocolate that melts seamlessly on the tongue with every indulgent bite.'
  },

  // ================= 5. GROCERIES =================
  {
    sku: 'prod-13',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune Foods',
    category: 'Groceries',
    price: 160,
    unit: '₹160/1L',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Fortune Oil', 'Groceries', '#fef08a', '#713f12'),
    inStock: true,
    stockCount: 25,
    isPopular: true,
    rating: '4.7 (240)',
    description: 'Light, healthy cooking oil enriched with Vitamin A & D. Low absorption technology keeps dishes crisp.'
  },
  {
    sku: 'prod-14',
    name: 'Tata Salt Vacuum Evaporated Iodised',
    brand: 'Tata Consumer',
    category: 'Groceries',
    price: 28,
    unit: '₹28/kg',
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Tata Salt', 'Groceries', '#f1f5f9', '#334155'),
    inStock: true,
    stockCount: 75,
    isPopular: false,
    rating: '4.9 (410)',
    description: 'Desh Ka Namak. Pure vacuum evaporated iodised salt ensuring mental development and daily health balance.'
  },
  {
    sku: 'prod-15',
    name: 'India Gate Feast Rozzana Basmati Rice',
    brand: 'India Gate',
    category: 'Groceries',
    price: 180,
    unit: '₹180/kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Basmati Rice', 'Groceries', '#f8fafc', '#475569'),
    inStock: true,
    stockCount: 40,
    isPopular: true,
    rating: '4.8 (310)',
    description: 'Aged long-grain aromatic Basmati rice. Slender pearls cook up fluffy, fragrant, and non-sticky.'
  },
  {
    sku: 'prod-41',
    name: 'Aashirvaad Shudh Chakki Whole Wheat Atta',
    brand: 'ITC Aashirvaad',
    category: 'Groceries',
    price: 245,
    unit: '₹245/5kg',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Aashirvaad Atta', 'Groceries', '#fef3c7', '#92400e'),
    inStock: true,
    stockCount: 35,
    isPopular: true,
    rating: '4.9 (530)',
    description: '100% pure whole wheat ground in traditional stone chakkis for rotis that stay soft for hours.'
  },
  {
    sku: 'prod-42',
    name: 'Tata Sampann Unpolished Toor Dal',
    brand: 'Tata Sampann',
    category: 'Groceries',
    price: 175,
    unit: '₹175/1kg',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Toor Dal', 'Groceries', '#fef08a', '#ca8a04'),
    inStock: true,
    stockCount: 30,
    isPopular: false,
    rating: '4.8 (190)',
    description: 'Unpolished split pigeon peas naturally rich in wholesome proteins, dietary fiber, and pure taste.'
  },
  {
    sku: 'prod-43',
    name: 'Tata Sampann Unpolished Chana Dal',
    brand: 'Tata Sampann',
    category: 'Groceries',
    price: 120,
    unit: '₹120/1kg',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Chana Dal', 'Groceries', '#fef9c3', '#a16207'),
    inStock: true,
    stockCount: 35,
    isPopular: false,
    rating: '4.7 (120)',
    description: 'Nutritious unpolished Bengal gram dal loaded with plant proteins for rich curries and vadas.'
  },
  {
    sku: 'prod-44',
    name: 'Kissan Fresh Tomato Ketchup',
    brand: 'Hindustan Unilever',
    category: 'Groceries',
    price: 130,
    unit: '₹130/950g',
    image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Kissan Ketchup', 'Groceries', '#fee2e2', '#b91c1c'),
    inStock: true,
    stockCount: 40,
    isPopular: true,
    rating: '4.7 (280)',
    description: 'Made from 100% real ripe tomatoes, delivering that delightful tangy-sweet punch to samosas and snacks.'
  },
  {
    sku: 'prod-45',
    name: 'Saffola Rolled Oats 100% Natural',
    brand: 'Marico Saffola',
    category: 'Groceries',
    price: 190,
    unit: '₹190/1kg',
    image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Saffola Oats', 'Groceries', '#f1f5f9', '#475569'),
    inStock: true,
    stockCount: 25,
    isPopular: false,
    rating: '4.8 (155)',
    description: 'High in fiber and protein for cholesterol control and sustained energy. Ideal for porridge and upma.'
  },

  // ================= 6. PERSONAL CARE =================
  {
    sku: 'prod-16',
    name: 'Dove Deeply Nourishing Beauty Bar Soap',
    brand: 'Dove Unilever',
    category: 'Personal Care',
    price: 55,
    unit: '₹55/100g',
    image: 'https://images.unsplash.com/photo-1607006314146-a05e8361b72e?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Dove Soap', 'Personal Care', '#f0fdf4', '#166534'),
    inStock: true,
    stockCount: 40,
    isPopular: true,
    rating: '4.8 (190)',
    description: 'Formulated with 1/4 moisturizing cream and gentle cleansers to keep skin softer, smoother, and radiant.'
  },
  {
    sku: 'prod-17',
    name: 'Colgate Strong Teeth Dental Cream',
    brand: 'Colgate-Palmolive',
    category: 'Personal Care',
    price: 95,
    unit: '₹95/100g',
    image: 'https://images.unsplash.com/photo-1559591937-e1032c525f05?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Colgate', 'Personal Care', '#fee2e2', '#991b1b'),
    inStock: true,
    stockCount: 30,
    isPopular: false,
    rating: '4.6 (140)',
    description: 'Contains Amino Shakti formula that adds natural calcium to teeth, strengthening enamel against cavities.'
  },
  {
    sku: 'prod-18',
    name: 'Dettol Original Germ Protection Liquid Handwash',
    brand: 'Dettol Reckitt',
    category: 'Personal Care',
    price: 110,
    unit: '₹110/250ml',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Dettol Handwash', 'Personal Care', '#ecfdf5', '#047857'),
    inStock: true,
    stockCount: 28,
    isPopular: true,
    rating: '4.9 (350+)',
    description: 'Trusted 99.9% germ protection hand hygiene wash with moisturizers and dermatologically tested formula.'
  },
  {
    sku: 'prod-46',
    name: 'Head & Shoulders Anti-Dandruff Smooth & Silky Shampoo',
    brand: 'Procter & Gamble',
    category: 'Personal Care',
    price: 185,
    unit: '₹185/180ml',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('H&S Shampoo', 'Personal Care', '#dbeafe', '#1e40af'),
    inStock: true,
    stockCount: 25,
    isPopular: true,
    rating: '4.7 (230)',
    description: 'Clinically proven up to 100% dandruff-free hair. Restores moisture balance to dry, frizzy locks.'
  },
  {
    sku: 'prod-47',
    name: 'Colgate ZigZag Deep Clean Toothbrush (Buy 2 Get 1)',
    brand: 'Colgate-Palmolive',
    category: 'Personal Care',
    price: 70,
    unit: '₹70/pack of 3',
    image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Toothbrush', 'Personal Care', '#e0f2fe', '#0284c7'),
    inStock: true,
    stockCount: 40,
    isPopular: false,
    rating: '4.6 (140)',
    description: 'Multi-angle cross bristles designed to reach deep between teeth to remove stubborn bacterial plaque.'
  },
  {
    sku: 'prod-48',
    name: 'Nivea Nourishing Body Milk Lotion',
    brand: 'Nivea Beiersdorf',
    category: 'Personal Care',
    price: 220,
    unit: '₹220/200ml',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Nivea Lotion', 'Personal Care', '#dbeafe', '#1d4ed8'),
    inStock: true,
    stockCount: 22,
    isPopular: true,
    rating: '4.8 (310)',
    description: 'Enriched with almond oil and deep moisture serum for 48-hour intensive hydration on dry skin.'
  },

  // ================= 7. HOUSEHOLD ITEMS =================
  {
    sku: 'prod-19',
    name: 'Surf Excel Quick Wash Detergent Powder',
    brand: 'Surf Excel',
    category: 'Household Items',
    price: 140,
    unit: '₹140/1kg',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Surf Excel', 'Household', '#dbeafe', '#1d4ed8'),
    inStock: true,
    stockCount: 30,
    isPopular: true,
    rating: '4.7 (290)',
    description: 'X-tra clean particles deliver superior stain removal on tough collars and grease with half the effort.'
  },
  {
    sku: 'prod-20',
    name: 'Vim Lemon Dishwash Gel Liquid',
    brand: 'Vim',
    category: 'Household Items',
    price: 120,
    unit: '₹120/500ml',
    image: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Vim Gel', 'Household', '#fef08a', '#854d0e'),
    inStock: true,
    stockCount: 25,
    isPopular: false,
    rating: '4.6 (170)',
    description: 'Powered by 100 lemons. 1 spoon of Vim gel cleans an entire sink full of oily utensils effortlessly.'
  },
  {
    sku: 'prod-49',
    name: 'Harpic Power Plus 10X Toilet Cleaner Gel',
    brand: 'Reckitt Harpic',
    category: 'Household Items',
    price: 98,
    unit: '₹98/500ml',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Harpic Cleaner', 'Household', '#dbeafe', '#1e3a8a'),
    inStock: true,
    stockCount: 35,
    isPopular: true,
    rating: '4.8 (410)',
    description: 'Disinfectant toilet cleaner that removes 99.9% of germs and eradicates yellow stains with 10X power.'
  },
  {
    sku: 'prod-50',
    name: 'Lizol Citrus Disinfectant Surface & Floor Cleaner',
    brand: 'Reckitt Lizol',
    category: 'Household Items',
    price: 115,
    unit: '₹115/500ml',
    image: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Lizol Cleaner', 'Household', '#fef08a', '#ca8a04'),
    inStock: true,
    stockCount: 40,
    isPopular: true,
    rating: '4.8 (350)',
    description: 'Kills 99.9% germs, removes tough grease and leaves a long-lasting zesty citrus freshness.'
  },
  {
    sku: 'prod-51',
    name: 'Shalimar Oxo-Biodegradable Garbage Bags (Medium 30 pcs)',
    brand: 'Shalimar',
    category: 'Household Items',
    price: 85,
    unit: '₹85/roll (30 bags)',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&auto=format&fit=crop&q=80',
    fallback: generateSvgThumb('Garbage Bags', 'Household', '#e2e8f0', '#334155'),
    inStock: true,
    stockCount: 50,
    isPopular: false,
    rating: '4.7 (130)',
    description: 'Tough, leak-proof, tear-resistant biodegradable waste disposal bags with tie-strings.'
  }
];

/**
 * Idempotent Seeding Execution
 */
async function seedCatalogue() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Seeding Error] MONGODB_URI is not configured in backend/.env');
    process.exit(1);
  }

  try {
    console.log('[Seeding] Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('[Seeding] Successfully connected to MongoDB database.');

    console.log(`[Seeding] Processing ${EXPANDED_PRODUCTS.length} catalogue items...`);
    let insertedCount = 0;
    let updatedCount = 0;

    for (const prod of EXPANDED_PRODUCTS) {
      // Upsert: update metadata, but do NOT overwrite stockCount if product already exists!
      const result = await Product.updateOne(
        { sku: prod.sku },
        {
          $set: {
            name: prod.name,
            brand: prod.brand,
            category: prod.category,
            price: prod.price,
            unit: prod.unit,
            image: prod.image,
            fallback: prod.fallback,
            isPopular: prod.isPopular,
            rating: prod.rating,
            description: prod.description
          },
          $setOnInsert: {
            sku: prod.sku,
            stockCount: prod.stockCount,
            inStock: prod.inStock
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
      } else if (result.modifiedCount > 0) {
        updatedCount++;
      }
    }

    console.log(`[Seeding Complete] New items inserted: ${insertedCount}, Existing items updated: ${updatedCount}`);

    // Seed default demo buyer account if not present
    const demoEmail = 'yash@example.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Yash Kumar',
        email: demoEmail,
        phone: '+91 98765 43210',
        password: 'Password123!',
        city: 'Kolkata, West Bengal',
        address: 'Flat 4B, Green Meadows Residency, Salt Lake Sector V, Kolkata - 700091',
        role: 'buyer'
      });
      console.log(`[Demo User Created] Email: ${demoEmail} | Default Password: Password123!`);
    } else {
      console.log(`[Demo User Exists] Buyer account (${demoEmail}) is already available.`);
    }

    const totalCount = await Product.countDocuments();
    console.log(`[Verification] Total products in database: ${totalCount}`);

    await mongoose.disconnect();
    console.log('[Seeding Finished] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error]', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedCatalogue();
}

module.exports = { EXPANDED_PRODUCTS };
