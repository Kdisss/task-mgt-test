import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
  } from "@mui/material";
  import React, { useState } from "react";
  import axios from "axios";  // Import axios
  import { useNavigate } from "react-router-dom";
  import "./Auth.css" 
  
  const Signup = ({ togglePanel }) => {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      role: "",
    });

    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form Data:", formData); // Debug: Check formData before sending
      try {
        // Make the POST request to the backend
        const response = await axios.post("http://localhost:5001/auth/signup", formData);
  
        // Handle successful signup
        console.log("Signup successful:", response.data);
        alert(response.data.message);  // Show success message
  
        // Redirect to Sign In page after successful signup
        navigate("/");  // Redirect to Signin page
  
      } catch (error) {
        // Handle errors (e.g., duplicate email)
        console.error("Signup error:", error);
        alert("Signup failed. Please try again.");
      }
    };
  
    return (
      <div className="">
        <h1 className="pb-8 text-lg font-bold text-center">Register</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name..."
          />
  
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
  
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={formData.role}
              label="Role"
              name="role"
              onChange={handleChange}
            >
              <MenuItem value={"ROLE-CUSTOMER"}>USER</MenuItem>
              <MenuItem value={"ROLE-ADMIN"}>ADMIN</MenuItem>
            </Select>
          </FormControl>
  
          <div>
            <Button
              fullWidth
              className="customButton"
              type="submit"
              sx={{ padding: ".9rem" }}
            >
              Register
            </Button>
          </div>
        </form>
        <div className="flex items-center justify-center gap-2 py-5 mt-5">
          <span>Already have an account?</span>
          <Button onClick={togglePanel}>Sign in</Button>
        </div>
      </div>
    );
  };
  
  export default Signup;
  