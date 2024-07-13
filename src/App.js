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
import { logout } from "./actions/auth.js";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: (
          <div>
            <button onClick={logout}>logout</button>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
