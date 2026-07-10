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

const products = [
  {
    name: 'AeroSound Wireless Earbuds',
    description: 'Compact wireless earbuds with clear audio and long battery backup.',
    price: 59,
    stock: 120,
    tags: ['audio', 'wireless', 'earbuds'],
    category: 'Electronics'
  },
  {
    name: 'VoltCharge 65W USB-C Adapter',
    description: 'Fast charger compatible with laptops, tablets, and smartphones.',
    price: 39,
    stock: 90,
    tags: ['charger', 'usb-c', 'accessories'],
    category: 'Electronics'
  },
  {
    name: 'Nimbus Smart LED Bulb Pack',
    description: 'Energy-efficient smart bulbs with app and voice control support.',
    price: 29,
    stock: 150,
    tags: ['smart-home', 'lighting', 'electronics'],
    category: 'Electronics'
  },
  {
    name: 'FlexStand Laptop Riser',
    description: 'Ergonomic aluminum stand designed for better posture and airflow.',
    price: 49,
    stock: 80,
    tags: ['laptop', 'office', 'ergonomic'],
    category: 'Home Essentials'
  },
  {
    name: 'SnapGrip Magnetic Phone Mount',
    description: 'Secure magnetic mount for desks, dashboards, and bedsides.',
    price: 24,
    stock: 110,
    tags: ['mobile', 'mount', 'accessories'],
    category: 'Home Essentials'
  },
  {
    name: 'UrbanWeave Casual Shirt',
    description: 'Breathable everyday shirt with a modern tailored fit.',
    price: 35,
    stock: 130,
    tags: ['fashion', 'shirt', 'casual'],
    category: 'Fashion'
  },
  {
    name: 'StrideMax Running Shoes',
    description: 'Lightweight running shoes with cushioned sole for daily training.',
    price: 72,
    stock: 95,
    tags: ['shoes', 'sports', 'running'],
    category: 'Fashion'
  },
  {
    name: 'ComfyNest Throw Blanket',
    description: 'Soft microfiber blanket suitable for couch, bed, and travel.',
    price: 28,
    stock: 140,
    tags: ['home', 'blanket', 'comfort'],
    category: 'Home Essentials'
  },
  {
    name: 'PureSip Stainless Water Bottle',
    description: 'Insulated bottle that keeps drinks cold or hot for hours.',
    price: 22,
    stock: 160,
    tags: ['bottle', 'lifestyle', 'outdoor'],
    category: 'Home Essentials'
  },
  {
    name: 'KitchenPro Knife Set',
    description: 'Durable 5-piece stainless steel knife set for daily cooking.',
    price: 64,
    stock: 70,
    tags: ['kitchen', 'home', 'cooking'],
    category: 'Home Essentials'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Store Admin',
      email: 'admin1@shophub.com',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true
    });

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

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productDocs = products.map((product, index) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: null,
      discount: 0,
      category: categoryMap[product.category],
      images: [],
      stock: product.stock,
      seller: admin._id,
      tags: product.tags,
      rating: 0,
      numReviews: 0,
      status: 'active',
      sold: 0
    }));

    await Product.insertMany(productDocs);

    console.log('Simple edition seed complete');
    console.log('Admin: admin1@shophub.com / Admin@123');
    console.log('Buyer 1: buyer1@shophub.com / Buyer@123');
    console.log('Buyer 2: buyer2@shophub.com / Buyer@123');
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${productDocs.length}`);
    console.log(`Buyers: ${buyers.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
