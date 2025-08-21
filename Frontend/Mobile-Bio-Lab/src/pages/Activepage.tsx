// src/pages/ActivatePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ActivatePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");

  useEffect(() => {
    const activateUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/activate/${studentId}`);
        const data = await res.json(); // backend should return JSON {success: true/false, message: "..."}
        
        if (res.ok && data.success) {
          setMessage("✅ " + data.message);
          setTimeout(() => navigate("/login"), 3000); // redirect to login
        } else {
          setMessage("❌ " + (data.message || "Activation failed."));
        }
      } catch {
        setMessage("⚠️ Server error. Please try again later.");
      }
    };

    activateUser();
  }, [studentId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Account Activation</h2>
      <p>{message}</p>
    </div>
  );
}

export default ActivatePage;
