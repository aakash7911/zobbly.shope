import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root Endpoint for API
app.get('/api', (req, res) => {
  res.send('Zobbly Shope API is running...');
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zobbly')
.then(() => console.log('MongoDB Connected successfully!'))
.catch((error) => console.log('MongoDB connection failed:', error.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
