// frontend/src/components/sampleapprove.tsx
import React, { useEffect, useState } from "react";
import { getPendingReservations, updateReservationStatus,} from "../services/reservationservice";
import "../style/reservationpending.css";

interface Reservation {
  id: number;
  userName: string;
  sampleType: string;
  date: string;
  status: string;
}

const SampleApprove: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ✅ Fetch pending reservations
  const fetchPending = async () => {
    try {
      setLoading(true);
      const data: Reservation[] = await getPendingReservations();
      setReservations(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch reservations");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve or Reject action
  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      await updateReservationStatus(id, action);
      fetchPending(); // reload after update
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to update status");
      }
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="sample-approve">
      <h2>Pending Slot Reservations</h2>
      {reservations.length === 0 ? (
        <p>No pending reservations.</p>
      ) : (
        <ul>
          {reservations.map((r) => (
            <li key={r.id}>
              <span>
                {r.userName} - {r.sampleType} on{" "}
                {new Date(r.date).toLocaleDateString()}
              </span>
              <div className="actions">
                <button
                  className="approve-btn"
                  onClick={() => handleAction(r.id, "approve")}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(r.id, "reject")}
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

export default SampleApprove;
