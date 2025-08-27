import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { activateUser } from "../services/activeservice";

function ActivatePage() {
  const { userId } = useParams(); // now using userId from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");

  useEffect(() => {
    const activate = async () => {
      if (!userId) return setMessage("❌ Invalid user ID");

      const data = await activateUser(Number(userId));
      if (data.success) {
        setMessage("✅ " + data.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("❌ " + (data.message || "Activation failed."));
      }
    };

    activate();
  }, [userId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Account Activation</h2>
      <p>{message}</p>
    </div>
  );
}

export default ActivatePage;
