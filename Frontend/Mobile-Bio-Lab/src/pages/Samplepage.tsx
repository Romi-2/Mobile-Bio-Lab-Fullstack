import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface SampleResponse {
  msg: string;
  id?: number;
}

const SampleForm = () => {
  const [form, setForm] = useState({
    sampleId: "",
    collectionDate: "",
    collectionTime: "",
    sampleType: "",
    temperature: "",
    pH: "",
    salinity: "",
    location: "",
  });

  // handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post<SampleResponse>("/api/samples", {
        sample_id: form.sampleId,
        collection_date: form.collectionDate,
        collection_time: form.collectionTime,
        sample_type: form.sampleType,
        temperature: form.temperature,
        pH: form.pH,
        salinity: form.salinity,
        location: form.location,
      });
      alert(res.data.msg);
   } catch (error) {
  console.error("Error saving sample:", error);
  alert("Error saving sample");
}

  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-lg mx-auto">
      <h2 className="text-lg font-bold mb-4">Sample Details</h2>

      <input
        type="text"
        name="sampleId"
        placeholder="Sample ID"
        value={form.sampleId}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
        required
      />

      <input
        type="date"
        name="collectionDate"
        value={form.collectionDate}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
        required
      />

      <input
        type="time"
        name="collectionTime"
        value={form.collectionTime}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
        required
      />

      <select
        name="sampleType"
        value={form.sampleType}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
        required
      >
        <option value="">Select Sample Type</option>
        <option value="water">Water</option>
        <option value="soil">Soil</option>
        <option value="plant">Plant</option>
        <option value="biological fluids">Biological Fluids</option>
      </select>

      <input
        type="text"
        name="temperature"
        placeholder="Temperature (°C)"
        value={form.temperature}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="text"
        name="pH"
        placeholder="pH Level"
        value={form.pH}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="text"
        name="salinity"
        placeholder="Salinity (ppt)"
        value={form.salinity}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="text"
        name="location"
        placeholder="Geolocation / Field Location"
        value={form.location}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />

      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
        Save Sample
      </button>
    </form>
  );
};

export default SampleForm;
