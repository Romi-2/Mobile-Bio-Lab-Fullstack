import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    vuId: "",
    email: "",
    password: "",
    mobile: "",
    role: "Student",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registered successfully! Wait for Admin approval.");
    } catch (error) {
      console.error(error);
      alert("Error in registration!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First Name" onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input name="vuId" placeholder="VU ID" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option>Student</option>
        <option>Researcher</option>
        <option>Technician</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
