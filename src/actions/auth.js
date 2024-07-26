import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

const signup = async (user) => {
  try {
    const response = await fetch(`http://localhost:5000/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.log("Error: in signup actions", e);
    console.log(e);
  }
};

export { signup };
