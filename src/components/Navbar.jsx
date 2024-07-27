import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { XIcon } from "lucide-react";
import { Menu } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "./ui/input";

const navigation = [
  { name: "Category", to: "/category" },
  { name: "Orders", to: "/careers" },
  { name: "About", to: "/about-us" },
  { name: "Contact Us", to: "/contact-us" },
];

export default function Navbar() {
  const [path] = useState(window.location.pathname);

  const { user, setUser } = useContext(AuthContext);

  const [isOpen, setOpen] = useState(false);
  // const [current, setCurrent] = useState();

  const toggleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const closeOnCurrent = (to) => {
    if (path === to) {
      toggleOpen();
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/auth/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setUser(null);
    } catch (e) {
      console.log("Error: in logout action", e);
      console.log(e);
    }
  };

  return (
    <nav className="bg-white/40 backdrop-blur-md fixed z-50 w-full top-0 shadow">
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-20 justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <Button
                onClick={() => toggleOpen()}
                variant={"link"}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
            <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start ml-12">
              <Link to="/" className="flex flex-shrink-0 items-center">
                <img
                  className="block h-12 w-12 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1602934445884-da0fa1c9d3b3?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Logo"
                  width={300}
                  height={300}
                />
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 w-full justify-center">
                {navigation.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => closeOnCurrent(item.to)}
                    className="group my-auto inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 "
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex justify-center items-center space-x-4">
                <div className="hidden md:flex justify-center items-center min-w-48 max-w-56 w-full">
                  <Input placeholder="Search" />
                </div>
                <Button variant="link" size="icon">
                  <ShoppingCart className="h-6 w-6" />
                </Button>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="rounded-full outline-none"
                    >
                      <div className="w-12 h-12 rounded-full border flex justify-center items-center">
                        <img
                          src={user.image}
                          className="h-12 w-12 object-cover rounded-full"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {user.firstName} {user.lastName}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Subscription</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="font-semibold"
                        onClick={() => {
                          logout();
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="outline">
                    <Link to="/login">Login</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
          </div>
        </div>

        {isOpen ? (
          <div className="sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    item.to === path
                      ? "bg-indigo-50 border-primary text-primary"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                    "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </>
      <div className="mx-auto flex md:hidden justify-center items-center p-2.5 w-full">
        <Input placeholder="Search" />
      </div>
    </nav>
  );
}
