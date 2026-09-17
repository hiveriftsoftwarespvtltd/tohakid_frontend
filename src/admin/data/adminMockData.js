// Admin Mock Seed Data for Tohay Kids E-Commerce Admin Dashboard

export const adminCategories = [
  {
    id: 'cat-1',
    name: 'Girls Ethnicwear & Lehenga',
    slug: 'girls-ethnicwear',
    parentCategory: 'Girls',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=400&q=80',
    productsCount: 42,
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'cat-2',
    name: 'Boys Festive Kurtas & Jackets',
    slug: 'boys-festive-kurtas',
    parentCategory: 'Boys',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=400&q=80',
    productsCount: 38,
    status: 'Active',
    createdAt: '2026-01-15'
  },
  {
    id: 'cat-3',
    name: 'Sibling Matching Sets',
    slug: 'sibling-matching-sets',
    parentCategory: 'Siblings',
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80',
    productsCount: 24,
    status: 'Active',
    createdAt: '2026-02-01'
  },
  {
    id: 'cat-4',
    name: 'New Arrivals Edit',
    slug: 'new-arrivals-edit',
    parentCategory: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    productsCount: 31,
    status: 'Active',
    createdAt: '2026-02-10'
  },
  {
    id: 'cat-5',
    name: 'Shop By Age (0 to 16 Years)',
    slug: 'shop-by-age',
    parentCategory: 'Shop By Age',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    productsCount: 65,
    status: 'Active',
    createdAt: '2026-02-12'
  },
  {
    id: 'cat-6',
    name: 'Festive & Wedding Collections',
    slug: 'festive-wedding-collections',
    parentCategory: 'Collections',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=400&q=80',
    productsCount: 48,
    status: 'Active',
    createdAt: '2026-02-15'
  },
  {
    id: 'cat-7',
    name: 'Sale (Up to 50% OFF)',
    slug: 'sale-specials',
    parentCategory: 'Sale',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=400&q=80',
    productsCount: 28,
    status: 'Active',
    createdAt: '2026-02-18'
  },
  {
    id: 'cat-8',
    name: 'Kids Juttis & Accessories',
    slug: 'accessories-juttis',
    parentCategory: 'Accessories',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=400&q=80',
    productsCount: 19,
    status: 'Active',
    createdAt: '2026-02-20'
  }
];

export const adminBrands = [
  { id: 'b-1', name: 'Tohay Heritage', code: 'TH-HERITAGE', productsCount: 45, status: 'Active' },
  { id: 'b-[#2]', name: 'Little Royal', code: 'TH-ROYAL', productsCount: 32, status: 'Active' },
  { id: 'b-3', name: 'Festive Blooms', code: 'TH-BLOOM', productsCount: 28, status: 'Active' },
  { id: 'b-4', name: 'Junior Silk', code: 'TH-SILK', productsCount: 19, status: 'Active' }
];

