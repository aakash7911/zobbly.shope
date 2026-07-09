import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/orders/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Filter to show only paid/confirmed orders
          setOrders(data.filter(order => order.isPaid));
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders', err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <div className="pt-32 text-center text-xl text-yellow">Please login to view orders.</div>;
  if (loading) return <div className="pt-32 text-center text-xl text-white">Loading orders...</div>;

  return (
    <div className="container py-24 min-h-[70vh]">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Package className="text-yellow" size={32} /> My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="glass-panel p-10 text-center rounded-2xl">
          <Package className="mx-auto text-secondary mb-4 opacity-50" size={64} />
          <h3 className="text-xl mb-4">You haven't placed any orders yet.</h3>
          <Link to="/shop" className="btn-primary px-6 py-2 rounded-full inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow"></div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4 border-b border-color pb-4">
                  <div>
                    <span className="text-xs text-secondary uppercase tracking-wider">Order ID: {order._id}</span>
                    <h3 className="text-lg font-bold mt-1 text-white">Placed on {new Date(order.createdAt).toLocaleDateString()}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-yellow">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                    <div className="text-sm text-green-400 font-medium">Paid via {order.paymentMethod}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="text-sm text-secondary mb-2 flex items-center gap-2"><MapPin size={16}/> Delivery Address</h4>
                    <p className="text-sm bg-surface-dark p-3 rounded-lg">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-secondary mb-2 flex items-center gap-2"><Truck size={16}/> Tracking Status</h4>
                    <div className="bg-surface-dark p-3 rounded-lg h-full flex flex-col justify-center">
                      {order.trackingId ? (
                        <>
                          <div className="text-yellow font-bold mb-1 tracking-wider">{order.trackingId}</div>
                          <div className="text-sm text-white">Status: <span className="text-green-400">{order.status}</span></div>
                          {order.estimatedDelivery && (
                            <div className="text-xs text-secondary mt-1">Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow/80">
                          <Clock size={18} className="animate-pulse" />
                          <span>Wait a few time. Generating tracking ID...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-secondary mb-2">Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.products.map((p, i) => (
                      <span key={i} className="text-xs bg-surface-dark px-3 py-1 rounded-full border border-color">
                        {p.product?.name || 'Product'} (x{p.quantity})
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
