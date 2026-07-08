import { useState, useEffect } from 'react';
import { Filter, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useSearchParams } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const { addToCart } = useCart();
  const { products: allProducts } = useProducts();
  const [searchParams] = useSearchParams();
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

  return (
    <div className="shop-container pt-80">
      <div className="container py-8">
        <div className="shop-header mb-8">
          <h1>Shop <span className="text-yellow capitalize">{categoryParam === 'all' ? 'All Products' : categoryParam}</span></h1>
          <p className="text-secondary mt-2">Find the perfect products across our premium catalog.</p>
        </div>

        <div className="shop-layout w-full">
          <main className="shop-main w-full">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:bg-surface-hover transition-colors"
                  >
                    <Menu size={20} className="text-yellow" /> <span className="hidden sm:inline">Filters</span>
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
                
                <span className="text-secondary text-sm">{finalFilteredProducts.length} Products</span>
              </div>

              <div className="search-bar flex items-center glass-panel px-4 py-2 rounded-full">
                <Search size={18} className="text-secondary mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-white w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                      <button onClick={() => addToCart(phone)} className="btn-add-cart p-2 rounded-full" title="Add to Cart">
                        +
                      </button>
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
