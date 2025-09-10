import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { activateUser } from "../services/activeservice";

function ActivatePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activate = async () => {
      if (!userId || isNaN(Number(userId))) {
        setMessage("❌ Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        const data = await activateUser(Number(userId));
        if (data.success) {
          setMessage("✅ " + data.message);
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMessage("❌ " + (data.message || "Activation failed."));
        }
      } catch (error: unknown) {
        console.error("Activation error:", error);
        setMessage("❌ Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    activate();
  }, [userId, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Account Activation</h2>
      <p>{loading ? "Processing..." : message}</p>
    </div>
  );
}

export default ActivatePage;
