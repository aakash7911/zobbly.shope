import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Upload, Plus, Phone, Shirt, Sparkles, Trash2, Edit } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [productData, setProductData] = useState({
    name: '', brand: '', price: '', category: 'phones', model: '', image: null
  });

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name: productData.name,
      brand: productData.brand,
      price: `₹${parseInt(productData.price).toLocaleString('en-IN')}`,
      category: productData.category,
      condition: 'New',
      image: productData.image ? URL.createObjectURL(productData.image) : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'
    };
    
    addProduct(newProduct);
    alert('Product Added successfully!');
    setProductData({ name: '', brand: '', price: '', category: 'phones', model: '', image: null });
  };

  return (
    <div className="admin-panel p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-color">
        <h1>Admin <span className="text-yellow">Dashboard</span></h1>
      </div>

      <div className="grid grid-cols-3 gap-8">
        
        {/* Left Col: Add Product Form */}
        <div className="admin-add-product glass-panel p-6 col-span-1 h-fit">
          <h2 className="mb-6 flex items-center gap-2 text-xl">
            <Plus className="text-yellow" /> Add New Product
          </h2>
          
          <form onSubmit={handleSubmit} className="flex-col gap-4">
            
            <div className="category-selector flex gap-2 mb-2">
              {['phones', 'clothes', 'beauty'].map(cat => (
                <label key={cat} className={`category-radio text-sm p-2 ${productData.category === cat ? 'active' : ''}`}>
                  <input 
                    type="radio" name="category" value={cat} 
                    checked={productData.category === cat} 
                    onChange={handleChange} 
                    className="hidden" 
                  />
                  {cat === 'phones' && <Phone size={14} />}
                  {cat === 'clothes' && <Shirt size={14} />}
                  {cat === 'beauty' && <Sparkles size={14} />}
                  <span className="capitalize">{cat}</span>
                </label>
              ))}
            </div>

            <div className="flex-col gap-3">
              <input required type="text" name="name" value={productData.name} onChange={handleChange} placeholder="Product Name" className="form-input text-sm" />
              <input required type="text" name="brand" value={productData.brand} onChange={handleChange} placeholder="Brand" className="form-input text-sm" />
              <input required type="number" name="price" value={productData.price} onChange={handleChange} placeholder="Price (₹)" className="form-input text-sm" />
              
              <div className="upload-box form-input flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden text-sm">
                <Upload size={16} className="text-secondary" />
                <span className="text-secondary text-xs truncate max-w-[150px]">
                  {productData.image ? productData.image.name : 'Upload Image'}
                </span>
                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-2">Save Product</button>
          </form>
        </div>

        {/* Right Col: Products List */}
        <div className="admin-products-list glass-panel p-6 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Manage Products</h2>
            <span className="bg-surface px-3 py-1 rounded text-sm text-yellow">{products.length} Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-color text-secondary text-sm">
                  <th className="pb-3 pl-2">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-color hover:bg-surface-hover transition-colors">
                    <td className="py-3 pl-2 flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded bg-main" />
                      <div>
                        <div className="font-bold text-sm">{product.name}</div>
                        <div className="text-xs text-secondary">{product.brand}</div>
                      </div>
                    </td>
                    <td className="py-3 capitalize text-sm">{product.category}</td>
                    <td className="py-3 font-bold text-sm text-yellow">{product.price}</td>
                    <td className="py-3 text-right pr-2">
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-secondary hover:text-red-500 transition-colors" title="Delete Product">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-secondary">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
