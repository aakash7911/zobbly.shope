import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import AdminPanel from '../pages/AdminPanel';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-layout-container flex h-screen bg-main overflow-hidden">
      {/* Sidebar */}
      <aside className="admin-sidebar glass-panel w-64 flex-col p-6 h-full border-r border-color">
        <div className="brand-logo mb-8">
          Zobbly<span className="text-yellow">.admin</span>
        </div>

        <nav className="flex-1 flex-col gap-2">
          <button className="admin-nav-btn active flex items-center gap-3">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button className="admin-nav-btn flex items-center gap-3 text-secondary hover:text-yellow">
            <Settings size={20} />
            Settings
          </button>
        </nav>

        <button onClick={logout} className="admin-nav-btn flex items-center gap-3 text-secondary hover:text-red-500 mt-auto">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main flex-1 overflow-y-auto">
        <AdminPanel />
      </main>
    </div>
  );
};

export default AdminLayout;
