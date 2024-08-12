import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";

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
    console.log(data);
  } catch (e) {
    console.log("Error: in signup actions", e);
    console.log(e);
  }
};

export { signup };
