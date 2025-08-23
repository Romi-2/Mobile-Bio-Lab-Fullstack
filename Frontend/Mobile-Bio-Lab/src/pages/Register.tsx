import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/userService";

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

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle form submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if (value instanceof File) {
          data.append(key, value); // file
        } else {
          data.append(key, value.toString()); // text
        }
      }
    });

    try {
      await createUser(data); // API call via service
      navigate("/registration-success");
    } catch (err) {
      console.error("❌ Error registering user:", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="vuId"
          placeholder="VU ID"
          value={formData.vuId}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <br />

        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="">-- Select Role --</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <br />

        <input type="file" name="profilePic" onChange={handleChange} />
        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
