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
    <div className="shop-container pt-20">
      
      {/* Flipkart Style Category Strip */}
      <div className="category-strip bg-surface-dark py-4 mb-6 border-b border-color shadow-sm mt-4">
        <div className="container flex justify-center gap-8 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                if (cat.id === 'all') params.delete('category');
                else params.set('category', cat.id);
                window.history.pushState(null, '', `?${params.toString()}`);
                // Instead of full navigation, we can just trigger a re-render or let user use Link
                // But since we rely on useSearchParams which doesn't auto-update on pushState easily,
                // let's just use window.location or navigate. 
                // We don't have navigate imported here. Let's just use window.location for simplicity, or we can import useNavigate.
                window.location.search = `?${params.toString()}`;
              }}
              className={`flex flex-col items-center gap-2 min-w-[80px] transition-transform hover:scale-105 ${categoryParam === cat.id ? 'text-yellow' : 'text-secondary hover:text-white'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${categoryParam === cat.id ? 'bg-yellow/20 border-2 border-yellow' : 'bg-surface'}`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="container py-4">
        <div className="shop-layout w-full">
          <main className="shop-main w-full">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:bg-surface-hover transition-colors"
                  >
                    <Menu size={20} className="text-yellow" /> <span className="hidden sm:inline">Brand Filter</span>
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute top-full mt-2 left-0 z-10 glass-panel p-4 rounded-lg w-56 shadow-lg animate-fade-in">
                      <h4 className="mb-3 text-secondary text-sm border-b border-color pb-2">Filter by Brand</h4>
                      <ul className="flex-col gap-2">
                        {brands.map(brand => (
                          <li key={brand}>
                            <button 
                              onClick={() => { setActiveBrand(brand); setIsFilterOpen(false); }}
                              className={`filter-btn text-sm p-2 ${activeBrand === brand ? 'active' : ''}`}
                            >
                              {brand}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <span className="text-secondary text-sm font-medium">{finalFilteredProducts.length} Items Found</span>
              </div>
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
