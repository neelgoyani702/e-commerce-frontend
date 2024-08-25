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
        element: < Profile />,
        children: [
          {
            path: '',
            element: <ProfileInfo />
          },
          {
            path: 'addresses',
            element: < UserAddress />
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
        element : <ProductDetail />
      }
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors closeButton />
      </AuthProvider>
    </>
  );
}

export default App;
