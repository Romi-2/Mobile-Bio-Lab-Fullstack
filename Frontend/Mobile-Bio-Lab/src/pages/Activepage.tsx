// Frontend/Mobile-Bio-Lab/src/pages/Activepage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ActivatePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message] = useState("Your account has been approved! Redirecting to login...");

  useEffect(() => {
    console.log("🔍 Activation Page Loaded");
    console.log("Token from URL:", token);

    const timer = setTimeout(() => {
      console.log("🔄 Redirecting to login page...");
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "100px",
      padding: "20px" 
    }}>
      <h2 style={{ color: "#28a745", marginBottom: "20px" }}>
        Account Approved ✅
      </h2>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>
        {message}
      </p>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Your account will be automatically activated when you login for the first time.
      </p>
      <button 
        onClick={() => navigate("/login")}
        style={{
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Go to Login Now
      </button>
    </div>
  );
}

export default ActivatePage;