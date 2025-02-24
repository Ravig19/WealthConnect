const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9099/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
      if (data.id) {
        console.log("Login successful");
        navigate("/user-dashboard");
      } else {
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  