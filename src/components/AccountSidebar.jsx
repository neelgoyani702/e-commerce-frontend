import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthProvider";
import { Link } from 'react-router-dom';
import { icons } from 'lucide-react';

const navigation = [
    { name: "Profile Information", to: "", icons: icons.User },
    { name: "Manage Addresses", to: "/addresses", icons: icons.MapPin },
    { name: "My Orders", to: "/orders", icons: icons.ShoppingBag },
];

function AccountSidebar() {

    const { setUser } = useContext(AuthContext);

    const logout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            // console.log(data);
            setUser(null);
        } catch (e) {
            console.log("Error: in logout action", e);
            console.log(e);
        }
    };

    return (
        <div className='flex flex-col gap-2'>
            {navigation.map((item) => (
                <Link
                    key={item.to}
                    to={`/profile${item.to}`}
                    // onClick={() => closeOnCurrent(item.to)}
                    className="group my-auto inline-flex w-full items-center justify-start rounded-md px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                >
                    {item.icons && <item.icons className="mr-3 size-5" />}
                    {item.name}
                </Link>
            ))
            }
            <hr className='bg-slate-200' />
            <div
                className="group my-auto inline-flex w-full items-center justify-start rounded-md px-4 py-2 font-medium transition-colors 
                    hover:bg-accent
                    hover:text-accent-foreground focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer "
                onClick={() => {
                    logout();
                }}
            >
                {icons.LogOut && <icons.LogOut className="mr-3 size-5" />}
                Logout
            </div>
        </div >
    )
}

export default AccountSidebar