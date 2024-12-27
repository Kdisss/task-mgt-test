import { TextField, Button } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css" // To redirect after successful login
 // Link to navigate to the Signup page

const Signin = ({ togglePanel }) => {

   // Make sure 'jwt' exists in 'response.data'


  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role:""
  });

  const [message, setMessage] = useState(""); // Define the setMessage state for login message
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("login form", formData);



  try {
    // Make the POST request to the backend
    const response = await axios.post(
      "http://localhost:5001/auth/signin",
      formData
    );

     // Check if login is successful
     if (response.data.status) {// Store the JWT token
      const role = response.data.role;
      const id = response.data.id;// Assuming role is part of the response

    // If login is successful, store the token
    const token = response.data.jwt; // Assuming the token is in response.data.jwt
    localStorage.setItem("token", token); 
    localStorage.setItem("role", role);
    localStorage.setItem("ID", id);
    
   
    // Store token in localStorage
    setMessage("Login successful!"); // Show success message
    console.log("JWT Token:", token);
    console.log("User Role:", role); // Log the token (can be used for other requests)

    // Redirect to dashboard or home page after successful login
    if (role === "ROLE-ADMIN") {
      console.log("Working")
      navigate("/dashboard/admin"); 
      // Admin dashboard
    } else{
      navigate("/dashboard/user"); // User dashboard
    }
  } else {
    // Handle unsuccessful login (e.g., invalid credentials)
    setMessage(response.data.message || "Invalid username or password.");
  } // You can replace "/dashboard" with the desired route

  
  }catch (error) {
    // Handle errors (invalid credentials or server issues)
    if (error.response) {
      // Server returned an error response
      setMessage(error.response.data.message || "Invalid username or password.");
      console.error("Login failed:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      setMessage("No response from server. Please try again later.");
      console.error("Server did not respond:", error.request);
    } else {
      // Something else went wrong
      setMessage("An error occurred. Please try again.");
      console.error("Error during login:", error.message);
    }
  }
};

  return (
    <div className="">
      <h1 className="pb-8 text-lg font-bold text-center">Login</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your e-mail..."
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password..."
        />

        <div>
          <Button
            fullWidth
            className="customButton"
            type="submit"
            sx={{ padding: ".9rem" }}
          >
            Login
          </Button>
        </div>
      </form>
      <div className="flex items-center justify-center gap-2 py-5 mt-5">
        <span>Don't have an account yet?</span>
        <Button onClick={togglePanel}>Sign up</Button>
      </div>
    </div>
  );
};

export default Signin;
