import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 style={{ color: "green" }}>✅ Successfully Registered!</h2>
      <p style={{ fontSize: "18px" }}>
        Please check your VU email for activation. <br />
        Your account is pending verification by the Admin.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#1565c0",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default RegistrationSuccess;
