import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  condition: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
