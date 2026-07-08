const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String }, // specific model or variant
  category: { 
    type: String, 
    enum: ['phones', 'clothes', 'beauty'],
    required: true
  },
  price: { type: Number, required: true },
  condition: { type: String, default: 'New' },
  imageUrl: { type: String }, // Cloudinary URL
  cloudinaryId: { type: String },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
