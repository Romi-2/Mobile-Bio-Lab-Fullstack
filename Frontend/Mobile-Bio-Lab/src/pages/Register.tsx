import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ define type for formData
interface RegisterFormData {
  firstName: string;
  lastName: string;
  vuId: string;
  email: string;
  password: string;
  mobile: string;
  city: string;
  role: string;
  profilePic: File | null;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
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

  // ✅ input change handler
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

  // ✅ form submit handler
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value as Blob | string);
      });

      await axios.post("http://localhost:5000/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/registration-success");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card" style={{ maxWidth: "700px" }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {/* First + Last Name */}
          <div className="input-row">
            <div className="input-group">
              <label>First Name</label>
              <input name="firstName" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input name="lastName" onChange={handleChange} required />
            </div>
          </div>

          {/* VU ID + Email */}
          <div className="input-row">
            <div className="input-group">
              <label>VU ID</label>
              <input name="vuId" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" onChange={handleChange} required />
            </div>
          </div>

          {/* Password + Mobile */}
          <div className="input-row">
            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Mobile</label>
              <input name="mobile" onChange={handleChange} required />
            </div>
          </div>

          {/* City + Role */}
          <div className="input-row">
            <div className="input-group">
              <label>City</label>
              <input name="city" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Role</label>
              <select name="role" onChange={handleChange} required>
                <option value="">-- Choose Role --</option>
                <option value="Student">Student</option>
                <option value="Researcher">Researcher</option>
                <option value="Technician">Technician</option>
              </select>
            </div>
          </div>

          {/* Profile Pic */}
          <label>Profile Picture</label>
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />

          {/* Buttons */}
          <div className="button-row">
            <button
              type="button"
              className="btn-link"
              onClick={() => navigate("/")}
              style={{ minWidth: "90px", padding: "8px 0" }}
            >
              Go Back
            </button>
            <button type="submit" style={{ minWidth: "90px", padding: "8px 0" }}>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
