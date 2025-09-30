import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // <-- import CSS

const ReservationSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="reservation-success">
      <h2>🎉 Reservation Successful!</h2>
      <p>Please wait for approval from the admin.</p>

      <div className="button-group">
        <button onClick={() => navigate("/reservation")} className="btn">
          Reserve Another Slot
        </button>
        <button onClick={() => navigate("/")} className="btn">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ReservationSuccess;
