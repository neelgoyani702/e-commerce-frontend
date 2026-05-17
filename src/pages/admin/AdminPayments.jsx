import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  IndianRupee,
  CreditCard,
  Truck,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ExternalLink,
  Copy,
} from "lucide-react";

const STATUS_CONFIG = {
  paid: { label: "Paid", color: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200", icon: CheckCircle2 },
  refunded: { label: "Refunded", color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200", icon: RotateCcw },
  pending: { label: "Pending", color: "text-blue-700", bg: "bg-blue-50", ring: "ring-blue-200", icon: Clock },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-50", ring: "ring-red-200", icon: XCircle },
};

const ORDER_STATUS_COLORS = {
  "order placed": "text-yellow-700 bg-yellow-50",
  confirmed: "text-blue-700 bg-blue-50",
  shipped: "text-indigo-700 bg-indigo-50",
  "out for delivery": "text-violet-700 bg-violet-50",
  delivered: "text-emerald-700 bg-emerald-50",
  cancelled: "text-red-700 bg-red-50",
};

function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 15 });
      if (filterStatus !== "all") params.set("paymentStatus", filterStatus);
      if (filterMethod !== "all") params.set("paymentMethod", filterMethod);
      if (search) params.set("search", search);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/payments?${params}`,
        { credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
        setSummary(data.summary || {});
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } else {
        toast.error(data.message || "Failed to load payments");
      }
    } catch {
      toast.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterMethod, search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const getRefundEvent = (statusHistory) => {
    if (!statusHistory) return null;
    return statusHistory.find((s) => s.status === "refund_initiated");
  };

  const summaryCards = [
    { label: "Collected", value: summary.totalCollected || 0, count: summary.paidCount || 0, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Refunded", value: summary.totalRefunded || 0, count: summary.refundedCount || 0, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Pending", value: summary.totalPending || 0, count: summary.pendingCount || 0, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Failed", value: summary.totalFailed || 0, count: summary.failedCount || 0, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className={`rounded-xl border ${card.border} ${card.bg} p-5`}>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color} mt-1`}>₹{card.value.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-400 mt-1">{card.count} orders</p>
          </div>
        ))}
      </div>

      {/* Method Breakdown */}
      <div className="flex items-center gap-6 bg-white rounded-xl border border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-indigo-500" />
          <span className="text-xs text-gray-500">Online:</span>
          <span className="text-sm font-bold text-gray-900">{summary.onlineCount || 0}</span>
        </div>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-amber-500" />
          <span className="text-xs text-gray-500">COD:</span>
          <span className="text-sm font-bold text-gray-900">{summary.codCount || 0}</span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-gray-400">
          Net Revenue: <strong className="text-gray-900">₹{((summary.totalCollected || 0) - (summary.totalRefunded || 0)).toLocaleString("en-IN")}</strong>
        </span>
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Method Filter */}
          <select
            value={filterMethod}
            onChange={(e) => { setFilterMethod(e.target.value); setPage(1); }}
            className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All Methods</option>
            <option value="online">Online</option>
            <option value="cod">COD</option>
          </select>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Payment ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </form>

          <button
            onClick={() => { setFilterStatus("all"); setFilterMethod("all"); setSearch(""); setSearchInput(""); setPage(1); }}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-16 bg-gray-50 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
                <div className="flex-1 h-4 bg-gray-50 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <IndianRupee className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Payment Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Order Status</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx) => {
                    const config = STATUS_CONFIG[tx.paymentStatus] || STATUS_CONFIG.pending;
                    const StatusIcon = config.icon;
                    const refundEvent = getRefundEvent(tx.statusHistory);

                    return (
                      <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                        {/* Order ID */}
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => copyToClipboard(tx._id)}
                            className="flex items-center gap-1.5 text-xs font-mono font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                            title="Click to copy"
                          >
                            #{String(tx._id).slice(-8).toUpperCase()}
                            <Copy className="h-3 w-3 text-gray-300" />
                          </button>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {tx.userId?.image ? (
                              <img src={tx.userId.image} alt="" className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-100" />
                            ) : (
                              <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                {tx.userId?.firstName?.charAt(0) || "?"}
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium text-gray-800">
                                {tx.userId?.firstName || "—"} {tx.userId?.lastName || ""}
                              </p>
                              <p className="text-[10px] text-gray-400">{tx.userId?.email || "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-bold text-gray-900">₹{tx.totalAmount?.toLocaleString("en-IN")}</span>
                        </td>

                        {/* Method */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider ${
                            tx.paymentMethod === "online"
                              ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                              : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                          }`}>
                            {tx.paymentMethod === "online" ? (
                              <CreditCard className="h-3 w-3" />
                            ) : (
                              <Truck className="h-3 w-3" />
                            )}
                            {tx.paymentMethod === "online" ? "Online" : "COD"}
                          </span>
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-3.5">
                          <div>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${config.bg} ${config.color} ${config.ring}`}>
                              <StatusIcon className="h-3 w-3" />
                              {config.label}
                            </span>
                            {refundEvent && (
                              <p className="text-[10px] text-gray-400 mt-1 max-w-[180px] truncate" title={refundEvent.note}>
                                {refundEvent.note}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Order Status */}
                        <td className="px-5 py-3.5">
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize ${ORDER_STATUS_COLORS[tx.status] || "text-gray-600 bg-gray-50"}`}>
                            {tx.status}
                          </span>
                        </td>

                        {/* Payment ID */}
                        <td className="px-5 py-3.5">
                          {tx.paymentId ? (
                            <button
                              onClick={() => copyToClipboard(tx.paymentId)}
                              className="text-[10px] font-mono text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                              title={tx.paymentId}
                            >
                              {tx.paymentId.slice(0, 16)}…
                              <Copy className="h-2.5 w-2.5 text-gray-300" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-300">—</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3.5">
                          <p className="text-[11px] text-gray-500">{formatDate(tx.createdAt)}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
                <p className="text-xs text-gray-400">
                  Showing {(page - 1) * 15 + 1}–{Math.min(page * 15, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-500" />
                  </button>
                  {[...Array(Math.min(pages, 5))].map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                          page === p ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPayments;