export const adminOrdersData = [
  {
    id: 'TH-10495',
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@gmail.com',
    customerPhone: '+91 98234 11223',
    itemsCount: 3,
    items: [
      { id: 'th-101', name: 'Floral Orange Lehenga Choli', qty: 1, price: 2352, size: '4-6Y', image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=200&q=80' },
      { id: 'th-103', name: 'Royal Blue Silk Kurta Pyjama', qty: 2, price: 1799, size: '6-8Y', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=200&q=80' }
    ],
    date: '2026-08-14 09:30 AM',
    subtotal: 5950,
    discount: 500,
    shipping: 0,
    tax: 272,
    totalAmount: 5722,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Successful',
    orderStatus: 'Processing',
    shippingAddress: {
      flat: 'Flat 302, Green Valley Apartments',
      street: 'Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034'
    },
    timeline: [
      { status: 'Placed', date: '2026-08-14 09:30 AM', completed: true, note: 'Order placed by customer' },
      { status: 'Confirmed', date: '2026-08-14 09:32 AM', completed: true, note: 'Payment verified via PhonePe' },
      { status: 'Processing', date: '2026-08-14 10:00 AM', completed: true, note: 'Item being packed in warehouse' },
      { status: 'Shipped', date: 'Pending', completed: false, note: 'Awaiting courier pickup' },
      { status: 'Delivered', date: 'Pending', completed: false, note: 'Estimated delivery Aug 16' }
    ]
  },
  {
    id: 'TH-10494',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@gmail.com',
    customerPhone: '+91 98112 33445',
    itemsCount: 2,
    items: [
      { id: 'th-102', name: 'Pastel Pink Party Gown', qty: 1, price: 2199, size: '2-4Y', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=200&q=80' },
      { id: 'th-105', name: 'Embroidered Yellow Sharara Set', qty: 1, price: 2499, size: '2-4Y', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80' }
    ],
    date: '2026-08-13 04:15 PM',
    subtotal: 4698,
    discount: 350,
    shipping: 0,
    tax: 217,
    totalAmount: 4565,
    paymentMethod: 'Credit Card (HDFC)',
    paymentStatus: 'Successful',
    orderStatus: 'Shipped',
    shippingAddress: {
      flat: 'House No 14B, Model Town',
      street: 'Near Metro Station',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110009'
    },
    timeline: [
      { status: 'Placed', date: '2026-08-13 04:15 PM', completed: true, note: 'Order confirmed' },
      { status: 'Confirmed', date: '2026-08-13 04:16 PM', completed: true, note: 'Payment pre-authorized' },
      { status: 'Processing', date: '2026-08-13 06:30 PM', completed: true, note: 'Quality check passed' },
      { status: 'Shipped', date: '2026-08-14 08:00 AM', completed: true, note: 'Handed over to BlueDart AWB #884920' },
      { status: 'Delivered', date: 'Pending', completed: false, note: 'Expected today by 6 PM' }
    ]
  },
  {
    id: 'TH-10493',
    customerName: 'Rohan Verma',
    customerEmail: 'rohan.v@yahoo.com',
    customerPhone: '+91 97445 66778',
    itemsCount: 1,
    items: [
      { id: 'th-104', name: 'Velvet Nehru Jacket Set', qty: 1, price: 2899, size: '7-8Y', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80' }
    ],
    date: '2026-08-12 11:20 AM',
    subtotal: 2899,
    discount: 0,
    shipping: 99,
    tax: 145,
    totalAmount: 3143,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Delivered',
    shippingAddress: {
      flat: 'B-405, Horizon Towers',
      street: 'SG Highway',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054'
    },
    timeline: [
      { status: 'Placed', date: '2026-08-12 11:20 AM', completed: true, note: 'Order placed COD' },
      { status: 'Confirmed', date: '2026-08-12 11:25 AM', completed: true, note: 'Phone verification done' },
      { status: 'Processing', date: '2026-08-12 02:00 PM', completed: true, note: 'Packed' },
      { status: 'Shipped', date: '2026-08-13 09:00 AM', completed: true, note: 'Shipped via Delhivery' },
      { status: 'Delivered', date: '2026-08-14 02:30 PM', completed: true, note: 'Delivered & Cash Collected' }
    ]
  },
  {
    id: 'TH-10492',
    customerName: 'Meera Iyer',
    customerEmail: 'meera.iyer@gmail.com',
    customerPhone: '+91 99887 22334',
    itemsCount: 2,
    items: [
      { id: 'th-106', name: 'Mint Green Tissue Silk Lehenga', qty: 1, price: 2699, size: '4-6Y', image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=200&q=80' }
    ],
    date: '2026-08-11 02:45 PM',
    subtotal: 2699,
    discount: 200,
    shipping: 0,
    tax: 125,
    totalAmount: 2624,
    paymentMethod: 'Net Banking',
    paymentStatus: 'Successful',
    orderStatus: 'Pending',
    shippingAddress: {
      flat: 'Flat 1204, Sea Breeze Towers',
      street: 'Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020'
    },
    timeline: [
      { status: 'Placed', date: '2026-08-11 02:45 PM', completed: true, note: 'Order placed' },
      { status: 'Confirmed', date: '2026-08-11 02:46 PM', completed: true, note: 'Net banking payment confirmed' },
      { status: 'Processing', date: 'Pending', completed: false, note: 'Awaiting stock allocation' },
      { status: 'Shipped', date: 'Pending', completed: false, note: '-' },
      { status: 'Delivered', date: 'Pending', completed: false, note: '-' }
    ]
  },
  {
    id: 'TH-10491',
    customerName: 'Karan Kapoor',
    customerEmail: 'karan.k@gmail.com',
    customerPhone: '+91 98776 55443',
    itemsCount: 1,
    items: [
      { id: 'th-107', name: 'Designer Sibling Matching Combo', qty: 1, price: 4299, size: 'Combo 5Y & 7Y', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=200&q=80' }
    ],
    date: '2026-08-10 07:10 PM',
    subtotal: 4299,
    discount: 400,
    shipping: 0,
    tax: 195,
    totalAmount: 4094,
    paymentMethod: 'UPI (Paytm)',
    paymentStatus: 'Refunded',
    orderStatus: 'Cancelled',
    shippingAddress: {
      flat: 'House 88, Sector 15',
      street: 'Chandigarh Main Rd',
      city: 'Chandigarh',
      state: 'Punjab',
      pincode: '160015'
    },
    timeline: [
      { status: 'Placed', date: '2026-08-10 07:10 PM', completed: true, note: 'Order placed' },
      { status: 'Confirmed', date: '2026-08-10 07:11 PM', completed: true, note: 'Payment processed' },
      { status: 'Cancelled', date: '2026-08-11 10:00 AM', completed: true, note: 'Cancelled by customer (Size change needed)' },
      { status: 'Refunded', date: '2026-08-11 11:30 AM', completed: true, note: 'Full refund initiated to Paytm wallet' }
    ]
  }
];

export const adminCustomersData = [
  {
    id: 'cust-101',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@gmail.com',
    phone: '+91 98765 43210',
    ordersCount: 6,
    totalSpent: 18450,
    lastOrderDate: '2026-08-10',
    status: 'Active',
    tier: 'Gold Member',
    registrationDate: '2025-11-12',
    address: 'Sector 62, Noida, UP - 201301',
    coins: 450
  },
  {
    id: 'cust-102',
    name: 'Aarav Patel',
    email: 'aarav.patel@gmail.com',
    phone: '+91 98234 11223',
    ordersCount: 4,
    totalSpent: 12890,
    lastOrderDate: '2026-08-14',
    status: 'Active',
    tier: 'Silver Member',
    registrationDate: '2026-01-20',
    address: 'Koramangala 4th Block, Bengaluru - 560034',
    coins: 220
  },
  {
    id: 'cust-103',
    name: 'Priya Sharma',
    email: 'priya.s@gmail.com',
    phone: '+91 98112 33445',
    ordersCount: 8,
    totalSpent: 26400,
    lastOrderDate: '2026-08-13',
    status: 'Active',
    tier: 'Platinum VIP',
    registrationDate: '2025-08-04',
    address: 'Model Town, Delhi - 110009',
    coins: 890
  },
  {
    id: 'cust-104',
    name: 'Rohan Verma',
    email: 'rohan.v@yahoo.com',
    phone: '+91 97445 66778',
    ordersCount: 2,
    totalSpent: 5200,
    lastOrderDate: '2026-08-12',
    status: 'Active',
    tier: 'Bronze Member',
    registrationDate: '2026-04-18',
    address: 'SG Highway, Ahmedabad - 380054',
    coins: 90
  },
  {
    id: 'cust-105',
    name: 'Meera Iyer',
    email: 'meera.iyer@gmail.com',
    phone: '+91 99887 22334',
    ordersCount: 3,
    totalSpent: 8950,
    lastOrderDate: '2026-08-11',
    status: 'Active',
    tier: 'Silver Member',
    registrationDate: '2026-02-14',
    address: 'Marine Drive, Mumbai - 400020',
    coins: 150
  }
];

export const adminReviewsData = [
  {
    id: 'rev-1',
    productName: 'Floral Orange Lehenga Choli',
    productId: 'th-101',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@gmail.com',
    rating: 5,
    comment: 'Sublime stitch quality! Pure silk touch is very soft on my daughter skin.',
    date: '2026-08-10',
    status: 'Approved'
  },
  {
    id: 'rev-2',
    productName: 'Royal Blue Silk Kurta Pyjama',
    productId: 'th-103',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@gmail.com',
    rating: 5,
    comment: 'The color is vibrant and fit is true to size chart. My son loved it.',
    date: '2026-08-08',
    status: 'Approved'
  },
  {
    id: 'rev-3',
    productName: 'Velvet Nehru Jacket Set',
    productId: 'th-104',
    customerName: 'Sanjay Dutt',
    customerEmail: 'sanjay.d@gmail.com',
    rating: 4,
    comment: 'Very premium packaging and prompt delivery within 2 days.',
    date: '2026-08-07',
    status: 'Pending'
  },
  {
    id: 'rev-4',
    productName: 'Pastel Pink Party Gown',
    productId: 'th-102',
    customerName: 'Kavita Roy',
    customerEmail: 'kavita.r@gmail.com',
    rating: 2,
    comment: 'Color was slightly lighter than phone screen image.',
    date: '2026-08-05',
    status: 'Rejected'
  }
];

export const adminCouponsData = [
  {
    id: 'coup-1',
    code: 'FESTIVE20',
    discountType: 'Percentage',
    discountValue: 20,
    minOrderValue: 1999,
    maxDiscount: 1000,
    usageLimit: 500,
    usedCount: 142,
    startDate: '2026-08-01',
    expiryDate: '2026-09-30',
    status: 'Active'
  },
  {
    id: 'coup-2',
    code: 'WELCOME500',
    discountType: 'Fixed Amount',
    discountValue: 500,
    minOrderValue: 2499,
    maxDiscount: 500,
    usageLimit: 1000,
    usedCount: 618,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'Active'
  },
  {
    id: 'coup-3',
    code: 'SIBLING15',
    discountType: 'Percentage',
    discountValue: 15,
    minOrderValue: 2999,
    maxDiscount: 800,
    usageLimit: 200,
    usedCount: 89,
    startDate: '2026-07-01',
    expiryDate: '2026-08-31',
    status: 'Active'
  },
  {
    id: 'coup-4',
    code: 'FREESHIP',
    discountType: 'Free Shipping',
    discountValue: 99,
    minOrderValue: 999,
    maxDiscount: 99,
    usageLimit: 2000,
    usedCount: 1890,
    startDate: '2026-05-01',
    expiryDate: '2026-08-15',
    status: 'Expired'
  }
];

export const adminReturnsData = [
  {
    id: 'RET-801',
    orderId: 'TH-10491',
    customerName: 'Karan Kapoor',
    customerEmail: 'karan.k@gmail.com',
    productName: 'Designer Sibling Matching Combo',
    reason: 'Size issue - Ordered smaller size',
    refundAmount: 4094,
    requestDate: '2026-08-11',
    status: 'Refunded'
  },
  {
    id: 'RET-802',
    orderId: 'TH-10488',
    customerName: 'Sunita Rao',
    customerEmail: 'sunita.r@gmail.com',
    productName: 'Embroidered Yellow Sharara Set',
    reason: 'Defective zipper',
    refundAmount: 2499,
    requestDate: '2026-08-09',
    status: 'Approved'
  },
  {
    id: 'RET-803',
    orderId: 'TH-10482',
    customerName: 'Vikram Joshi',
    customerEmail: 'vikram.j@gmail.com',
    productName: 'Royal Blue Silk Kurta Pyjama',
    reason: 'Mind changed',
    refundAmount: 1799,
    requestDate: '2026-08-05',
    status: 'Rejected'
  }
];

export const adminBannersData = [
  {
    id: 'ban-1',
    title: 'Festive Special Sale Flat 50% Off',
    placement: 'Homepage Main Hero Carousel',
    link: '/sale',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    status: 'Active'
  },
  {
    id: 'ban-2',
    title: 'New Royal Boys Ethnic Collection',
    placement: 'Boys Category Top Banner',
    link: '/boys',
    imageUrl: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=1000&q=80',
    startDate: '2026-08-05',
    endDate: '2026-10-31',
    status: 'Active'
  },
  {
    id: 'ban-3',
    title: 'Twin Festive Outfits Collection',
    placement: 'Siblings Header Banner',
    link: '/siblings',
    imageUrl: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1000&q=80',
    startDate: '2026-08-10',
    endDate: '2026-11-15',
    status: 'Active'
  }
];

export const adminTransactionsData = [
  {
    id: 'TXN-99104',
    orderId: 'TH-10495',
    customerName: 'Aarav Patel',
    paymentMethod: 'UPI (PhonePe)',
    amount: 5722,
    status: 'Successful',
    date: '2026-08-14 09:32 AM'
  },
  {
    id: 'TXN-99103',
    orderId: 'TH-10494',
    customerName: 'Priya Sharma',
    paymentMethod: 'Credit Card (HDFC)',
    amount: 4565,
    status: 'Successful',
    date: '2026-08-13 04:16 PM'
  },
  {
    id: 'TXN-99102',
    orderId: 'TH-10493',
    customerName: 'Rohan Verma',
    paymentMethod: 'Cash on Delivery',
    amount: 3143,
    status: 'Successful',
    date: '2026-08-14 02:30 PM'
  },
  {
    id: 'TXN-99101',
    orderId: 'TH-10491',
    customerName: 'Karan Kapoor',
    paymentMethod: 'Razorpay Refund',
    amount: 4094,
    status: 'Refunded',
    date: '2026-08-11 11:30 AM'
  }
];

export const adminNotificationsData = [
  {
    id: 'notif-1',
    title: 'New High Value Order #TH-10495',
    message: 'Aarav Patel placed an order worth ₹5,722 via PhonePe',
    time: '15 mins ago',
    type: 'order',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Low Stock Warning',
    message: 'Floral Orange Lehenga Choli has only 3 units left in inventory',
    time: '1 hour ago',
    type: 'inventory',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New Customer Registered',
    message: 'Ananya Sharma created a new parent account',
    time: '3 hours ago',
    type: 'customer',
    read: true
  },
  {
    id: 'notif-4',
    title: '5-Star Review Received',
    message: 'Priya Sharma rated Royal Blue Silk Kurta 5 stars',
    time: 'Yesterday',
    type: 'review',
    read: true
  }
];

export const adminAnalyticsMetrics = {
  totalRevenue: 348500,
  revenueGrowth: '+14.2%',
  totalOrders: 1240,
  ordersGrowth: '+8.7%',
  totalCustomers: 3820,
  customersGrowth: '+19.5%',
  totalProducts: 128,
  activeProducts: 114,
  outOfStockProducts: 14,
  pendingOrdersCount: 18,
  deliveredOrdersCount: 1180,
  cancelledOrdersCount: 42,
  refundAmountTotal: 16400,
  categorySales: [
    { category: 'Girls Ethnicwear', sales: 142000, percentage: 41 },
    { category: 'Boys Festive Kurtas', sales: 108000, percentage: 31 },
    { category: 'Sibling Sets', sales: 65000, percentage: 19 },
    { category: 'Accessories', sales: 33500, percentage: 9 }
  ],
  paymentMethodSplit: [
    { method: 'UPI (GPay / PhonePe)', percentage: 54, amount: 188190 },
    { method: 'Credit/Debit Card', percentage: 26, amount: 90610 },
    { method: 'Cash on Delivery', percentage: 14, amount: 48790 },
    { method: 'Net Banking & Wallets', percentage: 6, amount: 20910 }
  ],
  salesTrend5: {
    'Today': [
      { label: '06:00', value: 1200 },
      { label: '09:00', value: 4500 },
      { label: '12:00', value: 9800 },
      { label: '15:00', value: 14200 },
      { label: '18:00', value: 18900 },
      { label: '21:00', value: 22400 }
    ],
    '7 Days': [
      { label: 'Mon', value: 24000 },
      { label: 'Tue', value: 28500 },
      { label: 'Wed', value: 32000 },
      { label: 'Thu', value: 31000 },
      { label: 'Fri', value: 42000 },
      { label: 'Sat', value: 49000 },
      { label: 'Sun', value: 54000 }
    ],
    '30 Days': [
      { label: 'Week 1', value: 78000 },
      { label: 'Week 2', value: 84000 },
      { label: 'Week 3', value: 92000 },
      { label: 'Week 4', value: 94500 }
    ],
    '3 Months': [
      { label: 'Jun', value: 280000 },
      { label: 'Jul', value: 310000 },
      { label: 'Aug', value: 348500 }
    ],
    '1 Year': [
      { label: 'Q1', value: 680000 },
      { label: 'Q2', value: 820000 },
      { label: 'Q3', value: 940000 },
      { label: 'Q4', value: 1140000 }
    ]
  }
};
