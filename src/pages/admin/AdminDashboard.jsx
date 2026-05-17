import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShoppingCart,
  Package,
  FolderOpen,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  Trophy,
  Crown,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#eab308", "#22c55e", "#ef4444"];

function getChangePercent(current, previous) {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/stats`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      } else {
        toast.error(data.message || "Failed to load stats");
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLowStock() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/low-stock?threshold=5`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) setLowStock(data.products || []);
    } catch { }
  }

  useEffect(() => {
    fetchLowStock();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-gray-100" />
          <div className="h-6 w-36 bg-gray-100 rounded" />
        </div>
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-8 w-8 bg-gray-50 rounded-lg" />
              </div>
              <div className="h-7 w-20 bg-gray-100 rounded" />
              <div className="h-2.5 w-24 bg-gray-50 rounded" />
            </div>
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <div className="h-5 w-32 bg-gray-100 rounded mb-4" />
          <div className="h-48 bg-gray-50 rounded-lg" />
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="h-5 w-28 bg-gray-100 rounded mb-4" />
          {[...Array(4)].map((_, r) => (
            <div key={r} className="flex gap-4 py-3 border-b border-gray-50">
              {[...Array(5)].map((_, c) => (
                <div key={c} className={`h-3 rounded flex-1 ${c === 0 ? 'bg-gray-100' : 'bg-gray-50'}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Package className="h-12 w-12 mb-3" />
        <p className="text-lg font-medium">Failed to load dashboard</p>
      </div>
    );
  }

  const orderChange = getChangePercent(
    stats.comparison?.thisMonth?.orders || 0,
    stats.comparison?.lastMonth?.orders || 0
  );
  const revenueChange = getChangePercent(
    stats.comparison?.thisMonth?.revenue || 0,
    stats.comparison?.lastMonth?.revenue || 0
  );

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      link: "/admin/orders",
      change: orderChange,
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-violet-600",
      bg: "bg-violet-50",
      link: "/admin/products",
    },
    {
      label: "Total Categories",
      value: stats.totalCategories,
      icon: FolderOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: "/admin/categories",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      link: "/admin/users",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: IndianRupee,
      color: "text-rose-600",
      bg: "bg-rose-50",
      link: null,
      change: revenueChange,
    },
  ];

  const orderDistData = [
    { name: "Active", value: stats.orderDistribution?.orderPlaced || 0 },
    { name: "Delivered", value: stats.orderDistribution?.delivered || 0 },
    { name: "Cancelled", value: stats.orderDistribution?.cancelled || 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Today Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-4 w-4 text-white/70" />
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Today's Summary
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-3xl font-bold">{stats.today?.count || 0}</p>
            <p className="text-xs text-white/60 mt-0.5">Orders</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div>
            <p className="text-3xl font-bold">
              ₹{(stats.today?.revenue || 0).toLocaleString()}
            </p>
            <p className="text-xs text-white/60 mt-0.5">Revenue</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => card.link && navigate(card.link)}
              className={`bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 ${card.link ? "cursor-pointer" : ""
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <Icon className={`h-[18px] w-[18px] ${card.color}`} />
                </div>
                {card.link && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-300" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {card.value}
              </p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[11px] text-gray-400 font-medium">
                  {card.label}
                </p>
                {card.change !== undefined && card.change !== 0 && (
                  <span
                    className={`inline-flex items-center text-[10px] font-bold ${card.change > 0
                      ? "text-emerald-600"
                      : "text-red-500"
                      }`}
                  >
                    {card.change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(card.change)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Stats */}
      {stats.paymentStats && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-gray-900">Payment Overview</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Collected", value: stats.paymentStats.collected, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Refunded", value: stats.paymentStats.refunded, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Pending", value: stats.paymentStats.pending, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Failed", value: stats.paymentStats.failed, color: "text-red-600", bg: "bg-red-50" },
            ].map((item, i) => (
              <div key={i} className={`rounded-lg ${item.bg} p-4`}>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className={`text-xl font-bold ${item.color} mt-1`}>₹{(item.value || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Online: <strong className="text-gray-900">{stats.paymentStats.onlineOrders || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>COD: <strong className="text-gray-900">{stats.paymentStats.codOrders || 0}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Monthly Revenue
              </h2>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              Last 12 months
            </span>
          </div>
          {stats.monthlyRevenue?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={stats.monthlyRevenue}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-gray-300">
              <p className="text-sm">No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Order Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingCart className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-900">
              Order Status
            </h2>
          </div>
          {orderDistData.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={orderDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderDistData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {orderDistData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="text-[11px] text-gray-500 font-medium">
                      {d.name} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-300">
              <p className="text-sm">No order data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900">
              Top Selling Products
            </h2>
          </div>
          {stats.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-[11px] font-bold text-gray-300 w-5 text-center">
                    {i + 1}
                  </span>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover bg-gray-50"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 capitalize truncate">
                      {p.name || "Product"}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {p.totalOrders} orders · {p.totalQuantity} units
                    </p>
                  </div>
                  <p className="text-xs font-bold text-gray-900">
                    ₹{p.totalRevenue?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center py-8">
              No order data yet
            </p>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-violet-500" />
            <h2 className="text-sm font-bold text-gray-900">
              Top Customers
            </h2>
          </div>
          {stats.topCustomers?.length > 0 ? (
            <div className="space-y-3">
              {stats.topCustomers.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  <span className="text-[11px] font-bold text-gray-300 w-5 text-center">
                    {i + 1}
                  </span>
                  {c.image ? (
                    <img
                      src={c.image}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover bg-gray-50"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center">
                      <Users className="h-4 w-4 text-violet-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {c.firstName || "User"} {c.lastName || ""}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {c.orderCount} orders
                    </p>
                  </div>
                  <p className="text-xs font-bold text-gray-900">
                    ₹{c.totalSpent?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-300 text-center py-8">
              No customer data yet
            </p>
          )}
        </div>
      </div>

      {/* Inventory Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Inventory Alerts
              </h2>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                {lowStock.length} items
              </span>
            </div>
            <button
              onClick={() => navigate("/admin/inventory")}
              className="text-[11px] text-indigo-600 font-semibold hover:text-indigo-500 transition-colors"
            >
              Manage →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.slice(0, 6).map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 capitalize truncate">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {product.category?.name || "Uncategorized"}
                  </p>
                </div>
                <span
                  className={`text-xs font-black px-2 py-1 rounded-lg ${product.stock === 0
                    ? "bg-red-50 text-red-500"
                    : "bg-amber-50 text-amber-600"
                    }`}
                >
                  {product.stock === 0 ? "Out" : product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
          </div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-[11px] text-indigo-600 font-semibold hover:text-indigo-500 transition-colors"
          >
            View All →
          </button>
        </div>

        {stats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => navigate("/admin/orders")}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-4 font-mono text-xs text-gray-400">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {order.userId?.image ? (
                          <img
                            src={order.userId.image}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100" />
                        )}
                        <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                          {order.userId?.firstName} {order.userId?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500">
                      {order.totalItems}
                    </td>
                    <td className="py-3 pr-4 text-xs font-bold text-gray-900">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-700"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 text-gray-300">
            <p className="text-sm">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
