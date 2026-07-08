import { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    // Phones
    { id: 1, name: 'iPhone 13 Pro', brand: 'Apple', condition: 'Excellent', price: '₹45,999', category: 'phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000' },
    { id: 2, name: 'Samsung Galaxy S22', brand: 'Samsung', condition: 'Like New', price: '₹38,500', category: 'phones', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000' },
    { id: 3, name: 'OnePlus 10 Pro', brand: 'OnePlus', condition: 'Good', price: '₹32,000', category: 'phones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?q=80&w=1000' },
    // Clothes
    { id: 7, name: 'Premium Denim Jacket', brand: 'Levi\'s', condition: 'New', price: '₹3,500', category: 'clothes', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000' },
    { id: 8, name: 'Cotton T-Shirt Black', brand: 'Zara', condition: 'New', price: '₹999', category: 'clothes', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000' },
    // Beauty
    { id: 9, name: 'Hydrating Face Serum', brand: 'L\'Oreal', condition: 'New', price: '₹1,200', category: 'beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000' },
    { id: 10, name: 'Matte Lipstick', brand: 'MAC', condition: 'New', price: '₹1,800', category: 'beauty', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000' },
  ]);

  const addProduct = (product) => {
    // Generate a mock ID
    const newProduct = { ...product, id: Date.now() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
