import React from "react";
import { useNavigate } from "react-router-dom";

const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container" style={{ textAlign: "center", marginTop: "100px" }}>
      <h2 style={{ color: "green" }}>✅ Successfully Registered!</h2>
      <p>
        📧 Please check your <b>VU email</b> for the activation link.
      </p>
      <p>
        ⏳ Your account is <b>pending admin verification</b>. You’ll be able to login
        once it’s approved and activated.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#1565c0",
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
// This component displays a success message after user registration
// It informs the user to check their email and wait for admin verification
// The user can navigate back to the login page using the button provided