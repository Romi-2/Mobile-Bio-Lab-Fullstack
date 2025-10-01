// frontend/src/pages/ReservationPage.tsx

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface FormData {
  sampleId: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  geoLocation: string;
  temperature: string;
  pH: string;
  salinity: string;
}

const ReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = location.state as { reservationId: number };

  const [form, setForm] = useState<FormData>({
    sampleId: "",
    sampleType: "",
    collectionDate: "",
    collectionTime: "",
    geoLocation: "",
    temperature: "",
    pH: "",
    salinity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/samples", {
        reservationId,
        ...form,
      });
      navigate("/reservation-success");
    } catch (err) {
      console.error(err);
      alert("Failed to submit sample data.");
    }
  };

  return (
    <div>
      <h2>Enter Sample Details</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="sampleId" placeholder="Sample ID" value={form.sampleId} onChange={handleChange} />
        <select name="sampleType" value={form.sampleType} onChange={handleChange}>
          <option value="">-- Sample Type --</option>
          <option value="water">Water</option>
          <option value="soil">Soil</option>
          <option value="plant">Plant</option>
          <option value="biological fluids">Biological Fluids</option>
        </select>
        <input type="date" name="collectionDate" value={form.collectionDate} onChange={handleChange} />
        <input type="time" name="collectionTime" value={form.collectionTime} onChange={handleChange} />
        <input type="text" name="geoLocation" placeholder="Geolocation" value={form.geoLocation} onChange={handleChange} />
        <input type="text" name="temperature" placeholder="Temperature" value={form.temperature} onChange={handleChange} />
        <input type="text" name="pH" placeholder="pH" value={form.pH} onChange={handleChange} />
        <input type="text" name="salinity" placeholder="Salinity" value={form.salinity} onChange={handleChange} />
        <button type="submit">Submit Sample</button>
      </form>
    </div>
  );
};

export default ReservationPage;
