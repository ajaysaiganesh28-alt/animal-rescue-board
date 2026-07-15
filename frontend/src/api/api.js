import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getRequests = (statusFilter) =>
  api.get("/requests", { params: statusFilter ? { status: statusFilter } : {} });

export const getRequestById = (id) => api.get(`/requests/${id}`);

export const createRequest = (formData) =>
  api.post("/requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateRequest = (id, formData) =>
  api.put(`/requests/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const claimRequest = (id, claimData) => api.patch(`/requests/${id}/claim`, claimData);

export const updateStatus = (id, status) => api.patch(`/requests/${id}/status`, { status });

export const deleteRequest = (id) => api.delete(`/requests/${id}`);

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export default api;
