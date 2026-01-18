const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

dotenv.config();

const categories = [
  { name: 'Electronics', description: 'Latest gadgets and electronics' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Home & Garden', description: 'Home improvement and gardening' },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
  { name: 'Books', description: 'Books and publications' },
  { name: 'Toys & Games', description: 'Toys and board games' },
  { name: 'Beauty & Personal Care', description: 'Beauty products and personal care' },
  { name: 'Automotive', description: 'Auto parts and accessories' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Message.deleteMany();
    await Notification.deleteMany();
    console.log('✅ Cleared existing data');

    // Create 3 admins
    const admins = [];
    for (let i = 1; i <= 3; i++) {
      const admin = await User.create({
        name: `Admin ${i}`,
        email: `admin${i}@shophub.com`,
        password: 'Admin@123',
        role: 'admin',
        isEmailVerified: true
      });
      admins.push(admin);
    }
    console.log('✅ 3 Admins created');

    // Create 10 sellers
    const sellers = [];
    for (let i = 1; i <= 10; i++) {
      const seller = await User.create({
        name: `Seller ${i}`,
        email: `seller${i}@shophub.com`,
        password: 'Seller@123',
        role: 'seller',
        isEmailVerified: true
      });
      sellers.push(seller);
    }
    console.log('✅ 10 Sellers created');

    // Create 10 buyers
    const buyers = [];
    for (let i = 1; i <= 10; i++) {
      const buyer = await User.create({
        name: `Buyer ${i}`,
        email: `buyer${i}@shophub.com`,
        password: 'Buyer@123',
        role: 'buyer',
        isEmailVerified: true
      });
      buyers.push(buyer);
    }
    console.log('✅ 10 Buyers created');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Categories created');

    // Create products
    const products = [];
    const productNames = [
      'Wireless Bluetooth Headphones', 'Smartphone 128GB', 'Laptop 15.6 inch', 'Smart Watch',
      'Cotton T-Shirt', 'Denim Jeans', 'Running Shoes', 'Winter Jacket',
      'Coffee Maker', 'Vacuum Cleaner', 'LED Desk Lamp', 'Kitchen Knife Set',
      'Yoga Mat', 'Dumbbell Set', 'Tennis Racket', 'Camping Tent',
      'Best Seller Novel', 'Programming Guide', 'Cookbook', 'Art Supplies',
      'Board Game', 'Action Figure', 'Puzzle Set', 'RC Car',
      'Face Cream', 'Perfume', 'Hair Dryer', 'Makeup Kit',
      'Car Phone Mount', 'Tire Pressure Gauge', 'Car Vacuum', 'Dash Cam'
    ];

    // Each seller creates 10 products (100 total)
    let productIndex = 0;
    for (let sellerIdx = 0; sellerIdx < sellers.length; sellerIdx++) {
      for (let prodIdx = 0; prodIdx < 10; prodIdx++) {
        const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
        const randomName = productNames[Math.floor(Math.random() * productNames.length)];
        const price = Math.floor(Math.random() * 500) + 20;
        const discount = [0, 5, 10, 15, 20, 25][Math.floor(Math.random() * 6)];

        products.push({
          name: `${randomName} (Seller ${sellerIdx + 1})`,
          description: `High quality ${randomName.toLowerCase()} with excellent features. Perfect for everyday use. Comes with warranty and free shipping.`,
          price,
          originalPrice: discount > 0 ? Math.round(price / (1 - discount / 100)) : null,
          discount,
          category: randomCategory._id,
          images: [
            { url: '/uploads/products/placeholder.webp', public_id: `product-${productIndex + 1}` }
          ],
          stock: Math.floor(Math.random() * 100) + 10,
          seller: sellers[sellerIdx]._id,
          rating: (Math.random() * 2 + 3).toFixed(1),
          numReviews: Math.floor(Math.random() * 50),
          isFeatured: productIndex < 10,
          isFlashSale: productIndex % 15 === 0,
          sold: Math.floor(Math.random() * 200)
        });
        productIndex++;
      }
    }

    await Product.insertMany(products);
    console.log('✅ 100 Products created (10 per seller)');

    // Create sample orders (30 orders from last 30 days)
    const orders = [];
    const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'processing', 'pending'];
    
    for (let i = 0; i < 30; i++) {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemPrice = product.price;
        
        orderItems.push({
          product: product._id || product.seller,
          name: product.name,
          price: itemPrice,
          quantity
        });
        subtotal += itemPrice * quantity;
      }

      const shippingCost = 10;
      const tax = subtotal * 0.1;
      const total = subtotal + shippingCost + tax;
      const adminProfit = subtotal * 0.20;

      // Create order with date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - daysAgo);

      orders.push({
        user: buyer._id,
        items: orderItems,
        shippingAddress: {
          fullName: buyer.name,
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          addressLine1: `${Math.floor(Math.random() * 999) + 1} Main Street`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
          state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          country: 'USA'
        },
        paymentMethod: ['credit_card', 'debit_card', 'paypal'][Math.floor(Math.random() * 3)],
        paymentDetails: {
          status: 'completed',
          transactionId: `TXN${Date.now()}${i}`,
          paidAt: orderDate
        },
        subtotal,
        shippingCost,
        tax,
        total,
        adminProfit,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    await Order.insertMany(orders);
    console.log('✅ 30 Sample orders created');

    // Create sample reviews (50 reviews with unique combinations)
    const reviews = [];
    const usedCombinations = new Set();
    
    for (let i = 0; i < 50; i++) {
      let product, buyer, order, combinationKey;
      let attempts = 0;
      
      // Find unique combination
      do {
        product = products[Math.floor(Math.random() * products.length)];
        buyer = buyers[Math.floor(Math.random() * buyers.length)];
        order = orders[Math.floor(Math.random() * orders.length)];
        combinationKey = `${buyer._id}-${product._id || product.seller}-${order._id || order.user}`;
        attempts++;
      } while (usedCombinations.has(combinationKey) && attempts < 100);
      
      if (attempts >= 100) continue; // Skip if can't find unique combination
      
      usedCombinations.add(combinationKey);
      
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
      const titles = [
        'Great Product!',
        'Excellent Quality',
        'Highly Recommended',
        'Perfect Purchase',
        'Amazing Product',
        'Very Satisfied',
        'Best Buy Ever'
      ];
      const comments = [
        'Great product! Highly recommend.',
        'Excellent quality and fast shipping.',
        'Exactly as described. Very satisfied.',
        'Good value for money.',
        'Amazing! Will buy again.',
        'Perfect! Exceeded expectations.',
        'Very happy with this purchase.'
      ];

      reviews.push({
        product: product._id || product.seller,
        user: buyer._id,
        order: order._id || order.user,
        rating,
        title: titles[Math.floor(Math.random() * titles.length)],
        comment: comments[Math.floor(Math.random() * comments.length)],
        verifiedPurchase: true,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    if (reviews.length > 0) {
      await Review.insertMany(reviews);
      console.log(`✅ ${reviews.length} Product reviews created`);
    }

    // Add some items to buyer carts
    for (let i = 0; i < 5; i++) {
      const buyer = buyers[i];
      const cartProducts = [];
      for (let j = 0; j < 3; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        cartProducts.push({
          product: product._id || product.seller,
          quantity: Math.floor(Math.random() * 3) + 1
        });
      }
      await Cart.create({ user: buyer._id, products: cartProducts });
    }
    console.log('✅ 5 Shopping carts created');

    // Add items to wishlists
    for (let i = 0; i < 8; i++) {
      const buyer = buyers[i];
      const wishlistProducts = [];
      for (let j = 0; j < 4; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        wishlistProducts.push({ product: product._id || product.seller });
      }
      await Wishlist.create({ user: buyer._id, products: wishlistProducts });
    }
    console.log('✅ 8 Wishlists created');

    console.log('\n🎉 SmartShop Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍💼 Admins:   admin1-3@shophub.com / Admin@123');
    console.log('🏪 Sellers:  seller1-10@shophub.com / Seller@123');
    console.log('🛒 Buyers:   buyer1-10@shophub.com / Buyer@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Seeded Data Summary:');
    console.log(`  • 3 Admin accounts`);
    console.log(`  • 10 Seller accounts`);
    console.log(`  • 10 Buyer accounts`);
    console.log(`  • 8 Product categories`);
    console.log(`  • 100 Products (10 per seller)`);
    console.log(`  • 30 Orders (last 30 days)`);
    console.log(`  • 50 Product reviews`);
    console.log(`  • 5 Active shopping carts`);
    console.log(`  • 8 Wishlists`);
    console.log('\n✨ Ready to test!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();
