import { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
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

        <div className="shop-layout grid">
          {/* Filters Sidebar */}
          <aside className="shop-sidebar glass-panel p-6 h-fit">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Filter size={20} className="text-yellow" />
              <h3>Filters</h3>
            </div>
            
            <div className="filter-group mb-6">
              <h4 className="mb-3 text-secondary">Brands</h4>
              <ul className="flex flex-col gap-2">
                {brands.map(brand => (
                  <li key={brand}>
                    <button 
                      className={`filter-btn ${activeBrand === brand ? 'active' : ''}`}
                      onClick={() => setActiveBrand(brand)}
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4 className="mb-3 text-secondary">Price Range</h4>
              <input type="range" min="10000" max="100000" className="w-full" />
              <div className="flex justify-between text-sm mt-2">
                <span>₹10K</span>
                <span>₹100K+</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="shop-main">
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary">{finalFilteredProducts.length} Products Found</span>
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
