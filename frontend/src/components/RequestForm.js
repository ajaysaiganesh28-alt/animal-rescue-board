import React, { useState } from "react";
import { createRequest } from "../api/api";

const initialState = {
  animalType: "",
  description: "",
  reporterName: "",
  contactNumber: "",
  address: "",
  lat: "",
  lng: "",
  urgency: "medium",
};

const RequestForm = ({ onCreated }) => {
  const [form, setForm] = useState(initialState);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append("photo", photo);

      const res = await createRequest(data);
      setForm(initialState);
      setPhoto(null);
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <h2>Report a Rescue Request</h2>
      {error && <p className="error-text">{error}</p>}

      <label>Animal Type</label>
      <input
        name="animalType"
        placeholder="e.g. Dog, Cat, Bird"
        value={form.animalType}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        placeholder="Describe the animal's condition and situation"
        value={form.description}
        onChange={handleChange}
        required
      />

      <label>Your Name</label>
      <input
        name="reporterName"
        placeholder="Your name"
        value={form.reporterName}
        onChange={handleChange}
        required
      />

      <label>Contact Number</label>
      <input
        name="contactNumber"
        placeholder="Phone number"
        value={form.contactNumber}
        onChange={handleChange}
        required
      />

      <label>Location / Address</label>
      <input
        name="address"
        placeholder="Street, area, landmark"
        value={form.address}
        onChange={handleChange}
        required
      />
      <button type="button" className="secondary-btn" onClick={useMyLocation}>
        Use My Current Location
      </button>
      {form.lat && form.lng && (
        <p className="coords-text">
          Coordinates: {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}
        </p>
      )}

      <label>Urgency</label>
      <select name="urgency" value={form.urgency} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <label>Photo</label>
      <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />

      <button type="submit" disabled={submitting} className="primary-btn">
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
};

export default RequestForm;
