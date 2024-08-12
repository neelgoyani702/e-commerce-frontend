import React, { useState, useEffect, useContext } from "react";
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

function Signup() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const signup = async (user) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log("Signup Details : ",data.user);
      if (data.user) {
        setUser(data.user);
        navigate("/login");
      }
    } catch (e) {
      console.log("Error: in signup actions", e);
      console.log(e);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    onChange={handleChange}
                    id="first-name"
                    name="firstName"
                    placeholder=""
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    onChange={handleChange}
                    name="lastName"
                    placeholder=""
                    required
                  />
                </div>
              </div>
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
                Create an account
              </Button>
              {/* <Button variant="outline" className="w-full">
            Sign up with GitHub
            </Button> */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline font-bold">
                log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default Signup;
