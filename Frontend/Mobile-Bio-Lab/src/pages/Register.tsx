import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSuccess(true);

    // Show success message, then redirect to login after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/");
    }, 2000);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(`${event.target.name}: ${event.target.value}`);
  };

  return (
    <div className="register-container">
      {/* ✅ Success Dropdown (Separate from form) */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: "350px", // Increased width
            maxWidth: "90vw",
            backgroundColor: "#e6ffed",
            color: "#1b5e20",
            border: "2px solid #1b5e20",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          ✅ Successfully Registered!
        </div>
      )}

      <div className="register-card" style={{ maxWidth: "700px" }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="input-row">
            <div className="input-group">
              <label>VU ID</label>
              <input name="vuId" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Mobile</label>
              <input name="mobile" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>City</label>
              <input name="city" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Role</label>
              <select
                name="role"
                onChange={handleChange}
                required
                className="browser-default"
              >
                <option value="">-- Choose Role --</option>
                <option value="Student">Student</option>
                <option value="Researcher">Researcher</option>
                <option value="Technician">Technician</option>
              </select>
            </div>
          </div>

          <label>Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
          />

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
