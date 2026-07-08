import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  
  const featuredPhones = products.filter(p => p.category === 'phones').slice(0, 3);

  return (
    <div className="home-container animate-fade-in">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container grid grid-cols-2 items-center gap-8 hero-inner">
          <div className="hero-content">
            <div className="badge delay-100">Premium Refurbished</div>
            <h1 className="hero-title delay-200">
              Upgrade to <span className="text-yellow">Better.</span><br/>
              Pay Much <span className="text-yellow">Less.</span>
            </h1>
            <p className="hero-subtitle delay-300">
              Top-tier refurbished smartphones that look and perform like new, 
              backed by Zobbly.shope warranty and quality checks.
            </p>
            <div className="hero-actions delay-300 flex items-center gap-4">
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={18} className="ml-2"/>
              </Link>
              <Link to="/shop" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
            <div className="yellow-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Phone" 
              className="hero-image floating-anim"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section bg-surface">
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            <div className="feature-card glass-panel flex-col items-center text-center p-8">
              <div className="feature-icon text-yellow mb-4">
                <ShieldCheck size={48} />
              </div>
              <h3 className="mb-2">100% Quality Checked</h3>
              <p className="text-secondary text-sm">Every phone goes through 40+ rigorous checks.</p>
            </div>
            
            <div className="feature-card glass-panel flex-col items-center text-center p-8">
              <div className="feature-icon text-yellow mb-4">
                <Zap size={48} />
              </div>
              <h3 className="mb-2">Instant Delivery</h3>
              <p className="text-secondary text-sm">Get your dream phone delivered in record time.</p>
            </div>
            
            <div className="feature-card glass-panel flex-col items-center text-center p-8">
              <div className="feature-icon text-yellow mb-4">
                <Star size={48} />
              </div>
              <h3 className="mb-2">6 Months Warranty</h3>
              <p className="text-secondary text-sm">Peace of mind with our comprehensive warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products section-padding">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2>Trending <span className="text-yellow">Deals</span></h2>
            <Link to="/shop" className="text-yellow flex items-center text-sm font-medium hover-underline">
              View All <ArrowRight size={16} className="ml-1"/>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {featuredPhones.map(phone => (
              <div key={phone.id} className="product-card glass-panel">
                <div className="product-image-container">
                  <div className="condition-badge">{phone.condition}</div>
                  <img src={phone.image} alt={phone.name} className="product-image" />
                </div>
                <div className="product-info p-4">
                  <h3 className="product-name">{phone.name}</h3>
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
        </div>
      </section>
      
    </div>
  );
};

export default Home;
