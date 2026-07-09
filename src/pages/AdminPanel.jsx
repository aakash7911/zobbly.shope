import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Upload, Plus, Phone, Shirt, Sparkles, Trash2, Edit, Box, Package, Download } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [productData, setProductData] = useState({
    name: '', brand: '', price: '', category: 'phones', model: '', image: null
  });
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [trackingIds, setTrackingIds] = useState({});

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://zobbly-shope.onrender.com/api/orders/admin');
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const updateTracking = async (orderId) => {
    const trackingId = trackingIds[orderId];
    if (!trackingId) return;
    try {
      const res = await fetch(`https://zobbly-shope.onrender.com/api/orders/admin/${orderId}/tracking`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId })
      });
      if (res.ok) {
        alert('Tracking ID updated successfully!');
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update tracking', err);
    }
  };

  const downloadCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone/Email', 'Location', 'Amount', 'Payment ID', 'Status', 'Tracking ID'];
    const rows = orders.map(o => [
      o._id,
      new Date(o.createdAt).toLocaleDateString(),
      o.user?.name || 'N/A',
      o.user?.email || 'N/A',
      o.shippingAddress ? `${o.shippingAddress.address}, ${o.shippingAddress.city}` : 'N/A',
      o.totalAmount,
      o.razorpayPaymentId || 'N/A',
      o.status,
      o.trackingId || 'N/A'
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zobbly_orders_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex gap-2">
            <button className={`admin-nav-item flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'products' ? 'bg-yellow text-black' : 'bg-surface'}`} onClick={() => setActiveTab('products')}>
                <Box size={20} /> Products
            </button>
            <button className={`admin-nav-item flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-yellow text-black' : 'bg-surface'}`} onClick={() => setActiveTab('orders')}>
                <Package size={20} /> Orders
            </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-3 gap-8">
          <div className="admin-add-product glass-panel p-6 col-span-1 h-fit">
            <h2 className="mb-6 flex items-center gap-2 text-xl">
              <Plus className="text-yellow" /> Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div className="category-selector flex gap-2 mb-2">
                {['phones', 'clothes', 'beauty'].map(cat => (
                  <label key={cat} className={`category-radio text-sm p-2 ${productData.category === cat ? 'active' : ''}`}>
                    <input type="radio" name="category" value={cat} checked={productData.category === cat} onChange={handleChange} className="hidden" />
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
                  <span className="text-secondary text-xs truncate max-w-[150px]">{productData.image ? productData.image.name : 'Upload Image'}</span>
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-2">Save Product</button>
            </form>
          </div>
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
                        <div><div className="font-bold text-sm">{product.name}</div><div className="text-xs text-secondary">{product.brand}</div></div>
                      </td>
                      <td className="py-3 capitalize text-sm">{product.category}</td>
                      <td className="py-3 font-bold text-sm text-yellow">{product.price}</td>
                      <td className="py-3 text-right pr-2">
                        <button onClick={() => deleteProduct(product.id)} className="p-2 text-secondary hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-orders-section animate-fade-in glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Package className="text-yellow" /> Manage Orders</h2>
            <button onClick={downloadCSV} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Download size={16} /> Download Excel (CSV)
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-color text-secondary text-sm">
                  <th className="pb-3 pl-2">Order ID & Date</th>
                  <th className="pb-3">Customer Info</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 pr-2">Tracking ID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-color hover:bg-surface-hover transition-colors">
                    <td className="py-3 pl-2">
                      <div className="text-sm font-bold text-white">{order._id.substring(order._id.length - 8)}</div>
                      <div className="text-xs text-secondary">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm text-white font-medium">{order.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-secondary">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm text-yellow font-bold">₹{order.totalAmount}</div>
                      <div className="text-xs text-green-400">{order.razorpayPaymentId || 'Paid'}</div>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          placeholder="Tracking ID" 
                          className="bg-surface-dark border border-color rounded px-2 py-1 text-sm text-white outline-none focus:border-yellow w-32"
                          value={trackingIds[order._id] !== undefined ? trackingIds[order._id] : (order.trackingId || '')}
                          onChange={(e) => setTrackingIds({...trackingIds, [order._id]: e.target.value})}
                        />
                        <button 
                          onClick={() => updateTracking(order._id)}
                          className="bg-yellow text-black px-2 py-1 rounded text-xs font-medium hover:bg-white transition-colors"
                        >
                          Save
                        </button>
                      </div>
                      {order.status !== 'Pending' && <div className="text-xs text-secondary mt-1">Status: {order.status}</div>}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-secondary">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
