import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Real Backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://zobbly-shope.onrender.com/api/products');
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const res = await fetch('https://zobbly-shope.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const newProduct = await res.json();
      if (res.ok) {
        setProducts(prev => [newProduct, ...prev]);
        return { success: true };
      } else {
        return { success: false, message: newProduct.message };
      }
    } catch (error) {
      console.error("Add product error:", error);
      return { success: false, message: 'Server error' };
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await fetch(`https://zobbly-shope.onrender.com/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error("Delete product error:", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, loading, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
