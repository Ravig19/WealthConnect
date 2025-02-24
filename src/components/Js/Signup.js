const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9099/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log("User registered successfully");
        navigate("/login/user");
      } else {
        console.log("Error registering user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  