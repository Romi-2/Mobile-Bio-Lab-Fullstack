import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ import axios
import { deleteUser } from "../services/userService";

const DeleteAccount: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get logged-in user's ID
  const user = localStorage.getItem("loggedInUser");
  const userId = user ? JSON.parse(user).id : null;

  const handleDelete = async () => {
    if (!userId) {
      return alert("User ID not found. Please login again.");
    }

    if (!window.confirm("Are you sure you want to permanently delete your account?")) return;

    try {
      setLoading(true);
      await deleteUser(Number(userId));

      // Clear localStorage
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      alert("Your account has been deleted successfully!");
      navigate("/login");
    } catch (err: unknown) {
      console.error(err);

      // ✅ Narrow the unknown error type
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to delete account.");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to delete account. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      padding: "2rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "500px",
      margin: "2rem auto",
      textAlign: "center",
    }}>
      <h2 style={{ color: "#dc3545", marginBottom: "1rem" }}>Delete Account</h2>
      <p style={{ marginBottom: "2rem", fontSize: "1rem", color: "#555" }}>
        Clicking the button below will permanently delete your account and all associated data.
      </p>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          padding: "12px 25px",
          backgroundColor: "#dc3545",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1rem",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
      >
        {loading ? "Deleting..." : "Delete My Account"}
      </button>
    </div>
  );
};

export default DeleteAccount;
