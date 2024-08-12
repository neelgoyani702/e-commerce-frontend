import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/get-user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                const data = await response.json();
                console.log("checkUser: ",data);

                if (data.user) {
                    setUser(data.user);
                }
            } catch (e) {
                console.log("Error: in check user", e);
                console.log(e);
            }
        };

        checkUser();
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider
