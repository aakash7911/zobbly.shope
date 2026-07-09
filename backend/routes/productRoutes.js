import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zobbly_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
const upload = multer({ storage: storage });

// 1. Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// 2. Add New Product (Admin) - Uses standard JSON
router.post('/', async (req, res) => {
  try {
    const { name, brand, condition, price, category, description, image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'Image URL is missing' });
    }

    const newProduct = new Product({
      name,
      brand,
      condition,
      price: isNaN(Number(price)) ? price : Number(price), // store as string if it has symbols
      category,
      description,
      image
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// 3. Delete Product (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    
    res.status(200).json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
