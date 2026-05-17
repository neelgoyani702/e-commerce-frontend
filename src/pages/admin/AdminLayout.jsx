import React, { useContext, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Activity,
  TrendingUp,
  Ticket,
  Settings,
  RotateCcw,
  Zap,
  Gift,
  BarChart3,
  AlertTriangle,
  FileSpreadsheet,
  IndianRupee,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Payments", to: "/admin/payments", icon: IndianRupee },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: FolderOpen },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Customers", to: "/admin/customers", icon: TrendingUp },
  { label: "Coupons", to: "/admin/coupons", icon: Ticket },
  { label: "Flash Sales", to: "/admin/flash-sales", icon: Zap },
  { label: "Bundle Offers", to: "/admin/bundles", icon: Gift },
  { label: "Sales Reports", to: "/admin/analytics", icon: BarChart3 },
  { label: "Inventory", to: "/admin/inventory", icon: AlertTriangle },
  { label: "Bulk Import/Export", to: "/admin/bulk", icon: FileSpreadsheet },
  { label: "Segments", to: "/admin/segments", icon: TrendingUp },
  { label: "Returns", to: "/admin/returns", icon: RotateCcw },
  { label: "Activity Log", to: "/admin/activity-log", icon: Activity },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const logout = async () => {
    try {
      const toastId = toast.loading("Logging out...");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      toast.dismiss(toastId);
      const data = await response.json();
      if (response.ok) {
        setUser(null);
        navigate("/");
        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const currentPage =
    navItems.find((item) => isActive(item.to))?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Admin
            </span>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group ${active
                  ? "bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-400 ml-0"
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${active ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"
                    }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="mx-4 border-t border-white/5" />

        {/* User card & Logout */}
        <div className="p-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all mb-1"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            Back to Store
          </Link>
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5">
            <img
              src={user?.image}
              alt={user?.firstName || "Admin"}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 mt-1 rounded-lg text-[12px] font-medium text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200/60 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              {currentPage}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400 hidden sm:inline">
              Admin Panel
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-600">
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/80">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
