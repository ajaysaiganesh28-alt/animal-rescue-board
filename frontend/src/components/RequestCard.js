import React, { useState } from "react";
import { claimRequest, updateStatus, deleteRequest } from "../api/api";
import { API_ORIGIN } from "../api/api";

const statusColors = {
  pending: "#e74c3c",
  claimed: "#f39c12",
  "in-progress": "#3498db",
  rescued: "#27ae60",
  closed: "#7f8c8d",
};

const RequestCard = ({ request, onUpdated, onDeleted }) => {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({ name: "", organization: "", contactNumber: "" });
  const [busy, setBusy] = useState(false);

  const handleClaim = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await claimRequest(request._id, claimData);
      onUpdated(res.data);
      setShowClaimForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to claim request");
    } finally {
      setBusy(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setBusy(true);
    try {
      const res = await updateStatus(request._id, newStatus);
      onUpdated(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this rescue request?")) return;
    setBusy(true);
    try {
      await deleteRequest(request._id);
      onDeleted(request._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete request");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="request-card">
      {request.photoUrl && (
        <img
          src={`${API_ORIGIN}${request.photoUrl}`}
          alt={request.animalType}
          className="request-photo"
        />
      )}
      <div className="request-body">
        <div className="request-header">
          <h3>{request.animalType}</h3>
          <span
            className="status-badge"
            style={{ backgroundColor: statusColors[request.status] }}
          >
            {request.status}
          </span>
        </div>
        <p className="request-desc">{request.description}</p>
        <p className="request-meta">📍 {request.location?.address}</p>
        <p className="request-meta">Urgency: {request.urgency}</p>
        <p className="request-meta">
          Reported by {request.reporterName} ({request.contactNumber})
        </p>

        {request.claimedBy?.name && (
          <p className="claimed-info">
            Claimed by {request.claimedBy.name}
            {request.claimedBy.organization ? ` (${request.claimedBy.organization})` : ""}
          </p>
        )}

        <div className="card-actions">
          {request.status === "pending" && !showClaimForm && (
            <button disabled={busy} onClick={() => setShowClaimForm(true)}>
              Claim Request
            </button>
          )}

          {showClaimForm && (
            <form className="claim-form" onSubmit={handleClaim}>
              <input
                placeholder="Your name"
                required
                value={claimData.name}
                onChange={(e) => setClaimData({ ...claimData, name: e.target.value })}
              />
              <input
                placeholder="Organization (optional)"
                value={claimData.organization}
                onChange={(e) => setClaimData({ ...claimData, organization: e.target.value })}
              />
              <input
                placeholder="Contact number"
                required
                value={claimData.contactNumber}
                onChange={(e) => setClaimData({ ...claimData, contactNumber: e.target.value })}
              />
              <button type="submit" disabled={busy}>
                Confirm Claim
              </button>
              <button type="button" onClick={() => setShowClaimForm(false)}>
                Cancel
              </button>
            </form>
          )}

          {request.status === "claimed" && (
            <button disabled={busy} onClick={() => handleStatusChange("in-progress")}>
              Mark In Progress
            </button>
          )}
          {request.status === "in-progress" && (
            <button disabled={busy} onClick={() => handleStatusChange("rescued")}>
              Mark Rescued
            </button>
          )}
          {request.status === "rescued" && (
            <button disabled={busy} onClick={() => handleStatusChange("closed")}>
              Close Case
            </button>
          )}

          <button disabled={busy} className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
