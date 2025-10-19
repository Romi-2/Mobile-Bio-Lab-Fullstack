// frontend/src/components/AdminReservation.tsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../style/AdminReservation.css";

interface Reservation {
  id: number;
  user_name: string;
  email: string;
  vu_id: string;
  slot_id: number;
  reservation_date: string;
  reservation_time: string;
  duration: string;
  status: string;
  geo_location: string;
  created_at: string;
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

const AdminReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const getToken = () => localStorage.getItem("token");

  // 🔹 Fetch all reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      const res = await axios.get<Reservation[]>(
        "http://localhost:5000/api/admin/reservations",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Validate each reservation object before setting state
      const validReservations = Array.isArray(res.data)
        ? res.data.filter(
            (r) =>
              r.id &&
              r.user_name &&
              r.email &&
              r.vu_id &&
              r.slot_id &&
              r.reservation_date &&
              r.reservation_time &&
              r.status
          )
        : [];

      setReservations(validReservations);
      console.log("✅ Loaded reservations:", validReservations);
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      let errorMsg =
        error?.response?.data?.error || error?.message || "An unknown error occurred";

      if (typeof errorMsg !== "string") {
        errorMsg = JSON.stringify(errorMsg);
      }

      setError(errorMsg);
      console.error("❌ Error fetching reservations:", errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Approve or Reject reservation
  const handleStatusChange = async (id: number, status: "approved" | "rejected") => {
    try {
      setUpdatingId(id);
      const token = getToken();
      if (!token) {
        alert("No token found. Please login.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/admin/reservations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the list after update
      fetchReservations();
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse;
      let errorMsg =
        error?.response?.data?.error || error?.message || "An error occurred";

      if (typeof errorMsg !== "string") {
        errorMsg = JSON.stringify(errorMsg);
      }

      console.error(`${status} failed:`, errorMsg);
      alert(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  };

  // 🔹 Load reservations on mount
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      case 'pending': return 'status-badge status-pending';
      default: return 'status-badge status-pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-reservations">
        <h2>Slot Reservation Requests</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading reservations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-reservations">
        <h2>Slot Reservation Requests</h2>
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <button onClick={fetchReservations} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  // Separate pending and processed reservations
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const processedReservations = reservations.filter(r => r.status !== 'pending');

  return (
    <div className="admin-reservations">
      <h2>Slot Reservation Requests</h2>
      
      {/* Debug Info */}
      <div className="debug-stats">
        <p>Total: {reservations.length} | Pending: {pendingReservations.length} | Processed: {processedReservations.length}</p>
      </div>

      {/* Pending Reservations */}
      {pendingReservations.length > 0 && (
        <div className="reservations-section">
          <h3 className="section-title">Pending Approval ({pendingReservations.length})</h3>
          <div className="reservations-grid">
            {pendingReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card pending">
                <div className="card-header">
                  <h4 className="user-name">{reservation.user_name}</h4>
                  <span className="user-location">{reservation.geo_location}</span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{reservation.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">VU ID:</span>
                    <span className="detail-value">{reservation.vu_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Slot ID:</span>
                    <span className="detail-value">#{reservation.slot_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{reservation.duration}</span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleStatusChange(reservation.id, "approved")}
                    disabled={updatingId === reservation.id}
                  >
                    {updatingId === reservation.id ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusChange(reservation.id, "rejected")}
                    disabled={updatingId === reservation.id}
                  >
                    {updatingId === reservation.id ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Reservations */}
      {processedReservations.length > 0 && (
        <div className="reservations-section">
          <h3 className="section-title">Processed Reservations ({processedReservations.length})</h3>
          <div className="reservations-grid">
            {processedReservations.map((reservation) => (
              <div key={reservation.id} className={`reservation-card ${reservation.status}`}>
                <div className="card-header">
                  <h4 className="user-name">{reservation.user_name}</h4>
                  <span className="user-location">{reservation.geo_location}</span>
                  <span className={getStatusClass(reservation.status)}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{reservation.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">VU ID:</span>
                    <span className="detail-value">{reservation.vu_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Slot ID:</span>
                    <span className="detail-value">#{reservation.slot_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(reservation.reservation_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{reservation.duration}</span>
                  </div>
                </div>
                
                <div className="card-status">
                  <span className={getStatusClass(reservation.status)}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;