import React from "react";
import "./App.css";
import Signup from "./pages/user/Signup.jsx";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "./components/ui/sonner"
import Login from "./pages/user/Login.jsx";
import Home from "./pages/user/Home";
import AuthProvider from "./context/AuthProvider";
import Category from "./pages/user/Category";
import Layout from "./Layout.js";
import Profile from "./pages/user/Profile";
import ProfileInfo from "./pages/user/ProfileInfo";
import UserAddress from "./pages/user/UserAddress";
import CategoryProducts from "./pages/user/CategoryProducts";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import MyOrders from "./pages/user/MyOrders";
import OrderHistory from "./pages/user/OrderHistory";
import ChangePassword from "./pages/user/ChangePassword";
import AllProducts from "./pages/user/AllProducts";
import Wishlist from "./pages/user/Wishlist";
import NotFound from "./pages/user/NotFound";
import SettingsProvider from "./context/SettingsProvider";
import CompareProvider from "./context/CompareProvider";
import { FlashSaleProvider } from "./context/FlashSaleProvider";
import CompareProducts from "./pages/user/CompareProducts";
import ErrorBoundary from "./components/ErrorBoundary";

// Admin route guard (small — always needed)
import AdminRoute from "./pages/admin/AdminRoute";

// Admin pages — code-split so regular users never download admin JS
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCategories = React.lazy(() => import("./pages/admin/AdminCategories"));
const AdminProducts = React.lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = React.lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = React.lazy(() => import("./pages/admin/AdminUsers"));
const AdminActivityLog = React.lazy(() => import("./pages/admin/AdminActivityLog"));
const AdminCustomerInsights = React.lazy(() => import("./pages/admin/AdminCustomerInsights"));
const AdminCoupons = React.lazy(() => import("./pages/admin/AdminCoupons"));
const AdminSettings = React.lazy(() => import("./pages/admin/AdminSettings"));
const AdminReturns = React.lazy(() => import("./pages/admin/AdminReturns"));
const AdminFlashSales = React.lazy(() => import("./pages/admin/AdminFlashSales"));
const AdminBundles = React.lazy(() => import("./pages/admin/AdminBundles"));
const AdminAnalytics = React.lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminInventory = React.lazy(() => import("./pages/admin/AdminInventory"));
const AdminBulk = React.lazy(() => import("./pages/admin/AdminBulk"));
const AdminSegments = React.lazy(() => import("./pages/admin/AdminSegments"));
const AdminPayments = React.lazy(() => import("./pages/admin/AdminPayments"));

const AdminFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: '',
            element: <ProfileInfo />
          },
          {
            path: 'addresses',
            element: <UserAddress />
          },
          {
            path: 'orders',
            element: <MyOrders />
          },
          {
            path: 'order-history',
            element: <OrderHistory />
          },
          {
            path: 'change-password',
            element: <ChangePassword />
          },
          {
            path: 'wishlist',
            element: <Wishlist />
          }
        ],
      },
      {
        path: "category",
        element: <Category />,
      },
      {
        path: "category/:categoryId/products",
        element: <CategoryProducts />
      },
      {
        path: "product/:productId",
        element: <ProductDetail />
      },
      {
        path: "checkout/cart",
        element: <Cart />
      },
      {
        path: "checkout",
        element: <Checkout />
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmation />
      },
      {
        path: "compare",
        element: <CompareProducts />
      },
      {
        path: "products",
        element: <AllProducts />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
  // Admin routes — completely separate from user Layout
  {
    path: "admin",
    element: (
      <React.Suspense fallback={<AdminFallback />}>
        <AdminRoute />
      </React.Suspense>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "users", element: <AdminUsers /> },
      { path: "activity-log", element: <AdminActivityLog /> },
      { path: "customers", element: <AdminCustomerInsights /> },
      { path: "coupons", element: <AdminCoupons /> },
      { path: "returns", element: <AdminReturns /> },
      { path: "flash-sales", element: <AdminFlashSales /> },
      { path: "bundles", element: <AdminBundles /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "bulk", element: <AdminBulk /> },
      { path: "segments", element: <AdminSegments /> },
      { path: "payments", element: <AdminPayments /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <SettingsProvider>
        <FlashSaleProvider>
          <CompareProvider>
            <Toaster position="top-right" />
            <RouterProvider router={router} />
          </CompareProvider>
        </FlashSaleProvider>
      </SettingsProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
