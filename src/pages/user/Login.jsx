import React, { useState } from "react";
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
import { login } from "../../actions/auth.js";
import { Link,useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        
        navigate("/");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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