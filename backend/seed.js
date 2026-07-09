const products = [
  {
    name: 'iPhone 13 Pro (Refurbished)',
    brand: 'Apple',
    price: '₹45,000',
    category: 'phones',
    condition: 'Like New',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'
  },
  {
    name: 'Samsung Galaxy S22 Ultra',
    brand: 'Samsung',
    price: '₹55,000',
    category: 'phones',
    condition: 'Excellent',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000'
  },
  {
    name: "Men's Casual T-Shirt",
    brand: 'Zara',
    price: '₹999',
    category: 'clothes',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000'
  },
  {
    name: 'Luxury Lipstick Set',
    brand: 'MAC',
    price: '₹2,500',
    category: 'beauty',
    condition: 'New',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000'
  }
];

const seed = async () => {
  for (const p of products) {
    try {
      const res = await fetch('https://zobbly-shope.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      console.log('Added:', p.name, await res.json());
    } catch (e) {
      console.error(e);
    }
  }
};

seed();
