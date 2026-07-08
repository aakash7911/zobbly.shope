const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true // Allow null for phone users
  },
  phone: {
    type: String,
    unique: true,
    sparse: true // Allow null for email users
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  name: String,
  addresses: [{
    street: String,
    city: String,
    state: String,
    zip: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
