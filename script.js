/**
 * SuperMart SAS - Supermarket Automation Software
 * Role: Buyer Dashboard
 * Technology: Pure Vanilla JavaScript (ES6+)
 * Integrated with Node.js / Express / MongoDB Atlas REST Backend
 * Fully preserves local offline demo capabilities when backend is unavailable.
 */

(() => {
  'use strict';

  /* ==========================================================================
     0. BACKEND API CLIENT & CONFIGURATION
     ========================================================================== */
  window.SUPERMART_CONFIG = window.SUPERMART_CONFIG || {
    API_BASE_URL: 'http://localhost:5000/api'
  };

  class ApiClient {
    constructor(baseUrl) {
      this.baseUrl = baseUrl || window.SUPERMART_CONFIG.API_BASE_URL;
    }

    getToken() {
      try {
        return localStorage.getItem('sms_auth_token') || null;
      } catch (e) {
        return null;
      }
    }

    setToken(token) {
      try {
        if (token) {
          localStorage.setItem('sms_auth_token', token);
        } else {
          localStorage.removeItem('sms_auth_token');
        }
      } catch (e) {
        console.warn('[ApiClient] Failed to store auth token:', e);
      }
    }

    async request(endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };

      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers
        });

        const data = await response.json().catch(() => ({
          success: false,
          message: `Server returned HTTP ${response.status}`
        }));

        return {
          ok: response.ok,
          status: response.status,
          data
        };
      } catch (err) {
        return {
          ok: false,
          status: 0,
          data: {
            success: false,
            message: 'Unable to connect to SuperMart SAS backend server.'
          },
          error: err
        };
      }
    }

    get(endpoint) {
      return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });
    }

    patch(endpoint, body) {
      return this.request(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });
    }

    delete(endpoint) {
      return this.request(endpoint, { method: 'DELETE' });
    }
  }

  /* ==========================================================================
     1. CATALOGUE DATA & MOCK INVENTORY
     ========================================================================== */
  const INITIAL_PRODUCTS = [
  {
    "id": "prod-01",
    "sku": "prod-01",
    "name": "Fresh Shimla Apples",
    "brand": "FarmFresh Organic",
    "category": "Fruits & Vegetables",
    "price": 120,
    "unit": "₹120/kg",
    "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fee2e2%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23991b1b%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EFA%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23991b1b%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 45,
    "isPopular": true,
    "rating": "4.8 (120+)",
    "description": "Crisp, sweet, handpicked Himalayan Shimla apples packed with dietary fiber, natural antioxidants, and freshness."
  },
  {
    "id": "prod-02",
    "sku": "prod-02",
    "name": "Robusta Bananas",
    "brand": "Nature Choice",
    "category": "Fruits & Vegetables",
    "price": 60,
    "unit": "₹60/dozen",
    "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef9c3%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EB%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": false,
    "rating": "4.6 (95)",
    "description": "Naturally ripened nutrient-rich bananas rich in potassium and instant energy. Direct harvest from certified orchards."
  },
  {
    "id": "prod-03",
    "sku": "prod-03",
    "name": "Farm Fresh Tomatoes",
    "brand": "Kisan Choice",
    "category": "Fruits & Vegetables",
    "price": 40,
    "unit": "₹40/kg",
    "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fee2e2%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23b91c1c%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EFT%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23b91c1c%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 60,
    "isPopular": true,
    "rating": "4.7 (80)",
    "description": "Juicy, firm hybrid tomatoes perfect for delicious Indian curries, fresh salads, and culinary garnishing."
  },
  {
    "id": "prod-21",
    "sku": "prod-21",
    "name": "Fresh Thompson Green Grapes",
    "brand": "FarmFresh Organic",
    "category": "Fruits & Vegetables",
    "price": 90,
    "unit": "₹90/500g",
    "image": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dcfce7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2315803d%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EGG%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2315803d%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 35,
    "isPopular": true,
    "rating": "4.7 (110)",
    "description": "Crisp, sweet, seedless Indian Thompson green grapes bursting with refreshing natural sweetness and vitamins."
  },
  {
    "id": "prod-22",
    "sku": "prod-22",
    "name": "Nagpur Sweet Oranges",
    "brand": "Nature Choice",
    "category": "Fruits & Vegetables",
    "price": 80,
    "unit": "₹80/kg",
    "image": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23ffedd5%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23c2410c%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EO%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23c2410c%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": false,
    "rating": "4.5 (88)",
    "description": "Citrusy, succulent, Vitamin C loaded authentic Nagpur oranges with easy-to-peel rind."
  },
  {
    "id": "prod-23",
    "sku": "prod-23",
    "name": "Ruby Red Pomegranate",
    "brand": "FarmFresh Organic",
    "category": "Fruits & Vegetables",
    "price": 150,
    "unit": "₹150/kg",
    "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23ffe4e6%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23be123c%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EP%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23be123c%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 25,
    "isPopular": true,
    "rating": "4.9 (145)",
    "description": "Plump deep-red arils rich in antioxidants, hemoglobin boosters, and dietary potassium."
  },
  {
    "id": "prod-24",
    "sku": "prod-24",
    "name": "Fresh Jyoti Potatoes",
    "brand": "Kisan Choice",
    "category": "Fruits & Vegetables",
    "price": 30,
    "unit": "₹30/kg",
    "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef3c7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EP%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 100,
    "isPopular": false,
    "rating": "4.6 (220)",
    "description": "Uniform, clean, thin-skinned potato tubers ideal for frying, baking, boiling, and daily vegetable preparations."
  },
  {
    "id": "prod-25",
    "sku": "prod-25",
    "name": "Nasik Red Onions",
    "brand": "Kisan Choice",
    "category": "Fruits & Vegetables",
    "price": 35,
    "unit": "₹35/kg",
    "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fce7f3%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%239d174d%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EO%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%239d174d%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 85,
    "isPopular": true,
    "rating": "4.7 (310)",
    "description": "Pungent, firm Nasik red onions essential for rich aromatic Indian gravy bases and fresh salads."
  },
  {
    "id": "prod-26",
    "sku": "prod-26",
    "name": "Tender Fresh Spinach (Palak)",
    "brand": "FarmFresh Organic",
    "category": "Fruits & Vegetables",
    "price": 25,
    "unit": "₹25/bunch",
    "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dcfce7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23166534%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ES%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23166534%22%20text-anchor%3D%22middle%22%3EFruits%20%26%20Veg%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": false,
    "rating": "4.8 (95)",
    "description": "Hydroponically washed iron-rich green spinach leaves perfect for Palak Paneer, wholesome soups, and detox smoothies."
  },
  {
    "id": "prod-04",
    "sku": "prod-04",
    "name": "Amul Taaza Homogenised Milk",
    "brand": "Amul",
    "category": "Dairy & Bakery",
    "price": 32,
    "unit": "₹32/500ml",
    "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231e40af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EAM%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231e40af%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 80,
    "isPopular": true,
    "rating": "4.9 (450+)",
    "description": "Pasteurised toned milk with essential calcium, proteins, and vitamins. The taste of India in every single sip."
  },
  {
    "id": "prod-05",
    "sku": "prod-05",
    "name": "Britannia 100% Whole Wheat Bread",
    "brand": "Britannia",
    "category": "Dairy & Bakery",
    "price": 45,
    "unit": "₹45/packet",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef3c7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EBB%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 22,
    "isPopular": false,
    "rating": "4.5 (110)",
    "description": "Healthy whole-wheat brown loaf enriched with natural wheat germ and dietary fiber. Zero added maida."
  },
  {
    "id": "prod-06",
    "sku": "prod-06",
    "name": "Amul Pasteurized Butter",
    "brand": "Amul",
    "category": "Dairy & Bakery",
    "price": 58,
    "unit": "₹58/100g",
    "image": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EAB%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 15,
    "isPopular": true,
    "rating": "4.9 (380+)",
    "description": "Utterly butterly delicious creamy salted butter prepared from pristine cow and buffalo cream."
  },
  {
    "id": "prod-27",
    "sku": "prod-27",
    "name": "Amul Processed Cheese Slices",
    "brand": "Amul",
    "category": "Dairy & Bakery",
    "price": 135,
    "unit": "₹135/200g (10 slices)",
    "image": "https://images.unsplash.com/photo-1618060932014-4deda4932554?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23b45309%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EAC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23b45309%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": true,
    "rating": "4.8 (290)",
    "description": "Rich, creamy pasteurized processed cheese slices that melt deliciously over breakfast toasts and burgers."
  },
  {
    "id": "prod-28",
    "sku": "prod-28",
    "name": "Mother Dairy Classic Dahi (Curd)",
    "brand": "Mother Dairy",
    "category": "Dairy & Bakery",
    "price": 35,
    "unit": "₹35/400g",
    "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23e0f2fe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%230369a1%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EMD%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%230369a1%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 45,
    "isPopular": false,
    "rating": "4.7 (180)",
    "description": "Thick, creamy set curd containing beneficial live probiotic cultures for digestive wellness and cool summer raitas."
  },
  {
    "id": "prod-29",
    "sku": "prod-29",
    "name": "Amul Malai Fresh Paneer",
    "brand": "Amul",
    "category": "Dairy & Bakery",
    "price": 90,
    "unit": "₹90/200g",
    "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f1f5f9%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EAP%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 25,
    "isPopular": true,
    "rating": "4.9 (340)",
    "description": "High-protein, super soft traditional cottage cheese cubes. Retains its tender texture across curries and tikkas."
  },
  {
    "id": "prod-30",
    "sku": "prod-30",
    "name": "Farm Fresh White Eggs (Pack of 6)",
    "brand": "Eggoz Nutrition",
    "category": "Dairy & Bakery",
    "price": 55,
    "unit": "₹55/6 pcs",
    "image": "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef3c7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2378350f%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EFE%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2378350f%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 50,
    "isPopular": true,
    "rating": "4.7 (210)",
    "description": "Clean, sanitized, protein-dense farm fresh eggs enriched with essential Vitamin B12 and Omega-3."
  },
  {
    "id": "prod-31",
    "sku": "prod-31",
    "name": "Dutch Chocolate Truffle Cake",
    "brand": "The Bake Shop",
    "category": "Dairy & Bakery",
    "price": 350,
    "unit": "₹350/500g",
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fed7aa%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%237c2d12%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%237c2d12%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 12,
    "isPopular": true,
    "rating": "4.9 (170)",
    "description": "Decadent moist chocolate sponge layered with velvety Belgian dark chocolate ganache. Perfect for celebrations."
  },
  {
    "id": "prod-32",
    "sku": "prod-32",
    "name": "French Butter Croissants (Pack of 2)",
    "brand": "The Bake Shop",
    "category": "Dairy & Bakery",
    "price": 85,
    "unit": "₹85/2 pcs",
    "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef3c7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%3EDairy%20%26%20Bakery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 18,
    "isPopular": false,
    "rating": "4.6 (64)",
    "description": "Flaky, golden-crusted artisanal croissants layered with pure churned butter. Warm gently for café-style delight."
  },
  {
    "id": "prod-07",
    "sku": "prod-07",
    "name": "Coca-Cola Original Taste",
    "brand": "The Coca-Cola Company",
    "category": "Beverages",
    "price": 40,
    "unit": "₹40/750ml",
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fee2e2%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23991b1b%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23991b1b%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 50,
    "isPopular": true,
    "rating": "4.7 (310)",
    "description": "Iconic sparkling carbonated soft drink giving you that familiar uplifting refreshing kick."
  },
  {
    "id": "prod-08",
    "sku": "prod-08",
    "name": "Pepsi Cola Chilled Bottle",
    "brand": "PepsiCo",
    "category": "Beverages",
    "price": 40,
    "unit": "₹40/750ml",
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231e40af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EP%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231e40af%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 35,
    "isPopular": false,
    "rating": "4.6 (180)",
    "description": "Bold, refreshing, fizzy cola beverage with crisp taste designed to quench your thirst."
  },
  {
    "id": "prod-09",
    "sku": "prod-09",
    "name": "Réal Fruit Power Mixed Fruit Juice",
    "brand": "Dabur Réal",
    "category": "Beverages",
    "price": 110,
    "unit": "₹110/1L",
    "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fed7aa%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%239a3412%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ERJ%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%239a3412%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 18,
    "isPopular": true,
    "rating": "4.8 (210)",
    "description": "Packed with goodness of 9 selected fruits with Vitamin C. No added preservatives or artificial colours."
  },
  {
    "id": "prod-33",
    "sku": "prod-33",
    "name": "Nescafé Classic Instant Coffee",
    "brand": "Nestlé Nescafé",
    "category": "Beverages",
    "price": 165,
    "unit": "₹165/100g Jar",
    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fed7aa%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%237c2d12%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%237c2d12%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": true,
    "rating": "4.9 (420)",
    "description": "100% pure roasted Robusta coffee beans delivering that unmistakable bold morning aroma and rich signature flavour."
  },
  {
    "id": "prod-34",
    "sku": "prod-34",
    "name": "Tata Tea Gold Leaf Tea",
    "brand": "Tata Consumer",
    "category": "Beverages",
    "price": 140,
    "unit": "₹140/250g",
    "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2378350f%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ETT%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2378350f%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 60,
    "isPopular": true,
    "rating": "4.8 (310)",
    "description": "Exquisite blend of strong Assam CTC tea leaves gently scented with 15% long orthodox aromatic tea leaves."
  },
  {
    "id": "prod-35",
    "sku": "prod-35",
    "name": "Red Bull Energy Drink",
    "brand": "Red Bull",
    "category": "Beverages",
    "price": 125,
    "unit": "₹125/250ml Can",
    "image": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231d4ed8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ERB%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231d4ed8%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": false,
    "rating": "4.7 (195)",
    "description": "Vitalizes body and mind. Appreciated worldwide by top athletes, busy professionals, and college students."
  },
  {
    "id": "prod-36",
    "sku": "prod-36",
    "name": "Bisleri Packaged Mineral Water",
    "brand": "Bisleri",
    "category": "Beverages",
    "price": 20,
    "unit": "₹20/1L",
    "image": "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23cffafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%230e7490%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EBW%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%230e7490%22%20text-anchor%3D%22middle%22%3EBeverages%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 150,
    "isPopular": false,
    "rating": "4.9 (600+)",
    "description": "Pure, safe drinking water that undergoes a meticulous 10-step purification process and added essential minerals."
  },
  {
    "id": "prod-10",
    "sku": "prod-10",
    "name": "Lay's Classic Salted Potato Chips",
    "brand": "Lay's India",
    "category": "Snacks",
    "price": 20,
    "unit": "₹20/packet",
    "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ELC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 90,
    "isPopular": true,
    "rating": "4.7 (520+)",
    "description": "Crispy wafer-thin potato chips seasoned with pure sea salt for an unmistakable crunchy crunch."
  },
  {
    "id": "prod-11",
    "sku": "prod-11",
    "name": "Kurkure Masala Munch Namkeen",
    "brand": "Kurkure",
    "category": "Snacks",
    "price": 20,
    "unit": "₹20/packet",
    "image": "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fed7aa%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23c2410c%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EKM%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23c2410c%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 65,
    "isPopular": false,
    "rating": "4.6 (390)",
    "description": "Tedha hai par mera hai! Crunchy corn puffs tossed in spicy signature Indian masalas and spices."
  },
  {
    "id": "prod-12",
    "sku": "prod-12",
    "name": "Parle-G Original Glucose Biscuits",
    "brand": "Parle Products",
    "category": "Snacks",
    "price": 10,
    "unit": "₹10/packet",
    "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef3c7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2378350f%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EP%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2378350f%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 120,
    "isPopular": true,
    "rating": "4.9 (800+)",
    "description": "India's largest selling golden-baked glucose biscuit packed with wholesome milk & wheat goodness."
  },
  {
    "id": "prod-37",
    "sku": "prod-37",
    "name": "Oreo Original Vanilla Creme Sandwich Biscuits",
    "brand": "Cadbury Oreo",
    "category": "Snacks",
    "price": 35,
    "unit": "₹35/120g",
    "image": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23e2e8f0%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%230f172a%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EO%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%230f172a%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 70,
    "isPopular": true,
    "rating": "4.8 (430)",
    "description": "Twist, lick, and dunk! Rich cocoa biscuits filled with smooth sweet vanilla cream filling."
  },
  {
    "id": "prod-38",
    "sku": "prod-38",
    "name": "Maggi 2-Minute Masala Instant Noodles (4-Pack)",
    "brand": "Nestlé Maggi",
    "category": "Snacks",
    "price": 56,
    "unit": "₹56/280g",
    "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23b45309%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EMN%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23b45309%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 95,
    "isPopular": true,
    "rating": "4.9 (950+)",
    "description": "India's most loved instant noodle with authentic blend of 10 roasted Indian spices and fortification."
  },
  {
    "id": "prod-39",
    "sku": "prod-39",
    "name": "Haldiram's Nagpur Bhujia Sev",
    "brand": "Haldiram's",
    "category": "Snacks",
    "price": 50,
    "unit": "₹50/150g",
    "image": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fed7aa%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23c2410c%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EBS%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23c2410c%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 45,
    "isPopular": false,
    "rating": "4.7 (240)",
    "description": "Traditional crispy tepary bean and chickpea noodles flavored with black pepper and clove seasonings."
  },
  {
    "id": "prod-40",
    "sku": "prod-40",
    "name": "Cadbury Dairy Milk Silk Chocolate Bar",
    "brand": "Cadbury",
    "category": "Snacks",
    "price": 80,
    "unit": "₹80/60g",
    "image": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23ede9fe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%235b21b6%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDM%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%235b21b6%22%20text-anchor%3D%22middle%22%3ESnacks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": true,
    "rating": "4.9 (610)",
    "description": "Velvety smooth milk chocolate that melts seamlessly on the tongue with every indulgent bite."
  },
  {
    "id": "prod-13",
    "sku": "prod-13",
    "name": "Fortune Sunlite Refined Sunflower Oil",
    "brand": "Fortune Foods",
    "category": "Groceries",
    "price": 160,
    "unit": "₹160/1L",
    "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23713f12%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EFO%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23713f12%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 25,
    "isPopular": true,
    "rating": "4.7 (240)",
    "description": "Light, healthy cooking oil enriched with Vitamin A & D. Low absorption technology keeps dishes crisp."
  },
  {
    "id": "prod-14",
    "sku": "prod-14",
    "name": "Tata Salt Vacuum Evaporated Iodised",
    "brand": "Tata Consumer",
    "category": "Groceries",
    "price": 28,
    "unit": "₹28/kg",
    "image": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f1f5f9%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ETS%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 75,
    "isPopular": false,
    "rating": "4.9 (410)",
    "description": "Desh Ka Namak. Pure vacuum evaporated iodised salt ensuring mental development and daily health balance."
  },
  {
    "id": "prod-15",
    "sku": "prod-15",
    "name": "India Gate Feast Rozzana Basmati Rice",
    "brand": "India Gate",
    "category": "Groceries",
    "price": 180,
    "unit": "₹180/kg",
    "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f8fafc%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23475569%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EBR%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23475569%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": true,
    "rating": "4.8 (310)",
    "description": "Aged long-grain aromatic Basmati rice. Slender pearls cook up fluffy, fragrant, and non-sticky."
  },
  {
    "id": "prod-41",
    "sku": "prod-41",
    "name": "Aashirvaad Shudh Chakki Whole Wheat Atta",
    "brand": "ITC Aashirvaad",
    "category": "Groceries",
    "price": 245,
    "unit": "₹245/5kg",
    "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef3c7%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EAA%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%2392400e%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 35,
    "isPopular": true,
    "rating": "4.9 (530)",
    "description": "100% pure whole wheat ground in traditional stone chakkis for rotis that stay soft for hours."
  },
  {
    "id": "prod-42",
    "sku": "prod-42",
    "name": "Tata Sampann Unpolished Toor Dal",
    "brand": "Tata Sampann",
    "category": "Groceries",
    "price": 175,
    "unit": "₹175/1kg",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23ca8a04%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ETD%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23ca8a04%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": false,
    "rating": "4.8 (190)",
    "description": "Unpolished split pigeon peas naturally rich in wholesome proteins, dietary fiber, and pure taste."
  },
  {
    "id": "prod-43",
    "sku": "prod-43",
    "name": "Tata Sampann Unpolished Chana Dal",
    "brand": "Tata Sampann",
    "category": "Groceries",
    "price": 120,
    "unit": "₹120/1kg",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef9c3%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23a16207%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECD%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23a16207%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 35,
    "isPopular": false,
    "rating": "4.7 (120)",
    "description": "Nutritious unpolished Bengal gram dal loaded with plant proteins for rich curries and vadas."
  },
  {
    "id": "prod-44",
    "sku": "prod-44",
    "name": "Kissan Fresh Tomato Ketchup",
    "brand": "Hindustan Unilever",
    "category": "Groceries",
    "price": 130,
    "unit": "₹130/950g",
    "image": "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fee2e2%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23b91c1c%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EKK%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23b91c1c%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": true,
    "rating": "4.7 (280)",
    "description": "Made from 100% real ripe tomatoes, delivering that delightful tangy-sweet punch to samosas and snacks."
  },
  {
    "id": "prod-45",
    "sku": "prod-45",
    "name": "Saffola Rolled Oats 100% Natural",
    "brand": "Marico Saffola",
    "category": "Groceries",
    "price": 190,
    "unit": "₹190/1kg",
    "image": "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f1f5f9%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23475569%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ESO%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23475569%22%20text-anchor%3D%22middle%22%3EGroceries%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 25,
    "isPopular": false,
    "rating": "4.8 (155)",
    "description": "High in fiber and protein for cholesterol control and sustained energy. Ideal for porridge and upma."
  },
  {
    "id": "prod-16",
    "sku": "prod-16",
    "name": "Dove Deeply Nourishing Beauty Bar Soap",
    "brand": "Dove Unilever",
    "category": "Personal Care",
    "price": 55,
    "unit": "₹55/100g",
    "image": "https://images.unsplash.com/photo-1607006314146-a05e8361b72e?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f0fdf4%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23166534%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDS%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23166534%22%20text-anchor%3D%22middle%22%3EPersonal%20Care%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": true,
    "rating": "4.8 (190)",
    "description": "Formulated with 1/4 moisturizing cream and gentle cleansers to keep skin softer, smoother, and radiant."
  },
  {
    "id": "prod-17",
    "sku": "prod-17",
    "name": "Colgate Strong Teeth Dental Cream",
    "brand": "Colgate-Palmolive",
    "category": "Personal Care",
    "price": 95,
    "unit": "₹95/100g",
    "image": "https://images.unsplash.com/photo-1559591937-e1032c525f05?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fee2e2%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23991b1b%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23991b1b%22%20text-anchor%3D%22middle%22%3EPersonal%20Care%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": false,
    "rating": "4.6 (140)",
    "description": "Contains Amino Shakti formula that adds natural calcium to teeth, strengthening enamel against cavities."
  },
  {
    "id": "prod-18",
    "sku": "prod-18",
    "name": "Dettol Original Germ Protection Liquid Handwash",
    "brand": "Dettol Reckitt",
    "category": "Personal Care",
    "price": 110,
    "unit": "₹110/250ml",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23ecfdf5%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23047857%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDH%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23047857%22%20text-anchor%3D%22middle%22%3EPersonal%20Care%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 28,
    "isPopular": true,
    "rating": "4.9 (350+)",
    "description": "Trusted 99.9% germ protection hand hygiene wash with moisturizers and dermatologically tested formula."
  },
  {
    "id": "prod-46",
    "sku": "prod-46",
    "name": "Head & Shoulders Anti-Dandruff Smooth & Silky Shampoo",
    "brand": "Procter & Gamble",
    "category": "Personal Care",
    "price": 185,
    "unit": "₹185/180ml",
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231e40af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EHS%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231e40af%22%20text-anchor%3D%22middle%22%3EPersonal%20Care%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 25,
    "isPopular": true,
    "rating": "4.7 (230)",
    "description": "Clinically proven up to 100% dandruff-free hair. Restores moisture balance to dry, frizzy locks."
  },
  {
    "id": "prod-47",
    "sku": "prod-47",
    "name": "Colgate ZigZag Deep Clean Toothbrush (Buy 2 Get 1)",
    "brand": "Colgate-Palmolive",
    "category": "Personal Care",
    "price": 70,
    "unit": "₹70/pack of 3",
    "image": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23e0f2fe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%230284c7%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ET%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%230284c7%22%20text-anchor%3D%22middle%22%3EPersonal%20Care%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": false,
    "rating": "4.6 (140)",
    "description": "Multi-angle cross bristles designed to reach deep between teeth to remove stubborn bacterial plaque."
  },
  {
    "id": "prod-48",
    "sku": "prod-48",
    "name": "Nivea Nourishing Body Milk Lotion",
    "brand": "Nivea Beiersdorf",
    "category": "Personal Care",
    "price": 220,
    "unit": "₹220/200ml",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231d4ed8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENL%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231d4ed8%22%20text-anchor%3D%22middle%22%3EPersonal%20Care%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 22,
    "isPopular": true,
    "rating": "4.8 (310)",
    "description": "Enriched with almond oil and deep moisture serum for 48-hour intensive hydration on dry skin."
  },
  {
    "id": "prod-19",
    "sku": "prod-19",
    "name": "Surf Excel Quick Wash Detergent Powder",
    "brand": "Surf Excel",
    "category": "Household Items",
    "price": 140,
    "unit": "₹140/1kg",
    "image": "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231d4ed8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ESE%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231d4ed8%22%20text-anchor%3D%22middle%22%3EHousehold%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 30,
    "isPopular": true,
    "rating": "4.7 (290)",
    "description": "X-tra clean particles deliver superior stain removal on tough collars and grease with half the effort."
  },
  {
    "id": "prod-20",
    "sku": "prod-20",
    "name": "Vim Lemon Dishwash Gel Liquid",
    "brand": "Vim",
    "category": "Household Items",
    "price": 120,
    "unit": "₹120/500ml",
    "image": "https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EVG%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23854d0e%22%20text-anchor%3D%22middle%22%3EHousehold%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 25,
    "isPopular": false,
    "rating": "4.6 (170)",
    "description": "Powered by 100 lemons. 1 spoon of Vim gel cleans an entire sink full of oily utensils effortlessly."
  },
  {
    "id": "prod-49",
    "sku": "prod-49",
    "name": "Harpic Power Plus 10X Toilet Cleaner Gel",
    "brand": "Reckitt Harpic",
    "category": "Household Items",
    "price": 98,
    "unit": "₹98/500ml",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dbeafe%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%231e3a8a%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EHC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%231e3a8a%22%20text-anchor%3D%22middle%22%3EHousehold%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 35,
    "isPopular": true,
    "rating": "4.8 (410)",
    "description": "Disinfectant toilet cleaner that removes 99.9% of germs and eradicates yellow stains with 10X power."
  },
  {
    "id": "prod-50",
    "sku": "prod-50",
    "name": "Lizol Citrus Disinfectant Surface & Floor Cleaner",
    "brand": "Reckitt Lizol",
    "category": "Household Items",
    "price": 115,
    "unit": "₹115/500ml",
    "image": "https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fef08a%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23ca8a04%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ELC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23ca8a04%22%20text-anchor%3D%22middle%22%3EHousehold%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 40,
    "isPopular": true,
    "rating": "4.8 (350)",
    "description": "Kills 99.9% germs, removes tough grease and leaves a long-lasting zesty citrus freshness."
  },
  {
    "id": "prod-51",
    "sku": "prod-51",
    "name": "Shalimar Oxo-Biodegradable Garbage Bags (Medium 30 pcs)",
    "brand": "Shalimar",
    "category": "Household Items",
    "price": 85,
    "unit": "₹85/roll (30 bags)",
    "image": "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&auto=format&fit=crop&q=80",
    "fallback": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%20viewBox%3D%220%200%20300%20200%22%3E%0A%20%20%20%20%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23e2e8f0%22%2F%3E%0A%20%20%20%20%3Ccircle%20cx%3D%22150%22%20cy%3D%2290%22%20r%3D%2250%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.8%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%2298%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2228%22%20font-weight%3D%22bold%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EGB%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%22150%22%20y%3D%22160%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22600%22%20fill%3D%22%23334155%22%20text-anchor%3D%22middle%22%3EHousehold%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "inStock": true,
    "stockCount": 50,
    "isPopular": false,
    "rating": "4.7 (130)",
    "description": "Tough, leak-proof, tear-resistant biodegradable waste disposal bags with tie-strings."
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
      discount: 37.00,
      grandTotal: 351.50,
      paymentMethod: 'Credit/Debit Card',
      status: 'Completed'
    },
    {
      id: 'ORD-2026-1018',
      date: '28-Aug-2026 16:30',
      itemCount: 6,
      items: [
        { name: "Lay's Classic Chips", qty: 3, price: 20 },
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
     2. APP STATE CONTROLLER
     ========================================================================== */
  class SuperMartApp {
    constructor() {
      this.api = new ApiClient();
      this.token = this.api.getToken();
      this.isBackendOnline = false;
      this.currentUser = null;

      this.products = [...INITIAL_PRODUCTS];
      this.cart = this.loadFromStorage('sms_buyer_cart', [
        { product: this.products[0], quantity: 1 },
        { product: this.products[3], quantity: 2 }
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
      this.appliedDiscount = 0;
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
      this.checkBackendHealth();
    }

    setupDOMReferences() {
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
        topSignInBtn: document.getElementById('topSignInBtn'),
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

        // Connectivity & Auth Modal Elements
        apiStatusPill: document.getElementById('apiStatusPill'),
        apiDot: document.getElementById('apiDot'),
        apiStatusText: document.getElementById('apiStatusText'),
        authModalOverlay: document.getElementById('authModalOverlay'),
        authAlertBox: document.getElementById('authAlertBox'),
        authModalTitle: document.getElementById('authModalTitle'),
        authModalSub: document.getElementById('authModalSub'),
        tabBtnLogin: document.getElementById('tabBtnLogin'),
        tabBtnRegister: document.getElementById('tabBtnRegister'),
        authLoginForm: document.getElementById('authLoginForm'),
        authRegisterForm: document.getElementById('authRegisterForm'),
        btnCloseAuthModal: document.getElementById('btnCloseAuthModal'),

        // Modals & Containers
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
      this.dom.hamburgerBtn?.addEventListener('click', () => this.toggleSidebarMobile());
      this.dom.sidebarCloseBtn?.addEventListener('click', () => this.closeSidebarMobile());
      this.dom.sidebarOverlay?.addEventListener('click', () => this.closeSidebarMobile());

      // Header actions
      document.getElementById('topCartBtn')?.addEventListener('click', () => this.navigate('cart'));
      this.dom.topProfileChip?.addEventListener('click', () => this.navigate('profile'));
      this.dom.topSignInBtn?.addEventListener('click', () => this.openAuthModal());

      // Settings & Help & Logout
      document.getElementById('btnOpenSettings')?.addEventListener('click', () => this.openModal('settingsModalOverlay'));
      document.getElementById('btnOpenHelp')?.addEventListener('click', () => this.openModal('helpModalOverlay'));
      document.getElementById('btnCloseSettingsModal')?.addEventListener('click', () => this.closeModal('settingsModalOverlay'));
      document.getElementById('btnCloseHelpModal')?.addEventListener('click', () => this.closeModal('helpModalOverlay'));
      document.getElementById('btnLogout')?.addEventListener('click', () => this.logout());

      // Auth modal close
      this.dom.btnCloseAuthModal?.addEventListener('click', () => this.closeAuthModal());

      // Notifications popover
      this.dom.notificationBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dom.notificationPopover.classList.toggle('show');
      });
      document.addEventListener('click', (e) => {
        if (this.dom.notificationPopover && !this.dom.notificationPopover.contains(e.target) && e.target !== this.dom.notificationBtn) {
          this.dom.notificationPopover.classList.remove('show');
        }
        if (this.dom.searchDropdown && !this.dom.searchDropdown.contains(e.target) && e.target !== this.dom.topSearchInput) {
          this.dom.searchDropdown.classList.remove('show');
        }
      });

      // Global Live Search input
      this.dom.topSearchInput?.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
      this.dom.clearSearchBtn?.addEventListener('click', () => {
        this.dom.topSearchInput.value = '';
        this.dom.clearSearchBtn.style.display = 'none';
        this.dom.searchDropdown.classList.remove('show');
      });

      // Catalog filters
      this.dom.categoryTabs?.addEventListener('click', (e) => {
        const tab = e.target.closest('.category-tab');
        if (!tab) return;
        this.dom.categoryTabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category;
        this.renderCatalog();
      });

      this.dom.catalogSearchInput?.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCatalog();
      });

      this.dom.sortSelector?.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderCatalog();
      });

      this.dom.inStockOnlyCheckbox?.addEventListener('change', (e) => {
        this.inStockOnly = e.target.checked;
        this.renderCatalog();
      });

      this.dom.btnShowWishlistOnly?.addEventListener('click', () => {
        this.showWishlistOnly = !this.showWishlistOnly;
        this.dom.btnShowWishlistOnly.classList.toggle('active', this.showWishlistOnly);
        this.dom.wishlistFilterText.textContent = this.showWishlistOnly ? 'Showing Saved' : 'Saved Items';
        this.renderCatalog();
      });

      this.dom.btnResetFilters?.addEventListener('click', () => this.resetFilters());

      // Cart Interactions
      this.dom.btnClearCartBtn?.addEventListener('click', () => this.clearCart());
      this.dom.btnProceedToCheckout?.addEventListener('click', () => {
        if (this.cart.length === 0) {
          this.showToast('Your cart is empty! Please add products first.', 'warning');
          return;
        }
        this.navigate('checkout');
      });

      // Coupon Handling
      this.dom.btnApplyCoupon?.addEventListener('click', () => this.applyCoupon());
      this.dom.couponInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.applyCoupon();
      });
      this.dom.btnRemoveCoupon?.addEventListener('click', () => this.removeCoupon());

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
      this.dom.btnGenerateBill?.addEventListener('click', () => this.generateAndShowBill());

      // Receipt Modal Controls
      document.getElementById('btnCloseReceiptModal')?.addEventListener('click', () => this.closeModal('receiptModalOverlay'));
      document.getElementById('btnPrintReceiptBtn')?.addEventListener('click', () => window.print());
      document.getElementById('btnDownloadReceiptBtn')?.addEventListener('click', () => {
        this.showToast('Invoice prepared for export. Initiating print dialog...', 'info');
        setTimeout(() => window.print(), 500);
      });

      // Product Quick-view Modal close
      document.getElementById('btnCloseProductModal')?.addEventListener('click', () => this.closeModal('productModalOverlay'));

      // Transactions Search Filter
      this.dom.transactionsSearchInput?.addEventListener('input', (e) => {
        this.renderTransactions(e.target.value.toLowerCase().trim());
      });

      // Profile avatar/password demo triggers
      this.dom.btnChangeAvatar?.addEventListener('click', () => {
        this.showToast('Profile photo updated from supermarket camera register.', 'info');
      });
      this.dom.btnChangePassword?.addEventListener('click', () => {
        this.showToast('Password change token dispatched to buyer email.', 'info');
      });

      // Window hash changes
      window.addEventListener('hashchange', () => this.handleUrlHash());
    }

    handleUrlHash() {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      if (['dashboard', 'products', 'cart', 'checkout', 'orders', 'transactions', 'profile'].includes(hash)) {
        this.navigate(hash, false);
      }
    }

    /* ==========================================================================
       BACKEND INTEGRATION: HEALTH, SYNC & DATA FETCHING
       ========================================================================== */
    async checkBackendHealth() {
      const res = await this.api.get('/health');
      if (res.ok && res.data && res.data.success) {
        this.isBackendOnline = true;
        if (this.dom.apiStatusPill) {
          this.dom.apiStatusPill.className = 'api-status-pill online';
          this.dom.apiStatusPill.title = `Connected to Express API (${res.data.timestamp || 'Active'})`;
        }
        if (this.dom.apiStatusText) this.dom.apiStatusText.textContent = 'Backend Online';

        // Fetch products from backend
        await this.loadRemoteProducts();

        // Check if user is logged in
        if (this.token) {
          await this.loadRemoteBuyerSession();
        } else {
          this.updateAuthUI(false);
        }
      } else {
        this.isBackendOnline = false;
        if (this.dom.apiStatusPill) {
          this.dom.apiStatusPill.className = 'api-status-pill offline';
          this.dom.apiStatusPill.title = 'Backend server offline. Running in local demo mode with 51 products.';
        }
        if (this.dom.apiStatusText) this.dom.apiStatusText.textContent = 'Local Demo Mode';
        this.updateAuthUI(false);
      }
    }

    async loadRemoteProducts() {
      try {
        const res = await this.api.get('/products?limit=100');
        const productList = res.data?.products || (Array.isArray(res.data?.data) ? res.data.data : null);
        if (res.ok && res.data && res.data.success && Array.isArray(productList)) {
          this.products = productList.map(p => ({
            id: p.sku || p._id || p.id,
            sku: p.sku || p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            price: p.price,
            unit: p.unit,
            image: p.image,
            fallback: p.fallback || this.products[0]?.fallback || '',
            inStock: p.inStock,
            stockCount: p.stockCount,
            isPopular: p.isPopular,
            rating: p.rating,
            description: p.description
          }));
          this.renderCatalog();
          this.renderDashboard();
          this.updateBadgesAndStats();
        }
      } catch (e) {
        console.warn('[Backend] Error fetching remote products:', e);
      }
    }

    async loadRemoteBuyerSession() {
      try {
        const res = await this.api.get('/profile');
        if (res.ok && res.data && res.data.success) {
          this.currentUser = res.data.buyer || res.data.user || res.data.data || {};
          this.profile = {
            name: this.currentUser.name || 'Buyer',
            email: this.currentUser.email || 'buyer@example.com',
            phone: this.currentUser.phone || '+91 98765 43210',
            city: this.currentUser.city || 'Kolkata, West Bengal',
            address: this.currentUser.address || 'Salt Lake Sector V, Kolkata'
          };
          this.updateAuthUI(true);

          // Fetch real dashboard stats
          await this.loadRemoteDashboardStats();
          // Fetch real orders
          await this.loadRemoteOrders();
          // Fetch wishlist
          await this.loadRemoteWishlist();
        } else {
          // Token expired or invalid
          this.api.setToken(null);
          this.token = null;
          this.currentUser = null;
          this.updateAuthUI(false);
        }
      } catch (e) {
        console.warn('[Backend] Error loading buyer profile:', e);
      }
    }

    async loadRemoteDashboardStats() {
      try {
        const res = await this.api.get('/dashboard/stats');
        if (res.ok && res.data && res.data.success) {
          const stats = res.data.stats || res.data.data?.stats || res.data.data || {};
          if (this.dom.statTotalOrders) this.dom.statTotalOrders.textContent = stats.totalOrders ?? 0;
          if (this.dom.statSavedItems) this.dom.statSavedItems.textContent = stats.wishlistCount ?? 0;
          if (this.dom.profileStatOrders) this.dom.profileStatOrders.textContent = stats.totalOrders ?? 0;
          if (this.dom.profileStatSaved) this.dom.profileStatSaved.textContent = stats.wishlistCount ?? 0;
          if (this.dom.profileStatSpent) {
            const spent = stats.lifetimeSpend || 0;
            this.dom.profileStatSpent.textContent = `₹${spent >= 1000 ? (spent / 1000).toFixed(1) + 'k' : spent.toFixed(0)}`;
          }
          if (this.dom.lifetimeSpendAmount) {
            this.dom.lifetimeSpendAmount.textContent = `₹${(stats.lifetimeSpend || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
          }
        }
      } catch (e) {
        console.warn('[Backend] Error loading dashboard stats:', e);
      }
    }

    async loadRemoteOrders() {
      try {
        const res = await this.api.get('/orders');
        const orderList = res.data?.orders || (Array.isArray(res.data?.data) ? res.data.data : null);
        if (res.ok && res.data && res.data.success && Array.isArray(orderList)) {
          this.orders = orderList.map(o => ({
            id: o.invoiceNumber || o.invoiceNo || o.orderNumber || o._id,
            date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(o.createdAt || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            itemCount: (o.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
            items: (o.items || []).map(i => ({
              name: i.productName || i.name || (i.product && i.product.name) || 'Product',
              qty: i.quantity || 1,
              price: i.unitPrice || i.price || 0,
              total: i.lineTotal || ((i.unitPrice || i.price || 0) * (i.quantity || 1))
            })),
            subtotal: o.subtotal || 0,
            gst: o.gst || 0,
            discount: o.discount || 0,
            grandTotal: o.grandTotal || 0,
            paymentMethod: o.paymentMethod || 'Cash',
            status: o.orderStatus || o.status || 'Completed'
          }));
          this.renderOrders();
          this.renderTransactions();
          this.updateBadgesAndStats();
        }
      } catch (e) {
        console.warn('[Backend] Error loading remote orders:', e);
      }
    }

    async loadRemoteWishlist() {
      try {
        const res = await this.api.get('/wishlist');
        const wishlistItems = res.data?.items || (Array.isArray(res.data?.data) ? res.data.data : null);
        if (res.ok && res.data && res.data.success && Array.isArray(wishlistItems)) {
          this.wishlist = wishlistItems.map(i => i.product?.sku || i.product?.id || i.product?._id || i.sku || i.id || i).filter(Boolean);
          this.renderCatalog();
          this.updateBadgesAndStats();
        }
      } catch (e) {
        console.warn('[Backend] Error loading wishlist:', e);
      }
    }

    updateAuthUI(isLoggedIn) {
      if (isLoggedIn && this.profile) {
        this.dom.topProfileChip?.classList.remove('hidden');
        this.dom.topSignInBtn?.classList.add('hidden');
        if (this.dom.topUserName) this.dom.topUserName.textContent = this.profile.name;
        if (this.dom.welcomeUserName) this.dom.welcomeUserName.textContent = this.profile.name.split(' ')[0] || 'Buyer';
        const logoutBtn = document.getElementById('btnLogout');
        if (logoutBtn) logoutBtn.textContent = '🚪 Sign Out';
      } else {
        this.dom.topProfileChip?.classList.add('hidden');
        this.dom.topSignInBtn?.classList.remove('hidden');
        if (this.dom.topUserName) this.dom.topUserName.textContent = 'Guest Buyer';
        if (this.dom.welcomeUserName) this.dom.welcomeUserName.textContent = 'Guest';
      }
      this.renderProfile();
    }

    /* ==========================================================================
       BUYER AUTHENTICATION METHODS (MODAL, LOGIN, REGISTER, LOGOUT)
       ========================================================================== */
    openAuthModal() {
      if (this.dom.authAlertBox) {
        this.dom.authAlertBox.className = 'auth-alert hidden';
        this.dom.authAlertBox.textContent = '';
      }
      this.switchAuthTab('login');
      this.openModal('authModalOverlay');
    }

    closeAuthModal() {
      this.closeModal('authModalOverlay');
    }

    switchAuthTab(tab) {
      if (tab === 'login') {
        this.dom.tabBtnLogin?.classList.add('active');
        this.dom.tabBtnRegister?.classList.remove('active');
        this.dom.authLoginForm?.classList.remove('hidden');
        this.dom.authRegisterForm?.classList.add('hidden');
        if (this.dom.authModalTitle) this.dom.authModalTitle.textContent = 'Welcome Back to SuperMart SAS';
        if (this.dom.authModalSub) this.dom.authModalSub.textContent = 'Sign in to access your saved orders, live cart, and verified bills';
      } else {
        this.dom.tabBtnRegister?.classList.add('active');
        this.dom.tabBtnLogin?.classList.remove('active');
        this.dom.authRegisterForm?.classList.remove('hidden');
        this.dom.authLoginForm?.classList.add('hidden');
        if (this.dom.authModalTitle) this.dom.authModalTitle.textContent = 'Create New Buyer Account';
        if (this.dom.authModalSub) this.dom.authModalSub.textContent = 'Register with your verified details for seamless supermarket checkout';
      }
    }

    async handleLoginSubmit() {
      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;

      if (!email || !password) {
        this.showAuthAlert('Please enter both email and password.', 'error');
        return;
      }

      const submitBtn = document.getElementById('btnLoginSubmit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';
      }

      try {
        const res = await this.api.post('/auth/login', { email, password });
        if (res.ok && res.data && res.data.success) {
          this.token = res.data.token;
          this.api.setToken(this.token);
          this.currentUser = res.data.buyer || res.data.user || {};
          this.profile = {
            name: this.currentUser.name || email.split('@')[0],
            email: this.currentUser.email || email,
            phone: this.currentUser.phone || '+91 98765 43210',
            city: this.currentUser.city || 'Kolkata, West Bengal',
            address: this.currentUser.address || 'Salt Lake Sector V, Kolkata'
          };
          this.saveToStorage('sms_buyer_profile', this.profile);
          this.updateAuthUI(true);
          this.closeAuthModal();
          this.showToast(`Welcome back, ${this.profile.name}!`, 'success');

          // Sync remote data
          await this.loadRemoteDashboardStats();
          await this.loadRemoteOrders();
          await this.loadRemoteWishlist();
        } else {
          this.showAuthAlert(res.data?.message || 'Login failed. Please verify credentials.', 'error');
        }
      } catch (err) {
        console.error('[Login Error]', err);
        this.showAuthAlert('Unable to reach backend server. Please verify Express server is running on port 5000.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In to Buyer Portal';
        }
      }
    }

    async handleRegisterSubmit() {
      const name = document.getElementById('regName')?.value.trim();
      const phone = document.getElementById('regPhone')?.value.trim();
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value;
      const confirmPassword = document.getElementById('regConfirmPassword')?.value;
      const city = document.getElementById('regCity')?.value.trim();
      const address = document.getElementById('regAddress')?.value.trim();

      if (!name || !phone || !email || !password || !confirmPassword) {
        this.showAuthAlert('All fields marked are required.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        this.showAuthAlert('Passwords do not match. Please re-enter.', 'error');
        return;
      }

      if (password.length < 8) {
        this.showAuthAlert('Password must be at least 8 characters long.', 'error');
        return;
      }

      const submitBtn = document.getElementById('btnRegisterSubmit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
      }

      try {
        const res = await this.api.post('/auth/register', {
          name,
          phone,
          email,
          password,
          confirmPassword,
          city,
          address
        });

        if (res.ok && res.data && res.data.success) {
          this.token = res.data.token;
          this.api.setToken(this.token);
          this.currentUser = res.data.buyer || res.data.user || {};
          this.profile = {
            name: this.currentUser.name || name,
            email: this.currentUser.email || email,
            phone: this.currentUser.phone || phone,
            city: this.currentUser.city || city,
            address: this.currentUser.address || address
          };
          this.saveToStorage('sms_buyer_profile', this.profile);
          this.updateAuthUI(true);
          this.closeAuthModal();
          this.showToast(`Account created! Welcome to SuperMart, ${this.profile.name}.`, 'success');

          // Initialize fresh dashboard
          this.orders = [];
          this.wishlist = [];
          this.renderOrders();
          this.renderTransactions();
          this.updateBadgesAndStats();
        } else {
          this.showAuthAlert(res.data?.message || 'Registration failed.', 'error');
        }
      } catch (err) {
        console.error('[Register Error]', err);
        this.showAuthAlert('Error connecting to backend during registration.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Buyer Account';
        }
      }
    }

    showAuthAlert(message, type = 'error') {
      if (!this.dom.authAlertBox) return;
      this.dom.authAlertBox.className = `auth-alert ${type}`;
      this.dom.authAlertBox.textContent = message;
      this.dom.authAlertBox.classList.remove('hidden');
    }

    logout() {
      this.api.setToken(null);
      this.token = null;
      this.currentUser = null;
      this.updateAuthUI(false);
      this.showToast('You have been signed out. Welcome back anytime!', 'info');
      this.navigate('dashboard');
    }

    /* ==========================================================================
       NAVIGATION & VIEW SWITCHING
       ========================================================================== */
    navigate(viewName, updateHash = true) {
      this.currentView = viewName;

      this.dom.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-view') === viewName);
      });

      this.dom.viewSections.forEach(section => {
        section.classList.toggle('active', section.id === `view-${viewName}`);
      });

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
      if (this.dom.currentBreadcrumb) this.dom.currentBreadcrumb.textContent = title;
      if (this.dom.pageHeadingTitle) this.dom.pageHeadingTitle.textContent = title;

      if (updateHash) {
        window.location.hash = viewName;
      }

      if (viewName === 'cart') this.renderCart();
      if (viewName === 'checkout') this.renderCheckout();
      if (viewName === 'orders') this.renderOrders();
      if (viewName === 'transactions') this.renderTransactions();
      if (viewName === 'profile') this.renderProfile();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleSidebarMobile() {
      this.dom.sidebar?.classList.toggle('open');
      this.dom.sidebarOverlay?.classList.toggle('active');
    }

    closeSidebarMobile() {
      this.dom.sidebar?.classList.remove('open');
      this.dom.sidebarOverlay?.classList.remove('active');
    }

    /* ==========================================================================
       GLOBAL RENDER & STATS
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

      if (this.dom.topCartBadge) this.dom.topCartBadge.textContent = totalCartQty;
      if (this.dom.navCartCountBadge) this.dom.navCartCountBadge.textContent = totalCartQty;
      if (this.dom.navProductCountBadge) this.dom.navProductCountBadge.textContent = this.products.length;
      if (this.dom.heroCartCount) this.dom.heroCartCount.textContent = totalCartQty;

      if (this.dom.statCartItems) this.dom.statCartItems.textContent = totalCartQty;
      if (this.dom.statCartTotal) this.dom.statCartTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
      if (this.dom.statTotalOrders) this.dom.statTotalOrders.textContent = this.orders.length;
      if (this.dom.statSavedItems) this.dom.statSavedItems.textContent = this.wishlist.length;

      if (this.dom.profileStatOrders) this.dom.profileStatOrders.textContent = this.orders.length;
      if (this.dom.profileStatSaved) this.dom.profileStatSaved.textContent = this.wishlist.length;
      const lifetimeSpend = this.orders.reduce((sum, o) => sum + o.grandTotal, 0);
      if (this.dom.profileStatSpent) {
        this.dom.profileStatSpent.textContent = `₹${lifetimeSpend >= 1000 ? (lifetimeSpend / 1000).toFixed(1) + 'k' : lifetimeSpend.toFixed(0)}`;
      }
      if (this.dom.lifetimeSpendAmount) {
        this.dom.lifetimeSpendAmount.textContent = `₹${lifetimeSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      }

      this.saveToStorage('sms_buyer_cart', this.cart);
      this.saveToStorage('sms_buyer_orders', this.orders);
      this.saveToStorage('sms_buyer_wishlist', this.wishlist);
    }

    /* ==========================================================================
       DASHBOARD OVERVIEW RENDERING
       ========================================================================== */
    renderDashboard() {
      const popularProducts = this.products.filter(p => p.isPopular).slice(0, 4);
      if (this.dom.dashboardPopularProductsGrid) {
        this.dom.dashboardPopularProductsGrid.innerHTML = popularProducts.map(p => this.createProductCardHtml(p)).join('');
        this.bindProductCardActions(this.dom.dashboardPopularProductsGrid);
      }

      const recentOrders = this.orders.slice(0, 3);
      if (this.dom.dashboardRecentOrdersMini) {
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
      }
    }

    /* ==========================================================================
       CATALOGUE RENDERING & FILTER ENGINE
       ========================================================================== */
    renderCatalog() {
      let filtered = [...this.products];

      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.activeCategory);
      }

      if (this.searchQuery) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(this.searchQuery) ||
          p.brand.toLowerCase().includes(this.searchQuery) ||
          p.category.toLowerCase().includes(this.searchQuery)
        );
      }

      if (this.inStockOnly) {
        filtered = filtered.filter(p => p.inStock && p.stockCount > 0);
      }

      if (this.showWishlistOnly) {
        filtered = filtered.filter(p => this.wishlist.includes(p.id) || this.wishlist.includes(p.sku));
      }

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
        default:
          filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
      }

      if (this.dom.catalogVisibleCount) {
        this.dom.catalogVisibleCount.textContent = filtered.length;
      }

      if (filtered.length === 0) {
        if (this.dom.catalogProductsGrid) this.dom.catalogProductsGrid.innerHTML = '';
        this.dom.emptyCatalogState?.classList.remove('hidden');
      } else {
        this.dom.emptyCatalogState?.classList.add('hidden');
        if (this.dom.catalogProductsGrid) {
          this.dom.catalogProductsGrid.innerHTML = filtered.map(p => this.createProductCardHtml(p)).join('');
          this.bindProductCardActions(this.dom.catalogProductsGrid);
        }
      }
    }

    createProductCardHtml(product) {
      const isFavorited = this.wishlist.includes(product.id) || this.wishlist.includes(product.sku);
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
        const product = this.products.find(p => p.id === prodId || p.sku === prodId);
        if (!product) return;

        const qtyValElem = card.querySelector('[data-qty-val]');

        card.querySelector('[data-action="qty-plus"]')?.addEventListener('click', () => {
          let current = parseInt(qtyValElem.textContent, 10) || 1;
          if (current < product.stockCount) {
            qtyValElem.textContent = current + 1;
          } else {
            this.showToast(`Maximum stock of ${product.name} reached (${product.stockCount} units).`, 'warning');
          }
        });

        card.querySelector('[data-action="qty-minus"]')?.addEventListener('click', () => {
          let current = parseInt(qtyValElem.textContent, 10) || 1;
          if (current > 1) {
            qtyValElem.textContent = current - 1;
          }
        });

        card.querySelector('[data-action="add-to-cart"]')?.addEventListener('click', () => {
          const qty = parseInt(qtyValElem.textContent, 10) || 1;
          this.addToCart(product, qty);
        });

        card.querySelector('[data-action="wishlist"]')?.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleWishlist(product.id || product.sku);
        });

        card.querySelector('[data-action="quickview"]')?.addEventListener('click', () => {
          this.showProductQuickView(product);
        });
      });
    }

    resetFilters() {
      this.activeCategory = 'all';
      this.searchQuery = '';
      if (this.dom.catalogSearchInput) this.dom.catalogSearchInput.value = '';
      if (this.dom.sortSelector) this.dom.sortSelector.value = 'popular';
      this.sortBy = 'popular';
      if (this.dom.inStockOnlyCheckbox) this.dom.inStockOnlyCheckbox.checked = false;
      this.inStockOnly = false;
      this.showWishlistOnly = false;
      this.dom.btnShowWishlistOnly?.classList.remove('active');
      if (this.dom.wishlistFilterText) this.dom.wishlistFilterText.textContent = 'Saved Items';
      
      this.dom.categoryTabs?.querySelectorAll('.category-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.category === 'all');
      });

      this.renderCatalog();
      this.showToast('All product filters have been reset.', 'info');
    }

    showWishlistFilter() {
      this.navigate('products');
      this.showWishlistOnly = true;
      this.dom.btnShowWishlistOnly?.classList.add('active');
      if (this.dom.wishlistFilterText) this.dom.wishlistFilterText.textContent = 'Showing Saved';
      this.renderCatalog();
    }

    async toggleWishlist(productId) {
      const product = this.products.find(p => p.id === productId || p.sku === productId);
      const isSaved = this.wishlist.includes(productId);

      if (this.isBackendOnline && this.token) {
        try {
          if (isSaved) {
            await this.api.delete(`/wishlist/${productId}`);
          } else {
            await this.api.post(`/wishlist/${productId}`);
          }
        } catch (e) {
          console.warn('[Backend] Wishlist sync error:', e);
        }
      }

      const idx = this.wishlist.indexOf(productId);
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
       GLOBAL TOPBAR SEARCH
       ========================================================================== */
    handleGlobalSearch(query) {
      const q = query.toLowerCase().trim();
      if (!q) {
        if (this.dom.clearSearchBtn) this.dom.clearSearchBtn.style.display = 'none';
        this.dom.searchDropdown?.classList.remove('show');
        return;
      }

      if (this.dom.clearSearchBtn) this.dom.clearSearchBtn.style.display = 'block';
      const matches = this.products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        if (this.dom.searchDropdown) {
          this.dom.searchDropdown.innerHTML = `<div style="padding:1rem; font-size:0.85rem; color:#6b7280; text-align:center;">No supermarket items found matching "${query}"</div>`;
        }
      } else {
        if (this.dom.searchDropdown) {
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
              const targetProduct = this.products.find(p => p.id === pid || p.sku === pid);
              if (targetProduct) {
                this.dom.searchDropdown.classList.remove('show');
                this.showProductQuickView(targetProduct);
              }
            });
          });
        }
      }

      this.dom.searchDropdown?.classList.add('show');
    }

    /* ==========================================================================
       SHOPPING CART MANAGEMENT
       ========================================================================== */
    addToCart(product, quantity = 1) {
      if (!product.inStock || product.stockCount === 0) {
        this.showToast(`Sorry, ${product.name} is currently out of stock.`, 'danger');
        return;
      }

      const existing = this.cart.find(item => item.product.id === product.id || item.product.sku === product.sku);
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
      const item = this.cart.find(i => i.product.id === productId || i.product.sku === productId);
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
      const item = this.cart.find(i => i.product.id === productId || i.product.sku === productId);
      this.cart = this.cart.filter(i => i.product.id !== productId && i.product.sku !== productId);
      if (item) {
        this.showToast(`Removed ${item.product.name} from basket.`, 'info');
      }
      this.updateBadgesAndStats();
      this.renderCart();
    }

    clearCart() {
      if (this.cart.length === 0) return;
      this.cart = [];
      this.appliedDiscount = 0;
      this.appliedCouponCode = '';
      this.showToast('Shopping basket has been emptied.', 'info');
      this.updateBadgesAndStats();
      this.renderCart();
    }

    calculateTotals() {
      const subtotal = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const discount = subtotal * this.appliedDiscount;
      const discountedSubtotal = Math.max(0, subtotal - discount);
      const gst = discountedSubtotal * 0.05; // Assignment assumption: 5% simplified GST
      const grandTotal = discountedSubtotal + gst;

      return {
        subtotal,
        discount,
        discountedSubtotal,
        gst,
        grandTotal
      };
    }

    renderCart() {
      if (this.cart.length === 0) {
        this.dom.cartLayoutContainer?.classList.add('hidden');
        this.dom.emptyCartState?.classList.remove('hidden');
        this.dom.cartItemsTally && (this.dom.cartItemsTally.textContent = '0 items in your basket');
        return;
      }

      this.dom.cartLayoutContainer?.classList.remove('hidden');
      this.dom.emptyCartState?.classList.add('hidden');

      if (this.dom.cartTableBody) {
        this.dom.cartTableBody.innerHTML = this.cart.map(item => {
          const p = item.product;
          const itemTotal = p.price * item.quantity;
          return `
            <tr data-cart-prod-id="${p.id || p.sku}">
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

        this.dom.cartTableBody.querySelectorAll('tr').forEach(row => {
          const prodId = row.getAttribute('data-cart-prod-id');
          const item = this.cart.find(i => i.product.id === prodId || i.product.sku === prodId);
          if (!item) return;

          row.querySelector('[data-cart-action="plus"]')?.addEventListener('click', () => {
            this.updateCartQuantity(prodId, item.quantity + 1);
          });

          row.querySelector('[data-cart-action="minus"]')?.addEventListener('click', () => {
            this.updateCartQuantity(prodId, item.quantity - 1);
          });

          row.querySelector('[data-cart-action="remove"]')?.addEventListener('click', () => {
            this.removeFromCart(prodId);
          });
        });
      }

      const totals = this.calculateTotals();
      const totalItems = this.cart.reduce((s, i) => s + i.quantity, 0);
      if (this.dom.cartItemsTally) {
        this.dom.cartItemsTally.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'} in your basket`;
      }

      if (this.dom.summarySubtotal) this.dom.summarySubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
      if (this.dom.summaryGst) this.dom.summaryGst.textContent = `₹${totals.gst.toFixed(2)}`;
      
      if (totals.discount > 0) {
        this.dom.summaryDiscountRow?.classList.remove('hidden');
        if (this.dom.summaryDiscount) this.dom.summaryDiscount.textContent = `-₹${totals.discount.toFixed(2)}`;
        this.dom.appliedCouponPill?.classList.remove('hidden');
        if (this.dom.couponText) this.dom.couponText.textContent = `${this.appliedCouponCode} (${(this.appliedDiscount * 100).toFixed(0)}% OFF)`;
      } else {
        this.dom.summaryDiscountRow?.classList.add('hidden');
        this.dom.appliedCouponPill?.classList.add('hidden');
      }

      if (this.dom.summaryGrandTotal) this.dom.summaryGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
    }

    applyCoupon() {
      const code = this.dom.couponInput?.value.trim().toUpperCase();
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

      if (this.dom.couponInput) this.dom.couponInput.value = '';
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
       CHECKOUT & ORDER CREATION (BACKEND INTEGRATED)
       ========================================================================== */
    renderCheckout() {
      if (this.cart.length === 0) {
        this.navigate('cart');
        return;
      }

      if (this.dom.checkoutBuyerName) this.dom.checkoutBuyerName.value = this.profile.name;
      if (this.dom.checkoutMobile) this.dom.checkoutMobile.value = this.profile.phone;
      if (this.dom.checkoutAddress) this.dom.checkoutAddress.value = this.profile.address;

      if (this.dom.checkoutItemsMiniList) {
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
      }

      const totals = this.calculateTotals();
      if (this.dom.checkoutSubtotal) this.dom.checkoutSubtotal.textContent = `₹${totals.subtotal.toFixed(2)}`;
      if (this.dom.checkoutGst) this.dom.checkoutGst.textContent = `₹${totals.gst.toFixed(2)}`;

      if (totals.discount > 0) {
        this.dom.checkoutDiscountRow?.classList.remove('hidden');
        if (this.dom.checkoutDiscount) this.dom.checkoutDiscount.textContent = `-₹${totals.discount.toFixed(2)}`;
      } else {
        this.dom.checkoutDiscountRow?.classList.add('hidden');
      }

      if (this.dom.checkoutGrandTotal) this.dom.checkoutGrandTotal.textContent = `₹${totals.grandTotal.toFixed(2)}`;
    }

    async generateAndShowBill() {
      if (this.cart.length === 0) {
        this.showToast('Cannot generate bill for empty cart!', 'warning');
        return;
      }

      const buyerName = this.dom.checkoutBuyerName?.value.trim() || this.profile.name;
      const paymentModeInput = document.querySelector('input[name="paymentMethod"]:checked');
      const paymentMethod = paymentModeInput ? paymentModeInput.value : 'Cash';
      const address = this.dom.checkoutAddress?.value.trim() || this.profile.address;

      // When backend is online, authenticate and place order on Express/MongoDB
      if (this.isBackendOnline) {
        if (!this.token) {
          this.showToast('Please sign in or create an account to place and save orders.', 'warning');
          this.openAuthModal();
          return;
        }

        const orderPayload = {
          items: this.cart.map(item => ({
            product: item.product.id || item.product.sku,
            quantity: item.quantity,
            unitPrice: item.product.price
          })),
          paymentMethod,
          shippingAddress: {
            fullName: buyerName,
            phone: this.dom.checkoutMobile?.value.trim() || this.profile.phone,
            addressLine: address,
            city: this.profile.city || 'Kolkata'
          },
          couponCode: this.appliedCouponCode || undefined
        };

        const genBtn = this.dom.btnGenerateBill;
        if (genBtn) {
          genBtn.disabled = true;
          genBtn.textContent = 'Processing POS Order...';
        }

        try {
          const res = await this.api.post('/orders', orderPayload);
          if (res.ok && res.data && res.data.success) {
            const savedOrder = res.data.order;
            const invoiceNo = savedOrder.invoiceNumber || savedOrder.orderNumber;
            const formattedDate = new Date(savedOrder.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) + ' ' + new Date(savedOrder.createdAt).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit'
            });

            // Populate thermal bill modal
            this.populateReceiptModal({
              invoiceNo,
              formattedDate,
              buyerName,
              paymentMethod,
              items: savedOrder.items.map(i => ({
                name: i.productName,
                quantity: i.quantity,
                price: i.unitPrice,
                total: i.lineTotal
              })),
              subtotal: savedOrder.subtotal,
              gst: savedOrder.gst,
              discount: savedOrder.discount || 0,
              grandTotal: savedOrder.grandTotal
            });

            // Update local state and backend statistics
            this.cart = [];
            this.appliedDiscount = 0;
            this.appliedCouponCode = '';
            this.updateBadgesAndStats();
            this.renderCart();

            await this.loadRemoteOrders();
            await this.loadRemoteDashboardStats();
            await this.loadRemoteProducts();

            this.openModal('receiptModalOverlay');
            this.showToast(`Order ${invoiceNo} saved in MongoDB database!`, 'success');
            return;
          } else {
            this.showToast(res.data.message || 'Checkout failed on server.', 'danger');
            return;
          }
        } catch (err) {
          console.error('[Checkout Error]', err);
          this.showToast('Server error while saving order. Falling back to local receipt.', 'warning');
        } finally {
          if (genBtn) {
            genBtn.disabled = false;
            genBtn.textContent = 'Complete Order & Generate Bill';
          }
        }
      }

      // Offline fallback: simulate realistic order locally
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

      this.orders.unshift(newOrder);

      this.populateReceiptModal({
        invoiceNo,
        formattedDate,
        buyerName,
        paymentMethod,
        items: this.cart.map(i => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          total: i.product.price * i.quantity
        })),
        subtotal: totals.subtotal,
        gst: totals.gst,
        discount: totals.discount,
        grandTotal: totals.grandTotal
      });

      this.cart = [];
      this.appliedDiscount = 0;
      this.appliedCouponCode = '';

      this.updateBadgesAndStats();
      this.renderCart();
      this.renderOrders();
      this.renderTransactions();

      this.openModal('receiptModalOverlay');
      this.showToast(`Order ${invoiceNo} generated!`, 'success');
    }

    populateReceiptModal({ invoiceNo, formattedDate, buyerName, paymentMethod, items, subtotal, gst, discount, grandTotal }) {
      const invElem = document.getElementById('receiptInvoiceNo');
      if (invElem) invElem.textContent = invoiceNo;
      const dateElem = document.getElementById('receiptDateTime');
      if (dateElem) dateElem.textContent = formattedDate;
      const nameElem = document.getElementById('receiptCustomerName');
      if (nameElem) nameElem.textContent = buyerName;
      const payElem = document.getElementById('receiptPayMethod');
      if (payElem) payElem.textContent = `${paymentMethod} POS`;
      const barElem = document.getElementById('receiptBarcodeNumber');
      if (barElem) barElem.textContent = `*${invoiceNo}-BYR*`;

      const receiptTableBody = document.getElementById('receiptTableBody');
      if (receiptTableBody) {
        receiptTableBody.innerHTML = items.map(item => `
          <tr>
            <td class="text-left">${item.name}</td>
            <td class="text-center">${item.quantity || item.qty}</td>
            <td class="text-right">₹${Number(item.price).toFixed(2)}</td>
            <td class="text-right">₹${Number(item.total || (item.price * (item.quantity || item.qty))).toFixed(2)}</td>
          </tr>
        `).join('');
      }

      const subElem = document.getElementById('receiptSubtotal');
      if (subElem) subElem.textContent = `₹${Number(subtotal).toFixed(2)}`;
      const gstElem = document.getElementById('receiptGst');
      if (gstElem) gstElem.textContent = `₹${Number(gst).toFixed(2)}`;
      
      const discountRow = document.getElementById('receiptDiscountRow');
      if (discount > 0) {
        discountRow?.classList.remove('hidden');
        const discElem = document.getElementById('receiptDiscount');
        if (discElem) discElem.textContent = `-₹${Number(discount).toFixed(2)}`;
      } else {
        discountRow?.classList.add('hidden');
      }

      const grandElem = document.getElementById('receiptGrandTotal');
      if (grandElem) grandElem.textContent = `₹${Number(grandTotal).toFixed(2)}`;
    }

    viewReceiptForOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) return;

      this.populateReceiptModal({
        invoiceNo: order.id,
        formattedDate: order.date,
        buyerName: this.profile.name,
        paymentMethod: order.paymentMethod,
        items: order.items,
        subtotal: order.subtotal,
        gst: order.gst,
        discount: order.discount || 0,
        grandTotal: order.grandTotal
      });

      this.openModal('receiptModalOverlay');
    }

    /* ==========================================================================
       MY ORDERS & TRANSACTIONS
       ========================================================================== */
    renderOrders() {
      if (this.dom.ordersCountBadge) this.dom.ordersCountBadge.textContent = this.orders.length;
      if (this.dom.ordersTableBody) {
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
    }

    renderTransactions(filterQuery = '') {
      let filtered = [...this.orders];
      if (filterQuery) {
        filtered = filtered.filter(o => 
          o.id.toLowerCase().includes(filterQuery) ||
          o.paymentMethod.toLowerCase().includes(filterQuery)
        );
      }

      if (this.dom.transactionsTableBody) {
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
    }

    /* ==========================================================================
       BUYER PROFILE MANAGEMENT
       ========================================================================== */
    renderProfile() {
      if (this.dom.profileCardName) this.dom.profileCardName.textContent = this.profile.name;
      if (this.dom.profileCardEmail) this.dom.profileCardEmail.textContent = this.profile.email;
      if (this.dom.topUserName) this.dom.topUserName.textContent = this.profile.name;
      if (this.dom.welcomeUserName) this.dom.welcomeUserName.textContent = this.profile.name.split(' ')[0] || 'Buyer';

      if (this.dom.profileInputName) this.dom.profileInputName.value = this.profile.name;
      if (this.dom.profileInputEmail) this.dom.profileInputEmail.value = this.profile.email;
      if (this.dom.profileInputPhone) this.dom.profileInputPhone.value = this.profile.phone;
      if (this.dom.profileInputCity) this.dom.profileInputCity.value = this.profile.city;
      if (this.dom.profileInputAddress) this.dom.profileInputAddress.value = this.profile.address;
    }

    async saveProfile() {
      const updatedProfile = {
        name: this.dom.profileInputName?.value.trim() || 'Yash Kumar',
        email: this.dom.profileInputEmail?.value.trim() || 'yash@example.com',
        phone: this.dom.profileInputPhone?.value.trim() || '+91 98765 43210',
        city: this.dom.profileInputCity?.value.trim() || 'Kolkata, West Bengal',
        address: this.dom.profileInputAddress?.value.trim() || 'Salt Lake Sector V, Kolkata'
      };

      if (this.isBackendOnline && this.token) {
        try {
          const res = await this.api.patch('/profile', {
            name: updatedProfile.name,
            phone: updatedProfile.phone,
            city: updatedProfile.city,
            address: updatedProfile.address
          });
          if (res.ok && res.data && res.data.success) {
            this.profile = {
              ...this.profile,
              ...res.data.buyer
            };
            this.saveToStorage('sms_buyer_profile', this.profile);
            this.renderProfile();
            this.showToast('Profile updated in MongoDB database!', 'success');
            return;
          }
        } catch (e) {
          console.warn('[Backend] Profile update failed:', e);
        }
      }

      this.profile = updatedProfile;
      this.saveToStorage('sms_buyer_profile', this.profile);
      this.renderProfile();
      this.showToast('Buyer profile settings updated locally.', 'success');
    }

    /* ==========================================================================
       PRODUCT QUICK VIEW MODAL
       ========================================================================== */
    showProductQuickView(product) {
      const isFavorited = this.wishlist.includes(product.id) || this.wishlist.includes(product.sku);
      const quickViewContent = document.getElementById('quickViewContent');
      if (quickViewContent) {
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
          this.toggleWishlist(product.id || product.sku);
          this.closeModal('productModalOverlay');
        });

        this.openModal('productModalOverlay');
      }
    }

    /* ==========================================================================
       MODAL CONTROLS & RESET HELPER
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
        localStorage.removeItem('sms_auth_token');
        location.reload();
      }
    }

    /* ==========================================================================
       TOAST NOTIFICATION ENGINE
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

      if (this.dom.toastContainer) {
        this.dom.toastContainer.appendChild(toast);
      }

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
