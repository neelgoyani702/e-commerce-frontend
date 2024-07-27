import React, { useState, useContext, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

function Login() {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const login = async (user) => {
        try {
            const response = await fetch(`http://localhost:5000/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message)

            console.log(data);
            if (data.user) {
                setUser(data.user);
                navigate("/");
            }
        } catch (e) {
            alert(e)
            console.log("Error: in login action", e);
            console.log(e);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [user])


    return (
        <div className="min-h-screen flex items-center">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Log in</CardTitle>
                    <CardDescription>
                        Enter your information to Login an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    onChange={handleChange}
                                    type="email"
                                    name="email"
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    onChange={handleChange}
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Login an account
                            </Button>
                            {/* <Button variant="outline" className="w-full">
            Sign up with GitHub
            </Button> */}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            don't have an account?{" "}
                            <Link to="/signup" className="underline font-bold">
                                sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;