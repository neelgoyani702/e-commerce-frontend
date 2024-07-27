import "./App.css";
// import { Button } from "./components/ui/button";
import Signup from "./pages/user/Signup.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./pages/user/Login.jsx";
import Home from "./pages/user/Home";
import AuthProvider from "./context/AuthProvider";
import Category from "./pages/user/Category";
import Navbar from "./components/Navbar";
import Layout from "./Layout.js";

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
        path: "category",
        element: <Category />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
