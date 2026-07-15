import React, { useEffect, useState, useCallback } from "react";
import { getRequests } from "../api/api";
import RequestCard from "./RequestCard";

const RequestList = ({ refreshKey }) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRequests(filter);
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, refreshKey]);

  const handleUpdated = (updated) => {
    setRequests((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
  };

  const handleDeleted = (id) => {
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="request-list-container">
      <div className="filter-bar">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="claimed">Claimed</option>
          <option value="in-progress">In Progress</option>
          <option value="rescued">Rescued</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading && <p>Loading requests...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && requests.length === 0 && <p>No rescue requests found.</p>}

      <div className="request-grid">
        {requests.map((r) => (
          <RequestCard key={r._id} request={r} onUpdated={handleUpdated} onDeleted={handleDeleted} />
        ))}
      </div>
    </div>
  );
};

export default RequestList;
