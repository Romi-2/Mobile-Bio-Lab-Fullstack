// src/pages/ActivatePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ActivatePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate activation process
    setTimeout(() => {
      navigate("/"); // Redirect to login page after 3 sec
    }, 3000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Account Activation</h2>
      <p>Your account with ID <b>{studentId}</b> has been activated successfully!</p>
      <p>Redirecting to login...</p>
    </div>
  );
}

export default ActivatePage;
