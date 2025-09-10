import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";

import "../style/Register.css";

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
    profilePicture: File | null;
  }>({
    firstName: "",
    lastName: "",
    vuId: "",
    email: "",
    password: "",
    mobile: "",
    city: "",
    role: "",
    profilePicture: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === "file"
    ) {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];

        // File size check
        if (file.size > 200 * 1024) {
          alert("⚠️ Please upload a smaller image (max 200 KB).");
          event.target.value = "";
          return;
        }

        // Dimension check
        const img = new Image();
        img.onload = () => {
          if (img.width !== 300 || img.height !== 400) {
            alert("⚠️ Please upload a passport-size image (300x400 px).");
            event.target.value = "";
          } else {
            setFormData({ ...formData, [name]: file });
          }
        };
        img.src = URL.createObjectURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert(`⚠️ Please fill the ${key} field.`);
        return;
      }
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value as Blob | string);
      });

      await registerUser(data);
      navigate("/registration-success");
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
      else alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <h2>User Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
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
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: "5px", background: "none", border: "none", cursor: "pointer" }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>VU ID</label>
                <input
                  type="text"
                  name="vuId"
                  value={formData.vuId}
                  onChange={handleChange}
                  required
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

            <div className="input-row">
              <div className="input-group">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Profile Picture</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
                required
              />
            </div>

            <div className="button-row">
              <button type="button" onClick={() => navigate("/login")}>Go Back</button>
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
