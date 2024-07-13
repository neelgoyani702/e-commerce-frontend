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
    console.log(data);
  } catch (e) {
    console.log("Error: in login action", e);
    console.log(e);
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
  } catch (e) {
    console.log("Error: in logout action", e);
    console.log(e);
  }
};

export { signup, login , logout };
