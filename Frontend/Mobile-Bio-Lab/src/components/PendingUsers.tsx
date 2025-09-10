import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../style/PendingUsers.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city: string;
  status: string;
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      error?: string | object;
      message?: string;
    };
  };
  message?: string;
}

const PendingUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const getToken = () => localStorage.getItem("token");

  // 🔹 Fetch pending users
  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      const res = await axios.get<{ users: User[] }>(
        "http://localhost:5000/api/admin/pending-users",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Validate each user object before setting state
      const validUsers = Array.isArray(res.data.users)
        ? res.data.users.filter(
            (u) =>
              u.id &&
              u.firstName &&
              u.lastName &&
              u.email &&
              u.role &&
              u.status
          )
        : [];

      setUsers(validUsers);
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      let errorMsg =
        error?.response?.data?.error || error?.message || "An unknown error occurred";

      if (typeof errorMsg !== "string") {
        errorMsg = JSON.stringify(errorMsg);
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Approve or Reject user
  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      setUpdatingId(id);
      const token = getToken();
      if (!token) {
        alert("No token found. Please login.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/admin/${action}/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPending();
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      let errorMsg =
        error?.response?.data?.error || error?.message || "An error occurred";

      if (typeof errorMsg !== "string") {
        errorMsg = JSON.stringify(errorMsg);
      }

      console.error(`${action} failed:`, errorMsg);
      alert(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  };

  // 🔹 Load pending users on mount
  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  if (loading) return <p>Loading pending users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pending-users">
      <h2>Pending Users</h2>
      {users.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <span>
                {u.firstName.trim()} {u.lastName.trim()} - {u.city?.trim() || "N/A"}
              </span>
              <div className="actions">
                <button
                  className="approve-btn"
                  onClick={() => handleAction(u.id, "approve")}
                  disabled={updatingId === u.id}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(u.id, "reject")}
                  disabled={updatingId === u.id}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingUsers;
