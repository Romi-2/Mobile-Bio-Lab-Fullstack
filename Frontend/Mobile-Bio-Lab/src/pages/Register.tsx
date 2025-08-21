import React from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/registration-success"); // ✅ redirect to success page
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log(`${event.target.name}: ${event.target.value}`);
  };

  return (
    <div className="register-container">
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
