import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="registeration-container">
      <div className="registeration-card" style={{ textAlign: "center" }}>
        <h2 style={{ color: "#1976d2" }}>✅ Registration Successful!</h2>
        <p>Your account has been created successfully.</p>
        <p>Please wait for an activation email from the admin to access your account.</p>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
