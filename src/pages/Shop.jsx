import { useState, useEffect } from 'react';
import { Filter, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const { addToCart } = useCart();
  const { products: allProducts } = useProducts();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category') || 'all';

  const [activeBrand, setActiveBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Reset brand when category changes
  useEffect(() => {
    setActiveBrand('All');
  }, [categoryParam]);

  // Set brands dynamically based on category
  const filteredByCategory = categoryParam === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === categoryParam);

  const brands = ['All', ...new Set(filteredByCategory.map(p => p.brand))];

  const finalFilteredProducts = filteredByCategory.filter(p => 
    (activeBrand === 'All' || p.brand === activeBrand) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'all', name: 'All', icon: '🛍️' },
    { id: 'phones', name: 'Mobiles', icon: '📱' },
    { id: 'clothes', name: 'Fashion', icon: '👕' },
    { id: 'beauty', name: 'Beauty', icon: '💄' }
  ];

  return (
    <div className="shop-container pt-24">
      
      {/* Flipkart Style Category Strip */}
      <div className="category-strip bg-surface-dark py-4 mb-4 border-b border-color shadow-sm mt-4">
        <div className="container flex justify-center gap-12 sm:gap-16 overflow-x-auto no-scrollbar px-2">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                if (cat.id === 'all') params.delete('category');
                else params.set('category', cat.id);
                window.location.search = `?${params.toString()}`;
              }}
              className={`flex flex-col items-center gap-2 min-w-[70px] transition-transform hover:scale-105 ${categoryParam === cat.id ? 'text-yellow' : 'text-secondary hover:text-white'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${categoryParam === cat.id ? 'bg-yellow/20 border-2 border-yellow' : 'bg-surface'}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container py-4">
        <div className="shop-layout w-full">
          <main className="shop-main w-full">
            <div className="mb-4 text-secondary text-sm font-medium px-2">
              {finalFilteredProducts.length} Items Found
            </div>

            <div className="grid grid-cols-3 gap-6">
              {finalFilteredProducts.map(phone => (
                <div key={phone.id} className="product-card glass-panel">
                  <div className="product-image-container">
                    <div className="condition-badge">{phone.condition}</div>
                    <img src={phone.image} alt={phone.name} className="product-image" />
                  </div>
                  <div className="product-info p-4">
                    <span className="text-xs text-secondary uppercase tracking-wider">{phone.brand}</span>
                    <h3 className="product-name mt-1">{phone.name}</h3>
                    <div className="product-price-row flex items-center justify-between mt-4">
                      <span className="price font-bold text-xl">{phone.price}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigate('/checkout', { state: { directPurchase: [phone] } })}
                          className="bg-yellow text-black px-3 py-1.5 rounded-full text-sm font-bold hover:bg-white transition-colors"
                        >
                          Buy Now
                        </button>
                        <button onClick={() => addToCart(phone)} className="btn-add-cart p-2 rounded-full" title="Add to Cart">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
