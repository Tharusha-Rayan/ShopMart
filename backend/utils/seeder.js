const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();

const categories = [
  { name: 'Electronics', description: 'Latest gadgets and electronics' },
  { name: 'Fashion', description: 'Fashion and lifestyle products' },
  { name: 'Home Essentials', description: 'Home utility and essentials' }
];

const sellerOneProducts = [
  {
    name: 'AeroSound Wireless Earbuds',
    description: 'Compact wireless earbuds with clear audio and long battery backup.',
    price: 59,
    stock: 120,
    tags: ['audio', 'wireless', 'earbuds']
  },
  {
    name: 'VoltCharge 65W USB-C Adapter',
    description: 'Fast charger compatible with laptops, tablets, and smartphones.',
    price: 39,
    stock: 90,
    tags: ['charger', 'usb-c', 'accessories']
  },
  {
    name: 'Nimbus Smart LED Bulb Pack',
    description: 'Energy-efficient smart bulbs with app and voice control support.',
    price: 29,
    stock: 150,
    tags: ['smart-home', 'lighting', 'electronics']
  },
  {
    name: 'FlexStand Laptop Riser',
    description: 'Ergonomic aluminum stand designed for better posture and airflow.',
    price: 49,
    stock: 80,
    tags: ['laptop', 'office', 'ergonomic']
  },
  {
    name: 'SnapGrip Magnetic Phone Mount',
    description: 'Secure magnetic mount for desks, dashboards, and bedsides.',
    price: 24,
    stock: 110,
    tags: ['mobile', 'mount', 'accessories']
  }
];

const sellerTwoProducts = [
  {
    name: 'UrbanWeave Casual Shirt',
    description: 'Breathable everyday shirt with a modern tailored fit.',
    price: 35,
    stock: 130,
    tags: ['fashion', 'shirt', 'casual']
  },
  {
    name: 'StrideMax Running Shoes',
    description: 'Lightweight running shoes with cushioned sole for daily training.',
    price: 72,
    stock: 95,
    tags: ['shoes', 'sports', 'running']
  },
  {
    name: 'ComfyNest Throw Blanket',
    description: 'Soft microfiber blanket suitable for couch, bed, and travel.',
    price: 28,
    stock: 140,
    tags: ['home', 'blanket', 'comfort']
  },
  {
    name: 'PureSip Stainless Water Bottle',
    description: 'Insulated bottle that keeps drinks cold or hot for hours.',
    price: 22,
    stock: 160,
    tags: ['bottle', 'lifestyle', 'outdoor']
  },
  {
    name: 'KitchenPro Knife Set',
    description: 'Durable 5-piece stainless steel knife set for daily cooking.',
    price: 64,
    stock: 70,
    tags: ['kitchen', 'home', 'cooking']
  }
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
    console.log('✅ Cleared existing data');

    // Create users requested for demo environment
    const admin = await User.create({
      name: 'Admin One',
      email: 'admin1@shophub.com',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true
    });

    const sellers = await User.insertMany([
      {
        name: 'Seller One',
        email: 'seller1@shophub.com',
        password: 'Seller@123',
        role: 'seller',
        isEmailVerified: true
      },
      {
        name: 'Seller Two',
        email: 'seller2@shophub.com',
        password: 'Seller@123',
        role: 'seller',
        isEmailVerified: true
      }
    ]);

    const buyers = await User.insertMany([
      {
        name: 'Buyer One',
        email: 'buyer1@shophub.com',
        password: 'Buyer@123',
        role: 'buyer',
        isEmailVerified: true
      },
      {
        name: 'Buyer Two',
        email: 'buyer2@shophub.com',
        password: 'Buyer@123',
        role: 'buyer',
        isEmailVerified: true
      }
    ]);

    console.log('✅ 1 Admin, 2 Sellers, 2 Buyers created');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Categories created');

    const electronicsCategory = createdCategories.find((c) => c.name === 'Electronics');
    const fashionCategory = createdCategories.find((c) => c.name === 'Fashion');
    const homeCategory = createdCategories.find((c) => c.name === 'Home Essentials');

    const buildProductDoc = (product, sellerId, categoryId, indexOffset) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: null,
      discount: 0,
      category: categoryId,
      images: [{ url: '/uploads/products/placeholder.webp', public_id: `seed-product-${indexOffset}` }],
      stock: product.stock,
      seller: sellerId,
      tags: product.tags,
      rating: 0,
      numReviews: 0,
      status: 'active',
      sold: 0
    });

    const sellerOneDocs = sellerOneProducts.map((p, idx) =>
      buildProductDoc(
        p,
        sellers[0]._id,
        idx < 3 ? electronicsCategory._id : homeCategory._id,
        idx + 1
      )
    );

    const sellerTwoDocs = sellerTwoProducts.map((p, idx) =>
      buildProductDoc(
        p,
        sellers[1]._id,
        idx < 2 ? fashionCategory._id : homeCategory._id,
        idx + 6
      )
    );

    await Product.insertMany([...sellerOneDocs, ...sellerTwoDocs]);
    console.log('✅ 10 Products created (5 per seller)');

    console.log('\n🎉 SmartShop Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍💼 Admin:   admin1@shophub.com / Admin@123');
    console.log('🏪 Seller 1: seller1@shophub.com / Seller@123');
    console.log('🏪 Seller 2: seller2@shophub.com / Seller@123');
    console.log('🛒 Buyer 1:  buyer1@shophub.com / Buyer@123');
    console.log('🛒 Buyer 2:  buyer2@shophub.com / Buyer@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Seeded Data Summary:');
    console.log('  • 1 Admin account');
    console.log('  • 2 Seller accounts');
    console.log('  • 2 Buyer accounts');
    console.log('  • 3 Product categories');
    console.log('  • 10 Products total (5 for each seller)');
    console.log(`  • Seller 1 products owner: ${sellers[0].email}`);
    console.log(`  • Seller 2 products owner: ${sellers[1].email}`);
    console.log(`  • Seeded by: ${admin.email}`);
    console.log('\n✨ Ready to test!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();
