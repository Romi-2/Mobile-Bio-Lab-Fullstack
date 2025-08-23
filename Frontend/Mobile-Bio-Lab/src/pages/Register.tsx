import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../service/userService";
import "../App.css";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    vuId: string;
    email: string;
    password: string;
    mobile: string;
    city: string;
    role: string;
    profilePic: File | null;
  }>({
    firstName: "",
    lastName: "",
    vuId: "",
    email: "",
    password: "",
    mobile: "",
    city: "",
    role: "",
    profilePic: null,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (event.target instanceof HTMLInputElement && event.target.type === "file") {
      const files = event.target.files;
      if (files && files.length > 0) {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value as Blob | string);
      });

      // Use your service or axios directly
      await createUser(data);
      // OR: await axios.post("http://localhost:5000/api/auth/register", data, { headers: { "Content-Type": "multipart/form-data" } });

      navigate("/registration-success");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>User Registration</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name + Last Name */}
          <div className="input-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email + Password */}
          <div className="input-row">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* VU ID + Role */}
          <div className="input-row">
            <div className="input-group">
              <label>VU ID</label>
              <input
                type="text"
                name="vuId"
                placeholder="VU ID"
                value={formData.vuId}
                onChange={handleChange}
              />
            </div>
            <div className="role-group">
  <label>Role</label>
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="">-- Select Role --</option>
    <option value="student">Student</option>
    <option value="researcher">Researcher</option>
    <option value="technician">Technician</option>
  </select>
</div>

          </div>

          {/* Mobile + City */}
          <div className="input-row">
            <div className="input-group">
              <label>Mobile</label>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div className="input-group">
            <label>Profile Picture</label>
            <input type="file" name="profilePic" onChange={handleChange} />
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button
              type="button"
              className="btn-link"
              onClick={() => navigate("/login")}
            >
              Go Back
            </button>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
